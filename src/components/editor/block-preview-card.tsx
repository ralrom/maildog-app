"use client";

import { BlockType, blockPreviews } from "@/lib/blocks";

interface BlockPreviewCardProps {
  blockType: BlockType;
}

export function BlockPreviewCard({ blockType }: BlockPreviewCardProps) {
  const preview = blockPreviews.find((p) => p.type === blockType);

  if (!preview) return null;

  const Icon = preview.icon;

  return (
    <div className="p-3 rounded-lg border-2 border-blue-500 bg-white shadow-lg opacity-90">
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: preview.bgColor }}
        >
          <Icon size={20} style={{ color: preview.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {preview.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{preview.description}</p>
        </div>
      </div>
    </div>
  );
}
