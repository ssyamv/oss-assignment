import Application from "koa";
import log4js from "koa-log4";

log4js.configure({
  appenders: {
    console: { type: "console" },
    dateFile: {
      type: "dateFile",
      filename: "logs/app",
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["console", "dateFile"], level: "info" },
  },
});

export const logger = log4js.getLogger("app");

export function initLogger(app: Application) {
  app.use(log4js.koaLogger(log4js.getLogger("http"), { level: "auto" }));
}
