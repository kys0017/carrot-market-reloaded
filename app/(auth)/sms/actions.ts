"use server";

import twilio from "twilio";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { saveUserSession } from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format",
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

// 입력받은 값을 number 로 변환. refind check 함수 인자는 number type 이 된다.
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    // false 이면 action 을 처음 호출했다는 것. = phone 만 입력했다는 것.
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        errors: result.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });

      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            // 해당 유저가 계정을 가지고 있는지 모르기 때문에, 없으면 생성한다.
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"), // random username
                phone: result.data,
              },
            },
          },
        },
      });
      // send token using twilio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        body: `Your Karrot verification code is ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        // to: result.data // 입력받은 phone number 를 넣어주는 게 맞지만,
        // twilio trial 을 사용하고 있으므로 체험판 계정 인증 시 사용한 번호를 넣어줌.
        to: process.env.MY_PHONE_NUMBER!,
      });
      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.spa(token);
    if (!result.success) {
      return {
        token: true,
        errors: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      // token 유효성 체크를 마쳤으므로 typescript 강제.
      await saveUserSession({ id: token!.userId });
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      redirect("/profile");
    }
  }
}
