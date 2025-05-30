import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express"; // Fixed import syntax

export async function createApp() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  return { app, server };
}

// Local development bootstrap
if (process.env.NODE_ENV !== "production") {
  (async () => {
    const { app } = await createApp();
    await app.listen(process.env.PORT || 3001);
    console.log(`Local server running on ${await app.getUrl()}`);
  })();
}
