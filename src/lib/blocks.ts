// Block type definitions and available blocks for the email builder
import {
  Star,
  FileText,
  MessageCircle,
  MousePointerClick,
  Image,
  Columns,
  Grid3X3,
  Phone,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";

// Available block types
export const BLOCK_TYPES = {
  HERO: "hero",
  TEXT: "text",
  IMAGE: "image",
  BUTTON: "button",
  PRODUCT_LIST: "product-list",
  ABANDONED_CART: "abandoned-cart",
  TESTIMONIALS: "testimonials",
  GALLERY: "gallery",
  LOGO_GRID: "logo-grid",
  FOOTER: "footer",
  COLUMN: "column",
} as const;

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];

// Block content interfaces for different block types
export interface ContentHero {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
}

export interface ContentText {
  text: string;
}

export interface ContentImage {
  src: string;
  alt: string;
  link: string;
}

export interface ContentButton {
  text: string;
  url: string;
  style: string;
}

export interface ContentProductList {
  products: any[];
}

export interface ContentAbandonedCart {
  title: string;
  subtitle: string;
  cartItems: any[];
  totalAmount: string;
  buttonText: string;
  buttonUrl: string;
}

export interface ContentTestimonials {
  testimonials: any[];
}

export interface ContentGallery {
  images: any[];
}

export interface ContentLogoGrid {
  logos: any[];
}

export interface ContentFooter {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: any[];
}

export interface ContentColumn {
  numberOfColumns: number;
}

// Union type for all possible block content
export type Content =
  | ContentHero
  | ContentText
  | ContentImage
  | ContentButton
  | ContentProductList
  | ContentAbandonedCart
  | ContentTestimonials
  | ContentGallery
  | ContentLogoGrid
  | ContentFooter
  | ContentColumn;

// Column data for multi-column layouts
export interface ColumnData {
  id: string;
  children: Block[];
}

// Main block interface
export interface Block {
  id: string;
  type: BlockType;
  content: Content;
  children?: Block[];
  columns?: ColumnData[];
  parentId?: string;
}

// Block preview interface for sidebar items
export interface BlockPreview {
  type: BlockType;
  icon: any; // Lucide icon component
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  isHighlighted: boolean;
  isContainer?: boolean;
  defaultContent: Content;
}

// Available blocks for the sidebar
export const blockPreviews: BlockPreview[] = [
  {
    type: BLOCK_TYPES.HERO,
    icon: Star,
    title: "Hero Section",
    description: "Eye-catching header with CTA",
    bgColor: "#fee2e2",
    iconColor: "#dc2626",
    isHighlighted: true,
    defaultContent: {
      title: "Welcome to our newsletter",
      subtitle: "Stay updated with our latest offers",
      buttonText: "Shop Now",
      buttonUrl: "https://example.com",
      backgroundImage: "",
    },
  },
  {
    type: BLOCK_TYPES.PRODUCT_LIST,
    icon: ShoppingBag,
    title: "Product List",
    description: "Showcase your products",
    bgColor: "#fce7f3",
    iconColor: "#db2777",
    isHighlighted: false,
    defaultContent: {
      products: [],
    },
  },
  {
    type: BLOCK_TYPES.ABANDONED_CART,
    icon: ShoppingCart,
    title: "Abandoned Cart",
    description: "Remind customers of their cart",
    bgColor: "#e9d5ff",
    iconColor: "#7c3aed",
    isHighlighted: false,
    defaultContent: {
      title: "Don't forget your items!",
      subtitle: "Complete your purchase before it's too late",
      cartItems: [],
      totalAmount: "$0.00",
      buttonText: "Complete Purchase",
      buttonUrl: "https://example.com/checkout",
    },
  },
  {
    type: BLOCK_TYPES.TESTIMONIALS,
    icon: MessageCircle,
    title: "Testimonials",
    description: "Customer reviews and feedback",
    bgColor: "#fed7aa",
    iconColor: "#ea580c",
    isHighlighted: false,
    defaultContent: {
      testimonials: [],
    },
  },
  {
    type: BLOCK_TYPES.BUTTON,
    icon: MousePointerClick,
    title: "Call to Action",
    description: "Prominent buttons for engagement",
    bgColor: "#dbeafe",
    iconColor: "#2563eb",
    isHighlighted: false,
    defaultContent: {
      text: "Click Here",
      url: "https://example.com",
      style: "primary",
    },
  },
  {
    type: BLOCK_TYPES.IMAGE,
    icon: Image,
    title: "Image",
    description: "Single featured image",
    bgColor: "#fef3c7",
    iconColor: "#d97706",
    isHighlighted: false,
    defaultContent: {
      src: "",
      alt: "",
      link: "",
    },
  },
  {
    type: BLOCK_TYPES.GALLERY,
    icon: Columns,
    title: "Gallery",
    description: "Multiple images grid",
    bgColor: "#d1fae5",
    iconColor: "#059669",
    isHighlighted: false,
    defaultContent: {
      images: [],
    },
  },
  {
    type: BLOCK_TYPES.LOGO_GRID,
    icon: Grid3X3,
    title: "Logo Grid",
    description: "Partner/client logos",
    bgColor: "#e0e7ff",
    iconColor: "#3730a3",
    isHighlighted: false,
    defaultContent: {
      logos: [],
    },
  },
  {
    type: BLOCK_TYPES.TEXT,
    icon: FileText,
    title: "Text Block",
    description: "Rich text content",
    bgColor: "#f3f4f6",
    iconColor: "#374151",
    isHighlighted: false,
    defaultContent: {
      text: "Enter your text here...",
    },
  },
  {
    type: BLOCK_TYPES.FOOTER,
    icon: Phone,
    title: "Footer",
    description: "Contact and links",
    bgColor: "#f3f4f6",
    iconColor: "#374151",
    isHighlighted: false,
    defaultContent: {
      companyName: "Your Company",
      address: "",
      phone: "",
      email: "",
      socialLinks: [],
    },
  },
  {
    type: BLOCK_TYPES.COLUMN,
    icon: Columns,
    title: "Columns",
    description: "Container for multi-column layouts",
    bgColor: "#ddd6fe",
    iconColor: "#7c3aed",
    isHighlighted: true,
    isContainer: true,
    defaultContent: {
      numberOfColumns: 2,
    },
  },
];

// Utility function to create a new block instance
export const createBlock = (type: BlockType, customContent = {}, parentId?: string) => {
  const blockTemplate = blockPreviews.find((block) => block.type === type);
  if (!blockTemplate) {
    throw new Error(`Unknown block type: ${type}`);
  }

  const block: Block = {
    id: generateUniqueId(),
    type,
    content: { ...blockTemplate.defaultContent, ...customContent },
  };

  if (blockTemplate.isContainer) {
    // For column blocks, create multiple columns based on numberOfColumns
    if (type === BLOCK_TYPES.COLUMN) {
      const numberOfColumns = (block.content as ContentColumn).numberOfColumns;
      block.columns = Array.from({ length: numberOfColumns }, () => ({
        id: generateUniqueId(),
        children: [],
      }));
    } else {
      block.children = [];
    }
  }

  if (parentId) {
    block.parentId = parentId;
  }

  return block;
};

// Generate unique ID for blocks
const generateUniqueId = () => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
