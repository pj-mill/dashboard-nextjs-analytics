import { redisClient } from "@/lib/redis";
import { getDate } from "@/utils";
import { parse } from "date-fns";

const NAMESPACE_PREFIX = "analytics::";
const DATE_FORMAT = "dd/MM/yyyy";

type AnalyticsArgs = {
    retention?: number;
};

type TrackOptions = {
    persist?: boolean;
};

export class Analytics {
    private retention: number = 60 * 60 * 24 * 7;

    constructor(opts?: AnalyticsArgs) {
        if (opts?.retention) this.retention = opts.retention;
    }

    async track(namespace: string, event: object = {}, opts?: TrackOptions) {
        let key = `${NAMESPACE_PREFIX}${namespace}`;

        if (!opts?.persist) {
            key += `::${getDate()}`;
        }

        // db call to persist this event
        await redisClient.hincrby(key, JSON.stringify(event), 1);
        if (!opts?.persist) await redisClient.expire(key, this.retention);
    }

    async retrieve(namespace: string, date: string) {
        const res = await redisClient.hgetall<Record<string, string>>(`${NAMESPACE_PREFIX}${namespace}::${date}`);

        return {
            date,
            events: Object.entries(res ?? []).map(([key, value]) => ({
                [key]: Number(value),
            })),
        };
    }

    async retrieveDays(namespace: string, nDays: number) {
        type AnalyticsPromise = ReturnType<typeof analytics.retrieve>;
        const promises: AnalyticsPromise[] = [];

        for (let i = 0; i < nDays; i++) {
            const formattedDate = getDate(i);
            const promise = analytics.retrieve(namespace, formattedDate);
            promises.push(promise);
        }

        const fetched = await Promise.all(promises);

        const data = fetched.sort((a, b) => {
            if (parse(a.date, DATE_FORMAT, new Date()) > parse(b.date, DATE_FORMAT, new Date())) {
                return 1;
            } else {
                return -1;
            }
        });

        return data;
    }
}

export const analytics = new Analytics();
