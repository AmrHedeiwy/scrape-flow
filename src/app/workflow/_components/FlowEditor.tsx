"use client";

import React, { useEffect } from "react";

import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { EDITOR_GAPS } from "../_constants/editor";

import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { toast } from "sonner";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/create-flow-node";
import { IWorkflowNode } from "@/types/workflow-node";
import DeletableEdge from "./edges/DeletableEdge";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<IWorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) return;

    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) return;

      toast.message("Restored viewport", {
        id: "restore-viewport",
        action: {
          label: "Restore",
          onClick: () => {
            const { x, y, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
          },
        },
      });
    } catch (error) {}
  }, [workflow.definition, setNodes, setEdges, setViewport, nodes, edges]);

  const onDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const taskType = event.dataTransfer.getData("application/reactflow");
      if (!taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition],
  );

  const onConnect = React.useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges],
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={EDITOR_GAPS} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
