import { isContainer, type TreeNode } from "./store";

export type FlattenedItem = {
  id: string;
  parentId: string | null;
  children: string[];
  collapsed?: boolean;
};

export type Projection = {
  parentId: string | null;
  index: number;
} | null;

/**
 * Flattens a tree structure into a flat array
 */
function flatten(
  items: TreeNode[],
  parentId: string | null = null
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item) => {
    const flattenedItem: FlattenedItem = {
      id: item.id,
      parentId,
      children: isContainer(item) ? item.items.map((child) => child.id) : [],
    };

    return [
      ...acc,
      flattenedItem,
      ...(isContainer(item) ? flatten(item.items, item.id) : []),
    ];
  }, []);
}

export function flattenTree(tree: TreeNode): FlattenedItem[] {
  if (isContainer(tree)) {
    return flatten(tree.items, null);
  }
  return [{ id: tree.id, parentId: null, children: [] }];
}

/**
 * Removes children of specified items from the flattened tree
 */
export function removeChildrenOf(items: FlattenedItem[], ids: string[]): FlattenedItem[] {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

/**
 * Calculates the projection (where the item will be inserted) based on:
 * - The flattened tree structure
 * - The active (dragged) item ID
 * - The over (target) item ID (from pointerWithin collision detection)
 * 
 * This matches the logic used in moveNode to ensure projection matches actual drop behavior.
 * The overId comes from pointerWithin collision detection which finds the innermost droppable.
 */
export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string
): Projection {
  const overItem = items.find(({ id }) => id === overId);
  if (!overItem) return null;

  // Check if overId is a container (has children) - matches moveNode's isContainer check
  const overItemIsContainer = overItem.children.length > 0;

  // Match moveNode logic exactly:
  // if (isContainer(overNode)) → targetParent = overNode, targetIndex = overNode.items.length
  // else → targetParent = overParent, targetIndex = overParent.items.findIndex(item => item.id === overId)
  if (overItemIsContainer) {
    // Dropped on a container → append at end (match moveNode line 149-150)
    const visibleChildren = overItem.children.filter((id) => id !== activeId);
    return { parentId: overId, index: visibleChildren.length };
  } else {
    // Dropped on an item → insert at that position (match moveNode line 152-156)
    const siblings = items.filter(
      (item) => item.parentId === overItem.parentId && item.id !== activeId
    );
    const index = siblings.findIndex((item) => item.id === overId);
    return { parentId: overItem.parentId, index: index === -1 ? 0 : index };
  }
}
