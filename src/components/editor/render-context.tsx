"use client";

import React, { createContext, useContext } from "react";
import { TreeNode, TreeNodeData } from "./editor-state";

export type RenderNodeOptions = {
  prefix?: string;
  renderBlock?: (node: TreeNode<TreeNodeData>) => React.ReactNode;
  renderContainer?: (
    node: TreeNode<TreeNodeData>,
    renderChild: (node: TreeNode<TreeNodeData>) => React.ReactNode
  ) => React.ReactNode;
};

type RenderContextType = {
  renderTreeNode: (node: TreeNode<TreeNodeData>) => React.ReactNode;
  options: RenderNodeOptions;
};

const RenderContext = createContext<RenderContextType | null>(null);

export function RenderContextProvider({
  children,
  renderTreeNode,
  options,
}: {
  children: React.ReactNode;
  renderTreeNode: (node: TreeNode<TreeNodeData>) => React.ReactNode;
  options: RenderNodeOptions;
}) {
  return (
    <RenderContext.Provider value={{ renderTreeNode, options }}>
      {children}
    </RenderContext.Provider>
  );
}

export function useRenderContext() {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error("useRenderContext must be used within RenderContextProvider");
  }
  return context;
}

