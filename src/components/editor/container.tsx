"use client";

import React from "react";
import { useEditorState } from "./editor-state";
import { TreeNode, TreeNodeData } from "./editor-state";
import Droppable from "./dnd/droppable";
import DropIndicator from "./drop-indicator";
import { extractNodeId, prefixId } from "./editor";
import { useRenderContext } from "./render-context";

export default function Container({
  node,
  prefix,
}: {
  node: TreeNode<TreeNodeData>;
  prefix?: string;
}) {
  const { insertInfo, activeId } = useEditorState();
  const { renderTreeNode, options } = useRenderContext();
  const containerId = prefixId(node.id, prefix ?? options.prefix);

  // insertInfo.parentId is always unprefixed, so compare with node.id
  const showIndicator = insertInfo?.parentId === node.id && activeId && extractNodeId(String(activeId)) !== node.id;

  const visibleItems = node.children.filter((item: TreeNode<TreeNodeData>) => {
    return extractNodeId(String(activeId || "")) !== item.id;
  });

  const itemIds = visibleItems.map((item) => prefixId(item.id, prefix ?? options.prefix));

  const indicatorPosition = showIndicator && insertInfo.index;

  return (
    <Droppable id={containerId} items={itemIds}>
      <div className="flex flex-col gap-2">
        {visibleItems.map((item: TreeNode<TreeNodeData>, index: number) => (
          <React.Fragment key={item.id}>
            {indicatorPosition === index && <DropIndicator />}
            {renderTreeNode(item)}
          </React.Fragment>
        ))}
        {indicatorPosition === visibleItems.length && <DropIndicator />}
      </div>
    </Droppable>
  );
}

