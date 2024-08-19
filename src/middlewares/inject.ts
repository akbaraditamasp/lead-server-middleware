import express, { NextFunction, Request, Response } from "express";
import { join } from "path";
import edge from "../modules/edge.js";
import rxdb from "../modules/rxdb.js";
import CustomRequest from "../types/CustomRequest.js";

export default function inject(sitesPath: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.get("host")) {
      return res.sendStatus(404);
    }

    let site = await rxdb.db().sites.findOne(req.get("host")).exec();

    if (!site) {
      const target = edge(sitesPath, req.get("host")!);
      const publicStatic = express.static(
        join(sitesPath, req.get("host")!, "public")
      );
      const assetStatic = express.static(
        join(sitesPath, req.get("host")!, "assets")
      );

      site = await rxdb.db().sites.insert({
        site: req.get("host"),
        edge: () => target,
        public: publicStatic,
        asset: assetStatic,
      });
    }

    (req as CustomRequest).site = site;

    next();
  };
}
