"use client";

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";

export default function Sortable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id });

  return (
    <motion.div
      layout="position"
      className={cn(isDragging && "opacity-50")}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </motion.div>
  );
}
