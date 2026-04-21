import { PrismaClient } from "@prisma/client";
import { fakerTR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Veritabanı besleme işlemi başlıyor...");

  // Önce mevcut verileri temizlemek isteyebilirsin (opsiyonel)
  // await prisma.transaction.deleteMany();

  const transactions = [];

  for (let i = 0; i < 50; i++) {
    transactions.push({
      text: faker.commerce.productName(),
      amount: faker.number.int({ min: -5000, max: 2000 }),
      category: faker.helpers.arrayElement(["Market", "Eğlence", "Maaş", "Ulaşım", "Fatura"]),
      userId: "user_3BP8S8bfq6cfs5ZoNcbVvv4ADOJ", // Hangi kullanıcıya eklenecekse
    });
  }

  // TEK SEFERDE TOPLU EKLEME (Burası kritik!)
  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log("50 adet örnek harcama başarıyla eklendi! 🎉");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());