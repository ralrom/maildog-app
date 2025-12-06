"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Block, BLOCK_TYPES } from "@/lib/blocks";
import { SortableBlockItem } from "./sortable-block-item";

interface BlockRendererProps {
  block: Block;
  selectedBlockId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BlockRenderer({ block, selectedBlockId, onSelect, onDelete }: BlockRendererProps) {
  switch (block.type) {
    case BLOCK_TYPES.HERO:
      return <HeroBlock block={block} />;
    case BLOCK_TYPES.TEXT:
      return <TextBlock block={block} />;
    case BLOCK_TYPES.IMAGE:
      return <ImageBlock block={block} />;
    case BLOCK_TYPES.BUTTON:
      return <ButtonBlock block={block} />;
    case BLOCK_TYPES.PRODUCT_LIST:
      return <ProductListBlock block={block} />;
    case BLOCK_TYPES.ABANDONED_CART:
      return <AbandonedCartBlock block={block} />;
    case BLOCK_TYPES.TESTIMONIALS:
      return <TestimonialsBlock block={block} />;
    case BLOCK_TYPES.GALLERY:
      return <GalleryBlock block={block} />;
    case BLOCK_TYPES.LOGO_GRID:
      return <LogoGridBlock block={block} />;
    case BLOCK_TYPES.FOOTER:
      return <FooterBlock block={block} />;
    case BLOCK_TYPES.COLUMN:
      return <ColumnBlock block={block} selectedBlockId={selectedBlockId} onSelect={onSelect} onDelete={onDelete} />;
    default:
      return <div className="p-4 bg-gray-100">Unknown block type</div>;
  }
}

function HeroBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
      <h1 className="text-4xl font-bold mb-4">{content.title || "Hero Title"}</h1>
      <p className="text-xl mb-6">{content.subtitle || "Hero subtitle"}</p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
        {content.buttonText || "Call to Action"}
      </button>
    </div>
  );
}

function TextBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6">
      <p className="text-gray-700">{content.text || "Enter your text here..."}</p>
    </div>
  );
}

function ImageBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-4">
      {content.src ? (
        <img src={content.src} alt={content.alt || ""} className="w-full h-auto" />
      ) : (
        <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-500">
          Image placeholder
        </div>
      )}
    </div>
  );
}

function ButtonBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6 text-center">
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
        {content.text || "Click Here"}
      </button>
    </div>
  );
}

function ProductListBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {content.products?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {content.products.map((product: any, i: number) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="bg-gray-200 h-32 mb-2"></div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No products added</div>
      )}
    </div>
  );
}

function AbandonedCartBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-2">{content.title || "Don't forget your items!"}</h2>
      <p className="text-gray-600 mb-4">{content.subtitle || "Complete your purchase"}</p>
      <div className="bg-white p-4 rounded-lg mb-4">
        {content.cartItems?.length > 0 ? (
          content.cartItems.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items in cart</p>
        )}
      </div>
      <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
        {content.buttonText || "Complete Purchase"}
      </button>
    </div>
  );
}

function TestimonialsBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">Testimonials</h2>
      {content.testimonials?.length > 0 ? (
        <div className="space-y-4">
          {content.testimonials.map((testimonial: any, i: number) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <p className="italic mb-2">"{testimonial.quote}"</p>
              <p className="text-sm text-gray-600">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No testimonials added</div>
      )}
    </div>
  );
}

function GalleryBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      {content.images?.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {content.images.map((img: any, i: number) => (
            <div key={i} className="bg-gray-200 h-24"></div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No images added</div>
      )}
    </div>
  );
}

function LogoGridBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-4 text-center">Our Partners</h2>
      {content.logos?.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {content.logos.map((logo: any, i: number) => (
            <div key={i} className="bg-white p-4 rounded flex items-center justify-center">
              <div className="bg-gray-200 w-16 h-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">No logos added</div>
      )}
    </div>
  );
}

function FooterBlock({ block }: { block: Block }) {
  const content = block.content as any;
  return (
    <div className="p-6 bg-gray-800 text-white">
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2">{content.companyName || "Your Company"}</h3>
        {content.address && <p className="text-sm text-gray-300">{content.address}</p>}
        {content.phone && <p className="text-sm text-gray-300">{content.phone}</p>}
        {content.email && <p className="text-sm text-gray-300">{content.email}</p>}
      </div>
    </div>
  );
}

function ColumnBlock({
  block,
  selectedBlockId,
  onSelect,
  onDelete
}: {
  block: Block;
  selectedBlockId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const content = block.content as any;
  const columns = block.columns || [];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-4">
        {columns.map((column) => (
          <ColumnItem
            key={column.id}
            column={column}
            selectedBlockId={selectedBlockId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function ColumnItem({
  column,
  selectedBlockId,
  onSelect,
  onDelete
}: {
  column: { id: string; children: Block[] };
  selectedBlockId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <SortableContext items={column.children.map((b) => b.id)} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 border-2 border-dashed border-purple-300 bg-white dark:bg-gray-950 min-h-[150px] transition-all relative ${
          isOver ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""
        }`}
        style={{ minHeight: '150px' }}
      >
        {column.children && column.children.length > 0 ? (
          <div className="space-y-2">
            {column.children.map((child) => (
              <SortableBlockItem
                key={child.id}
                block={child}
                isSelected={selectedBlockId === child.id}
                onSelect={() => onSelect?.(child.id)}
                onDelete={() => onDelete?.(child.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-purple-400 dark:text-purple-500 text-sm">
            Drop blocks here
          </div>
        )}
      </div>
    </SortableContext>
  );
}
