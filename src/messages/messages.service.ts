import { Injectable } from '@nestjs/common';
import { Model, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import * as dayjs from 'dayjs';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  private limitPages;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(Message.name) private readonly model: Model<Message>,
    @InjectModel(Message.name)
    private readonly modelPag: PaginateModel<Message>,
  ) {
    this.limitPages = this.configService.get('appConfig.limit');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const currentDate = dayjs().format();
    const filters = {
      updated_at: { $lte: currentDate },
    };
    const params: PaginationDto = {};
    const documents = await this.findPaginated(filters, params);
    const { docs, totalPages } = documents;
    if (docs.length === 0) return;
    const processData = [];
    for (let index = 0; index < docs.length; index++) {
      processData.push(docs[index]);
    }
    for (let page = 2; page <= totalPages; page++) {
      const paramsPaged: PaginationDto = {
        limit: this.limitPages,
        page,
      };
      const otherPage = await this.findPaginated(filters, paramsPaged);
      const otherDocs = otherPage.docs;
      for (let index = 0; index < otherDocs.length; index++) {
        processData.push(otherDocs[index]);
      }
    }
    for (let index = 0; index < processData.length; index++) {
      const element = processData[index];

      try {
        switch (element.method.toLocaleUpperCase()) {
          case 'GET':
            await this.getMethod(element.toObject());
            break;
          case 'POST':
            await this.postMethod(element.toObject());
            break;
          case 'PATCH':
            await this.patchMethod(element.toObject());
            break;
          case 'PUT':
            await this.putMethod(element.toObject());
            break;
          case 'DELETE':
            await this.deleteMethod(element.toObject());
            break;
          default:
            break;
        }
        await this.model.deleteOne({ _id: element._id });
      } catch (error) {
        this.handlerError(element);
      }
    }
  }

  private async handlerError(element: any) {
    const actualElement = element.toObject();
    const newData = {
      ...actualElement,
      count: actualElement.count + 1,
    };
    await this.updateElement(element._id, newData as Message);
  }

  private async findPaginated(filters: object, params?: PaginationDto) {
    const { limit = this.limitPages, page = 1 } = params;
    const options = {
      page,
      limit,
      sort: {
        created_at: 1,
      },
    };
    const results = await this.modelPag.paginate(filters, options);
    return results;
  }

  private async getMethod(body: Message) {
    const request = this.httpService.get(body.to, { headers: body.headers });
    const { data } = await firstValueFrom(request);
    return data;
  }

  private async postMethod(body: Message) {
    const request = this.httpService.post(body.to, body.data, {
      headers: body.headers,
    });
    const { data } = await firstValueFrom(request);
    return data;
  }

  private async patchMethod(body: Message) {
    const request = this.httpService.patch(body.to, body.data, {
      headers: body.headers,
    });
    const { data } = await firstValueFrom(request);
    return data;
  }

  private async putMethod(body: Message) {
    const request = this.httpService.put(body.to, body.data, {
      headers: body.headers,
    });
    const { data } = await firstValueFrom(request);
    return data;
  }

  private async deleteMethod(body: Message) {
    const request = this.httpService.delete(body.to, { headers: body.headers });
    const { data } = await firstValueFrom(request);
    return data;
  }

  async create(body: CreateMessageDto) {
    const currentDate = dayjs().format();
    body.created_at = currentDate;
    body.updated_at = currentDate;
    return await this.model.create(body);
  }

  async updateElement(_id: string, data: Message) {
    return await this.model.findOneAndUpdate({ _id }, data, {
      new: true,
    });
  }
}
