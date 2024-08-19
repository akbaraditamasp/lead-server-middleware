import axios from "axios";
import { Edge } from "edge.js";
import { resolve } from "path";

export default function edge(sitesPath: string, site: string) {
  const edge = Edge.create();
  edge.global("axios", axios);
  edge.global("error", (code: number) => {
    throw new Error(`${code}`);
  });
  edge.mount(resolve(sitesPath, site, "src"));

  return edge;
}
