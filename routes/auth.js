const Router = require('express')
const router = new Router()
const controller = require('../controllers/auth')
const { check } = require('express-validator')
const isAuth = require('../middleware/auth')
const hasRole = require('../middleware/role')

router.post(
  '/register',
  [
    check('username', 'Username cannot be blank').notEmpty(),
    check('password', 'Min 4 and max 10 characters').isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.register
)
router.post('/login', controller.login)
// admin, user .. checking different roles here
router.get('/users', isAuth, hasRole(['ADMIN']), controller.getUsers)

module.exports = router
