/**
 * Entry point of this Express Application
 * @type {Express}
 */

const express = require('express');
const {db_connection} = require('./connections/db.connection');
const {server_connection} = require('./connections/server.connection');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT|5000;


if(process.env.HOME==='/root'){
    db_connection(process.env.DB_CONNECTION_DOCKER);
}
else db_connection(process.env.DB_CONNECTION);

const app = require('./app');

server_connection(app, PORT);