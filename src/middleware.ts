import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = await getSession(request);

    // All routes in Studio are protected
    if (!session) {
        const loginUrl = new URL("https://account.forboc.ai");
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg$).*)",
    ],
};
