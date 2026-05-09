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

function ProblemSets({ problems = [], setId, onBack }) {
  const [items, setItems] = useState(Array.isArray(problems) ? problems : []);
  const [activeProblem, setActiveProblem] = useState(null);

  useEffect(() => {
    setItems(Array.isArray(problems) ? problems : []);
  }, [problems]);

  const grouped = useMemo(() => {
    const map = {};

    (items || []).forEach((p) => {
      if (!p?.data) return;

      const key = p.data.category || "uncategorized";

      if (!map[key]) map[key] = [];
      map[key].push(p);
    });

    return map;
  }, [items]);

  const markDone = async (problemId) => {
    try {
      const res = await fetch(`/api/problem-set/${setId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });

      if (!res.ok) {
        toast.error("Update failed");
        return;
      }

      setItems((prev) =>
        (prev || []).map((p) =>
          p.id === problemId
            ? { ...p, data: { ...p.data, completed: true } }
            : p
        )
      );

      toast.success("Done");
    } catch (err) {
      toast.error("Network error");
    }
  };

  if (!items.length) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        No problems found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 text-white">

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-xs text-slate-400">
          ← Back
        </button>

        <h1 className="font-bold">Problem Set</h1>
      </div>

      {activeProblem && (
        <ProblemModal
          problem={activeProblem}
          setId={setId}
          onClose={() => setActiveProblem(null)}
          onDone={markDone}
          setItems={setItems}
        />
      )}

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, list]) => (
          <div key={category} className="space-y-4">

            <h2 className="text-xs uppercase tracking-widest text-slate-500">
              {category}
            </h2>

            <div className="space-y-3">
              {(list || []).map((p) => (
                <div
                  key={p.id}
                  className="p-4 border border-slate-800 rounded-xl flex justify-between items-center bg-slate-900/30"
                >
                  <div>
                    <div className="text-sm">{p?.data?.label}</div>
                    <div className="text-xs text-slate-500">
                      {p?.data?.priority} • {p?.data?.friction}
                    </div>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => setActiveProblem(p)}
                      className="text-xs px-3 py-1 border border-slate-700 rounded-lg"
                    >
                      View
                    </button>

                    {!p?.data?.completed && (
                      <button
                        onClick={() => markDone(p.id)}
                        className="text-xs px-3 py-1 bg-indigo-600 rounded-lg"
                      >
                        Done
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSetModule() {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSet = async (id) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/problem-set/${id}`);
      const json = await res.json();

      const mapped = (json.problems || []).map((n) => ({
        id: n.id,
        data: {
          label: n.label,
          priority: n.priority,
          friction: n.friction,
          category: n.category,
          completed: n.completed,
          solutionPaths: n.solutionPaths || [],
        },
      }));

      setData(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) fetchSet(selectedId);
  }, [selectedId]);

  if (!selectedId) {
    return <ProblemSetList onSelect={setSelectedId} />;
  }

  if (loading || !data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading set...
      </div>
    );
  }

  return (
    <ProblemSetViewer
      problems={data}
      onBack={() => {
        setSelectedId(null);
        setData(null);
      }}
      onRefresh={() => fetchSet(selectedId)}
    />
  );
}


function ProblemSetViewer({ problems, onBack }) {
  const [items, setItems] = useState(problems);
  const [activeProblem, setActiveProblem] = useState(null);

  const grouped = useMemo(() => {
    const map = {};

    items.forEach((p) => {
      const key = p.data?.category || "uncategorized";

      if (!map[key]) map[key] = [];
      map[key].push(p);
    });

    return map;
  }, [items]);

  const markDone = async (id) => {
    try {
      const res = await fetch(`/api/problem-set/${items[0].data.problemSetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: id }),
      });

      if (!res.ok) return;

      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, data: { ...p.data, completed: true } }
            : p
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-xs text-slate-500">
          ← Back
        </button>

        <h1 className="text-xl font-bold text-white">
          Problem Set
        </h1>
      </div>

      {/* If modal open */}
      {activeProblem && (
        <ProblemModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
          onDone={markDone}
        />
      )}

      {/* Groups */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, list]) => (
          <div key={category} className="space-y-4">

            <h2 className="text-sm uppercase tracking-widest text-slate-500">
              {category}
            </h2>

            <div className="space-y-3">
              {list.map((p) => (
                <ProblemCard
                  key={p.id}
                  problem={p}
                  onOpen={() => setActiveProblem(p)}
                  onDone={() => markDone(p.id)}
                />
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}


function ProblemCard({ problem, onOpen, onDone }) {
  return (
    <div className="p-4 border border-slate-800 rounded-xl bg-slate-900/40 flex justify-between items-center">

      <div>
        <div className="text-white text-sm font-medium">
          {problem.data.label}
        </div>

        <div className="text-xs text-slate-500">
          {problem.data.priority} • {problem.data.friction}
        </div>
      </div>

      <div className="flex gap-2">

        <button
          onClick={onOpen}
          className="text-xs px-3 py-1 border border-slate-700 rounded-lg"
        >
          View
        </button>

        {!problem.data.completed && (
          <button
            onClick={onDone}
            className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg"
          >
            Done
          </button>
        )}

      </div>
    </div>
  );
}


function ProblemModal({ problem, setId, onClose, onDone, setItems }) {
  const [tab, setTab] = useState("plan");
  const [planText, setPlanText] = useState(problem?.data?.plan || "");

  const savePlan = async () => {
    try {
      const res = await fetch(`/api/problem-set/${setId}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          plan: planText,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to save plan");
        return;
      }

      setItems((prev) =>
        prev.map((p) =>
          p.id === problem.id
            ? { ...p, data: { ...p.data, plan: planText } }
            : p
        )
      );

      toast.success("Plan saved");
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="w-[600px] bg-[#020617] border border-slate-800 rounded-2xl p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between">
          <h3 className="font-bold">{problem.data.label}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 text-xs">
          <button onClick={() => setTab("plan")}>Plan</button>
          <button onClick={() => setTab("solution")}>Solution</button>
        </div>

        {/* Content */}
        <div className="text-sm text-slate-300 min-h-[150px]">

          {tab === "plan" && (
            <div className="space-y-3">
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
                placeholder="Write your plan..."
              />

              <button
                onClick={savePlan}
                className="px-3 py-1 bg-indigo-600 rounded"
              >
                Save Plan
              </button>
            </div>
          )}

          {tab === "solution" && (
            <div>
              {problem.data.solutionPaths?.length
                ? problem.data.solutionPaths.map((s, i) => (
                    <div key={i}>• {s.title}</div>
                  ))
                : "No solution yet"}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onDone(problem.id)}
            className="px-3 py-1 bg-indigo-600 rounded"
          >
            Mark Done
          </button>
        </div>
      </div>
    </div>
  );
}