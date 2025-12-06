"use client";

import { useState } from "react";
import { Block } from "@/lib/blocks";
import { Layers, Settings } from "lucide-react";
import { HierarchyTab } from "./hierarchy-tab";
import { SettingsTab } from "./settings-tab";

interface RightSidebarProps {
  blocks: Block[];
  selectedBlock: Block | undefined;
  setSelectedBlockId: (id: string | null) => void;
  setBlocks: (blocks: Block[]) => void;
}

export function RightSidebar({
  blocks,
  selectedBlock,
  setSelectedBlockId,
  setBlocks,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"hierarchy" | "settings">("hierarchy");

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("hierarchy")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "hierarchy"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Layers size={18} />
          Hierarchy
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "settings"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "hierarchy" ? (
          <HierarchyTab blocks={blocks} setSelectedBlockId={setSelectedBlockId} />
        ) : (
          <SettingsTab
            selectedBlock={selectedBlock}
            setBlocks={setBlocks}
            blocks={blocks}
          />
        )}
      </div>
    </div>
  );
}
