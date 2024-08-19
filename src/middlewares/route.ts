import { Request, Response } from "express";
import { join } from "path";
import CustomRequest from "../types/CustomRequest.js";
import { default as parse } from "../utils/template.js";

export default function route(sitesPath: string) {
  return async (req: Request, res: Response) => {
    const mainDir = join(sitesPath, (req as CustomRequest).site.site, "src");
    const requested = (
      (req as CustomRequest).params as {
        "0": string;
      }
    )["0"].replace(/^\//, "");

    const template = parse(requested, mainDir);

    let html: string = "";

    if (template) {
      try {
        html = await (req as CustomRequest).site.edge().render(template.path, {
          params: template.params,
          req,
        });
      } catch (err) {
        console.log(err);
        const statusCode = isNaN(Number((err as Error).message))
          ? 500
          : Number((err as Error).message);
        const errorPage = parse(`${statusCode}` || "500", mainDir);

        if (errorPage) {
          html = await (req as CustomRequest).site
            .edge()
            .render(errorPage.path, {
              params: errorPage.params,
              req,
            });
        }

        res.status(statusCode);
      }
    } else {
      res.status(404);
    }

    return res.type("html").send(html);
  };
}
