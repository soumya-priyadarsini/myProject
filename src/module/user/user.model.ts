import mongoose, {Schema} from "mongoose";

const UserSchema: Schema = new Schema({
    user_name:{type:String},
    email:{type:String,required:true},
    password:{type:String},
    verification_code:{type:String},
    token:String,
    created_at: { type: Date, default: Date.now() }
    
})
export const User =mongoose.model('user',UserSchema)