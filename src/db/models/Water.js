import { Schema, model } from "mongoose";

import { handleSaveError } from "./hooks.js";


const waterSchema = new Schema(
    {
      waterVolume: {
        type: Number,
        required: [true, '"Water Volume" is required'],
        min: [1, '"Water Volume" must be at least 1 ml'],
        max: [5000, '"Water Volume" cannot exceed 5000 ml'],
      },
      waterRate: {
        type: Number,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, '"User ID" is required'],
      },
      date: {
        type: String,
        required: [true, '"Date" is required'],

      },
    },
    { versionKey: false, timestamps: true }
  );

  waterSchema.post('save', handleSaveError);


  waterSchema.post('findOneAndUpdate', handleSaveError);

  const WaterCollection = model('water', waterSchema);

  export default WaterCollection;
