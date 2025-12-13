export class TreeNode<T> {
  id: string;
  value: T;
  children: TreeNode<T>[];
  parent: TreeNode<T> | null;

  constructor(value: T, id?: string) {
    this.id = id || crypto.randomUUID();
    this.value = value;
    this.children = [];
    this.parent = null;
  }

  // Add a child node
  addChild(value: T): TreeNode<T> {
    const child = new TreeNode(value);
    child.parent = this;
    this.children.push(child);
    return child;
  }

  // Add an existing node as a child
  addChildNode(node: TreeNode<T>): void {
    node.parent = this;
    this.children.push(node);
  }

  // Remove a child by value
  removeChild(value: T): boolean {
    const index = this.children.findIndex((child) => child.value === value);
    if (index !== -1) {
      this.children[index].parent = null;
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  // Check if this node is a leaf (has no children)
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  // Check if this node is the root (has no parent)
  isRoot(): boolean {
    return this.parent === null;
  }

  // Get the depth of this node from the root
  getDepth(): number {
    let depth = 0;
    let current: TreeNode<T> | null = this;
    while (current.parent) {
      depth++;
      current = current.parent;
    }
    return depth;
  }
}

// Tree class to manage the entire tree structure
export class Tree<T> {
  root: TreeNode<T> | null;

  constructor(rootValue?: T) {
    this.root = rootValue !== undefined ? new TreeNode(rootValue) : null;
  }

  find(id: string, node?: TreeNode<T>): TreeNode<T> | null {
    const current = node || this.root;
    if (!current) return null;

    if (current.id === id) return current;

    for (const child of current.children) {
      const found = this.find(id, child);
      if (found) return found;
    }

    return null;
  }

  /**
   * Find the parent of a node by its ID
   */
  findParent(id: string, node?: TreeNode<T>, parent: TreeNode<T> | null = null): TreeNode<T> | null {
    const current = node || this.root;
    if (!current) return null;

    if (current.id === id) return parent;

    for (const child of current.children) {
      const found = this.findParent(id, child, current);
      if (found !== null) return found;
    }

    return null;
  }

  /**
   * Add a node to a specific parent at an optional index
   */
  addNode(parentId: string, node: TreeNode<T>, index?: number): boolean {
    const parent = this.find(parentId);
    if (!parent) return false;

    // Remove from old parent if it has one
    if (node.parent) {
      const oldParent = node.parent;
      const oldIndex = oldParent.children.findIndex((child) => child.id === node.id);
      if (oldIndex !== -1) {
        oldParent.children.splice(oldIndex, 1);
      }
    }

    node.parent = parent;

    if (index !== undefined && index >= 0 && index <= parent.children.length) {
      parent.children.splice(index, 0, node);
    } else {
      parent.children.push(node);
    }

    return true;
  }

  /**
   * Remove a node by its ID
   */
  removeNode(nodeId: string): boolean {
    const parent = this.findParent(nodeId);
    if (!parent) return false;

    const index = parent.children.findIndex((child) => child.id === nodeId);
    if (index === -1) return false;

    parent.children[index].parent = null;
    parent.children.splice(index, 1);
    return true;
  }

  /**
   * Check if a node is a descendant of another node
   */
  isDescendant(descendantId: string, ancestorId: string): boolean {
    const ancestor = this.find(ancestorId);
    if (!ancestor) return false;

    const descendant = this.find(descendantId, ancestor);
    return descendant !== null;
  }

  /**
   * Move a node to a new parent at an optional index
   */
  moveNode(nodeId: string, newParentId: string, index?: number): boolean {
    const node = this.find(nodeId);
    if (!node) return false;

    // Prevent moving a node into itself or its own descendant
    if (nodeId === newParentId) return false;

    const newParent = this.find(newParentId);
    if (!newParent) return false;

    // Check if newParent is a descendant of node
    let current: TreeNode<T> | null = newParent;
    while (current) {
      if (current.id === nodeId) return false;
      current = current.parent;
    }

    // Remove from old location
    if (!this.removeNode(nodeId)) return false;

    // Add to new location
    return this.addNode(newParentId, node, index);
  }
}
