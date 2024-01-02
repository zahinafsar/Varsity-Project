import mysql from "mysql";

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: Number(process.env.DB_PORT),
//   multipleStatements: true,
//   insecureAuth: true,
// };

export const connectDb = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    insecureAuth: true,
    multipleStatements: true,
  });
};
