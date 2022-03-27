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

userSchema.virtual('invoices', {
  foreignField: 'cashier',
  localField: '_id',
  ref: 'Invoice',
});

// userSchema.methods.toJSON = () => toJSON(this);

/*
 * userSchema.pre('save', async (next) => {
 *   if (this.isModified('password')) {
 *     this.password = await bcrypt.hash(this.password, 8);
 *   }
 *   next();
 * });
 */

export const User = model('User', userSchema);
