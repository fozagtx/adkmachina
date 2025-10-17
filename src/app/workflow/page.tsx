"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AlertTriangle } from "lucide-react";
import { CopyButton } from "@/components/prompt-kit/copy-button";
import {
  Message as PromptMessage,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

import { ScriptInputNode } from "./components/script-input-node";
import { AudioOutputNode } from "./components/audio-output-node";
import { askAgent } from "../_actions";

const nodeTypes: NodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
};

type WorkflowData = {
  script?: string;
  onScriptChange?: (value: string) => void;
  onPaste?: () => void;
  onClear?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  audioUrl?: string;
};

type CustomNode = Node<WorkflowData>;
type CustomEdge = Edge;

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "scriptInput",
    position: { x: 100, y: 150 },
    data: {
      script: "",
      onScriptChange: () => {},
      onPaste: () => {},
      onClear: () => {},
      onGenerate: () => {},
      isGenerating: false,
    },
    dragHandle: ".drag-handle",
    style: { width: 320 },
  },
  {
    id: "2",
    type: "audioOutput",
    position: { x: 600, y: 150 },
    data: {
      audioUrl: undefined,
    },
    dragHandle: ".drag-handle",
    style: { width: 320 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    style: {
      stroke: "url(#edge-gradient)",
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#6366f1",
    },
  },
];

export default function WorkflowPage() {
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"ready" | "submitted" | "error">(
    "ready",
  );
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async () => {
    if (!input.trim() || status === "submitted") return;

    const userMessage = {
      id: String(Date.now()),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("submitted");
    setError(null);

    try {
      const response = await askAgent(input);
      const assistantMessage = {
        id: String(Date.now()),
        role: "assistant",
        content: response.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if ("audioUrl" in response) {
        setScript(response.script);
        setAudioUrl(response.audioUrl);
      }
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to send message"),
      );
      setStatus("error");
    }
  };

  const [nodes, setNodes, onNodesChange] =
    useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdge>(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge(params, eds) as CustomEdge[]),
    [setEdges],
  );

  const updateNodes = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return {
            ...node,
            data: {
              script,
              onScriptChange: (value: string) => setScript(value),
              onPaste: async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setScript(text);
                } catch (error) {
                  console.error("Failed to paste:", error);
                }
              },
              onClear: () => setScript(""),
              onGenerate: async () => {
                if (!script) return;
                setIsGenerating(true);
                try {
                  const response = await askAgent(script);
                  if ("audioUrl" in response && response.audioUrl) {
                    setAudioUrl(response.audioUrl);
                  }
                } catch (error) {
                  console.error("Error generating audio:", error);
                } finally {
                  setIsGenerating(false);
                }
              },
              isGenerating,
            },
          };
        }
        if (node.id === "2") {
          return {
            ...node,
            data: {
              audioUrl,
            },
          };
        }
        return node;
      }),
    );
  }, [script, audioUrl, isGenerating, setNodes]);

  useEffect(() => {
    updateNodes();
  }, [updateNodes]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#D3D1DE]">
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-200 bg-white flex flex-col">
        <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
          <ChatContainerContent className="space-y-12 px-4 py-12">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isAssistant = message.role === "assistant";
              return (
                <PromptMessage
                  key={message.id}
                  className={cn(
                    "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
                    isAssistant ? "items-start" : "items-end",
                  )}
                >
                  {isAssistant ? (
                    <div className="group flex w-full flex-col gap-0">
                      <MessageContent
                        className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
                        markdown={true}
                      >
                        {message.content || ""}
                      </MessageContent>
                      <MessageActions
                        className={cn(
                          "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                          isLastMessage && "opacity-100",
                        )}
                      >
                        <MessageAction tooltip="Copy" delayDuration={100}>
                          <CopyButton
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onCopy={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                          />
                        </MessageAction>
                      </MessageActions>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col items-end gap-1">
                      <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
                        {message.content}
                      </MessageContent>
                      <MessageActions
                        className={cn(
                          "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                        )}
                      >
                        <MessageAction tooltip="Copy" delayDuration={100}>
                          <CopyButton
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onCopy={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                          />
                        </MessageAction>
                      </MessageActions>
                    </div>
                  )}
                </PromptMessage>
              );
            })}
            {status === "submitted" && (
              <PromptMessage className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
                <div className="group flex w-full flex-col gap-0">
                  <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </PromptMessage>
            )}
            {status === "error" && error && (
              <PromptMessage className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
                <div className="group flex w-full flex-col items-start gap-0">
                  <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
                    <AlertTriangle size={16} className="text-red-500" />
                    <p className="text-red-500">{error.message}</p>
                  </div>
                </div>
              </PromptMessage>
            )}
          </ChatContainerContent>
        </ChatContainerRoot>
        <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
          <PromptInput
            isLoading={status !== "ready"}
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder="Ask the AI agent..."
                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
              />
              <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 p-2">
                <div />
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    disabled={
                      !input.trim() ||
                      (status !== "ready" && status !== "error")
                    }
                    onClick={handleSubmit}
                    className="size-9 rounded-full"
                  >
                    {status === "ready" || status === "error" ? (
                      <ArrowUp size={18} />
                    ) : (
                      <span className="size-3 rounded-xs bg-white" />
                    )}
                  </Button>
                </div>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>

      <div className="flex-1 h-[50vh] md:h-auto">
        <ReactFlow
          className="touch-none"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid
          snapGrid={[15, 15]}
          fitView
          fitViewOptions={{
            padding: 0.5,
            minZoom: 0.5,
            maxZoom: 1.5,
          }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls />
          <Background gap={12} size={1} />
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              <linearGradient
                id="edge-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.1}>
                  <animate
                    attributeName="offset"
                    values="0%;100%"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}>
                  <animate
                    attributeName="offset"
                    values="0%;100%"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>
          </svg>
        </ReactFlow>
      </div>
    </div>
  );
}
