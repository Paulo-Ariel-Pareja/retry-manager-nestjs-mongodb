import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessagesService', () => {
  let service: MessagesService;
  let httpService;

  const dbMock = {
    docs: [
      {
        _id: '6442073fdfd398f369484daf',
        to: 'https://pokeapiii.co/api/v2/pokemon/1',
        method: 'get',
        headers: {},
        frequency: 3,
        count: 37,
        data: {},
        created_at: '2023-04-21T03:47:11.000Z',
        updated_at: '2023-04-21T04:27:00.000Z',
        toObject: () => true,
      },
      {
        _id: '64420751dfd398f369484db1',
        to: 'https://pokeapiii.co/api/v2/pokemon/2',
        method: 'post',
        headers: {},
        frequency: 6,
        count: 29,
        data: {},
        created_at: '2023-04-21T03:47:29.000Z',
        updated_at: '2023-04-21T04:30:00.000Z',
        toObject: () => true,
      },
      {
        _id: '64420754dfd398f369484db3',
        to: 'https://pokeapiii.co/api/v2/pokemon/3',
        method: 'patch',
        headers: {},
        frequency: 9,
        count: 27,
        data: {},
        created_at: '2023-04-21T03:47:32.000Z',
        updated_at: '2023-04-21T04:33:00.000Z',
        toObject: () => true,
      },
      {
        _id: '6442a62468a9d77392ae9363',
        to: 'https://pokeapiii.co/api/v2/pokemon/4',
        method: 'put',
        headers: {},
        frequency: 9,
        count: 27,
        data: {},
        created_at: '2023-04-21T03:47:32.000Z',
        updated_at: '2023-04-21T04:33:00.000Z',
        toObject: () => true,
      },
      {
        _id: '6442a62a68a9d77392ae9364',
        to: 'https://pokeapiii.co/api/v2/pokemon/5',
        method: 'delete',
        headers: {},
        frequency: 9,
        count: 27,
        data: {},
        created_at: '2023-04-21T03:47:32.000Z',
        updated_at: '2023-04-21T04:33:00.000Z',
        toObject: () => true,
      },
      {
        _id: '6442a62a68a9d77392ae9364',
        to: 'https://pokeapiii.co/api/v2/pokemon/6',
        method: 'fail',
        headers: {},
        frequency: 9,
        count: 27,
        data: {},
        created_at: '2023-04-21T03:47:32.000Z',
        updated_at: '2023-04-21T04:33:00.000Z',
        toObject: () => true,
      },
    ],
    totalDocs: 6,
    limit: 6,
    totalPages: 2,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };

  const HttpMock = {
    get: jest.fn(() => true),
    post: jest.fn(() => true),
    patch: jest.fn(() => true),
    put: jest.fn(() => true),
    delete: jest.fn(() => true),
  };
  const MessagerModel = {
    create: jest.fn().mockResolvedValue(dbMock.docs[0]),
    findOneAndUpdate: jest.fn().mockResolvedValue(dbMock.docs[0]),
    paginate: jest.fn().mockResolvedValue(dbMock),
    deleteOne: jest.fn().mockResolvedValue(true),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: HttpService,
          useValue: HttpMock,
        },
        {
          provide: getModelToken(Message.name),
          useValue: MessagerModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => {
              return 1;
            },
          },
        },
      ],
    }).compile();
    httpService = module.get<HttpService>(HttpService);
    service = module.get<MessagesService>(MessagesService);
  });

  describe('create method', () => {
    it('create element', async () => {
      const body: CreateMessageDto = {
        to: 'some url',
        method: 'GET',
        headers: {},
        frequency: 1,
        data: {},
        created_at: '',
        updated_at: '',
      };
      const result = await service.create(body);
      expect(result).toEqual(dbMock.docs[0]);
    });
  });

  describe('updateElement method', () => {
    it('update element', async () => {
      const body = {};
      const result = await service.updateElement('1', body as Message);
      expect(result).toEqual(dbMock.docs[0]);
    });
  });

  describe('handleCron method', () => {
    it('success all request', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of({ ...{ data: {} } });
      });
      jest.spyOn(httpService, 'post').mockImplementation(() => {
        return of({ ...{ data: {} } });
      });
      jest.spyOn(httpService, 'patch').mockImplementation(() => {
        return of({ ...{ data: {} } });
      });
      jest.spyOn(httpService, 'put').mockImplementation(() => {
        return of({ ...{ data: {} } });
      });
      jest.spyOn(httpService, 'delete').mockImplementation(() => {
        return of({ ...{ data: {} } });
      });
      const result = await service.handleCron();
      expect(result).toEqual(undefined);
    });

    it('fail all request', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw Error('some error happen');
      });
      jest.spyOn(httpService, 'post').mockImplementation(() => {
        throw Error('some error happen');
      });
      jest.spyOn(httpService, 'patch').mockImplementation(() => {
        throw Error('some error happen');
      });
      jest.spyOn(httpService, 'put').mockImplementation(() => {
        throw Error('some error happen');
      });
      jest.spyOn(httpService, 'delete').mockImplementation(() => {
        throw Error('some error happen');
      });
      const result = await service.handleCron();
      expect(result).toEqual(undefined);
    });

    it('no have nothing to process', async () => {
      dbMock.docs = [];
      const result = await service.handleCron();
      expect(result).toEqual(undefined);
    });
  });
});
