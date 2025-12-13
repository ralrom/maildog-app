import React from "react";
import { Copy, HeartOff, Columns as ColumnsIcon, Grid3x3 as GridIcon, LucideIcon } from "lucide-react";
import { TreeNode, TreeNodeData } from "../editor-state";
import Wow from "./wow";
import Pow from "./pow";
import Columns from "./columns";
import Grid from "./grid";

export type Block = {
  type: string;
  group: string;
  full: React.FC<{ node?: TreeNode<TreeNodeData> }>;
  icon: LucideIcon;
  title: string;
  description: string;
  initialChildren?: () => TreeNodeData[];
};

export const BLOCKS: Block[] = [
  {
    group: "test",
    type: "wow",
    full: Wow,
    icon: HeartOff,
    title: "Wow",
    description: "Wow, what an amazing block",
  },
  {
    group: "test",
    type: "pow",
    full: Pow,
    icon: Copy,
    title: "Pow",
    description: "Pow, what a destructive block",
  },
  {
    group: "layout",
    type: "columns",
    full: Columns,
    icon: ColumnsIcon,
    title: "Columns",
    description: "Two side-by-side columns for organizing content",
    initialChildren: () => [
      { type: "container" as const },
      { type: "container" as const },
    ],
  },
  {
    group: "layout",
    type: "grid",
    full: Grid,
    icon: GridIcon,
    title: "Grid",
    description: "3-column grid layout for organizing content",
    initialChildren: () => [{ type: "container" as const }],
  },
] as const;

// Map for O(1) lookups by type
export const BLOCKS_BY_TYPE = new Map<string, Block>(
  BLOCKS.map((block) => [block.type, block])
);

export function getPaletteGroups() {
  const groups: { [x: string]: Block[] } = {};
  BLOCKS.forEach((block) => {
    if (!groups[block.group]) {
      groups[block.group] = [];
    }

    groups[block.group].push(block);
  });

  return groups;
}

export const getBlockComponent = (blockId?: string) => (blockId ? BLOCKS_BY_TYPE.get(blockId) : undefined);
