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
      category: category || "Yemek",
    },
  });

  revalidatePath("/"); // Sayfayı yenilemeden veriyi güncelle
}

export async function deleteTransaction(transactionId: string) {
  const { userId } = auth();

  if (!userId) throw new Error("Giriş yapmalısın!");

  const result = await db.transaction.deleteMany({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("Silinecek harcama bulunamadı.");
  }

  revalidatePath("/");
}