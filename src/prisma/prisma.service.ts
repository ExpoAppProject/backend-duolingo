import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry() {
    const maxAttempts = 10;
    const delayMs = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.$connect();
        this.logger.log('Prisma connected');
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          this.logger.error('Prisma failed to connect', error as Error);
          throw error;
        }
        this.logger.warn(
          `Prisma connect failed (attempt ${attempt}/${maxAttempts}); retrying in ${
            delayMs / 1000
          }s`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}
