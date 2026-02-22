
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.uIContent.count()
    console.log(`Number of records in UIContent: ${count}`)
    if (count > 0) {
        const content = await prisma.uIContent.findMany()
        console.log('Content keys:', content.map(c => c.key))
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
