import { MiddlewareConfig, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("hello");
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
