"use client";

import React from "react";
import { TreeNode, TreeNodeData, useEditorState } from "../editor-state";
import Droppable from "../dnd/droppable";
import DropIndicator from "../drop-indicator";
import { extractNodeId, prefixId } from "../editor";
import { useRenderContext } from "../render-context";

export default function Grid({ node }: { node?: TreeNode<TreeNodeData> }) {
  if (!node) {
    return null;
  }

  const { tree, insertInfo, activeId } = useEditorState();
  const { renderTreeNode, options } = useRenderContext();

  // Find the node in the tree to get its children
  const gridNode = tree.find(node.id);
  if (!gridNode) {
    return <div className="text-sm text-gray-500">Grid block not found</div>;
  }

  // Get the container child
  const container = gridNode.children.find((child) => child.value.type === "container");

  if (!container) {
    return (
      <div className="w-full border rounded-md p-4">
        <div className="text-sm text-gray-500">Grid: Need 1 container</div>
      </div>
    );
  }

  const containerId = prefixId(container.id, options.prefix);

  // insertInfo.parentId is always unprefixed, so compare with container.id
  const showIndicator = insertInfo?.parentId === container.id && activeId && extractNodeId(String(activeId)) !== container.id;

  const visibleItems = container.children.filter((item: TreeNode<TreeNodeData>) => {
    return extractNodeId(String(activeId || "")) !== item.id;
  });

  const itemIds = visibleItems.map((item) => prefixId(item.id, options.prefix));

  const indicatorPosition = showIndicator && insertInfo.index;

  return (
    <div className="w-full border rounded-md p-2">
      <Droppable id={containerId} items={itemIds}>
        <div className="grid grid-cols-3 gap-2">
          {visibleItems.map((item: TreeNode<TreeNodeData>, index: number) => (
            <React.Fragment key={item.id}>
              {indicatorPosition === index && (
                <div className="col-span-3">
                  <DropIndicator />
                </div>
              )}
              <div>{renderTreeNode(item)}</div>
            </React.Fragment>
          ))}
          {indicatorPosition === visibleItems.length && (
            <div className="col-span-3">
              <DropIndicator />
            </div>
          )}
        </div>
      </Droppable>
    </div>
  );
}

