"use client";

import { motion } from "framer-motion";

export default function DropIndicator() {
  return <motion.div className="h-2 w-full bg-blue-500 rounded-full" style={{ pointerEvents: "none" }} />;
}
