import { Block, blockPreviews } from "@/lib/blocks";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface BlockHierarchyProps {
  blocks: Block[];
  onDeleteBlock?: (blockId: string) => void;
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

interface SortableBlockItemProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const getBlockIconData = (blockType: string) => {
  const blockPreview = blockPreviews.find((preview) => preview.type === blockType);
  return blockPreview
    ? {
        Icon: blockPreview.icon,
        bgColor: blockPreview.bgColor,
        iconColor: blockPreview.iconColor,
      }
    : null;
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

function SortableBlockItem({ block, index, isSelected, onSelect, onDelete }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'hierarchy-item',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const iconData = getBlockIconData(block.type);
  const IconComponent = iconData?.Icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`
        group flex items-center gap-1.5 p-1.5 rounded-lg border cursor-pointer transition-all
        ${isDragging ? "opacity-50" : ""}
        ${isSelected
          ? "bg-blue-50 border-blue-300"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      </div>
      {IconComponent && iconData && (
        <div className="rounded-full p-1 flex-shrink-0" style={{ backgroundColor: iconData.bgColor }}>
          <IconComponent size={14} style={{ color: iconData.iconColor, display: "block" }} />
        </div>
      )}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 font-mono">#{index + 1}</span>
        <span className="text-xs font-medium text-gray-700 truncate">
          {getBlockLabel(block)}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-100 rounded flex-shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
      </button>
    </div>
  );
}

export default function BlockHierarchy({
  blocks,
  onDeleteBlock,
  onSelectBlock,
  selectedBlockId
}: BlockHierarchyProps) {
  return (
    <div className="w-64 border-l border-gray-200 bg-white p-3 h-screen overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Block Hierarchy
      </h2>

      {blocks.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No blocks yet</p>
      ) : (
        <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy} id="hierarchy">
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                index={index}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock?.(block.id)}
                onDelete={() => onDeleteBlock?.(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
