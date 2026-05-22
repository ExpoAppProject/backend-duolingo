const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // If there is already a course, return its ids
  const existing = await prisma.course.findFirst();
  if (existing) {
    const track = await prisma.track.findFirst({ where: { courseId: existing.id } });
    const lesson = await prisma.lesson.findFirst({ where: { moduleId: (await prisma.module.findFirst({ where: { trackId: track ? track.id : undefined } }))?.id } });
    console.log(JSON.stringify({ courseId: existing.id, trackId: track?.id, lessonId: lesson?.id }));
    return;
  }

  const course = await prisma.course.create({
    data: {
      title: 'Seeded Sample Course',
      description: 'Course created by seed script',
      tracks: {
        create: [
          {
            title: 'Track 1',
            modules: {
              create: [
                {
                  title: 'Module 1',
                  lessons: {
                    create: [
                      { title: 'Lesson 1', content: 'Content 1', order: 1 },
                      { title: 'Lesson 2', content: 'Content 2', order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: { tracks: { include: { modules: { include: { lessons: true } } } } },
  });

  const track = course.tracks[0];
  const lesson = track.modules[0].lessons[0];

  console.log(JSON.stringify({ courseId: course.id, trackId: track.id, lessonId: lesson.id }));
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
