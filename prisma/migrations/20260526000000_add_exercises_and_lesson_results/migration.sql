CREATE TABLE `Exercise` (
    `id` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'multiple_choice',
    `question` TEXT NOT NULL,
    `options` JSON NOT NULL,
    `correctAnswerIndex` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `Exercise_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `LessonProgress`
    ADD COLUMN `correctAnswers` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalAnswers` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `xpEarned` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `accuracyRate` DOUBLE NOT NULL DEFAULT 0;

ALTER TABLE `Exercise`
    ADD CONSTRAINT `Exercise_lessonId_fkey`
    FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
