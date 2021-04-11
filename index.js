/**
 * Entry point of this Express Application
 * @type {Express}
 */

const express = require('express');
const mongoose = require('mongoose');
const postRoute = require('./routes/post.route');
const registerRoute = require('./routes/register.route');
const loginRoute = require('./routes/login.route');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
//   }  
dotenv.config();
// const PORT = process.env.PORT|3000;
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
// app.use(flash())
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(methodOverride('_method'))
app.use('/posts',postRoute);
app.use('/register',registerRoute);
app.use('/login',loginRoute);


app.listen(3000, () => console.log('Server started at port : 3000'));