import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

// Troubleshooting

// TODO: Think about Prettier rules
// TODO: Add roles in controllers

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // TODO: Think about adding specific object below
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
