"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Droppable({ id, items, children }: { id: string; items: string[]; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    borderColor: isOver ? "green" : undefined,
  };

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} style={style} className="flex flex-col gap-2 border min-h-[200px] p-4">
        {children}
      </div>
    </SortableContext>
  );
}
