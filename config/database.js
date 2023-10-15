import mongoose from "mongoose";
import dotenv from "dotenv";

// dot env config

dotenv.config();

const connectDb = async () => {
  try {
    let conn = await mongoose.connect(process.env.dburl);
    console.log(`Connected to database ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Mongo db error ${error}`);
  }
};

export default connectDb;
