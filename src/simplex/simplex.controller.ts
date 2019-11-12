import { Body, Controller, Post } from '@nestjs/common';
import { SimplexDataApi } from './simplex.class';
import Simplex2Phases from './simplexthophases.class';



@Controller('simplex')
export class SimplexController {

  @Post()
  simplexMethod(@Body() data: SimplexDataApi) {
      const simplex = new Simplex2Phases(data);

      return simplex.result();
  }
}
