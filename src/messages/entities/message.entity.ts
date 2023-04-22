import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ collection: 'retry-manager' })
export class Message extends Document {
  @Prop({ type: String })
  to: string;

  @Prop({ type: String })
  method: string;

  @Prop({ type: Object })
  headers: object;

  @Prop({ type: Number })
  frequency: number;

  @Prop({ type: Number, default: 0 })
  count: number;

  @Prop({ type: Object })
  data: object;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.plugin(paginate);
