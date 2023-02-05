const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    // return the new activity
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *
    `,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.error('error createActivity fn', error);
  }
}

async function getAllActivities() {
  try {
    // select and return an array of all activities
    const { rows: activities } = await client.query(`
    SELECT * FROM activities
    `);

    return activities;
  } catch (error) {
    console.error('error getAllActivities fn', error);
  }
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
