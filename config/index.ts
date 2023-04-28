import 'dotenv/config';

export const applicationConfig = {
  // DB
  db: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },

  // App
  app: {
    env: process.env.APP_ENV,
    port: process.env.APP_PORT || '3009',
    feDomain: () => {
      const mapValues = {
        qa: 'xyz.',
        qa2: 'xyz2.',
        beta: 'beta.',
        main: '',
      };

      const subDomain = mapValues[process.env.APP_ENV];

      return `https://${subDomain}glue.is`;
    },
  },
};
