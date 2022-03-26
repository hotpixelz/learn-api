import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const config = new DocumentBuilder()
    .setTitle('My Cv Api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('mycv')
    .addCookieAuth(
      'accessToken',
      {
        type: 'http',
        in: 'header',
        scheme: 'Bearer',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
