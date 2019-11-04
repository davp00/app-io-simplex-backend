import { Controller, Post } from '@nestjs/common';
import SimplexMethod, { SimplexRestriction } from './simplex.class';

interface SimplexData {

}

@Controller('simplex')
export class SimplexController {

  @Post()
  simplexMethod() {
      return 'Hola desde el simplex';
  }
}
