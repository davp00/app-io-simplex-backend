import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SimplexMethod, { SimplexRestriction } from './simplex/simplex.class';
import Simplex2Phases from './simplex/simplexthophases.class';

const port = process.env.PORT ||  3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
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
*/
/*const cj: number[] = [ 2, 3, -5 ];

const restrictions: SimplexRestriction[] = [
  { x_n: [1, 1, 1], symbol: '=', equal: 7 },
  { x_n: [2, -5, 1], symbol: '>=', equal: 10 },
];

const FO = 'max';*/

/*const cj: number[] = [1.5, 2];

const restrictions: SimplexRestriction[] = [
  { x_n: [2,2], symbol: '<=', equal: 8 },
  { x_n: [2,6], symbol: '>=', equal: 12 },
];

const FO = 'min';*/

/*const cj: number[] = [0.1, 0.04, 0.06];

const restrictions: SimplexRestriction[] = [
  { x_n: [-1, 1, -1], symbol: '<=', equal: 0 },
  { x_n: [1, 1, 0], symbol: '<=', equal: 1.6 },
  { x_n: [-0.9, 0.1 , 0.1], symbol: '<=', equal: 0 },
  { x_n: [0.1, -0.9 , 0.1], symbol: '<=', equal: 0 },
  { x_n: [0.1, 0.1 , -0.9], symbol: '<=', equal: 0 },
  { x_n: [-1, -1 , -1], symbol: '<=', equal: -2 },
];

const FO = 'min';*/

/*const cj: number[] = [2, 3];

const restrictions: SimplexRestriction[] = [
  { x_n: [0.5,0.25], symbol: '<=', equal: 4 },
  { x_n: [1,3], symbol: '>=', equal: 20 },
  { x_n: [1,1], symbol: '=', equal: 10 },
];

const FO = 'min';*/

/*const cj: number[] = [60, 35, 20];

const restrictions: SimplexRestriction[] = [
  { x_n: [8, 6, 1], symbol: '<=', equal: 48 },
  { x_n: [4, 2, 1.5], symbol: '<=', equal: 20 },
  { x_n: [2, 1.5, 0.5], symbol: '<=', equal: 8 },
  { x_n: [0, 1, 0], symbol: '<=', equal: 5 },
];

const FO = 'max';*/

/*const cj: number[] = [36, 30, -3, -4];

const restrictions: SimplexRestriction[] = [
  { x_n: [1, 1, -1, 0], symbol: '<=', equal: 5 },
  { x_n: [6,5, 0, -1], symbol: '<=', equal: 10 },
];

const FO = 'max';



let simplex: Simplex2Phases = new Simplex2Phases({cj, restrictions, FO});

simplex.result();*/
bootstrap();
