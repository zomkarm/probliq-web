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

        const mapped = (json.nodes || []).map((n) => ({
          id: n.id,
          data: {
            label: n.label,
            priority: n.priority,
            friction: n.friction,
            completed: n.completed || false,
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
    return <ProblemSets problems={data} setId={selectedId}
             onBack={() => {
                setSelectedId(null);
                setData(null);
              }} />;
  }

  // list UI
  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black">Your Problem Sets</h1>

          <button
            onClick={() => router.push("/user/home")}
            className="text-xs text-slate-500 hover:text-white cursor-pointer"
          >
            ← Main Menu
          </button>
        </div>

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

function ProblemSets({ problems, setId, onBack }) {

  const [items, setItems] = useState(problems);
  const [showFear, setShowFear] = useState(false);
  const [fearText, setFearText] = useState("");
  const [mode, setMode] = useState("welcome"); 

  const getScore = (p) => {
    const { priority, friction } = p.data || {};
    if (priority === "high" && friction === "easy") return 1;
    if (priority === "high" && friction === "hard") return 2;
    if (priority === "low" && friction === "easy") return 3;
    return 4;
  };

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => getScore(a) - getScore(b));
  }, [items]);

  const currentIndex = useMemo(() => {
    return sorted.findIndex((p) => !p.data.completed);
  }, [sorted]);

  const current = currentIndex === -1 ? null : sorted[currentIndex];

  const handleDone = async () => {
    try {
      const res = await fetch(`/api/problem-set/${setId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: current.id }),
      });

      const json = await res.json();

      if (res.status === 409) {
        toast.error("Already completed");

        // force sync local state
        setItems((prev) =>
          prev.map((p) =>
            p.id === current.id
              ? { ...p, data: { ...p.data, completed: true } }
              : p
          )
        );
        return;
      }

      if (!res.ok) {
        toast.error("Failed to update");
        return;
      }

      // success
      setItems((prev) =>
        prev.map((p) =>
          p.id === current.id
            ? { ...p, data: { ...p.data, completed: true } }
            : p
        )
      );

      setMode("completed");

      toast.success("Marked done");

    } catch (err) {
      toast.error("Network error");
    }
  };

  const consumeFear = () => {
    setFearText("");
    setShowFear(false);
  };


  if (!current) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 text-slate-400">
        <span>All tasks completed.</span>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <CheckCircle2 className="w-5 h-5" />
          Back to Problem Sets
        </button>
      </div>
    );
  }

  if (mode === "welcome") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 text-slate-400">
        <h2 className="text-xl font-bold text-white">Welcome back, Good to see you </h2>

        <button
          onClick={() => setMode("active")}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold"
        >
          Let’s Continue
        </button>

        <button
          onClick={onBack}
          className="text-xs text-slate-500"
        >
          Back
        </button>
      </div>
    );
  }

  if (mode === "completed") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 text-slate-400">
        <h2 className="text-xl font-bold text-white">
          Task completed, Congrats
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => setMode("active")}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
          >
            Let's Continue
          </button>

          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    );
  }

  if (mode === "active") {
    return (
      <div className="max-w-2xl mx-auto space-y-12 py-12">
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-white cursor-pointer"
          >
            ← Back to sets
          </button>
        </div>
        
        {/* Header Signal */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Timer className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
              Active Set
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Focus on one problem. Ignore everything else.
          </p>
        </div>

        {/* Task Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-60" />

          <div className="relative p-10 border border-slate-800 rounded-[2rem] bg-[#020617]/90 text-center shadow-2xl backdrop-blur-xl">
            
            <div className="mb-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
                {/*Task {currentIndex + 1} / {sorted.length}*/}Todays Problem to Tackle
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {current.data?.label || "Untitled Task"}
            </h2>

            <p className="mt-4 text-xs text-slate-600">
              Execute. Don’t evaluate.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            onClick={() => setShowFear(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-2xl border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900/40 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Is something stopping you ?
          </button>

          <button
            onClick={handleDone}
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_30px_rgba(79,70,229,0.35)] active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark Done
          </button>
        </div>


        {/* FEAR OVERLAY */}
        {showFear && createPortal(
          <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col">
            
            <div className="absolute top-8 right-8 z-[10000]">
              <button
                onClick={() => {
                  setFearText("");
                  setShowFear(false);
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xl"
              >
                <X className="w-4 h-4" />
                Exit
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
          document.body
        )}
      </div>
    );
  }
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
        const mapped = (json.nodes || []).map((n) => ({
          id: n.id,
          data: {
            label: n.label,
            priority: n.priority,
            friction: n.friction,
            completed: n.completed || false,
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