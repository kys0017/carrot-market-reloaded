"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username?",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "no potatoes allowed")
      .refine(checkUniqueUsername, "This username is already taken"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account alreadh registered with that email.",
      ),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    confirm_password: z.string().min(4),
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  /**
   * 유효성 검사 실패 시
   * parse -> throw error. So, try catch 로 잡아야 함.
   * safeParse -> not throw error. return validation result.
   */
  try {
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
      // flatten() - error 객체에서 필요한 것만 표시해 줌.
      return result.error.flatten();
    } else {
      // hash password
      // save the user to db
      // log the user in
      // redirect '/home'
    }
  } catch (error) {
    return {
      formErrors: ["Error occured"],
    } as z.typeToFlattenedError<
      {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
      },
      string
    >;
  }
}
