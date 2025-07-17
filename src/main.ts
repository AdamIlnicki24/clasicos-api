import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  // app.enableCors({
  //   allowedHeaders: "*",
  //   origin: "*",
  //   credentials: true,
  // });

  // app.enableCors({
  //   origin: ["https://clasicos-web.vercel.app"], // "*""
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization", "x-api-version"],
  //   credentials: true,
  // });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
