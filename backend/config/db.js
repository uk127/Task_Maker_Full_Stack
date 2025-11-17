const mongoose = require("mongoose");

const connectdb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }catch(err){
        console.error("Mongodb connection error",err);
        process.exit(1);
    }
}
module.exports = connectdb;