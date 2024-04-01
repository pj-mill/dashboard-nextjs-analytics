import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function middleware(req: NextRequest) {
    // If navigating to the home page
    if (req.nextUrl.pathname === "/") {
        // Track analytic events
        try {
            await analytics.track(
                "pageview",
                {
                    page: "/",
                    country: req.geo?.country,
                },
                {}
            );
        } catch (err) {
            //Fail silently
            console.error(err);
        }
    }

    return NextResponse.next();
}

export const matcher = {
    matcher: ["/"],
};
