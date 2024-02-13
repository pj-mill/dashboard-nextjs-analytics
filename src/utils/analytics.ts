import { redis } from "@/lib/redis";

type AnalyticsArgs = {
    retention?: number;
};

type TrackOptions = {
    persist?: boolean;
};

export class Analytics {
    // The maximum duration in seconds to cache the page for (Time To Live: 1 week)
    private retention: number = 60 * 60 * 24 * 7;

    constructor(args?: AnalyticsArgs) {
        if (args?.retention) {
            this.retention = args.retention;
        }
    }

    async track(namespace: string, event: object = {}, options?: TrackOptions) {
        console.log("track", namespace, event, options);

        const key = `analytics:${namespace}`;
        await redis.hincrby(key, JSON.stringify(event), 1);
    }
}

export const analytics = new Analytics();
