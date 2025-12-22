import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);