const { deleteUserAccount } = require('../services/accountService');

async function deleteMe(req, res, next) {
  try {
    await deleteUserAccount(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteMe
};
