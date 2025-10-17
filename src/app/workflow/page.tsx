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

import {
  ChatContainer,
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import { DotsLoader } from "@/components/prompt-kit/loader";
import { Message, MessageContent } from "@/components/prompt-kit/message";
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
import { useChat } from "ai/react";

const nodeTypes: NodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
}

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
    position: { x: 150, y: 100 },
    data: {
      script: "",
      onScriptChange: () => {},
      onPaste: () => {},
      onClear: () => {},
      onGenerate: () => {},
      isGenerating: false,
    },
    dragHandle: ".drag-handle",
  },
  {
    id: "2",
    type: "audioOutput",
    position: { x: 450, y: 100 },
    data: {
      audioUrl: undefined,
    },
    dragHandle: ".drag-handle",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#6B7280", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function WorkflowPage() {
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
  });

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
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          error={error}
          onMessageAction={(message, action) => {
            if (action.id === "copy") {
              navigator.clipboard.writeText(message.content);
            }
          }}
        />
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
        >
          <Controls />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}