"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, DragOverEvent, MeasuringStrategy, useSensor, useSensors, PointerSensor, pointerWithin, rectIntersection, CollisionDetection, getFirstCollision } from "@dnd-kit/core";
import { arrayMove, AnimateLayoutChanges, defaultAnimateLayoutChanges, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Block, BlockType, createBlock, blockPreviews } from "@/lib/blocks";
import { LeftSidebar } from "./editor/left-sidebar";
import { Canvas } from "./editor/canvas";
import { RightSidebar } from "./editor/right-sidebar";
import { BlockPreviewCard } from "./editor/block-preview-card";
import { BlockRenderer } from "./editor/block-renderer";

export default function Editor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"block-type" | "block-instance" | null>(null);
  const [dragSource, setDragSource] = useState<"sidebar" | "canvas" | "hierarchy" | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);

    const dataType = event.active.data.current?.type;
    console.log("Drag start - data type:", dataType);

    // Determine if dragging a block type from sidebar or an existing block
    if (dataType === "block-type") {
      setActiveType("block-type");
      setDragSource("sidebar");
    } else if (dataType === "block-instance-hierarchy") {
      setActiveType("block-instance");
      setDragSource("hierarchy");
    } else if (dataType === "block-instance-canvas") {
      setActiveType("block-instance");
      setDragSource("canvas");
    } else {
      setActiveType("block-instance");
      setDragSource("canvas");
    }
    console.log("Drag source set to:", dataType === "block-type" ? "sidebar" : dataType === "block-instance-hierarchy" ? "hierarchy" : "canvas");
  };

  // Helper function to add block to container
  const addBlockToContainer = (blocks: Block[], containerId: string, newBlock: Block): Block[] => {
    return blocks.map((block) => {
      if (block.id === containerId) {
        return {
          ...block,
          children: [...(block.children || []), { ...newBlock, parentId: containerId }],
        };
      }
      if (block.children) {
        return {
          ...block,
          children: addBlockToContainer(block.children, containerId, newBlock),
        };
      }
      return block;
    });
  };

  // Helper function to add block to a specific column
  const addBlockToColumn = (blocks: Block[], columnId: string, newBlock: Block): Block[] => {
    return blocks.map((block) => {
      if (block.columns) {
        return {
          ...block,
          columns: block.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                children: [...col.children, { ...newBlock, parentId: block.id }],
              };
            }
            return col;
          }),
        };
      }
      if (block.children) {
        return {
          ...block,
          children: addBlockToColumn(block.children, columnId, newBlock),
        };
      }
      return block;
    });
  };

  // Helper function to find which column a block belongs to
  const findBlockLocation = (
    blocks: Block[],
    blockId: string,
    path: { type: 'root' | 'column'; columnId?: string } = { type: 'root' }
  ): { type: 'root' | 'column'; columnId?: string } | null => {
    for (const block of blocks) {
      if (block.id === blockId) {
        return path;
      }
      if (block.columns) {
        for (const col of block.columns) {
          const found = findBlockLocation(col.children, blockId, { type: 'column', columnId: col.id });
          if (found) return found;
        }
      }
      if (block.children) {
        const found = findBlockLocation(block.children, blockId, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to reorder blocks within a column
  const reorderBlocksInColumn = (blocks: Block[], columnId: string, activeId: string, overId: string): Block[] => {
    return blocks.map((block) => {
      if (block.columns) {
        return {
          ...block,
          columns: block.columns.map((col) => {
            if (col.id === columnId) {
              const activeIndex = col.children.findIndex((b) => b.id === activeId);
              const overIndex = col.children.findIndex((b) => b.id === overId);
              if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                return {
                  ...col,
                  children: arrayMove(col.children, activeIndex, overIndex),
                };
              }
            }
            return col;
          }),
        };
      }
      if (block.children) {
        return {
          ...block,
          children: reorderBlocksInColumn(block.children, columnId, activeId, overId),
        };
      }
      return block;
    });
  };

  // Helper function to remove a block from anywhere in the tree
  const removeBlockFromTree = (blocks: Block[], blockId: string): { blocks: Block[]; removedBlock: Block | null } => {
    let removedBlock: Block | null = null;

    const removeFromArray = (arr: Block[]): Block[] => {
      const filtered: Block[] = [];
      for (const block of arr) {
        if (block.id === blockId) {
          removedBlock = block;
          continue;
        }
        const newBlock = { ...block };
        if (newBlock.columns) {
          newBlock.columns = newBlock.columns.map((col) => ({
            ...col,
            children: removeFromArray(col.children),
          }));
        }
        if (newBlock.children) {
          newBlock.children = removeFromArray(newBlock.children);
        }
        filtered.push(newBlock);
      }
      return filtered;
    };

    return { blocks: removeFromArray(blocks), removedBlock };
  };

  // Helper function to insert block at a specific location
  const insertBlockAtLocation = (
    blocks: Block[],
    targetBlockId: string,
    blockToInsert: Block,
    location: { type: 'root' | 'column'; columnId?: string }
  ): Block[] => {
    if (location.type === 'root') {
      const targetIndex = blocks.findIndex((b) => b.id === targetBlockId);
      if (targetIndex !== -1) {
        const newBlocks = [...blocks];
        newBlocks.splice(targetIndex, 0, { ...blockToInsert, parentId: undefined });
        return newBlocks;
      }
    } else if (location.type === 'column' && location.columnId) {
      return blocks.map((block) => {
        if (block.columns) {
          return {
            ...block,
            columns: block.columns.map((col) => {
              if (col.id === location.columnId) {
                const targetIndex = col.children.findIndex((b) => b.id === targetBlockId);
                if (targetIndex !== -1) {
                  const newChildren = [...col.children];
                  newChildren.splice(targetIndex, 0, { ...blockToInsert, parentId: block.id });
                  return { ...col, children: newChildren };
                }
              }
              return col;
            }),
          };
        }
        if (block.children) {
          return {
            ...block,
            children: insertBlockAtLocation(block.children, targetBlockId, blockToInsert, location),
          };
        }
        return block;
      });
    }
    return blocks;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setDragSource(null);
      return;
    }

    // Case 1: Dragging a new block type from sidebar
    if (activeType === "block-type") {
      const blockType = active.id as BlockType;
      const newBlock = createBlock(blockType);

      // Check if dropped into a specific column
      if (over.data?.current?.type === "column") {
        const columnId = over.data.current.columnId;
        setBlocks(addBlockToColumn(blocks, columnId, newBlock));
      }
      // Check if dropped into a container
      else if (over.data?.current?.type === "container") {
        const containerId = over.data.current.blockId;
        setBlocks(addBlockToContainer(blocks, containerId, newBlock));
      }
      // If dropped on canvas (empty area)
      else if (over.id === "canvas") {
        setBlocks([...blocks, newBlock]);
      }
      // If dropped on an existing block, insert before it
      else {
        const overId = typeof over.id === "string" && over.id.startsWith("hierarchy-")
          ? over.id.replace("hierarchy-", "")
          : over.id;
        const overIndex = blocks.findIndex((b) => b.id === overId);
        if (overIndex !== -1) {
          const newBlocks = [...blocks];
          newBlocks.splice(overIndex, 0, newBlock);
          setBlocks(newBlocks);
        }
      }
    }
    // Case 2: Reordering existing blocks
    // Already handled by onDragOver, no need to update again

    setActiveId(null);
    setActiveType(null);
    setDragSource(null);
  };

  // Helper to find block recursively
  const findBlockById = (blocks: Block[], id: string): Block | undefined => {
    for (const block of blocks) {
      if (block.id === id) return block;
      if (block.columns) {
        for (const col of block.columns) {
          const found = findBlockById(col.children, id);
          if (found) return found;
        }
      }
      if (block.children) {
        const found = findBlockById(block.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedBlock = findBlockById(blocks, selectedBlockId || '');
  const actualActiveId = typeof activeId === "string" && activeId.startsWith("hierarchy-")
    ? activeId.replace("hierarchy-", "")
    : activeId;
  const activeBlock = findBlockById(blocks, actualActiveId || '');

  // Custom collision detection that prioritizes hierarchy blocks and columns appropriately
  const customCollisionDetection: CollisionDetection = (args) => {
    // First, get all collisions using pointer-based detection
    const pointerCollisions = pointerWithin(args);

    // If we have pointer collisions, prioritize in order: hierarchy blocks > canvas columns > column blocks
    if (pointerCollisions.length > 0) {
      // Highest priority: hierarchy block items (for sorting within hierarchy)
      const hierarchyBlockCollisions = pointerCollisions.filter(({ id, data }) =>
        data?.current?.type === 'hierarchy-block'
      );

      if (hierarchyBlockCollisions.length > 0) {
        return hierarchyBlockCollisions;
      }

      // Second priority: column droppables (for canvas)
      const columnCollisions = pointerCollisions.filter(({ id }) =>
        typeof id === 'string' && id.startsWith('column-')
      );

      if (columnCollisions.length > 0) {
        return columnCollisions;
      }

      // Third priority: other valid targets
      const nonColumnBlockCollisions = pointerCollisions.filter(({ id, data }) => {
        // Keep canvas and hierarchy items
        if (id === 'canvas' || (typeof id === 'string' && id.startsWith('hierarchy-'))) {
          return true;
        }
        // Filter out column blocks but keep other blocks
        return data?.current?.isColumnBlock !== true;
      });

      if (nonColumnBlockCollisions.length > 0) {
        return nonColumnBlockCollisions;
      }

      return pointerCollisions;
    }

    // Fall back to rectangle intersection for other cases
    const intersectionCollisions = rectIntersection(args);

    if (intersectionCollisions.length > 0) {
      // Same priority order for intersection collisions
      const hierarchyBlockCollisions = intersectionCollisions.filter(({ id, data }) =>
        data?.current?.type === 'hierarchy-block'
      );

      if (hierarchyBlockCollisions.length > 0) {
        return hierarchyBlockCollisions;
      }

      const columnCollisions = intersectionCollisions.filter(({ id }) =>
        typeof id === 'string' && id.startsWith('column-')
      );

      if (columnCollisions.length > 0) {
        return columnCollisions;
      }

      // Filter out column block containers
      const nonColumnBlockCollisions = intersectionCollisions.filter(({ id, data }) => {
        if (id === 'canvas' || (typeof id === 'string' && id.startsWith('hierarchy-'))) {
          return true;
        }
        return data?.current?.isColumnBlock !== true;
      });

      if (nonColumnBlockCollisions.length > 0) {
        return nonColumnBlockCollisions;
      }

      return intersectionCollisions;
    }

    // Final fallback to closest center
    return closestCenter(args);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(event) => {
        const { active, over } = event;

        if (!over || activeType !== "block-instance") return;

        // Extract active block ID - handle both direct ID and data.blockId
        const activeId = active.data.current?.blockId ||
                        (typeof active.id === "string" && active.id.startsWith("hierarchy-")
                          ? active.id.replace("hierarchy-", "")
                          : active.id as string);

        // Check if we're over a column droppable area
        const overColumnId = over.data.current?.type === 'column' ? over.data.current.columnId :
                            over.data.current?.type === 'hierarchy-block' && over.data.current?.columnId ? over.data.current.columnId :
                            null;

        // Check if we're over a specific block
        const overId = over.data.current?.blockId ||
                      (typeof over.id === "string" && over.id.startsWith("hierarchy-")
                        ? over.id.replace("hierarchy-", "")
                        : (typeof over.id === "string" && !over.id.startsWith("column-") && !over.id.startsWith("container-") && over.id !== "canvas"
                          ? over.id
                          : null)) as string | null;

        console.log("DragOver - activeId:", activeId, "overId:", overId, "overColumnId:", overColumnId, "overData:", over.data.current);

        setBlocks((currentBlocks) => {
          // Skip if dragging over itself
          if (activeId === overId && !overColumnId) return currentBlocks;

          // Find where the active block is located
          const activeLocation = findBlockLocation(currentBlocks, activeId);
          console.log("Active location:", activeLocation);

          // Dropping into a column (either empty or with blocks)
          if (overColumnId) {
            console.log("Dropping into column:", overColumnId);

            // If we're over a specific block in the column, handle position
            if (overId && overId !== activeId) {
              const overLocation = findBlockLocation(currentBlocks, overId);
              console.log("Over specific block in column, overLocation:", overLocation);

              // Both in same column - reorder
              if (activeLocation?.type === 'column' && overLocation?.type === 'column' &&
                  activeLocation.columnId === overLocation.columnId) {
                console.log("Reordering in same column");
                return reorderBlocksInColumn(currentBlocks, activeLocation.columnId!, activeId, overId);
              }

              // Moving to different column - remove and insert
              if (overLocation?.type === 'column') {
                console.log("Moving to different column");
                const { blocks: newBlocks, removedBlock } = removeBlockFromTree(currentBlocks, activeId);
                if (removedBlock) {
                  return insertBlockAtLocation(newBlocks, overId, removedBlock, overLocation);
                }
              }
            }

            // Dropping into empty space in column or moving from root to column
            console.log("Dropping into empty space or from root to column");
            const { blocks: newBlocks, removedBlock } = removeBlockFromTree(currentBlocks, activeId);
            if (removedBlock) {
              return addBlockToColumn(newBlocks, overColumnId, removedBlock);
            }

            return currentBlocks;
          }

          // Not over a column, must be over canvas or hierarchy
          if (!overId) return currentBlocks;

          const overLocation = findBlockLocation(currentBlocks, overId);
          console.log("Over location:", overLocation);

          // Both blocks are at root level - reorder
          if (activeLocation?.type === 'root' && overLocation?.type === 'root') {
            const activeIndex = currentBlocks.findIndex((b) => b.id === activeId);
            const overIndex = currentBlocks.findIndex((b) => b.id === overId);

            if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
              console.log("Reordering at root level");
              return arrayMove(currentBlocks, activeIndex, overIndex);
            }
          }

          // Moving from column to root
          if (activeLocation?.type === 'column' && overLocation?.type === 'root') {
            console.log("Moving from column to root");
            const { blocks: newBlocks, removedBlock } = removeBlockFromTree(currentBlocks, activeId);
            if (removedBlock) {
              return insertBlockAtLocation(newBlocks, overId, removedBlock, overLocation);
            }
          }

          return currentBlocks;
        });
      }}
      collisionDetection={customCollisionDetection}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950">
        {/* Left Sidebar - Block List */}
        <LeftSidebar />

        {/* Main Canvas - Email Preview */}
        <Canvas
          blocks={blocks}
          setBlocks={setBlocks}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
        />

        {/* Right Sidebar - Hierarchy & Settings */}
        <RightSidebar
          blocks={blocks}
          selectedBlock={selectedBlock}
          setSelectedBlockId={setSelectedBlockId}
          setBlocks={setBlocks}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId && dragSource === "sidebar" && activeType === "block-type" ? (
          <BlockPreviewCard blockType={activeId as BlockType} />
        ) : activeId && dragSource === "canvas" && activeBlock ? (
          <div className="max-w-2xl bg-white dark:bg-gray-950 opacity-80">
            <BlockRenderer block={activeBlock} />
          </div>
        ) : activeId && dragSource === "hierarchy" && activeBlock ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-2">
            {(() => {
              const preview = blockPreviews.find((p) => p.type === activeBlock.type);
              const Icon = preview?.icon;

              return (
                <>
                  {Icon && (
                    <div
                      className="p-1.5 rounded"
                      style={{
                        backgroundColor: preview.bgColor,
                      }}
                    >
                      <Icon size={14} style={{ color: preview.iconColor }} />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {preview?.title || "Unknown"}
                  </span>
                </>
              );
            })()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
