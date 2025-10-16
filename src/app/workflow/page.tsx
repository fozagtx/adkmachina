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
import { User } from "lucide-react";

import { ScriptInputNode } from "./components/script-input-node";
import { AudioOutputNode } from "./components/audio-output-node";
import { AvatarSelectionNode } from "./components/avatar-selection-node";
import { VoiceCustomizationNode } from "./components/voice-customization-node";
import { askAgent } from "../_actions";

const nodeTypes = {
  scriptInput: ScriptInputNode,
  audioOutput: AudioOutputNode,
  avatarSelection: AvatarSelectionNode,
  voiceCustomization: VoiceCustomizationNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "avatarSelection",
    position: { x: 0, y: 0 },
    data: {
      selectedAvatar: "fitness",
      onAvatarSelect: () => {},
    },
  },
  {
    id: "2",
    type: "voiceCustomization",
    position: { x: 0, y: 200 },
    data: {
      selectedTone: "energetic",
      onToneSelect: () => {},
    },
  },
  {
    id: "3",
    type: "scriptInput",
    position: { x: 350, y: 0 },
    data: {
      script: "",
      onScriptChange: () => {},
      onPaste: () => {},
      onClear: () => {},
      onGenerate: () => {},
      isGenerating: false,
    },
  },
  {
    id: "4",
    type: "audioOutput",
    position: { x: 850, y: 0 },
    data: {
      audioUrl: "",
    },
  },
];

const initialEdges = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    style: { stroke: "#6B7280", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    style: { stroke: "#6B7280", strokeWidth: 2 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: false,
    style: { stroke: "#6B7280", strokeWidth: 2 },
  },
];

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [script, setScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("fitness");
  const [selectedTone, setSelectedTone] = useState("energetic");

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
      const response = await askAgent(script, selectedAvatar, selectedTone);
      if (response.audioUrl) {
        setAudioUrl(response.audioUrl);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen flex bg-[#D3D1DE]">
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