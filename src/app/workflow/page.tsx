"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { FileText, Volume2, Trash2, User } from "lucide-react";
import { askAgent } from "../_actions";

const ScriptInputNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[450px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5" />
        <h3 className="font-semibold text-lg">Script Input</h3>
      </div>
      <textarea
        value={data.script}
        onChange={(e) => data.onScriptChange(e.target.value)}
        placeholder="Paste or type your script here..."
        className="w-full h-48 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <div className="text-sm text-gray-500 mt-2">
        {data.script.length} chars ·{" "}
        {data.script.split(/\s+/).filter(Boolean).length} words
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={data.onPaste}>
          Paste
        </Button>
        <Button variant="ghost" size="icon" onClick={data.onClear}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <Button
        onClick={data.onGenerate}
        disabled={!data.script || data.isGenerating}
        className="w-full mt-3 bg-gray-700 hover:bg-gray-800"
      >
        {data.isGenerating ? "Generating..." : "Generate Voice-Over"}
      </Button>
      <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <span className="font-semibold">Tips:</span> Write in a conversational
        tone, include hooks, and keep scripts between 50-200 words for best
        results.
      </div>
    </div>
  );
};

const AudioOutputNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5" />
        <div>
          <h3 className="font-semibold text-lg">Audio Output</h3>
          <p className="text-sm text-gray-500">Generated voice-over playback</p>
        </div>
      </div>

      {data.audioUrl ? (
        <div className="space-y-4">
          <audio controls className="w-full">
            <source src={data.audioUrl} type="audio/mpeg" />
          </audio>
          <Button
            onClick={() => {
              const a = document.createElement("a");
              a.href = data.audioUrl;
              a.download = "voiceover.mp3";
              a.click();
            }}
            className="w-full"
          >
            Download Audio
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Volume2 className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium text-gray-600">
            No audio generated yet
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Paste the script text and generate voice-over
          </p>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
};

export default function WorkflowPage() {
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptIdeas, setScriptIdeas] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [avatarType, setAvatarType] = useState("fitness");
  const [niche, setNiche] = useState("");

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setScript(text);
  };

  const handleClear = () => {
    setScript("");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const message = `Generate a voiceover for this script: ${script}`;
      const response = await askAgent(message);

      try {
        const parsed = JSON.parse(response);
        if (parsed.audioUrl) {
          setAudioUrl(parsed.audioUrl);
        }
      } catch (err) {
        console.error("Parse error:", err);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetIdeas = async () => {
    if (!niche) return;
    try {
      const message = `Generate script ideas for ${avatarType} avatar in ${niche} niche`;
      const response = await askAgent(message);
      try {
        const parsed = JSON.parse(response);
        setScriptIdeas(parsed);
      } catch {
        setScriptIdeas({ ideas: [response] });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "scriptInput",
      position: { x: 100, y: 200 },
      data: {
        script,
        onScriptChange: setScript,
        onPaste: handlePaste,
        onClear: handleClear,
        onGenerate: handleGenerate,
        isGenerating,
      },
    },
    {
      id: "2",
      type: "audioOutput",
      position: { x: 750, y: 200 },
      data: {
        audioUrl,
      },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: isGenerating,
      style: { stroke: "#6B7280", strokeWidth: 2 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen flex bg-[#D3D1DE]">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-semibold text-lg">Relo</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Ibrahim Pima</span>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 mt-16 overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-6">Script Generator</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Avatar Type
              </label>
              <select
                value={avatarType}
                onChange={(e) => setAvatarType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="fitness">Fitness</option>
                <option value="beauty">Beauty</option>
                <option value="tech">Tech</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Niche/Topic
              </label>
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., weight loss, skincare, AI tools"
                className="w-full p-2 border rounded"
              />
            </div>

            <Button
              onClick={handleGetIdeas}
              disabled={!niche}
              className="w-full"
            >
              Get Script Ideas
            </Button>

            {scriptIdeas && (
              <div className="mt-4 p-4 bg-gray-50 rounded max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-2">Script Ideas:</h3>
                {scriptIdeas.scriptIdeas?.map((idea: string, i: number) => (
                  <div
                    key={i}
                    className="p-2 mb-2 bg-white rounded border cursor-pointer hover:border-gray-400"
                    onClick={() => setScript(idea)}
                  >
                    {idea}
                  </div>
                ))}
                {scriptIdeas.viralHooks && (
                  <>
                    <h3 className="font-semibold mt-4 mb-2">Viral Hooks:</h3>
                    {scriptIdeas.viralHooks.map((hook: string, i: number) => (
                      <div
                        key={i}
                        className="p-2 mb-2 bg-white rounded border cursor-pointer hover:border-gray-400"
                        onClick={() => setScript(hook)}
                      >
                        {hook}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="flex-1 mt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
