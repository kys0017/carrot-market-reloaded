"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/,
);

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username?",
      })
      .min(3, "Way too short!!!")
      .max(10, "That is too loooooong!")
      .toLowerCase()
      .trim()
      .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "no potatoes allowed"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "Password must have lowercase, UPPERCASE, a number and special characters ",
      ),
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
  const result = formSchema.safeParse(data);
  if (!result.success) {
    // flatten() - error 객체에서 필요한 것만 표시해 줌.
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
