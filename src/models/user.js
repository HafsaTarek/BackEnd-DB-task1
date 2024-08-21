const mongoose = require("mongoose");
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const validator=require("validator")


const userSchema=new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(val) {
        let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])[A-Za-z\\d!@#\\$%\\^&\\*]{8,}$");
        if (!password.test(val)) {
          throw new Error("Password must include uppercase, lowercase, numbers, and special characters, and be at least 8 characters long.");
        }
      }
      
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(val){
        if(!validator.isEmail(val))
          throw new Error("Email is invalid")
      }
    },
    age: {
      type: String,
      default: 18,
      validate(val){
        if(val<=0)
          throw new Error("Age must be positive")
      }
    },
    city: {
      type: String,
    },
    tokens:[{
      type:String
    }]
  
})

userSchema.pre("save",async function(){
  const user=this

  if (user.isModified('password'))
  user.password=await bcryptjs.hash(user.password,8)
  
})


userSchema.statics.findByCredentials = async function (email, password) {
  // Use 'this' to refer to the model
  const user = await this.findOne({ email });
  
  if (!user) {
    throw new Error('Unable to login. User not found.');
  }
  
  console.log(user);
  
  const isMatch = await bcryptjs.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('Unable to login. Incorrect password.');
  }
  
  return user; // Return the user if everything is correct
};


userSchema.methods.generateToken=async function (){

  const user=this
  const token=jwt.sign({_id:user._id.toString()},"hafsa500")
  user.tokens=user.tokens.concat(token)
  await user.save()
  return token

}

const user = mongoose.model("User",userSchema);

module.exports=user
