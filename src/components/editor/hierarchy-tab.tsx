"use client";

import { Block, blockPreviews } from "@/lib/blocks";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableHierarchyItem } from "./sortable-hierarchy-item";
import { useDroppable } from "@dnd-kit/core";

interface HierarchyTabProps {
  blocks: Block[];
  setSelectedBlockId: (id: string | null) => void;
}

function ColumnDropZone({ column, colIndex, onSelect, parentBlockId }: { column: { id: string; children: Block[] }; colIndex: number; onSelect: (id: string) => void; parentBlockId?: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      columnId: column.id,
      parentBlockId,
    },
  });

  return (
    <div className="rounded-md">
      <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
        Column {colIndex + 1}
      </div>
      {column.children.length > 0 ? (
        <SortableContext items={column.children.map((b) => `hierarchy-${b.id}`)} strategy={verticalListSortingStrategy}>
          <div className="ml-2 space-y-1 min-h-[2rem]">
            {column.children.map((child, childIndex) => (
              <BlockHierarchyItem
                key={child.id}
                block={child}
                index={childIndex}
                onSelect={onSelect}
                columnId={column.id}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div
          ref={setNodeRef}
          className={`ml-2 px-2 py-3 text-xs text-gray-400 dark:text-gray-500 rounded border-2 border-dashed transition-colors ${
            isOver ? 'border-purple-400 dark:border-purple-500 bg-purple-100 dark:bg-purple-900/30' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          Empty column
          {isOver && <span className="ml-2 text-purple-600 dark:text-purple-400">Drop here</span>}
        </div>
      )}
    </div>
  );
}

function BlockHierarchyItem({ block, index, onSelect, columnId }: { block: Block; index: number; onSelect: (id: string) => void; columnId?: string }) {
  const preview = blockPreviews.find((p) => p.type === block.type);
  const Icon = preview?.icon;
  const isContainer = preview?.isContainer;
  const hasColumns = block.columns && block.columns.length > 0;
  const hasChildren = block.children && block.children.length > 0;

  const { setNodeRef, isOver } = useDroppable({
    id: `hierarchy-${block.id}`,
    data: {
      type: 'hierarchy-block',
      blockId: block.id,
      columnId,
    },
  });

  return (
    <div ref={setNodeRef}>
      <SortableHierarchyItem
        block={block}
        index={index}
        preview={preview}
        Icon={Icon}
        onSelect={() => onSelect(block.id)}
        isOver={isOver}
      />
      {/* Show columns if the block has them */}
      {hasColumns && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-purple-200 dark:border-purple-700 pl-2">
          {block.columns!.map((column, colIndex) => (
            <ColumnDropZone key={column.id} column={column} colIndex={colIndex} onSelect={onSelect} parentBlockId={block.id} />
          ))}
        </div>
      )}
      {/* Show regular children for non-column containers */}
      {!hasColumns && isContainer && hasChildren && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
          {block.children!.map((child, childIndex) => (
            <BlockHierarchyItem
              key={child.id}
              block={child}
              index={childIndex}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HierarchyTab({ blocks, setSelectedBlockId }: HierarchyTabProps) {
  if (blocks.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>No blocks yet</p>
        <p className="text-sm mt-2">Add blocks from the left sidebar</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Block Structure</h3>
      <SortableContext items={blocks.map((b) => `hierarchy-${b.id}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {blocks.map((block, index) => (
            <BlockHierarchyItem
              key={block.id}
              block={block}
              index={index}
              onSelect={setSelectedBlockId}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
