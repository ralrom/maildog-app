"use client";

import { useSortable } from "@dnd-kit/sortable";
import { Block } from "@/lib/blocks";
import { BlockRenderer } from "./block-renderer";
import { GripVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface SortableBlockItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableBlockItem({ block, isSelected, onSelect, onDelete }: SortableBlockItemProps) {
  // Check if this is a column block - we want to allow drops into it without triggering sort
  const isColumnBlock = block.type === 'column';

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useSortable({
    id: block.id,
    data: {
      type: "block-instance-canvas",
      blockId: block.id,
      isColumnBlock,
    },
    transition: null, // Disable dnd-kit animations
  });

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className={`group relative ${isDragging ? "opacity-50" : ""} ${
        isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
      }`}
      onClick={onSelect}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      {/* Drag Handle and Delete Button */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className="p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Block Content */}
      <BlockRenderer
        block={block}
        selectedBlockId={isSelected ? block.id : null}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </motion.div>
  );
}
