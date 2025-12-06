"use client";

import { useSortable } from "@dnd-kit/sortable";
import { ElementType, ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useDndContext } from "@dnd-kit/core";

export default function Sortable({
  id,
  children,
  element,
  data,
}: {
  id: string;
  children: ReactNode;
  element?: ElementType;
  data?: Record<string, any>;
}) {
  const Element = element || "div";
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
    id,
    data,
  });

  const { active } = useDndContext();

  // Check if dragging from hierarchy (different container)
  const activeContainerId = active?.data.current?.sortable?.containerId;
  const isDraggingFromHierarchy = activeContainerId === 'hierarchy';

  const style = {
    transform: isDraggingFromHierarchy ? undefined : CSS.Transform.toString(transform),
    transition: isDraggingFromHierarchy ? undefined : transition,
  };

  return (
    <Element ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Element>
  );
}
