import { Block } from ".";

export function BlockPreview({ block }: { block: Block }) {
  const Icon = block.icon;
  return (
    <div className="group flex items-center gap-2 relative p-2 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-ring cursor-grab active:cursor-grabbing">
      <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="text-start">
        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
          {block.title}
        </h3>
        {block.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{block.description}</p>
        )}
      </div>
    </div>
  );
}
