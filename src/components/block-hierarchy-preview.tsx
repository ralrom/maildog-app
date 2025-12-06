import { Block } from "@/lib/blocks";
import { GripVertical } from "lucide-react";

interface BlockHierarchyPreviewProps {
  block: Block;
}

const getBlockIcon = (blockType: string) => {
  const iconMap: Record<string, string> = {
    hero: "⭐",
    text: "📝",
    image: "🖼️",
    button: "🔘",
    "product-list": "🛍️",
    "abandoned-cart": "🛒",
    testimonials: "💬",
    gallery: "🎨",
    "logo-grid": "⊞",
    footer: "📞",
  };
  return iconMap[blockType] || "📦";
};

const getBlockLabel = (block: Block) => {
  const content = block.content as any;

  switch (block.type) {
    case "hero":
      return content.title || "Hero Section";
    case "text":
      return content.text?.substring(0, 30) || "Text Block";
    case "image":
      return content.alt || "Image";
    case "button":
      return content.text || "Button";
    case "product-list":
      return `Products (${content.products?.length || 0})`;
    case "abandoned-cart":
      return content.title || "Abandoned Cart";
    case "testimonials":
      return `Testimonials (${content.testimonials?.length || 0})`;
    case "gallery":
      return `Gallery (${content.images?.length || 0})`;
    case "logo-grid":
      return `Logos (${content.logos?.length || 0})`;
    case "footer":
      return content.companyName || "Footer";
    default:
      return block.type;
  }
};

export default function BlockHierarchyPreview({ block }: BlockHierarchyPreviewProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border bg-blue-50 border-blue-300 shadow-lg w-64">
      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-lg flex-shrink-0">{getBlockIcon(block.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-700 truncate">
          {getBlockLabel(block)}
        </div>
      </div>
    </div>
  );
}
