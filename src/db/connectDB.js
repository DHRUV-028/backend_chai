import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDatabase = async function () {
  try {

  
    
    const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`
      );

    console.log(
      "DATABASE CONNECTED SUCCESSSFULLY ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR", error);
    throw error;
  }
};

export default connectDatabase;
