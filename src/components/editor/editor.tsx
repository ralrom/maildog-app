"use client";

import { useThrottledCallback } from "@/lib/useThrottledCallback";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useEffect } from "react";
import { getBlockComponent } from "./blocks";
import { BlockPreview } from "./blocks/block-preview";
import Container from "./container";
import Sortable from "./dnd/sortable";
import { TreeNodeData, useEditorState } from "./editor-state";
import Palette from "./palette";
import HierarchyPanel from "./hierarchy-panel";
import { RenderContextProvider, RenderNodeOptions } from "./render-context";
import { Tree, TreeNode } from "./tree";

export const extractNodeId = (prefixedId: string): string => prefixedId.split("::")[1] ?? prefixedId;

export const prefixId = (nodeId: string, prefix?: string): string => {
  if (!prefix) return nodeId;
  return `${prefix}::${nodeId}`;
};

const getInsertIndex = (
  overId: string,
  tree: Tree<TreeNodeData>,
  event: DragOverEvent
): { parentId: string; index?: number } | null => {
  const { over, collisions } = event;

  if (!over) return null;

  const overNode = tree.find(overId);
  if (!overNode) return null;

  const collision = collisions?.find((c) => extractNodeId(String(c.id)) === overId);
  if (!collision) {
    return { parentId: overId };
  }

  const activatorEvent = (event as any).activatorEvent as PointerEvent | undefined;
  if (!activatorEvent) {
    return { parentId: overId };
  }

  const overRect = (over as any).rect as DOMRect | undefined;
  if (!overRect) {
    return { parentId: overId };
  }

  const pointerY = activatorEvent.clientY;

  if (overNode.value.type === "container") {
    const children = overNode.children;
    const relativeY = pointerY - overRect.top;
    const itemHeight = overRect.height / Math.max(children.length, 1);

    let index = Math.floor(relativeY / itemHeight);
    index = Math.max(0, Math.min(index, children.length));

    return { parentId: overId, index };
  }

  const parent = tree.findParent(overId);
  if (!parent) return null;

  const siblings = parent.children;
  const currentIndex = siblings.findIndex((node) => node.id === overId);
  if (currentIndex === -1) return { parentId: parent.id };

  const relativeY = pointerY - overRect.top;
  const shouldInsertAfter = relativeY > overRect.height / 2;

  return {
    parentId: parent.id,
    index: shouldInsertAfter ? currentIndex + 1 : currentIndex,
  };
};

export function Block({
  node,
  prefix,
  usePreview = false,
}: {
  node: TreeNode<TreeNodeData>;
  prefix?: string;
  usePreview?: boolean;
}) {
  const block = getBlockComponent(node.value.data?.blockId);
  if (!block) {
    if (usePreview) {
      return <div className="text-sm text-gray-500">Unknown block</div>;
    }
    throw new Error(`Block component not found for node: ${node.id}`);
  }

  const BlockComponent = block.full;
  const id = prefixId(node.id, prefix);

  return <Sortable id={id}>{usePreview ? <BlockPreview block={block} /> : <BlockComponent node={node} />}</Sortable>;
}

export const createRenderTreeNode = (options?: RenderNodeOptions) => {
  const renderTreeNode = (node: TreeNode<TreeNodeData>): React.ReactNode => {
    const { prefix, renderBlock, renderContainer } = options || {};

    if (node.value.type === "block") {
      if (renderBlock) {
        return renderBlock(node);
      }

      const block = getBlockComponent(node.value.data?.blockId);
      if (!block) {
        throw new Error(`Block not found for node: ${node.id}`);
      }

      return <Block key={node.id} node={node} prefix={prefix} />;
    }

    if (node.value.type === "container") {
      if (renderContainer) {
        return renderContainer(node, (childNode) => renderTreeNode(childNode));
      }

      return <Container key={node.id} node={node} prefix={prefix} />;
    }

    return <div key={node.id}>Unsupported block type: {node.value.type}</div>;
  };

  return renderTreeNode;
};

