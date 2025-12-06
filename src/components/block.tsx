"use client";

import { Block as TBlock } from "@/lib/blocks";
import { renderReactToMjml } from "@/lib/renderReactToMjml";
import { Mjml, MjmlBody, MjmlColumn, MjmlSection, MjmlText } from "@faire/mjml-react";
import BlockButton from "./blocks/block-button";
import BlockHero from "./blocks/block-hero";
import BlockImage from "./blocks/block-image";
import BlockText from "./blocks/block-text";
import BlockProductList from "./blocks/block-product-list";
import BlockTestimonials from "./blocks/block-testimonials";
import { useEffect, useRef } from "react";

interface BlockProps {
  block: TBlock;
  className?: string;
}

const renderBlockContent = ({ block }: { block: TBlock }) => {
  const content = (() => {
    switch (block.type) {
      case "hero":
        return BlockHero({ block });
      case "text":
        return BlockText({ block });
      case "image":
        return BlockImage({ block });
      case "button":
        return BlockButton({ block });
      case "product-list":
        return BlockProductList({ block });
      case "testimonials":
        return BlockTestimonials({ block });
      default:
        return (
          <MjmlSection backgroundColor="#f3f4f6" padding="20px">
            <MjmlColumn>
              <MjmlText
                color="#6b7280"
                fontSize="14px"
                align="center"
                fontStyle="italic"
              >
                Block not implemented yet
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
        );
    }
  })();

  return (
    <Mjml>
      <MjmlBody>{content}</MjmlBody>
    </Mjml>
  );
};

const Block = ({ block, className }: BlockProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const blockContent = renderBlockContent({ block });
  const { html, errors } = renderReactToMjml(blockContent);

  useEffect(() => {
    const host = rootRef.current;
    if (!host) return;

    // Only attach shadow DOM if it doesn't exist
    if (!host.shadowRoot) {
      const shadowRoot = host.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = html;
    } else {
      // Update existing shadow DOM content
      host.shadowRoot.innerHTML = html;
    }
  }, [html]);

  if (errors.length) {
    console.error(errors);
    return null;
  }

  return <div ref={rootRef} className={className} />;
};

export default Block;
