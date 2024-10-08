import { PrismaClient } from '@prisma/client'

import { config } from '@/lib/utils/config'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (config.nodeEnv !== 'production') globalThis.prismaGlobal = prisma