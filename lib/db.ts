"use client";

import { PrismaClient } from "@/prisma/src/app/generated/client";
//import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export const db = prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//     var cachedPrisma: PrismaClient;
// }

// let prisma: PrismaClient;
// if (process.env.NODE_ENV === "production") {
//     prisma = new PrismaClient();
// } else {
//     if (!global.cachedPrisma) {
//         global.cachedPrisma = new PrismaClient();
//     }

//     prisma = global.cachedPrisma;
// }

// export const db = prisma;
