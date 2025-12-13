import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPaletteGroups } from "./blocks";
import Draggable from "./dnd/draggable";
import { PalettePreview } from "./blocks/palette-preview";

export default function Palette() {
  const paletteGroups = getPaletteGroups();

  return (
    <div className="h-full overflow-auto p-4 border-r border-border bg-sidebar">
      <h2 className="text-sm font-semibold mb-4 text-sidebar-foreground uppercase tracking-wide">Blocks</h2>
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(paletteGroups).map((groupName) => {
          return (
            <AccordionItem key={groupName} value={groupName}>
              <AccordionTrigger className="text-sidebar-foreground">{groupName}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {paletteGroups[groupName].map((block) => (
                    <Draggable key={block.type} id={`palette::${block.type}`}>
                      <PalettePreview block={block} />
                    </Draggable>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
