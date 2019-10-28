import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimplexController } from './simplex/simplex.controller';

@Module({
  imports: [],
  controllers: [AppController, SimplexController],
  providers: [AppService],
})
export class AppModule {}
