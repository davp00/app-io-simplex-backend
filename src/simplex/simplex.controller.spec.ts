import { Test, TestingModule } from '@nestjs/testing';
import { SimplexController } from './simplex.controller';

describe('Simplex Controller', () => {
  let controller: SimplexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimplexController],
    }).compile();

    controller = module.get<SimplexController>(SimplexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
