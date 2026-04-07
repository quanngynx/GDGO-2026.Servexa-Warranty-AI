import { AppBootStrap } from "@/core/infra/bootstrap";

const PORT = 3000;
const app = new AppBootStrap();

app.listen(PORT);
