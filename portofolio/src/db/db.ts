import { PrismaClient } from "@prisma/client";


/** @type {import('@prisma/client').PrismaClient} */
const prismaClientSingleton = () => {
    return new PrismaClient({
      log:["query"]
    }).$extends({ 
      result: {
        
      },});
  }
  
  declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  } & typeof global;
  
  const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
  
  export default prisma
  
  if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

  