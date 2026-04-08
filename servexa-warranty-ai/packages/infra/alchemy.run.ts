import alchemy from "alchemy";
import { Vite } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("servexa-warranty-ai");

export const web = await Vite("web", {
  name: `${app.name}-${app.stage}-web`,
  cwd: "../../apps/web",
  assets: "dist",
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
