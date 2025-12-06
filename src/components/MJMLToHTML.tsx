"use client";

import { useEffect, useState } from "react";
import mjml2html from "mjml-browser";

interface MJMLToHTMLProps {
  mjmlContent: string;
}

const MJMLToHTML: React.FC<MJMLToHTMLProps> = ({ mjmlContent }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const render = async () => {
      try {
        const result = mjml2html(mjmlContent);
        setHtml(result.html);
      } catch (error) {
        console.error("Error rendering MJML:", error);
        setHtml("<div>Error rendering block</div>");
      }
    };
    render();
  }, [mjmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MJMLToHTML;
