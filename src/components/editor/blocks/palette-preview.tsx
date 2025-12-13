import { Block } from ".";

export function PalettePreview({ block }: { block: Block }) {
  const Icon = block.icon;
  return (
    <div className="group relative p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-ring cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
            {block.title}
          </h3>
          {block.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{block.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
