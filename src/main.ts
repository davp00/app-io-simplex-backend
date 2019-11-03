import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SimplexMethod, { SimplexRestriction } from './simplex/simplex.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const cj: number[] = [ 4, 1 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [3, 1], symbol: '>=', equal: 3 },
  { x_n: [4, 3], symbol: '>=', equal: 6 },
  { x_n: [1, 2], symbol: '<=', equal: 4 },
];

const FO = 'max';

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
