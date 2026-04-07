import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Dışarıdan gelen JSON paketini oku
    const body = await request.json();
    const { text, amount, userId, category } = body;

    // 2. Zorunlu alan kontrolü (Hangi kullanıcıya yazılacağı şart!)
    if (!userId || !amount || !text) {
      return NextResponse.json({ error: "Eksik bilgi: userId, amount ve text zorunlu!" }, { status: 400 });
    }

    // 3. Prisma ile Veritabanına Yaz
    const transaction = await db.transaction.create({
      data: {
        text,
        amount: parseFloat(amount.toString()),
        userId: userId, // İşte burada hangi hesabın ID'sini verirsen ona yazar!
        category: category || "Diğer",
      },
    });

    return NextResponse.json({ 
      message: "İşlem Başarılı!", 
      data: transaction 
    }, { status: 201 });

  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
