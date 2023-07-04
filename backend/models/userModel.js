const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  pic: {
    type: String,
    default: "https://icon-library.com/icon/anonymous-avatar-icon-25.html.html",
  },
}, 
{timestamps: true}
);

userSchema.methods.matchPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

//Before saving the user to our database, it's gonna encrypt the password
userSchema.pre('save', async function (next){ //pre means before saving, we are adding a function. Using next because it is going to be a middleware
  if(!this.isModified){ //if password is not modified then don't run the code after that i.e., move on to the next 
    next()
  }
  //otherwise generate a new password
  const salt=await bcrypt.genSalt(10) //higher the number, stronger the salth will be generated
  this.password=await bcrypt.hash(this.password, salt)

})
const User=mongoose.model("User", userSchema)

module.exports=User