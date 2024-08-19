import express, { RequestHandler } from "express";
import inject from "../middlewares/inject.js";
import CustomRequest from "../types/CustomRequest.js";
import route from "../middlewares/route.js";
import { resolve } from "path";

export default function server(sitesPath: string) {
  const sites = resolve(sitesPath);
  const router = express.Router();

  router.use(inject(sites));

  router.use("/assets", (req, res, next) => {
    return (req as CustomRequest).site.asset(req, res, next);
  });

  router.use((req, res, next) => {
    return (req as CustomRequest).site.public(req, res, next);
  });

  router.get("*", route(sites) as RequestHandler);

  return router;
}
