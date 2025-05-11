import connectDatabase from './db/connectDB.js'
import app from './app.js'
import dotenv  from 'dotenv'



dotenv.config({
    path:'./.env'
})

connectDatabase().then(()=>{
    app.listen(process.env.PORT || 8009 , ()=>{
        console.log('port is listening on port : ' ,process.env.PORT);
        
    })
})
.catch((error)=>{
    app.on('error' , (error)=>{
        console.log('database connection error ' , error);
        
    })
})