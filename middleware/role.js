module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(403).json({ message: 'Login failed' })
      }
      const { roles: userRoles } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY
      )
      let hasRole = false
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true
        }
      })
      if (!hasRole) {
        return res.status(403).json({ message: 'You have no access' })
      }
      next()
    } catch (error) {
      console.log()
      return res.status(403).json({ message: 'Login failed' })
    }
  }
}
