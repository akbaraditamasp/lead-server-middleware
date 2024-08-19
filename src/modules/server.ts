import express, { RequestHandler } from "express";
import inject from "../middlewares/inject.js";
import CustomRequest from "../types/CustomRequest.js";
import route from "../middlewares/route.js";
import { resolve } from "path";
import rxdb from "./rxdb.js";

export default async function server(
  sitesPath: string,
  ...middlewares: RequestHandler[]
) {
  await rxdb.boot();
  const sites = resolve(sitesPath);
  const router = express.Router();

  router.use(inject(sites));

  router.use("/assets", (req, res, next) => {
    return (req as CustomRequest).site.asset(req, res, next);
  });

  router.use((req, res, next) => {
    return (req as CustomRequest).site.public(req, res, next);
  });

  router.get("*", ...middlewares, route(sites) as RequestHandler);

  return router;
}
