"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import WorryEaterSequenceWrapper from '@/components/ui/shared/WorryEaterSequence'
import { Timer, ShieldAlert, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'

export default function ProblemSetList() {
  const [sets, setSets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // fetch list
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await fetch("/api/problem-set");
        const json = await res.json();
        setSets(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  // fetch selected set
  useEffect(() => {
    if (!selectedId) return;

    const fetchSet = async () => {
      try {
        const res = await fetch(`/api/problem-set/${selectedId}`);
        const json = await res.json();

        if (!res.ok) {
          console.error(json);
          return;
        }

        const mapped = (json.problems || []).map((n) => ({
          id: n.id,
          data: {
            label: n.label,
            priority: n.priority,
            friction: n.friction,
            category: n.category,
            completed: n.completed || false,
            plan: n.plan || "",
            solutionPaths: n.solutionPaths || [],
          },
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSet();
  }, [selectedId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-slate-500">
        Loading...
      </div>
    );
  }

  // OPEN BOARD
  if (selectedId && data) {
    return (
      <ProblemSets
        problems={data}
        setId={selectedId}
        onBack={() => {
          setSelectedId(null);
          setData(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* GRID BG */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-indigo-500/10 blur-[140px]" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-10 py-10">

        {/* HEADER */}
        <div className="max-w-7xl mx-auto flex items-start justify-between mb-14">

          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-indigo-400/70 mb-3">
              Cognitive Mapping System
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Problem Sets
            </h1>

            <p className="mt-4 text-slate-500 max-w-xl text-sm leading-relaxed">
              Structured collections of interconnected personal problems,
              friction points, and execution pathways.
            </p>
          </div>

          <button
            onClick={() => router.push("/user/home")}
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/50 text-xs uppercase tracking-[0.18em] text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
          >
            ← Main Menu
          </button>

        </div>

        {/* STATS */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
              Total Sets
            </div>

            <div className="mt-3 text-3xl font-black">
              {sets.length}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
              Active Nodes
            </div>

            <div className="mt-3 text-3xl font-black">
              {sets.reduce((acc, set) => acc + (set.problemCount || 0), 0)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
              Cognitive Maps
            </div>

            <div className="mt-3 text-3xl font-black">
              {sets.length}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
              System State
            </div>

            <div className="mt-3 text-sm text-emerald-400 uppercase tracking-[0.2em]">
              Stable
            </div>
          </div>

        </div>

        {/* SETS */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {sets.map((set, index) => (

            <div
              key={set.id}
              onClick={() => setSelectedId(set.id)}
              className={`
                group relative overflow-hidden cursor-pointer
                rounded-[2rem] border border-slate-800
                bg-[#0f172a]/80 backdrop-blur-xl
                p-6 transition-all duration-300
                hover:-translate-y-1 hover:border-indigo-500/40
                hover:shadow-[0_0_40px_rgba(99,102,241,0.12)]

                ${index % 3 === 1 ? "xl:translate-y-8" : ""}
                ${index % 3 === 2 ? "xl:-translate-y-4" : ""}
              `}
            >

              {/* INNER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_70%)]" />

              {/* TOP */}
              <div className="relative z-10 flex items-center justify-between mb-8">

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
                  #{String(index + 1).padStart(2, "0")}
                </div>

              </div>

              {/* TITLE */}
              <div className="relative z-10">

                <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-indigo-300 transition-all">
                  {set.name}
                </h2>

                <div className="mt-3 text-sm text-slate-500 leading-relaxed">
                  Problem structure map with categorized cognitive nodes and execution pathways.
                </div>

              </div>

              {/* META */}
              <div className="relative z-10 mt-10 flex items-end justify-between">

                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-2">
                    Created
                  </div>

                  <div className="text-sm text-slate-300">
                    {new Date(set.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-[11px] uppercase tracking-[0.18em] text-indigo-300">
                  Open Board
                </div>

              </div>

            </div>

          ))}

        </div>

        {/* EMPTY */}
        {sets.length === 0 && (
          <div className="max-w-7xl mx-auto mt-20">

            <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/20 p-14 text-center">

              <div className="text-xl font-bold text-slate-300">
                No Problem Sets Found
              </div>

              <div className="mt-3 text-sm text-slate-500">
                Your cognitive mapping workspace is currently empty.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function ProblemSets({ problems = [], onBack, setId }) {
  const [activeProblem, setActiveProblem] = useState(null);

  const grouped = useMemo(() => {
    const map = {};

    problems.forEach((p) => {
      const key = p?.data?.category || "uncategorized";

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(p);
    });

    return map;
  }, [problems]);

  const categoryEntries = Object.entries(grouped);

  if (!problems.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-slate-500">
        No problems found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden text-white relative">

      {activeProblem && (
          <ProblemPlanView
            problem={activeProblem}
            setId={setId}
            onClose={() => setActiveProblem(null)}
          />
        )}

      {/* GRID BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-500/10 blur-[140px]" />

      {/* HEADER */}
      <div className="relative z-10 px-8 pt-8 flex items-center justify-between">

        <button
          onClick={onBack}
          className="text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-white transition-all cursor-pointer"
        >
          ← Back
        </button>

        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-indigo-400/70">
            Neural Problem Board
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            Problem Mapping System
          </h1>
        </div>

        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-600">
          {problems.length} nodes
        </div>
      </div>

      {/* BOARD */}
      <div className="relative z-10 w-full min-h-screen px-10 py-20">

        {/* CONNECTION LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">

          {categoryEntries.map((_, i) => {
            const positions = [
              { x: 220, y: 180 },
              { x: 850, y: 320 },
              { x: 480, y: 700 },
              { x: 1080, y: 920 },
              { x: 260, y: 1120 },
              { x: 780, y: 1320 },
            ];

            const current = positions[i % positions.length];
            const next = positions[(i + 1) % positions.length];

            return (
              <line
                key={i}
                x1={current.x}
                y1={current.y}
                x2={next.x}
                y2={next.y}
                stroke="rgb(99 102 241)"
                strokeWidth="1.5"
                strokeDasharray="8 10"
              />
            );
          })}

        </svg>

        {/* CATEGORY TABLES */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">

          {categoryEntries.map(([category, list], index) => (

            <div
              key={category}
              className={`
                rounded-[2rem] border border-slate-800 bg-[#0f172a]/90
                backdrop-blur-xl overflow-hidden
                shadow-[0_0_40px_rgba(0,0,0,0.45)]
                transition-all duration-300
                hover:-translate-y-1 hover:border-indigo-500/40
              `}
            >

              {/* TOP BAR */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {category.replaceAll("_", " ")}
                </div>

              </div>

              {/* TABLE HEADER */}
              <div className="grid grid-cols-[minmax(0,1fr)_88px_100px_90px] px-6 py-3 border-b border-slate-800 text-[10px] uppercase tracking-[0.12em] text-slate-500 bg-slate-900/50">
                <div>Problem Node</div>
                <div>Priority</div>
                <div>Complexity</div>
                <div>Actions</div>
              </div>

              {/* ROWS */}
              <div>

                {list.map((problem) => (

                  <div
                    key={problem.id}
                    className="grid grid-cols-[minmax(0,1fr)_88px_100px_90px] px-6 py-4 border-b border-slate-900 hover:bg-indigo-500/5 transition-all group"
                  >

                    {/* LABEL */}
                    <div className="flex items-center gap-3 min-w-0">

                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          problem.data.completed
                            ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                            : "bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                        }`}
                      />

                      <div className="text-sm text-white truncate group-hover:text-indigo-300 transition-all">
                        {problem.data.label}
                      </div>

                    </div>

                    {/* PRIORITY */}
                    <div className="flex items-center">

                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border ${
                          problem.data.priority === "high"
                            ? "border-rose-500/30 text-rose-300 bg-rose-500/10"
                            : "border-slate-700 text-slate-400 bg-slate-800/60"
                        }`}
                      >
                        {problem.data.priority || "none"}
                      </div>

                    </div>

                    {/* FRICTION */}
                    <div className="flex items-center">

                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border ${
                          problem.data.friction === "hard"
                            ? "border-orange-500/30 text-orange-300 bg-orange-500/10"
                            : "border-slate-700 text-slate-400 bg-slate-800/60"
                        }`}
                      >
                        {problem.data.friction || "none"}
                      </div>

                    </div>

                  {/* Actions */}
                    <div className="flex items-center">

                      <button
                        onClick={() => setActiveProblem(problem)}
                        className="px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border border-slate-700 text-slate-300 bg-slate-800/60 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer"
                      >
                        View Plan
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>


      </div>
    </div>
  );
}

function ProblemPlanView({
  problem,
  setId,
  onClose,
}) {
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);

  const hasPlan =
    problem?.data?.plan &&
    problem.data.plan.trim().length > 0;

  const steps = [
    {
      id: "perspective",
      title: "Perspective Shift",
      description:
        "Detach emotionally and think like you are helping another person facing the same situation.",
    },
    {
      id: "paths",
      title: "Explore 5 Possible Paths",
      description:
        "Research, reflect, and widen the possibility space instead of locking into one direction.",
    },
    {
      id: "normalize",
      title: "Build One Believable Plan",
      description:
        "Combine realistic ideas into one path you genuinely feel capable of following.",
    },
    {
      id: "reward",
      title: "Define The Reward",
      description:
        "Reconnect the solution to meaningful future change and emotional payoff.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-10">

      <div className="w-full max-w-5xl rounded-[2rem] border border-slate-800 bg-[#0b1120]/95 backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)] relative">

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-indigo-500/10 blur-[120px]" />

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950/60">

          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-indigo-400/70 mb-2">
              Execution Pathway
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              {problem.data.label}
            </h2>
          </div>

          <button
            onClick={() => {
              setCreating(false);
              onClose();
            }}
            className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-500 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="relative z-10 p-8">

          {/* META */}
          <div className="flex flex-wrap gap-3 mb-8">

            <div className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              {problem.data.category?.replaceAll("_", " ")}
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-[11px] uppercase tracking-[0.18em] text-rose-300">
              {problem.data.priority || "no priority"}
            </div>

            <div className="px-3 py-1.5 rounded-xl border border-orange-500/20 bg-orange-500/10 text-[11px] uppercase tracking-[0.18em] text-orange-300">
              {problem.data.friction || "no complexity"}
            </div>

          </div>

          {/* ========================= */}
          {/* PLAN EXISTS */}
          {/* ========================= */}
          {hasPlan ? (

            <div className="space-y-8">

              {/* MAIN PLAN */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/30 overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-indigo-400/70 mb-2">
                      Finalized Execution Path
                    </div>

                    <div className="text-lg font-bold text-white">
                      Active Problem Plan
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                    Active
                  </div>

                </div>

                <div className="p-6 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {problem.data.plan}
                </div>

              </div>

              {/* PLAN BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* SOLUTION PATHS */}
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/30 p-6">

                  <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500 mb-5">
                    Explored Paths
                  </div>

                  {problem.data.solutionPaths?.length ? (

                    <div className="space-y-3">

                      {problem.data.solutionPaths.map((path, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300"
                        >
                          <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 mb-2">
                            Path {i + 1}
                          </div>

                          {path}
                        </div>
                      ))}

                    </div>

                  ) : (

                    <div className="text-sm text-slate-500 leading-relaxed">
                      No exploration pathways stored yet.
                    </div>

                  )}

                </div>

                {/* REWARD */}
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/30 p-6">

                  <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500 mb-5">
                    Why Solving This Matters
                  </div>

                  <div className="rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-5">

                    <div className="text-sm leading-relaxed text-slate-300">
                      {problem.data.reward ||
                        "No emotional reward or future outcome defined yet."}
                    </div>

                  </div>

                  <div className="mt-5 text-xs text-slate-500 leading-relaxed">
                    This section exists to reconnect the user with meaningful
                    change during periods of resistance, confusion, or low
                    motivation.
                  </div>

                </div>

              </div>

            </div>

          ) : !creating ? (

            /* ========================= */
            /* INITIAL EMPTY STATE */
            /* ========================= */
            <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-center mb-6">
                <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
              </div>

              <h3 className="text-2xl font-black tracking-tight text-white">
                No Plan Created
              </h3>

              <p className="mt-4 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                This problem currently has no structured execution plan.
                Create a guided pathway using the 4-step planning flow.
              </p>

              <button
                onClick={() => setCreating(true)}
                className="mt-8 px-6 py-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-sm uppercase tracking-[0.18em] text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                Create Plan
              </button>

            </div>

          ) : (

            /* ========================= */
            /* CREATE FLOW */
            /* ========================= */
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

              {/* LEFT SIDEBAR */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/30 overflow-hidden h-fit">

                <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/40">

                  <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/70 mb-2">
                    Guided Construction
                  </div>

                  <div className="text-lg font-bold text-white">
                    4-Step Planning Flow
                  </div>

                </div>

                <div className="p-4 space-y-3">

                  {steps.map((item, index) => (

                    <button
                      key={item.id}
                      onClick={() => setStep(index)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                        step === index
                          ? "border-indigo-500/40 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                      }`}
                    >

                      <div className="flex items-center justify-between mb-2">

                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          Step {index + 1}
                        </div>

                        {step === index && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                        )}

                      </div>

                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>

                    </button>

                  ))}

                </div>

              </div>

              {/* RIGHT CONTENT */}
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/30 overflow-hidden">

                <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/40">

                  <div className="flex items-center justify-between">

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/70 mb-3">
                        Step {step + 1}
                      </div>

                      <h3 className="text-3xl font-black tracking-tight text-white">
                        {steps[step].title}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        setCreating(false);
                        setStep(0);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/50 text-xs uppercase tracking-[0.18em] text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                  </div>

                  <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-2xl">
                    {steps[step].description}
                  </p>

                </div>

                <div className="p-8">

                  {/* STEP A */}
                  {step === 0 && (
                    <div className="space-y-6">

                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/30 p-6">
                        <div className="text-[11px] uppercase tracking-[0.25em] text-indigo-400 mb-4">
                          Perspective Shift
                        </div>

                        <div className="space-y-4 text-sm leading-relaxed text-slate-300">

                          <p>
                            Imagine another person came to you with this exact
                            problem.
                          </p>

                          <p>
                            Remove yourself from the emotional center for a
                            moment and think from the outside.
                          </p>

                          <p>
                            What would you tell them to do first?
                          </p>

                        </div>
                      </div>

                      <textarea
                        placeholder="Write how you would guide another person facing this issue..."
                        className="w-full h-56 rounded-[1.5rem] border border-slate-800 bg-slate-950/40 px-5 py-5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500/40"
                      />

                    </div>
                  )}

                  {/* STEP B */}
                  {step === 1 && (
                    <div className="space-y-5">

                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/30 p-6 text-sm leading-relaxed text-slate-400">
                        Explore multiple believable directions instead of trying
                        to discover one perfect answer.
                      </div>

                      {[1, 2, 3, 4, 5].map((n) => (
                        <textarea
                          key={n}
                          placeholder={`Possible path ${n}...`}
                          className="w-full h-28 rounded-[1.5rem] border border-slate-800 bg-slate-950/40 px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500/40"
                        />
                      ))}

                    </div>
                  )}

                  {/* STEP C */}
                  {step === 2 && (
                    <div className="space-y-6">

                      <div className="rounded-[1.5rem] border border-indigo-500/10 bg-indigo-500/5 p-6">

                        <div className="text-[11px] uppercase tracking-[0.25em] text-indigo-300 mb-3">
                          Believable Over Perfect
                        </div>

                        <div className="text-sm leading-relaxed text-slate-300">
                          The goal is not creating an ideal strategy.
                          The goal is building a path you genuinely feel capable
                          of following consistently.
                        </div>

                      </div>

                      <textarea
                        placeholder="Combine the useful ideas into one realistic and manageable execution path..."
                        className="w-full h-72 rounded-[1.5rem] border border-slate-800 bg-slate-950/40 px-5 py-5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500/40"
                      />

                    </div>
                  )}

                  {/* STEP D */}
                  {step === 3 && (
                    <div className="space-y-6">

                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/30 p-6 text-sm leading-relaxed text-slate-400">
                        Define what changes if this problem gets solved.
                        This becomes a future reminder during periods of low
                        momentum.
                      </div>

                      <textarea
                        placeholder="What improves in your life if this problem gets solved?"
                        className="w-full h-56 rounded-[1.5rem] border border-slate-800 bg-slate-950/40 px-5 py-5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500/40"
                      />

                    </div>
                  )}

                </div>

                {/* FOOTER */}
                <div className="px-8 py-5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">

                  <button
                    disabled={step === 0}
                    onClick={() => setStep((prev) => prev - 1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>

                  {step !== 3 ? (

                    <button
                      onClick={() => setStep((prev) => prev + 1)}
                      className="px-6 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-sm uppercase tracking-[0.18em] text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      Continue
                    </button>

                  ) : (

                    <button
                      className="px-6 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm uppercase tracking-[0.18em] text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer"
                    >
                      Finalize Plan
                    </button>

                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}