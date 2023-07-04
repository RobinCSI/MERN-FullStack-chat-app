const mongoose = require("mongoose");

//function to connect to our database
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(
      "mongodb+srv://robincsharma:xZYimoGmStk3NOMF@cluster0.hos5iim.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        // useUnifiedTopolgy: true,
      }
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
