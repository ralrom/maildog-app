import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPaletteGroups } from "./blocks";
import Draggable from "./dnd/draggable";
import { BlockPreview } from "./blocks/block-preview";

export default function Palette() {
  const paletteGroups = getPaletteGroups();

  return (
    <div className="h-full overflow-auto border-r border-border">
      <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide p-4">Blocks</h2>
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(paletteGroups).map((groupName) => {
          return (
            <AccordionItem key={groupName} value={groupName}>
              <AccordionTrigger className="text-sidebar-foreground px-4">{groupName}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 px-4">
                  {paletteGroups[groupName].map((block) => (
                    <Draggable key={block.type} id={`palette::${block.type}`}>
                      <BlockPreview block={block} />
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
