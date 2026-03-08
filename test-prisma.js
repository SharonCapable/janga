const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect via Prisma Client...');
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('Query successful:', result);
    } catch (e) {
        console.error('Prisma Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
