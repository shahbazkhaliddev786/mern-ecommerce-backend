import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const OTPSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);