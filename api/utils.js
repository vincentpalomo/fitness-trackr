// check if user is logged in
function requireUser(req, res, next) {
  if (req.user) {
    console.log('passed', req.user);
    next();
  } else {
    console.log('failed', req.user);
    res.status(401);
    next({
      name: 'MissingUserError',
      message: 'You must be logged in to perform this action',
    });
  }
}

module.exports = { requireUser };
