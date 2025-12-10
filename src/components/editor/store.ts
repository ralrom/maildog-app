import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ContainerNode = {
  id: string;
  type: "container";
  items: TreeNode[];
};

type LeafNode = {
  id: string;
  type: Exclude<string, "container">;
};

export type TreeNode = ContainerNode | LeafNode;

export function isContainer(node: TreeNode): node is ContainerNode {
  return node.type === "container";
}

function findNodeById(tree: TreeNode, id: string): TreeNode | null {
  if (tree.id === id) {
    return tree;
  }

  if (isContainer(tree)) {
    for (const item of tree.items) {
      const found = findNodeById(item, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function findParentById(
  tree: TreeNode,
  id: string,
  parent: ContainerNode | null = null
): ContainerNode | null {
  if (tree.id === id) {
    return parent;
  }

  if (isContainer(tree)) {
    for (const item of tree.items) {
      const found = findParentById(item, id, tree);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

type EditorStore = {
  tree: TreeNode;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  findNode: (id: string) => TreeNode | null;
  findDropTarget: (id: string) => ContainerNode | null;
  addNode: (parentId: string, node: TreeNode, index?: number) => void;
  moveNode: (activeId: string, overId: string) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<TreeNode>) => void;
};

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    tree: {
      id: "level-1",
      type: "container",
      items: [
        {
          id: "level-2",
          type: "container",
          items: [],
        },
        {
          id: "level-3",
          type: "container",
          items: [],
        },
      ],
    },

    activeId: null,
    setActiveId: (id) => set({ activeId: id }),

    findNode: (id) => findNodeById(get().tree, id),

    findDropTarget: (id) => {
      const node = findNodeById(get().tree, id);
      if (!node) return null;
      return isContainer(node) ? node : findParentById(get().tree, id);
    },

    addNode: (parentId, node, index) =>
      set((state) => {
        const parent = findNodeById(state.tree, parentId);
        if (parent && isContainer(parent)) {
          if (index !== undefined) {
            parent.items.splice(index, 0, node);
          } else {
            parent.items.push(node);
          }
        }
      }),

    moveNode: (activeId, overId) =>
      set((state) => {
        const activeNode = findNodeById(state.tree, activeId);
        const activeParent = findParentById(state.tree, activeId);
        if (!activeNode || !activeParent) return;

        const overNode = findNodeById(state.tree, overId);
        if (!overNode) return;

        // Determine target container and index
        let targetParent: ContainerNode;
        let targetIndex: number;

        if (isContainer(overNode)) {
          // Dropped on a container → append at end
          targetParent = overNode;
          targetIndex = overNode.items.length;
        } else {
          // Dropped on an item → insert at that position
          const overParent = findParentById(state.tree, overId);
          if (!overParent) return;
          targetParent = overParent;
          targetIndex = overParent.items.findIndex((item) => item.id === overId);
        }

        // Same container → reorder
        if (activeParent.id === targetParent.id) {
          const oldIndex = activeParent.items.findIndex((item) => item.id === activeId);
          if (oldIndex !== -1 && targetIndex !== -1) {
            activeParent.items = arrayMove(activeParent.items, oldIndex, targetIndex);
          }
        } else {
          // Different container → move between containers
          const oldIndex = activeParent.items.findIndex((item) => item.id === activeId);
          if (oldIndex !== -1) {
            // Remove from old parent
            activeParent.items.splice(oldIndex, 1);
            // Add to new parent
            targetParent.items.splice(targetIndex, 0, activeNode);
          }
        }
      }),

    removeNode: (id) =>
      set((state) => {
        const removeFromTree = (node: TreeNode): boolean => {
          if (!isContainer(node)) return false;
          const index = node.items.findIndex((item) => item.id === id);
          if (index !== -1) {
            node.items.splice(index, 1);
            return true;
          }
          return node.items.some(removeFromTree);
        };
        removeFromTree(state.tree);
      }),

    updateNode: (id, updates) =>
      set((state) => {
        const node = findNodeById(state.tree, id);
        if (node) {
          Object.assign(node, updates);
        }
      }),
  }))
);
