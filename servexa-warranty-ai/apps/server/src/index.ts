import { AppBootStrap } from "@/core/infra/bootstrap";
import { env } from "@servexa-warranty-ai/env/server";

const app = new AppBootStrap();
await app.bootstrap();

app.listen(env.PORT);
