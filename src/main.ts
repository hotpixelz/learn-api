import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      allowedHeaders:
        'Content-Type, Access-Control-Allow-Headers, Authorization',
      optionsSuccessStatus: 200,
    },
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
