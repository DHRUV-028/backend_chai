import mongoose ,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unipue : true,
        index :true //will be used for searching
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unipue : true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required :true 
    },
    coverImage:{
        type:String,
   
    },
    password:{
        type:String,
        required:[true , "password must be of 8 character"],
    },
    refreshTokens:{
        type:String,
        
    },
    watchHistory :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }

    ]
},{timestamps:true})



userSchema.pre('save' , async function(next){
if(this.isModified(this.password)) {return next();}

    this.password = await bcrypt.hash(this.password , 10);
    next();
})


userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password);
}


userSchema.methods.generateAccessToken = function(){
 return   jwt.sign({
        _id : this._id,
        userName :this.userName,
        fullName :this.fullName,
        email :this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }

)
}

userSchema.methods.generateRefreshToken = function(){
    return   jwt.sign({
           _id : this._id,
          
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
           expiresIn : process.env.REFRESH_TOKEN_EXPIRY
       }
   
   )
   }


export const User = mongoose.model("User" ,userSchema );