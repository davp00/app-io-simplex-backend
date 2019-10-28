import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SimplexMethod, { SimplexRestriction } from './simplex/simplex.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const cj: number[] = [8, 10 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [2, 3], symbol: '<=', equal: 600 },
  { x_n: [2, 1], symbol: '<=', equal: 500 },
  { x_n: [0, 4], symbol: '<=', equal: 600 },
];

const FO = 'max';

const simplex = new SimplexMethod(cj, restrictions, FO);

simplex.result();

//bootstrap();
