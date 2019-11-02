import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SimplexMethod, { SimplexRestriction } from './simplex/simplex.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const cj: number[] = [-5, -4 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [2, 2], symbol: '<=', equal: 14 },
  { x_n: [6, 3], symbol: '<=', equal: 36 },
  { x_n: [5, 10], symbol: '<=', equal: 60 },
];

const FO = 'min';

const simplex = new SimplexMethod(cj, restrictions, FO);

simplex.result();
/*
* const cj: number[] = [5, 4,3 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [2, 3, 1], symbol: '<=', equal: 5 },
  { x_n: [4, 1, 2], symbol: '<=', equal: 11 },
  { x_n: [3, 4, 2], symbol: '<=', equal: 8 },
];

const FO = 'max';*/
//bootstrap();
