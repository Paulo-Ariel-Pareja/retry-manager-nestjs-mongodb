import { registerAs } from '@nestjs/config';

const buildUri = () => {
  const url =
    process.env.MONGO_DB_URI || 'mongodb://127.0.0.1:27017/retry-manager';
  const val = url.split('//');

  const user = process.env.MONGO_DB_USER || '';
  const pass = process.env.MONGO_DB_PASS || '';
  const userInfo = !!user && !!pass ? `${user}:${pass}@` : '';
  return `${val[0]}//${userInfo}${val[1]}`;
};

export default registerAs('dbConfig', () => ({
  uri: buildUri(),
}));
