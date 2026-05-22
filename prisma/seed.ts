import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed minimo (nao cria dados obrigatoriamente).
  // Mantemos o arquivo para permitir evolucao futura (cursos, tracks, etc.).
  await prisma.$connect();

  // Exemplo (descomentear quando quiser seed real):
  // await prisma.course.create({ data: { title: 'Curso 1', description: 'Introducao' } });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
