import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import authContract from "../data/contracts/auth.json";

export async function proxy(request: NextRequest) {
    const session = await getSession(request);

    return session
        ? NextResponse.next()
        : NextResponse.redirect(new URL(authContract.routes.account));
}

export const config = {
    // Next statically parses this mirror; the data guard binds it to auth.json.
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg$).*)",
    ],
};
