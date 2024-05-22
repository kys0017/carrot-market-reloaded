import db from "@/lib/db";
import { saveUserSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getGitHubAccessToken, getGitHubUserProfile } from "../api";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getGitHubAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await getGitHubUserProfile(access_token);

  console.log({ id, avatar_url, login });

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (user) {
    await saveUserSession(user!);
    return redirect("/profile");
  }

  // username 은 unique. 동일 username 존재할 때 처리.
  const usernameExists = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  const newUser = await db.user.create({
    data: {
      username: usernameExists ? `${login}-${id}` : login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  await saveUserSession(newUser);
  return redirect("/profile");
}
