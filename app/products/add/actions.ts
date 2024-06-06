"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z
    .string({
      required_error: "Photo is required",
      invalid_type_error: "Photo must be image format",
    })
    .min(1, "Photo is required"),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Decription is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
});

export default async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  if (data.photo instanceof File) {
    if (!data.photo.size) {
      data.photo = "";
    } else if (!data.photo.type.startsWith("image/")) {
      data.photo = null;
    } else {
      const photoData = await data.photo.arrayBuffer();

      await fs.appendFile(
        `./public/${data.photo.name}`,
        Buffer.from(photoData),
      );
      data.photo = `/${data.photo.name}`;
    }
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/products/${product.id}`);
      // redirect("/products");
    }
  }
}
