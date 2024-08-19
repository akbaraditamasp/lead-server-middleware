import { createRxDatabase, RxCollection, RxDatabase, RxJsonSchema } from "rxdb";
import {
  getRxStorageMemory,
  MemoryStorageInternals,
  RxStorageMemoryInstanceCreationOptions,
} from "rxdb/plugins/storage-memory";
import SiteSchema from "../types/SiteSchema.js";

const sites = {
  title: "Site Ready",
  version: 0,
  description: "List of edge",
  primaryKey: "site",
  type: "object",
  properties: {
    site: {
      type: "string",
      maxLength: 100,
    },
    edge: {},
    public: {},
    asset: {},
  },
  required: ["id", "edge", "public", "asset"],
} as RxJsonSchema<SiteSchema>;

const rxdb = () => {
  let db: RxDatabase<
    {
      sites: RxCollection;
    },
    MemoryStorageInternals<any>,
    RxStorageMemoryInstanceCreationOptions,
    unknown
  >;

  const boot = async () => {
    db = await createRxDatabase({
      name: "website",
      storage: getRxStorageMemory(),
    });

    await db.addCollections({
      sites: {
        schema: sites,
      },
    });
  };

  return {
    boot,
    db: () => db!,
  };
};

export default rxdb();
