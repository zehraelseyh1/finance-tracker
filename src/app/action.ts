"use server"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const { userId } = auth();
  const text = formData.get("text") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("categoryId") as string | null;

  if (!userId) throw new Error("Giriş yapmalısın!");

  const transaction = await db.transaction.create({
    data: {
      text,
      amount: parseFloat(amount),
      userId,
      category: category || "Diğer",
    },
  });

  revalidatePath("/"); // Sayfayı yenilemeden veriyi güncelle
}