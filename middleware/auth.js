const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'User not authorized' })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    req.user = decoded
    next()
  } catch (error) {
    console.log()
    return res.status(403).json({ message: 'User not authorized' })
  }
}
