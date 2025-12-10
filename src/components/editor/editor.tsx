"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { LayoutGroup, motion } from "framer-motion";
import throttle from "lodash/throttle";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import Pow from "./blocks/pow";
import Wow from "./blocks/wow";
import Draggable from "./draggable";
import Droppable from "./droppable";
import DropIndicator from "./drop-indicator";
import { flattenTree, getProjection, removeChildrenOf } from "./projection";
import Sortable from "./sortable";
import { isContainer, useEditorStore, type TreeNode } from "./store";

const PALETTE_ITEMS = ["wow", "pow"] as const;
const isPaletteItem = (id: string | null): id is "wow" | "pow" =>
  id !== null && PALETTE_ITEMS.includes(id as "wow" | "pow");

const getBlockComponent = (type: string) => (type === "pow" ? Pow : Wow);

export default function Editor() {
  const {
    tree,
    addNode,
    moveNode,
    findNode,
    findDropTarget,
    activeId,
    overId,
    projection,
    setActiveId,
    setOverId,
    setProjection,
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Calculate flattened tree and projection
  const flattenedItems = useMemo(() => {
    const flattened = flattenTree(tree);
    const collapsedItems: string[] = []; // For future collapse support

    return removeChildrenOf(flattened, activeId != null ? [activeId, ...collapsedItems] : collapsedItems);
  }, [tree, activeId]);

  // Calculate projection whenever activeId or overId changes
  useEffect(() => {
    if (!activeId || !overId) {
      setProjection(null);
      return;
    }

    // For palette items (wow/pow), calculate simple projection
    if (isPaletteItem(activeId)) {
      const overNode = findNode(overId);
      if (!overNode) {
        setProjection(null);
        return;
      }

      if (isContainer(overNode)) {
        setProjection({ parentId: overId, index: overNode.items.length });
      } else {
        const parent = findDropTarget(overId);
        if (!parent) {
          setProjection(null);
          return;
        }
        const index = parent.items.findIndex((item) => item.id === overId);
        setProjection({ parentId: parent.id, index });
      }
    } else {
      // For tree items, use projection calculation
      setProjection(getProjection(flattenedItems, activeId, overId));
    }
  }, [activeId, overId, flattenedItems, findNode, findDropTarget, setProjection]);

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
    setOverId(null);
    setProjection(null);
    throttledMoveNode.cancel();
  };

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setOverId(null);
        return;
      }

      setOverId(over.id as string);

      // Only move tree items (not palette items) during drag
      if (!isPaletteItem(active.id as string)) {
        throttledMoveNode(active.id as string, over.id as string);
      }
    },
    [throttledMoveNode]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setProjection(null);
    throttledMoveNode.cancel();

    if (!over || active.id === over.id) return;

    // Adding new item from palette
    if (isPaletteItem(active.id as string)) {
      const overNode = findNode(over.id as string);
      if (!overNode) return;

      const newNode = { id: `${active.id}-${crypto.randomUUID()}`, type: active.id as string };

      if (isContainer(overNode)) {
        addNode(overNode.id, newNode);
      } else {
        const parent = findDropTarget(over.id as string);
        if (!parent) return;
        const index = parent.items.findIndex((item) => item.id === over.id);
        addNode(parent.id, newNode, index);
      }
    }
  };

  const renderNode = (node: TreeNode, parentId?: string): React.ReactNode => {
    if (!isContainer(node)) {
      const BlockComponent = getBlockComponent(node.type);
      return (
        <div key={node.id}>
          <Sortable id={node.id}>
            <BlockComponent />
          </Sortable>
        </div>
      );
    }

    // Filter out activeId from items array for rendering (only for tree items, not palette items)
    const visibleItems =
      activeId && !isPaletteItem(activeId) ? node.items.filter((item) => item.id !== activeId) : node.items;
    const itemIds = visibleItems.map((item) => item.id);

    // Check if projection indicates we should show indicator for this container
    // Handle root level (parentId === null means root container "level-1") or specific container
    const isTargetContainer =
      projection &&
      activeId &&
      ((projection.parentId === null && node.id === "level-1") || projection.parentId === node.id);

    return (
      <Droppable key={node.id} id={node.id} items={itemIds}>
        {node.id}
        {visibleItems.map((item, itemIndex) => {
          const result = renderNode(item, node.id);
          return (
            <Fragment key={item.id}>
              {isTargetContainer && projection.index === itemIndex && <DropIndicator />}
              {result}
            </Fragment>
          );
        })}
        {isTargetContainer && projection.index >= visibleItems.length && <DropIndicator />}
      </Droppable>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Draggable id="wow">
        <Wow />
      </Draggable>
      <Draggable id="pow">
        <Pow />
      </Draggable>
      <LayoutGroup>{renderNode(tree)}</LayoutGroup>
      <DragOverlay>
        {activeId && (
          <motion.div className="shadow-lg" style={{ opacity: 0.75 }}>
            {(() => {
              const type = isPaletteItem(activeId) ? activeId : findNode(activeId)?.type ?? "wow";
              const BlockComponent = getBlockComponent(type);
              return <BlockComponent />;
            })()}
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
