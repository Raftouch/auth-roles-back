const { model, Schema } = require('mongoose')

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // array, as a user can have different roles
  roles: [{ type: String, ref: 'Role' }],
})

module.exports = model('User', User)
