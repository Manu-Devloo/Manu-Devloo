import type { Context, Config } from "@netlify/edge-functions";
import { getStore, Store } from "@netlify/blobs";
import { STORE, SECTIONS } from "./utils/constants";

export default async (req: Request, context: Context) => {
  const store = getStore(STORE);

  const url = new URL(req.url);
  const section = url.searchParams.get("section");

  if (section != null && SECTIONS.includes(section)) {
    return new Response(await store.get(section), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const data: Record<string, JSON> = {};

    for (const e of SECTIONS) {
      data[e] = JSON.parse(await store.get(e));
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}
};