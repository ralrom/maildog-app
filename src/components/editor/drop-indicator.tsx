"use client";

import { motion } from "framer-motion";

export default function DropIndicator() {
  return <motion.div className="h-1 w-full bg-blue-500 rounded-full" style={{ pointerEvents: "none" }} />;
}
