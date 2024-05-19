import { MiddlewareConfig, NextRequest } from "next/server";
import db from "./lib/db";

export async function middleware(req: NextRequest) {
  /* middleware edge runtime(nodejs 의 경량 버전) 에서 돌아감.
    사용할 수 있는 npm package 가 적음. = 모든 nodejs API 를 사용할 수 없다.
    prisma 도 그 중에 하나.
  */
  // await db.user.findUnique({});
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
