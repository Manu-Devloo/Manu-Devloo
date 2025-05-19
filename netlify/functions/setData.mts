import validate from "./utils/validate.js";
import type { Context } from "@netlify/edge-functions";
import { getStore } from "@netlify/blobs";
import { SECTIONS, STORE } from "./utils/constants.js";
import axios from "axios";

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

  const store = getStore(STORE);
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
    
    // Trigger GitHub Actions workflow via repository_dispatch
    try {
      const githubToken = Netlify.env.get("GITHUB_TOKEN");
      if (githubToken) {
        await axios.post(
          "https://api.github.com/repos/Manu-Devloo/Manu-Devloo/dispatches",
          {
            event_type: "generate-readme",
            client_payload: { section, updated: true }
          },
          {
            headers: {
              "Accept": "application/vnd.github+json",
              "Authorization": `Bearer ${githubToken}`,
              "Content-Type": "application/json"
            }
          }
        );
      }
    } catch (err) {
      // Optionally log error, but do not block response
      console.error("Failed to trigger GitHub Actions workflow", err);
    }
  } else {
    return invalidResponse;
  }

  return new Response(null, { status: 204 });
};
