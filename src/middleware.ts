import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function middleware(req: NextRequest) {
    // navigating to the home page
    if (req.nextUrl.pathname === "/") {
        // Track analytic events
        console.log("middleware");

        try {
            analytics.track("pageview", {
                page: "/",
                country: req.geo?.country,
            });
        } catch (e) {
            // Fail silently
            console.error(e);
        }
    }

    return NextResponse.next();
}

// Only runs on the home page
export const matcher = {
    matcher: ["/"],
};
