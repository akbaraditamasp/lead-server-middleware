import { Edge } from "edge.js";
import { RequestHandler } from "express";

export default interface SiteSchema {
  site: string;
  edge: () => Edge;
  public: RequestHandler;
  asset: RequestHandler;
}
