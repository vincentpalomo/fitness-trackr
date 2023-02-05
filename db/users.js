const client = require('./client');

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *
    `,
      [username, password]
    );
    delete user.password;
    return user;
  } catch (error) {
    console.error('error createUser fn', error);
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT username, password FROM users
    WHERE username=$1 AND password=$2
    `,
      [username, password]
    );
    delete user.password;
    return user;
  } catch (error) {
    console.error('error getUser fn', error);
  }
}

async function getUserById(userId) {}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT username, password FROM users
    WHERE username=$1
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error('error getUserByUsername fn', error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
