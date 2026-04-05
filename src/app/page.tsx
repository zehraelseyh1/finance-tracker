import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { addTransaction } from "./action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


const CATEGORIES = ["Yemek", "Ulaşım", "Fatura", "Eğlence", "Sağlık", "Diğer"];

const CAT_COLORS: Record<string, string> = {
  Yemek: "bg-orange-100 text-orange-700",
  Ulaşım: "bg-blue-100 text-blue-700",
  Fatura: "bg-yellow-100 text-yellow-700",
  Eğlence: "bg-purple-100 text-purple-700",
  Sağlık: "bg-green-100 text-green-700",
  Diğer: "bg-slate-100 text-slate-600",
};

export default async function Home() {
  const { userId } = auth();
  
  // Kullanıcının harcamalarını veritabanından çek
  const transactions = userId 
    ? await db.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }) 
    : [];

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col p-6">
      <div className="mb-6 flex shrink-0 justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Finance Tracker</h1>
        <UserButton />
      </div>

      <SignedIn>
        <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-row">
          {/* Sol: form, sayfa ile kaymaz */}
          <div className="shrink-0 md:w-[min(100%,22rem)] md:overflow-hidden">
            <form
              action={addTransaction}
              className="rounded border bg-white px-8 pt-6 pb-8 shadow-md"
            >
              <div className="mb-4">
                <input
                  name="text"
                  placeholder="Harcama adı (örn: Kahve)"
                  className="w-full rounded border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Miktar (örn: 50.50)"
                  className="w-full rounded border p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <select name="categoryId" className="w-full rounded border p-2">
                  <option value="">Kategori seç</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-700"
              >
                Harcama Ekle
              </button>
            </form>
          </div>

          {/* Sağ: geçmiş harcamalar, alan içinde kayar */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col md:overflow-hidden">
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              <h2 className="sticky top-0 z-10 bg-white pb-2 font-semibold text-slate-600">
                Geçmiş Harcamalar
              </h2>

              {transactions.map((t) => {
                const colorClass =
                  CAT_COLORS[t.category as keyof typeof CAT_COLORS] || CAT_COLORS["Diğer"];

                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded border bg-white p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{t.text}</p>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}
                      >
                        {t.category || "Ulaşım"}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${t.amount < 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {t.amount > 0 ? `+${t.amount}` : t.amount} TL
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-center py-20 bg-slate-100 rounded-lg">
          <p className="mb-4 text-slate-600 font-medium">Devam etmek için giriş yapmalısın.</p>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">Giriş Yap/ Kayıt ol</button>
          </SignInButton>
        </div>
      </SignedOut>
    </main>
  );
}