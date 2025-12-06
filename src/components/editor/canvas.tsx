"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Block } from "@/lib/blocks";
import { SortableBlockItem } from "./sortable-block-item";

interface CanvasProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
}

// Helper function to recursively delete a block from nested structure
function deleteBlockById(blocks: Block[], blockId: string): Block[] {
  return blocks.filter((block) => {
    if (block.id === blockId) {
      return false;
    }
    if (block.children) {
      block.children = deleteBlockById(block.children, blockId);
    }
    if (block.columns) {
      block.columns = block.columns.map((col) => ({
        ...col,
        children: deleteBlockById(col.children, blockId),
      }));
    }
    return true;
  });
}

export function Canvas({ blocks, setBlocks, selectedBlockId, setSelectedBlockId }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  const handleDelete = (blockId: string) => {
    setBlocks(deleteBlockById(blocks, blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div
          ref={setNodeRef}
          className={`bg-white dark:bg-gray-950 min-h-[600px] shadow-lg dark:shadow-black/50 transition-all ${
            isOver ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
          }`}
        >
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-[600px] text-gray-400 dark:text-gray-500 text-center p-8">
              <div>
                <p className="text-lg font-medium">Drop blocks here to start building</p>
                <p className="text-sm mt-2">Drag blocks from the left sidebar</p>
              </div>
            </div>
          ) : (
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => setSelectedBlockId(block.id)}
                  onDelete={() => handleDelete(block.id)}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}
