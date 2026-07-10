const { listUsers } = require('../services/userService');

async function getUsers(req, res, next) {
  try {
    const users = await listUsers();
    console.log('getUsers', users);

    res.json({
      users: users.map((user) => user.toJSON())
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers
};
