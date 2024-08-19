import { Request } from "express";
import SiteSchema from "./SiteSchema.js";

export default interface CustomRequest extends Request {
  site: SiteSchema;
}
