import { create } from "zustand";
import { Tree, TreeNode } from "./tree";

type BlockId = string | null;

export type InsertInfo = { parentId: string; index?: number } | null;

// Define the data structure for editor nodes
export type TreeNodeData = {
  type: "container" | "block";
  data?: any;
};

// Export TreeNode type for convenience
export type { TreeNode };

interface TreeState {
  tree: Tree<TreeNodeData>;
  activeId: BlockId;
  overId: BlockId;
  insertInfo: InsertInfo;

  setActiveId: (activeId: unknown) => void;
  setOverId: (overId: unknown) => void;
  setInsertInfo: (insertInfo: InsertInfo) => void;
  cleanupDragState: () => void;
  addNode: (parentId: string, nodeData: TreeNodeData, index?: number) => void;
  addNodeWithChildren: (parentId: string, node: TreeNode<TreeNodeData>, index?: number) => void;
  moveNode: (nodeId: string, newParentId: string, index?: number) => void;
  removeNode: (nodeId: string) => void;
}

export const useEditorState = create<TreeState>()((set) => {
  // Initialize tree with root node
  const tree = new Tree<TreeNodeData>({ type: "container" });
  if (tree.root) {
    tree.root.id = "root";
  }

  return {
    tree,
    activeId: null,
    overId: null,
    insertInfo: null,

    setActiveId: (activeId) => set({ activeId: activeId ? String(activeId) : null }),
    setOverId: (overId) => set({ overId: overId ? String(overId) : null }),
    setInsertInfo: (insertInfo) => set({ insertInfo }),
    cleanupDragState: () => set({ activeId: null, overId: null, insertInfo: null }),

    addNode: (parentId, nodeData, index) =>
      set((state) => {
        const newNode = new TreeNode(nodeData);
        state.tree.addNode(parentId, newNode, index);
        return state;
      }),

    addNodeWithChildren: (parentId, node, index) =>
      set((state) => {
        state.tree.addNode(parentId, node, index);
        return state;
      }),

    moveNode: (nodeId, newParentId, index) =>
      set((state) => {
        state.tree.moveNode(nodeId, newParentId, index);
        return state;
      }),

    removeNode: (nodeId) =>
      set((state) => {
        state.tree.removeNode(nodeId);
        return state;
      }),
  };
});
