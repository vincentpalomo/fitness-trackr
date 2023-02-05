const client = require('./client');
const bcrypt = require('bcrypt');

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
    const user = await getUserByUsername(username);

    if (user.password === password) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('error getUser fn', error);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
  SELECT id FROM users
  WHERE id = $1
  `,
      [userId]
    );

    return user;
  } catch (error) {
    console.error('error getUserById fn', error);
  }
}

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
