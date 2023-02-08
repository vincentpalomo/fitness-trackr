const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://vincentpalomo:v2_3ysed_nbsdWVz5vhCJymkwPH3dqmN@db.bit.io:5432/vincentpalomo/fitness-dev?ssl=true';

const client = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
