import { model, Schema } from 'mongoose';

// organization

const organizationSchema = new Schema(
  {
    admin: {
      ref: 'User',
      required: true,
      trim: true,
      type: Schema.Types.ObjectId,
    },
    members: [
      {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
    name: {
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Organization = model('Organization', organizationSchema);
