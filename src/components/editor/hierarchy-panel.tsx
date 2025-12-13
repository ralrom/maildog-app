"use client";

import React from "react";
import Container from "./container";
import { Block, createRenderTreeNode } from "./editor";
import { TreeNode, TreeNodeData, useEditorState } from "./editor-state";
import { RenderContextProvider, RenderNodeOptions, useRenderContext } from "./render-context";

function BlockHierarchyView({ node }: { node: TreeNode<TreeNodeData> }) {
  const { renderTreeNode } = useRenderContext();

  return (
    <div className="mb-2">
      <Block node={node} prefix="hierarchy" usePreview={true} />
      {node.children.length > 0 && (
        <div className="pl-4 mt-2 border-l border-border/50 ml-2">
          {node.children.map((child) => (
            <div key={child.id} className="mb-1">
              {renderTreeNode(child)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchyPanel() {
  const { tree } = useEditorState();

  if (!tree.root) {
    return null;
  }

  const renderHierarchyContainer = (node: TreeNode<TreeNodeData>): React.ReactNode => {
    const isRoot = node.id === "root";

    return (
      <div key={node.id} className={isRoot ? "" : "pl-4 mb-2"}>
        <Container node={node} prefix="hierarchy" />
      </div>
    );
  };

  const hierarchyOptions: RenderNodeOptions = {
    prefix: "hierarchy",
    renderBlock: (node) => {
      return <BlockHierarchyView key={node.id} node={node} />;
    },
    renderContainer: renderHierarchyContainer,
  };

  const hierarchyRenderTreeNode = createRenderTreeNode(hierarchyOptions);

  return (
    <RenderContextProvider renderTreeNode={hierarchyRenderTreeNode} options={hierarchyOptions}>
      <div className="h-full overflow-auto p-4 border-l border-border bg-sidebar">
        <h2 className="text-sm font-semibold mb-4 text-sidebar-foreground uppercase tracking-wide">Hierarchy</h2>
        <div className="space-y-1">{hierarchyRenderTreeNode(tree.root)}</div>
      </div>
    </RenderContextProvider>
  );
}
