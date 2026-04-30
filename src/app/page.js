"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

/**
 * Custom node: editable problem block
 */
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

export default function ProblemCanvas() {
  const idRef = useRef(1);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /**
   * Update node text
   */
  const updateNodeText = useCallback((id, text) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: text } } : n
      )
    );
  }, [setNodes]);

  /**
   * Add new node at center-ish random offset
   */
  const addNode = () => {
    const id = String(idRef.current++);
    const newNode = {
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
    };
    setNodes((nds) => nds.concat(newNode));
  };

  /**
   * Connect nodes
   */
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
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100vh", background: "#020617" }}>
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 16,
          left: 16,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={addNode}
          style={{
            padding: "8px 14px",
            background: "#e5e7eb",
            color: "#020617",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
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
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
