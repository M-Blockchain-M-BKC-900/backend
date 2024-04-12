import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const host = process.env.BACK_HOST;

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(
      `\x1B[32m[Nest]\x1B[0m\t\tServer is running at\t\x1B[32mhttp://${host}:\x1B[1;33m${port}\x1B[0m`,
    );
  });
}
bootstrap();
