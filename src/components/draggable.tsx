"use client";

import React, { ElementType, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Draggable({
  id,
  children,
  element,
}: {
  id: string;
  children: ReactNode;
  element?: ElementType;
}) {
  const Element = element || "div";
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <Element ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </Element>
  );
}
