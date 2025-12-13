"use client";

import { useDraggable } from "@dnd-kit/core";

export default function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <button ref={setNodeRef} style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
