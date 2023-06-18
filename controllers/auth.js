const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const generateAccessToken = (id, roles) => {
  const payload = { id, roles }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1h' })
}

// class used to compact all controllers together

class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Unexpected error occurred', errors })
      }
      const { username, password } = req.body
      const candidate = await User.findOne({ username })
      if (candidate) {
        return res.status(400).json({ message: 'Such user already exists' })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const userRole = await Role.findOne({ value: 'USER' })
      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      })
      await user.save()
      return res.json({ message: 'User created successfully' })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }
      const isValid = bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(400).json({ message: 'Wrong password' })
      }
      // if valid --> generate token
      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Login error' })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
      //   res.json({ message: 'Server works' })
    } catch (error) {
      console.log(error)
    }
  }
}

// we export an object of the given class

module.exports = new authController()
