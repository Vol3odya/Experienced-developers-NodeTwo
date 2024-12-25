import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/users.js";


const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'female',
    },
    waterRate: {
    type: Number,
    default: 2000,
    },
    photo: {
    type: String,
    },
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const UserCollection = model('user', userSchema);


export default UserCollection;
