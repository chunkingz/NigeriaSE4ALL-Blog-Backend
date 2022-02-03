
// using postgresql

// module.exports = ({ env }) => ({
//   defaultConnection: 'default',
//   connections: {
//     default: {
//       connector: 'bookshelf',
//       settings: {
//         client: 'postgres',
//         host: env("DATABASE_HOST", "localhost"),
//         port: env.int("DATABASE_PORT", 5432),
//         database: env("DATABASE_NAME", "angular_strapi_blog"),
//         username: env("DATABASE_USERNAME", "postgres"),
//         password: env("DATABASE_PASSWORD", "toor"),
//         schema: env("DATABASE_SCHEMA", "public"),
//       },
//       options: {},
//     },
//   },
// });

// dev db

module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: "se4alldatabase.postgres.database.azure.com",
        port: "5432",
        database: "se4all_nigeria",
        username: "technical_user_strapi@se4alldatabase",
        password: "Juuhdwau35l%%$",
        schema: "strapi",
      },
      options: {},
    },
  },
});
