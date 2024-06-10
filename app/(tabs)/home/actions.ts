"use server";

import db from "@/lib/db";

export default async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 1, // pageSize
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}
