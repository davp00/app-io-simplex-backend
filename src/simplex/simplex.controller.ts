import { Body, Controller, Post } from '@nestjs/common';
import SimplexMethod, { SimplexDataApi } from './simplex.class';



@Controller('simplex')
export class SimplexController {

  @Post()
  simplexMethod(@Body() data: SimplexDataApi) {
      const simplex = new SimplexMethod(data);

      return simplex.result();
  }
}
