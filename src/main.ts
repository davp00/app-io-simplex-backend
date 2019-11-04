import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SimplexMethod, { SimplexRestriction } from './simplex/simplex.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

/*const cj: number[] = [ 2,3 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [1/2, 1/4 ], symbol: '<=', equal: 4 },
  { x_n: [1, 3], symbol: '>=', equal: 36 },
  { x_n: [1, 2], symbol: '=', equal: 10 },
];

const FO = 'max';*/

/*const cj: number[] = [ 5,6 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [-2, 3 ], symbol: '=', equal: 3 },
  { x_n: [1, 2], symbol: '<=', equal: 5 },
  { x_n: [6, 7], symbol: '<=', equal: 3 },
];

const FO = 'max';

const cj: number[] = [ 2, 3, -5 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [1, 1, 1], symbol: '=', equal: 7 },
  { x_n: [2, -5, 1], symbol: '>=', equal: 10 },
];

const FO = 'max';

const simplex = new SimplexMethod(cj, restrictions, FO);

simplex.result();*/

bootstrap();
