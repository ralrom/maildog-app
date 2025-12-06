import type { BlockPreview as TBlockPreview } from "@/lib/blocks";

interface BlockPreviewProps {
  block: TBlockPreview;
}

const BlockPreview: React.FC<BlockPreviewProps> = ({ block }) => {
  const IconComponent = block.icon;
  return (
    <div className="flex items-center gap-2 justify-start p-2 rounded-lg border border-dashed border-black/25 dark:border-white/25">
      <div className="rounded-full p-2" style={{ backgroundColor: block.bgColor }}>
        <IconComponent size={24} style={{ color: block.iconColor, display: "block" }} />
      </div>
      <div>
        <p className="font-semibold">{block.title}</p>
        <p className="text-muted">{block.description}</p>
      </div>
    </div>
  );
};

export default BlockPreview;
