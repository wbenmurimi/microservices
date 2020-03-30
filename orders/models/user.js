var mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, saltRounds)
  }
  next()
})

UserSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY,{expiresIn: "1 day"})
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email} )
  const auth_user="";
  if (!user) {
      return auth_user
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
      return auth_user
  }
  
  return user
}

UserSchema.statics.findUserByEmail = async (email) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email} )
  const auth_user="";
  if (!user) {
      return auth_user
  }

  return user
}

var User = mongoose.model('User', UserSchema);
module.exports = User;