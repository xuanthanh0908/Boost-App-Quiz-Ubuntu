const requestTime = (req, res, next) => {
  req.startTime = Date.now()
  next()
}
module.exports = requestTime
