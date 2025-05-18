import validate from "./utils/validate.js";
import type { Context } from "@netlify/edge-functions";
import { getStore } from "@netlify/blobs"
import { SECTIONS, STORE } from "./utils/constants.js";

export default async (req: Request, context: Context) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!validate(token)) {
    return new Response(
      JSON.stringify({ message: "Unauthorized", error: "Invalid token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const invalidResponse = new Response(
    JSON.stringify({ message: "Invalid request" }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );

  const store = getStore(STORE)
  let data: any;
  try {
    data = await req.json();
  } catch (error) {
    return invalidResponse;
  }


  const url = new URL(req.url);
  const section = url.searchParams.get("section");

  if (section != null && SECTIONS.includes(section)) {
    await store.setJSON(section, data);
  } else {
    return invalidResponse;
  }

  return new Response(null, { status: 204 });
};
