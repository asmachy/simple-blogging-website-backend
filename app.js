const express = require('express');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const cors = require('cors');
const app = express();
 
app.use(express.json());
// app.use(cors());

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use('/user',userRoute);
app.use('/posts',postRoute);
 
 
module.exports = app;