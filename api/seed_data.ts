import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const rent = await prisma.rentCost.create({
    data: {
      year: 2024,
      cost: 2100.9
    }
  })
  console.log(rent)
  const expense = await prisma.monthlyExpense.create({
    data: {
      year: 2024,
      month: 3,
      electricity: 82.34,
      water: 15.34,
      heat: 121.87
    }
  })
  console.log(expense)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
