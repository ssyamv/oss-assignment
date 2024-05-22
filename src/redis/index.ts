import Ioredis from "ioredis";

const redis = new Ioredis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});

export default redis;
