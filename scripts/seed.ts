const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Engineering" },
                { name: "Filming" },
                { name: "Accounting" },
                { name: "Graphic Design" },
            ],
        });
        console.log("Success");
    } catch (error) {
        console.log("error in seeding the category", error);
    } finally {
        await database.$disconnect();
    }
}

main();