"use server";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirm_password: z.string().min(10),
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
  }
}