export default function Editor() {
  const {
    tree,
    activeId,
    insertInfo,
    setOverId,
    setActiveId,
    setInsertInfo,
    addNode,
    addNodeWithChildren,
    moveNode,
    cleanupDragState,
  } = useEditorState();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active?.id);
  };

  const handleDragOver = useThrottledCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id);
    if (!over) {
      setInsertInfo(null);
      return;
    }
    const overId = String(over.id);
    // Strip prefix for tree operations
    const nodeId = extractNodeId(overId);
    setInsertInfo(getInsertIndex(nodeId, tree, event));
  }, 100);

  useEffect(() => {
    return () => handleDragOver.cancel?.();
  }, [handleDragOver]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !insertInfo) {
      cleanupDragState();
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    // Strip prefixes for tree operations
    const activeNodeId = extractNodeId(activeId);
    const overNodeId = extractNodeId(overId);

    if (activeNodeId === overNodeId || tree.isDescendant(activeNodeId, overNodeId)) {
      cleanupDragState();
      return;
    }

    if (activeId.startsWith("palette::")) {
      const block = getBlockComponent(extractNodeId(activeId));
      if (block) {
        if (block.initialChildren) {
          const newNode = new TreeNode<TreeNodeData>({
            type: "block",
            data: { blockId: block.type },
          });
          block.initialChildren().forEach((childData) => {
            newNode.addChild(childData);
          });
          addNodeWithChildren(insertInfo.parentId, newNode, insertInfo.index);
        } else {
          addNode(
            insertInfo.parentId,
            {
              type: "block",
              data: { blockId: block.type },
            },
            insertInfo.index
          );
        }
      }
    } else {
      moveNode(activeNodeId, insertInfo.parentId, insertInfo.index);
    }

    cleanupDragState();
  };

  const renderBlockComponent = (node: TreeNode<TreeNodeData>): React.ReactNode => {
    const BlockComponent = getBlockComponent(node.value.data?.blockId)?.full;
    return BlockComponent ? <BlockComponent node={node} /> : null;
  };

  const renderBlockPreview = (node: TreeNode<TreeNodeData>): React.ReactNode => {
    if (node.value.type === "container") {
      return (
        <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <div className="text-sm font-medium text-foreground">
              Container ({node.children.length} {node.children.length === 1 ? "item" : "items"})
            </div>
          </div>
        </div>
      );
    }

    const block = getBlockComponent(node.value.data?.blockId);
    if (!block) {
      return null;
    }
    return <BlockPreview block={block} />;
  };

  if (!tree.root) {
    throw new Error("Tree root not found");
  }

  const canvasOptions: RenderNodeOptions = {
    prefix: "canvas",
  };
  const canvasRenderTreeNode = createRenderTreeNode(canvasOptions);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <RenderContextProvider renderTreeNode={canvasRenderTreeNode} options={canvasOptions}>
        <div className="flex h-screen">
          <div className="w-[300px]">
            <Palette />
          </div>
          <div className="flex-1">{canvasRenderTreeNode(tree.root)}</div>
          <div className="w-[300px]">
            <HierarchyPanel />
          </div>
        </div>

        <DragOverlay>
          {activeId?.startsWith("palette::") ? (
            <BlockPreview block={getBlockComponent(extractNodeId(activeId))!} />
          ) : activeId ? (
            (() => {
              const node = tree.find(extractNodeId(activeId));
              if (!node) return null;

              const isHierarchy = activeId.startsWith("hierarchy::");
              const isBlock = node.value.type === "block";

              if (isHierarchy) {
                return renderBlockPreview(node);
              }
              return isBlock ? renderBlockComponent(node) : <Container node={node} />;
            })()
          ) : null}
        </DragOverlay>
      </RenderContextProvider>
    </DndContext>
  );
}
