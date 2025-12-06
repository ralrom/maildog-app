"use client";

import { useSortable } from "@dnd-kit/sortable";
import { Block, BlockPreview } from "@/lib/blocks";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";

interface SortableHierarchyItemProps {
  block: Block;
  index: number;
  preview: BlockPreview | undefined;
  Icon: any;
  onSelect: () => void;
  isOver?: boolean;
}

export function SortableHierarchyItem({ block, index, preview, Icon, onSelect, isOver }: SortableHierarchyItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: `hierarchy-${block.id}`,
    data: {
      type: "block-instance-hierarchy",
      blockId: block.id,
    },
    transition: null, // Disable dnd-kit animations
  });

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className="relative group"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-400' : ''
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={14} className="text-gray-400" />
        </div>
        {Icon && (
          <div
            className="p-1.5 rounded"
            style={{
              backgroundColor: preview?.bgColor,
            }}
          >
            <Icon size={14} style={{ color: preview?.iconColor }} />
          </div>
        )}
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {preview?.title || "Unknown"}
        </span>
      </button>
    </motion.div>
  );
}
