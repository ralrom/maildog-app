"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { LayoutGroup, motion } from "framer-motion";
import throttle from "lodash/throttle";
import { useCallback, useMemo, useRef, useState } from "react";
import Pow from "./blocks/pow";
import Wow from "./blocks/wow";
import Draggable from "./draggable";
import Droppable from "./droppable";
import Sortable from "./sortable";
import { isContainer, useEditorStore, type TreeNode } from "./store";

export default function Editor() {
  const { tree, addNode, moveNode, findNode, findDropTarget, findParent } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Create throttled move function
  const throttledMoveNode = useMemo(
    () =>
      throttle((activeId: string, overId: string) => {
        moveNode(activeId, overId);
      }, 100),
    [moveNode]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // throttledMoveNode.cancel();
  };

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      console.log("🔄 Drag Over:", { active: active.id, over: over?.id });

      if (!over || active.id === over.id) {
        return;
      }

      if (active.id === "wow" || active.id === "pow") {
        return;
      }

      // Check if moving to a new container
      const activeParent = findParent(active.id as string);
      const overNode = findNode(over.id as string);

      if (overNode && activeParent) {
        let targetParent;
        if (isContainer(overNode)) {
          targetParent = overNode;
        } else {
          targetParent = findParent(over.id as string);
        }
      }

      throttledMoveNode(active.id as string, over.id as string);
    },
    [findParent, findNode]
    // [throttledMoveNode, findParent, findNode]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    // throttledMoveNode.cancel();

    if (!over || active.id === over.id) return;

    // Adding new item from palette
    if (active.id === "wow" || active.id === "pow") {
      const overNode = findNode(over.id as string);
      if (!overNode) return;

      const blockType = active.id as string;

      if (isContainer(overNode)) {
        // Dropped on container → append at end
        addNode(overNode.id, { id: active.id + "-" + crypto.randomUUID(), type: blockType });
      } else {
        // Dropped on item → insert at that item's position
        const parent = findDropTarget(over.id as string);
        if (!parent) return;
        const index = parent.items.findIndex((item) => item.id === over.id);
        addNode(parent.id, { id: active.id + "-" + crypto.randomUUID(), type: blockType }, index);
      }
    }
  };

  const renderNode = (node: TreeNode): React.ReactNode => {
    if (!isContainer(node)) {
      const BlockComponent = node.type === "pow" ? Pow : Wow;
      return (
        <Sortable key={node.id} id={node.id} activeId={activeId}>
          <BlockComponent />
        </Sortable>
      );
    }

    return (
      <Droppable key={node.id} id={node.id} items={node.items.map((item) => item.id)}>
        {node.id}
        {node.items.map((item) => renderNode(item))}
      </Droppable>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <Draggable id="wow">
        <Wow />
      </Draggable>
      <Draggable id="pow">
        <Pow />
      </Draggable>
      <LayoutGroup>{renderNode(tree)}</LayoutGroup>
      <DragOverlay>
        {activeId ? (
          <motion.div className="shadow-lg">
            {(() => {
              if (activeId === "pow") return <Pow />;
              if (activeId === "wow") return <Wow />;
              const activeNode = findNode(activeId);
              return activeNode?.type === "pow" ? <Pow /> : <Wow />;
            })()}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
