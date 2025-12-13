"use client";

import React from "react";
import { TreeNode, TreeNodeData, useEditorState } from "../editor-state";
import Container from "../container";
import { useRenderContext } from "../render-context";

export default function Columns({ node }: { node?: TreeNode<TreeNodeData> }) {
  if (!node) {
    return null;
  }

  const { tree } = useEditorState();

  // Find the node in the tree to get its children
  const columnsNode = tree.find(node.id);
  if (!columnsNode) {
    return <div className="text-sm text-gray-500">Columns block not found</div>;
  }

  // Get the 2 column containers
  const columns = columnsNode.children.slice(0, 2);

  if (columns.length < 2) {
    return (
      <div className="w-full border rounded-md p-4">
        <div className="text-sm text-gray-500">Columns: Need 2 column containers</div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md p-2">
      <div className="flex gap-2">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 min-w-0">
            <Container node={column} />
          </div>
        ))}
      </div>
    </div>
  );
}
