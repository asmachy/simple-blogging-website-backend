const express = require('express');
const mongoose = require('mongoose');
db_connection = (db_link)=>{
    return mongoose.connect(
        db_link,
        {  useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true })
          .then(()=>{
                const connection = mongoose.connection;
                console.log("DB Connected!");
          })
          .catch((err)=>{
              console.log(err.message);
    });
}
module.exports = {
    db_connection
}