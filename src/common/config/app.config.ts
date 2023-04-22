import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  port: Number(process.env.PORT) || 3000,
  limit: process.env.LIMIT_PAGES || 10,
}));
