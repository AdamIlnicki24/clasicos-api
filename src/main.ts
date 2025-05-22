import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// TODO: Think about Prettier rules

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // TODO: Think about adding specific object below
  app.enableCors();
}
bootstrap();
