const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.count();
        const projects = await prisma.videoProject.count();
        console.log(`Database verified!`);
        console.log(`Users: ${users}, Projects: ${projects}`);
        process.exit(0);
    } catch (e) {
        console.error('Final verification failed:', e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
