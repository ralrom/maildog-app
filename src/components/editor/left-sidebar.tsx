"use client";

import { useDraggable } from "@dnd-kit/core";
import { blockPreviews } from "@/lib/blocks";

function DraggableBlockItem({ blockPreview }: { blockPreview: typeof blockPreviews[0] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: blockPreview.type,
    data: { type: "block-type" },
  });

  const Icon = blockPreview.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: blockPreview.bgColor }}
        >
          <Icon size={20} style={{ color: blockPreview.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {blockPreview.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{blockPreview.description}</p>
        </div>
      </div>
    </div>
  );
}

export function LeftSidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Blocks</h2>
        <div className="space-y-2">
          {blockPreviews.map((blockPreview) => (
            <DraggableBlockItem key={blockPreview.type} blockPreview={blockPreview} />
          ))}
        </div>
      </div>
    </div>
  );
}
