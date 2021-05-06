/**
 * Entry point of this Express Application
 * @type {Express}
 */

const express = require('express');
const {db_connection} = require('./connections/db.connection');
const {server_connection} = require('./connections/server.connection');
const postRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT|3000;


db_connection(process.env.DB_CONNECTION);

app.use(express.json());
// app.use(cors());
app.use('/user',userRoute);
app.use('/posts',postRoute);

server_connection(app, PORT);

module.exports = app;