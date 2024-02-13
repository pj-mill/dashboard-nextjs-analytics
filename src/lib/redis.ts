import { Redis } from "@upstash/redis";

export const redis = new Redis({
    url: "https://eu1-honest-dassie-38819.upstash.io",
    token: process.env.REDIS_TOKEN!,
});
