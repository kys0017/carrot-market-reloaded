import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  // 아래 두 줄과 동일.
  // const accessToKenResponse = await (await fetch(accessTokenURL)).json();
  const accessToKenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const accessTokenData = await accessToKenResponse.json();

  if ("error" in accessTokenData) {
    return new Response(null, {
      status: 400,
    });
  }

  return Response.json({ accessTokenData });
}
