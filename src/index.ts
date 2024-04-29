import Koa from "koa";
import routerLoader from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = new Koa();

routerLoader(app);

app.listen(process.env.PORT);

export default app;
