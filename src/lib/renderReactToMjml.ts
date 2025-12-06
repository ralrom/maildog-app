"use client";

import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import React from "react";
import { MJMLParseResults } from "mjml-core";
import mjml2html from "mjml-browser";

export function renderReactToMjml(mjml: React.ReactElement): MJMLParseResults {
  return mjml2html(renderToMjml(mjml));
}
