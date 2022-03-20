import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';
import validator from 'validator';
import { toJSON } from '../utils/utils';

export const userRole = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  SUPER_ADMIN: 'superadmin',
};

const userSchema = new Schema(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    gender: {
      trim: true,
      type: String,
    },
    mobile: {
      maxlength: 10,
      minlength: 10,
      trim: true,
      type: String,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    password: {
      minlength: 8,
      required: true,
      trim: true,
      type: String,
      validate: (value) => {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    role: {
      enum: [userRole.admin, userRole.SUPER_ADMIN, userRole.CASHIER],
      required: true,
      type: String,
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
export const User = model('User', userSchema);

userSchema.virtual('invoices', {
  foreignField: 'cashier',
  localField: '_id',
  ref: 'Invoice',
});

userSchema.statics.findByCredentials = async (userId, password) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('invalid creds');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('invalid creds');
  }

  return user;
};

userSchema.methods.generateAuthToken = async () => {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = () => toJSON(this);

userSchema.pre('save', async (next) => {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
