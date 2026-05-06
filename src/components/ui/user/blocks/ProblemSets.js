"use client";

import { useProblemStore } from "@/store/problemStore";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import WorryEaterSequenceWrapper from '@/components/ui/shared/WorryEaterSequence'
import { Timer, ShieldAlert, CheckCircle2, X } from "lucide-react";



export default function ProblemSetList() {
  const [sets, setSets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const mapped = (json.nodes || []).map((n) => ({
          id: n.id,
          data: {
            label: n.label,
            priority: n.priority,
            friction: n.friction,
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
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  // show execution UI
  if (selectedId && data) {
    return <ProblemSets problems={data} />;
  }

  // list UI
  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-black">Your Problem Sets</h1>

        <div className="grid gap-4">
          {sets.map((set) => (
            <div
              key={set.id}
              onClick={() => setSelectedId(set.id)}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500 cursor-pointer transition-all"
            >
              <div className="text-lg font-bold">{set.name}</div>
              <div className="text-xs text-slate-500">
                {new Date(set.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {sets.length === 0 && (
            <div className="text-slate-500 text-sm">
              No problem sets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProblemSets({ problems }) {

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

  const handleDoneNEW = async () => {
    try {
      await fetch(`/api/problem-set/${setId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: current.id }),
      });

      setIndex((i) => i + 1);
    } catch (err) {
      console.error("Failed to update progress", err);
    }
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

function ProblemSetModule() {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!selectedId) return;

    const fetchSet = async () => {
      try {
        const res = await fetch(`/api/problem-set/${selectedId}`);
        const json = await res.json();

        // convert DB → UI shape
        const mapped = json.nodes.map((n) => ({
          id: n.id,
          data: {
            label: n.label,
            priority: n.priority,
            friction: n.friction,
          },
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSet();
  }, [selectedId]);

  if (!selectedId) {
    return <ProblemSetList onSelect={setSelectedId} />;
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading set...
      </div>
    );
  }

  return <ProblemSets problems={data} />;
}