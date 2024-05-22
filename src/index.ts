import Koa from "koa";
import routerLoader from "./routes";
import dotenv from "dotenv";
import koaBody from "koa-body";

dotenv.config();

const app = new Koa();

app.use(koaBody());
routerLoader(app);

app.listen(process.env.PORT);

export default app;
