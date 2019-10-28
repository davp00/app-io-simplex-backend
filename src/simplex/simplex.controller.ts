import { Controller, Get } from '@nestjs/common';
import SimplexMethod, { SimplexRestriction } from './simplex.class';

@Controller('simplex')
export class SimplexController {
  @Get()
  simplexMethod() {
      return 'Hola desde el simplex';
  }
}
