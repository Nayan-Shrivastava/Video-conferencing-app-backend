import { model, Schema } from 'mongoose';
import validator from 'validator';

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
    imageUrl: {
      type: String,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    password: {
      minlength: 8,
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

export const User = model('User', userSchema);
