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

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    SELECT * FROM activities
    WHERE id = $1
    `,
      [id]
    );
    return activity;
  } catch (error) {
    console.error('error getActivityById fn', error);
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    SELECT * FROM activities
    WHERE name = $1
    `,
      [name]
    );

    return activity;
  } catch (error) {
    console.error('error getActivityByName');
  }
}

async function attachActivitiesToRoutines(routines) {
  // try {
  //   const {
  //     rows: [activities],
  //   } = await client.query(
  //     `
  // SELECT * FROM activities a
  // JOIN routine_activities ra ON ra."activityId" = a.id
  // `,
  //     [routines]
  //   );
  //   console.log({ activities });
  //   return activities;
  // } catch (error) {
  //   console.error('error attachActivitiesToRoutines fn', error);
  // }
}

attachActivitiesToRoutines('Soccer');

async function updateActivity({ id, ...fields }) {
  try {
    // don't try to update the id
    // do update the name and description
    // return the updated activity
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');

    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE activities
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `,
      Object.values(fields)
    );

    return activity;
  } catch (error) {
    console.error('error updateActivity fn', error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
