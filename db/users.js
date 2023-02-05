const client = require('./client');
const bcrypt = require('bcrypt');

const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hash = await bcrypt.hash(password, SALT_COUNT);

    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *
    `,
      [username, hash]
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
    const hash = user.password;

    let passwordsMatch = await bcrypt.compare(password, hash);
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      throw new Error('Passwords do not match');
    }

    // if (user.password === password) {
    //   delete user.password;
    //   return user;
    // } else {
    //   return null;
    // }
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
  SELECT id, username FROM users
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
    SELECT id, username, password FROM users
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
