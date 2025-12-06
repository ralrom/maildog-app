"use client";

import React, { ElementType, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  id,
  children,
  element,
}: {
  id: string;
  children: ReactNode;
  element?: ElementType;
}) {
  const Element = element || "div";
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Element ref={setNodeRef} className="w-full h-full">
      {children}
    </Element>
  );
}
