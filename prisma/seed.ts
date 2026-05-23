import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@duolingo.local' },
    update: {},
    create: {
      name: 'Usuário Demo',
      email: 'demo@duolingo.local',
      password: passwordHash,
      role: Role.USER,
    },
  });

  const course = await prisma.course.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Inglês Básico',
      description: 'Curso inicial com foco em vocabulário e frases simples.',
    },
  });

  const track = await prisma.track.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      courseId: course.id,
      title: 'Fundamentos',
    },
  });

  const module = await prisma.module.upsert({
    where: { id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333333',
      trackId: track.id,
      title: 'Saudações',
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: '44444444-4444-4444-4444-444444444441' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-444444444441',
      moduleId: module.id,
      title: 'Hello e Goodbye',
      content: 'Introdução às primeiras palavras em inglês.',
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: '44444444-4444-4444-4444-444444444442' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-444444444442',
      moduleId: module.id,
      title: 'Como vai você?',
      content: 'Prática de cumprimentos e respostas simples.',
      order: 2,
    },
  });

  await prisma.courseProgress.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: {
      userId: user.id,
      courseId: course.id,
      currentTrackId: track.id,
    },
  });

  await prisma.userTrack.upsert({
    where: { userId_trackId: { userId: user.id, trackId: track.id } },
    update: {},
    create: {
      userId: user.id,
      trackId: track.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed concluído com sucesso.');
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
