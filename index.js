/**
 * Entry point of this Express Application
 * @type {Express}
 */

const express = require('express');
const mongoose = require('mongoose');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT|3000;
mongoose.connect(
    process.env.DB_CONNECTION,
    { useUnifiedTopology: true,
      useNewUrlParser: true });
const connection = mongoose.connection;
connection.on('open',function(){
    console.log("DB Connected!");
})
  


app.use(express.json());
app.use(cors());
app.use('/user',userRoute);
app.use('/posts',postRoute);


app.listen(PORT, () => console.log('Server started at port :'+PORT));