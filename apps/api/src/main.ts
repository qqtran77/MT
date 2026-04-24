import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (dev)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Chuỗi Kinh Doanh API')
    .setDescription('Vietnamese Multi-Industry Business Chain Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication')
    .addTag('branches', 'Branch Management')
    .addTag('staff', 'Staff Management')
    .addTag('attendance', 'Attendance Tracking')
    .addTag('inventory', 'Inventory Management')
    .addTag('invoices', 'Invoice & Payment')
    .addTag('bookings', 'Booking Management')
    .addTag('revenue', 'Revenue & Reports')
    .addTag('customers', 'Customer Management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
