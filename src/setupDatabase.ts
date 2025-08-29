
import mongoose from "mongoose";

export default () =>{
    const connect =() =>{
        mongoose.connect('mongodb://localhost:27017/chattyapp-backend')
        .then(()=>{
            console.log('Successfully connected to database.');
        })
        .catch((error)=>{
            console.log('Error in the database.',error);
            return process.exit(1);
        });
    };
    connect();

    mongoose.connection.on('disconnected',connect);
};