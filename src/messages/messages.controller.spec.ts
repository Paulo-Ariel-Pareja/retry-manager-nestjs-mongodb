import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn().mockResolvedValue(true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('create method', async () => {
      const body: CreateMessageDto = {
        to: 'some url',
        method: 'get',
        headers: {},
        frequency: 10,
        data: {},
        created_at: '',
        updated_at: '',
      };
      const result = await controller.create(body);
      expect(result).toBe(true);
    });
  });
});
