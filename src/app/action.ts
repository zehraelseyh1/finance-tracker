"use server"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const { userId } = auth();
  const text = formData.get("text") as string;
  const amount = formData.get("amount") as string;

  if (!userId) throw new Error("Giriş yapmalısın!");

  await db.transaction.create({
    data: {
      text,
      amount: parseFloat(amount),
      userId,
    },
  });

  revalidatePath("/"); // Sayfayı yenilemeden veriyi güncelle
}