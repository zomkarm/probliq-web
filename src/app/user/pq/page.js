"use client";

import React,{useState,useRef,useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
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
import { useProblemStore } from "@/store/problemStore";
import WorryEaterSequenceWrapper from '@/components/ui/shared/WorryEaterSequence'
import { 
  ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Plus,
  RefreshCcw, Trash2, Copy, Terminal, Send, X, Timer,
  Zap, ListOrdered, BarChart3, Target, ShieldAlert,         
 } from "lucide-react";

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
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Header & Progress Section */}
      <nav className="relative z-10 w-full px-6 py-8 max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">PROBLIQ</h2>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Module Alpha</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-md">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-medium text-slate-300">Phase: {STEPS[step].desc}</span>
          </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-slate-400">
              STEP <span className="text-white">{step + 1}</span> / {STEPS.length}
            </span>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              {Math.round(((step + 1) / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Main Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-7xl">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              {STEPS[step].title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              {getInstruction(step)}
            </p>
          </div>

          {/* High-Fidelity Content Container */}
          <div className="relative group">
            {/* Outer Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative bg-[#020617]/80 border border-slate-800 rounded-[2rem] p-4 md:p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 overflow-hidden">
              {/* Internal Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
              
              {/* Logic Check: Step Rendering */}
              <div className="relative z-10 min-h-[500px]">
                {step === 0 && <DumpUI />}
                {step === 1 && <DecomposeUI />}
                {step === 2 && <PriorityUI />}
                {step === 3 && <TunnelUI />}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <footer className="relative bottom-0 z-50 w-full p-4">
        <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-700/50 backdrop-blur-2xl rounded-2xl p-3 flex justify-between items-center shadow-2xl ring-1 ring-white/5">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={() => setStep((s) => Math.min(s + 1, 3))}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-[#020617] font-black hover:bg-indigo-50 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            {step === 3 ? (
              <>Finish <CheckCircle2 className="w-5 h-5" /></>
            ) : (
              <>Continue <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </footer>
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
    <div className="space-y-8">
      {/* Top Actions: Restore & Clear */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={restoreOriginal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Restore Original
        </button>

        <button
          onClick={clearProblems}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Instruction Header */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
        <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-500/20">
          <Terminal className="w-4 h-4 text-indigo-400" />
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Break down problems manually <strong className="text-indigo-400 uppercase tracking-wider text-xs">or</strong> use the AI-optimized prompt below to assist your decomposition.
        </p>
      </div>

      {/* Prompt Box & Copy Section */}
      <div className="group relative space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#020617] shadow-2xl">
          <div className="p-4 text-[13px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap h-[180px] overflow-y-auto custom-scrollbar">
            {prompt}
          </div>
          {/* Bottom fade for scroll depth */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#020617] to-transparent" />
        </div>

        <button
          onClick={copyPrompt}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-white text-slate-900 hover:bg-indigo-50 transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Prompt
        </button>
      </div>

      {/* LLM Interaction Logic */}
      <div className="pt-4 border-t border-slate-800/50">
        {!showLLMInput ? (
          <button
            onClick={() => setShowLLMInput(true)}
            className="w-full md:w-auto px-6 py-3 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] cursor-pointer"
          >
            Enter LLM Output
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <textarea
                value={llmInput}
                onChange={(e) => setLlmInput(e.target.value)}
                className="w-full min-h-[140px] bg-slate-900/50 border border-indigo-500/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl p-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600"
                placeholder="Paste the generated list here..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={applyLLMOutput}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Apply Changes
              </button>

              <button
                onClick={() => {
                  setShowLLMInput(false);
                  setLlmInput("");
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[450px] rounded-[2rem] border border-slate-800 bg-[#020617]/40 overflow-hidden shadow-inner ring-1 ring-white/5">
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
          <Background gap={24} size={1} color="#1e293b" variant="dots" className="opacity-40" />
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* LEFT: Classification */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Target className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Metric Input</h3>
        </div>

        {problems.map((p) => (
          <div
            key={p.id}
            className="group p-5 border border-slate-800 rounded-2xl bg-slate-900/30 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/50"
          >
            <div className="text-sm font-medium text-slate-200 mb-5 leading-relaxed">
              {p.data?.label || "Untitled Node"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority Control */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Priority</span>
                <div className="flex p-1 bg-[#020617] rounded-xl border border-slate-800">
                  <button
                    onClick={() => updateField(p.id, "priority", "high")}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      p.data?.priority === "high"
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    High
                  </button>
                  <button
                    onClick={() => updateField(p.id, "priority", "low")}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      p.data?.priority === "low"
                        ? "bg-slate-700 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Low
                  </button>
                </div>
              </div>

              {/* Friction Control */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Friction</span>
                <div className="flex p-1 bg-[#020617] rounded-xl border border-slate-800">
                  <button
                    onClick={() => updateField(p.id, "friction", "easy")}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      p.data?.friction === "easy"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => updateField(p.id, "friction", "hard")}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      p.data?.friction === "hard"
                        ? "bg-slate-700 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Stack Output */}
      <div className="sticky top-0 border border-slate-800/60 rounded-[2rem] p-6 bg-[#020617]/60 backdrop-blur-xl ring-1 ring-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Execution Order</h3>
          </div>
          <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 font-bold">
            Sorted Alpha
          </div>
        </div>

        <div className="space-y-3">
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className="group flex items-center gap-4 p-4 border border-slate-800/40 rounded-2xl bg-slate-900/20 hover:bg-slate-900/40 transition-all shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[11px] font-black text-indigo-500 group-hover:border-indigo-500/30 transition-colors">
                {i + 1}
              </div>

              <div className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {p.data?.label}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-400 transition-colors">
                <BarChart3 className="w-3 h-3" />
                {getLabel(p)}
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <Zap className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">Add and classify problems to see your sequence.</p>
            </div>
          )}
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
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      {/* 5-second trigger */}
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Timer className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">Hyper-Focus Mode</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Start within <span className="text-slate-300">5 seconds</span>. Do not overthink.
        </p>
      </div>

      {/* Task Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-10 transition duration-1000"></div>
        <div className="relative p-10 border border-slate-800 rounded-[2rem] bg-[#020617] text-center shadow-2xl">
          <div className="inline-block px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
            Current Mission: {index + 1}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {current.data?.label || "Untitled Task"}
          </h2>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowFear(true)}
          className="order-2 sm:order-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-2xl border border-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          Something is stopping me
        </button>

        <button
          onClick={handleDone}
          className="order-1 sm:order-2 flex items-center justify-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          DONE
        </button>
      </div>

      {/* PORTALED FEAR OVERLAY */}
      {showFear && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col overflow-hidden">
          {/* Close button UI */}
          <div className="absolute top-8 right-8 z-[10000]">
            <button
              onClick={() => {
                setFearText("");
                setShowFear(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xl"
            >
              <X className="w-4 h-4" />
              Exit Void
            </button>
          </div>

          <div className="flex-1 w-full h-full">
            <WorryEaterSequenceWrapper
              initialText={fearText}
              onComplete={() => {
                setFearText("");
                setShowFear(false);
              }}
            />
          </div>
        </div>,
        document.body // This tells React to move the HTML to the very end of the <body>
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