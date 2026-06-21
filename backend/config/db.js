// import 'dotenv/config'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { PrismaClient } from '@prisma/client'

// const connectionString = process.env.DATABASE_URL

// const adapter = new PrismaNeon({connectionString})
// const prisma = new PrismaClient({adapter})

// export default prisma

// Local PostgreDB for testing
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.LOCALDB_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;