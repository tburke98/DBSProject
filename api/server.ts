import express from 'express'
import cors from 'cors'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(cors({origin: process.env.CLIENT_URL}))

const port = process.env.PORT || 5050

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get('/expenses', async (req, res) => {
  const data = await prisma.monthlyExpense.findMany({
    include: {
      rent: true
    }
  })
  return res.json(data)
})
