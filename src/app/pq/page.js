"use client";

import { useState,useRef,useCallback, useEffect, useMemo } from "react";
import ReactFlow,{
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { useProblemStore } from "@/stores/problemStore";


function ProblemNode({ id, data }) {
  const [value, setValue] = useState(data.label || "");

  const onChange = (e) => {
    setValue(e.target.value);
    data.onChange(id, e.target.value); // push change to parent state
  };

  return (
    <div
      style={{
        padding: 12,
        minWidth: 220,
        background: "#0f172a",
        color: "#e5e7eb",
        border: "1px solid #334155",
        borderRadius: 8,
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* connection handles */}
      <Handle type="target" position={Position.Top} />
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Enter problem..."
        style={{
          width: "100%",
          minHeight: 70,
          resize: "none",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "inherit",
          fontSize: 14,
        }}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  problemNode: ProblemNode,
};

const STEPS = [
  {
    key: "dump",
    title: "Raw Dump",
    desc: "List everything bothering you",
  },
  {
    key: "decompose",
    title: "Decomposition",
    desc: "Break problems into smaller parts",
  },
  {
    key: "priority",
    title: "Priority Stack",
    desc: "Organize by importance and difficulty",
  },
  {
    key: "tunnel",
    title: "Action Tunnel",
    desc: "Focus on one task only",
  },
];

export default function ProbliqUI() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col">
      {/* Top Progress Bar */}
      <div className="w-full px-6 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">
            Step {step + 1} / {STEPS.length}
          </div>
          <div className="text-sm text-slate-500">
            {STEPS[step].desc}
          </div>
        </div>

        <div className="h-[4px] bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold m-2">
              {STEPS[step].title}
            </h1>
            <p className="text-slate-400 text-sm">
              {getInstruction(step)}
            </p>
          </div>

          <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 shadow-lg">
            {step === 0 && <DumpUI />}
            {step === 1 && <DecomposeUI />}
            {step === 2 && <PriorityUI />}
            {step === 3 && <TunnelUI />}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-6 mt-2 flex justify-between items-center">
        <button
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => setStep((s) => Math.min(s + 1, 3))}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition cursor-pointer"
        >
          {step === 3 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Step UIs ---------- */

function DumpUI() {
  const idRef = useRef(1);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setInitialProblems } = useProblemStore();

  useEffect(() => {
    const filtered = nodes.filter(n => n.data.label.trim() !== "");
    setInitialProblems(filtered);
  }, [nodes]);

  const updateNodeText = useCallback((id, text) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: text } } : n
      )
    );
  }, []);

  const addNode = () => {
    const id = String(idRef.current++);
    setNodes((nds) =>
      nds.concat({
        id,
        type: "problemNode",
        position: {
          x: 200 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data: {
          label: "",
          onChange: updateNodeText,
        },
      })
    );
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#94a3b8" },
          },
          eds
        )
      ),
    []
  );

  return (
    <div className="relative w-full h-[500px] rounded-xl border border-slate-800 overflow-hidden">
      
      {/* Add button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={addNode}
          className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 transition"
        >
          + Add Problem
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background gap={20} size={1} color="#1e293b" />
      </ReactFlow>
    </div>
  );
}

function DecomposeUI() {
  const idRef = useRef(1000);

  const {
    problems,
    setProblems,
    restoreOriginal,
    clearProblems,
  } = useProblemStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [showLLMInput, setShowLLMInput] = useState(false);
  const [llmInput, setLlmInput] = useState("");

  // sync store -> canvas
  useEffect(() => {
    setNodes(problems);
  }, [problems]);

  const updateNodeText = useCallback((id, text) => {
    setNodes((nds) => {
      const updated = nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: text } } : n
      );
      setProblems(updated);
      return updated;
    });
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#94a3b8" },
          },
          eds
        )
      ),
    []
  );

  // strong LLM prompt
  const problemListText = problems
    .map((p) => p.data?.label?.trim())
    .filter(Boolean)
    .join("\n");

  const prompt = `Take this list of problems:
  ${problemListText || "[No problems found]"}

  Rules:
  - If a problem is broad or vague, break it into smaller, concrete problems.
  - If a problem is already specific, keep it unchanged.
  - Do NOT give advice, suggestions, or solutions.
  - Do NOT explain anything.
  - Output ONLY a clean list of problems.
  - Each problem must be on a new line.
  - No numbering, no bullets, no extra text.`;

  const applyLLMOutput = () => {
    const lines = llmInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const newNodes = lines.map((text, i) => ({
      id: String(idRef.current++),
      type: "problemNode",
      position: {
        x: 100 + (i % 3) * 260,
        y: 100 + Math.floor(i / 3) * 120,
      },
      data: {
        label: text,
        onChange: updateNodeText,
      },
    }));

    setNodes(newNodes);
    setProblems(newNodes);

    // reset input flow
    setLlmInput("");
    setShowLLMInput(false);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="space-y-4">

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={restoreOriginal}
          className="px-3 py-1.5 text-sm rounded-md border border-slate-700 text-slate-300"
        >
          Restore Original
        </button>

        <button
          onClick={clearProblems}
          className="px-3 py-1.5 text-sm rounded-md border border-slate-700 text-slate-300"
        >
          Clear
        </button>
      </div>

      {/* Instruction */}
      <div className="text-sm text-slate-400">
        Try to break down problems manually <strong className="text-cyan-400">OR</strong> use the prompt below in your favourite LLM.
      </div>

      {/* Prompt Box */}
      <div className="relative">
        <div className="bg-[#020617] border border-slate-800 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap h-[180px] overflow-y-auto">
          {prompt}
        </div>

        {/* optional fade hint at bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#020617] to-transparent rounded-b-lg" />
      </div>

      <button
        onClick={copyPrompt}
        className="px-2 py-1 text-xs border m-2 border-slate-700 rounded"
      >
        Copy
      </button>

      {/* Trigger Button */}
      {!showLLMInput && (
        <button
          onClick={() => setShowLLMInput(true)}
          className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600"
        >
          Enter LLM Output
        </button>
      )}

      {/* Conditional Input */}
      {showLLMInput && (
        <div className="space-y-2">
          <textarea
            value={llmInput}
            onChange={(e) => setLlmInput(e.target.value)}
            className="w-full min-h-[120px] bg-transparent border border-slate-800 rounded-lg p-3 text-sm text-slate-200"
            placeholder="Paste newline-separated problems here..."
          />

          <div className="flex gap-2">
            <button
              onClick={applyLLMOutput}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600"
            >
              Apply
            </button>

            <button
              onClick={() => {
                setShowLLMInput(false);
                setLlmInput("");
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-700 text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full h-[400px] rounded-xl border border-slate-800 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <Background gap={20} size={1} color="#1e293b" />
        </ReactFlow>
      </div>
    </div>
  );
}

function PriorityUI() {
  const { problems, setProblems } = useProblemStore();

  const updateField = (id, field, value) => {
    const updated = problems.map((p) =>
      p.id === id
        ? {
            ...p,
            data: {
              ...p.data,
              [field]: value,
            },
          }
        : p
    );
    setProblems(updated);
  };

  const getScore = (p) => {
    const { priority, friction } = p.data || {};
    if (priority === "high" && friction === "easy") return 1;
    if (priority === "high" && friction === "hard") return 2;
    if (priority === "low" && friction === "easy") return 3;
    return 4;
  };

  const getLabel = (p) => {
    const { priority, friction } = p.data || {};
    if (priority === "high" && friction === "easy") return "Quick Win";
    if (priority === "high" && friction === "hard") return "Big Task";
    if (priority === "low" && friction === "easy") return "Maintenance";
    return "Backlog";
  };

  const sorted = useMemo(() => {
    return [...problems].sort((a, b) => getScore(a) - getScore(b));
  }, [problems]);

  return (
    <div className="grid grid-cols-2 gap-6">
      
      {/* LEFT: Classification */}
      <div className="space-y-3">
        {problems.map((p) => (
          <div
            key={p.id}
            className="p-4 border border-slate-800 rounded-lg bg-[#020617]"
          >
            <div className="text-sm text-slate-200 mb-3">
              {p.data?.label}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-400 w-16">Priority</span>
              <button
                onClick={() => updateField(p.id, "priority", "high")}
                className={`px-2 py-1 text-xs rounded ${
                  p.data?.priority === "high"
                    ? "bg-indigo-500 text-white"
                    : "border border-slate-700 text-slate-300"
                }`}
              >
                High
              </button>
              <button
                onClick={() => updateField(p.id, "priority", "low")}
                className={`px-2 py-1 text-xs rounded ${
                  p.data?.priority === "low"
                    ? "bg-indigo-500 text-white"
                    : "border border-slate-700 text-slate-300"
                }`}
              >
                Low
              </button>
            </div>

            {/* Friction */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-16">Friction</span>
              <button
                onClick={() => updateField(p.id, "friction", "easy")}
                className={`px-2 py-1 text-xs rounded ${
                  p.data?.friction === "easy"
                    ? "bg-indigo-500 text-white"
                    : "border border-slate-700 text-slate-300"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => updateField(p.id, "friction", "hard")}
                className={`px-2 py-1 text-xs rounded ${
                  p.data?.friction === "hard"
                    ? "bg-indigo-500 text-white"
                    : "border border-slate-700 text-slate-300"
                }`}
              >
                Hard
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Stack Output */}
      <div className="border border-slate-800 rounded-lg p-4 bg-[#020617]">
        <div className="text-sm text-slate-400 mb-4">
          Execution Order
        </div>

        <div className="space-y-2">
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-2 border border-slate-800 rounded-md"
            >
              <div className="text-xs text-slate-500 w-5">{i + 1}</div>

              <div className="flex-1 text-sm text-slate-200">
                {p.data?.label}
              </div>

              <div className="text-[10px] text-slate-400">
                {getLabel(p)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TunnelUI() {
  const { problems } = useProblemStore();

  const [index, setIndex] = useState(0);
  const [showFear, setShowFear] = useState(false);
  const [fearText, setFearText] = useState("");

  // same sorting logic as step 3
  const getScore = (p) => {
    const { priority, friction } = p.data || {};
    if (priority === "high" && friction === "easy") return 1;
    if (priority === "high" && friction === "hard") return 2;
    if (priority === "low" && friction === "easy") return 3;
    return 4;
  };

  const sorted = useMemo(() => {
    return [...problems].sort((a, b) => getScore(a) - getScore(b));
  }, [problems]);

  const current = sorted[index];

  const handleDone = () => {
    setIndex((i) => i + 1);
  };

  const consumeFear = () => {
    setFearText("");
    setShowFear(false);
  };

  if (!current) {
    return (
      <div className="flex items-center justify-center h-[200px] text-slate-400">
        All tasks completed.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* 5-second trigger */}
      <div className="text-xs text-slate-500 text-center">
        Start within 5 seconds. Do not overthink.
      </div>

      {/* Task Card */}
      <div className="p-6 border border-slate-800 rounded-xl bg-[#020617] text-center">
        <div className="text-sm text-slate-400 mb-2">
          Task {index + 1}
        </div>

        <div className="text-lg text-slate-200 font-medium">
          {current.data?.label}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">

        <button
          onClick={() => setShowFear(true)}
          className="w-full px-4 py-2 text-sm rounded-lg border border-slate-700 text-slate-300 cursor-pointer"
        >
          Something is stopping me
        </button>

        <button
          onClick={handleDone}
          className="w-full px-4 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600"
        >
          DONE
        </button>
      </div>

      {/* Fear Modal */}
      {showFear && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl bg-[#020617] border border-slate-800 rounded-xl p-5 space-y-4">
            
            <div className="text-sm text-slate-300">
              What is stopping you?
            </div>

            <textarea
              value={fearText}
              onChange={(e) => setFearText(e.target.value)}
              className="w-full min-h-[400px] bg-transparent border border-slate-800 rounded-lg p-3 text-sm text-slate-200"
              placeholder="Name the fear..."
            />

            <div className="flex gap-2">
              <button
                onClick={consumeFear}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-indigo-500 hover:bg-indigo-600"
              >
                Clear It
              </button>

              <button
                onClick={() => setShowFear(false)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-700 text-slate-300"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Instructions ---------- */

function getInstruction(step) {
  switch (step) {
    case 0:
      return "Don't think. Just unload everything.";
    case 1:
      return "If it feels big, split it.";
    case 2:
      return "Decide what matters and what hurts.";
    case 3:
      return "Ignore everything except the next move.";
    default:
      return "";
  }
}