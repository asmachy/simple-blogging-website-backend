const express = require('express');
const mongoose = require('mongoose');
db_connection = (db_link)=>{
    return mongoose.connect(
        db_link,
        { useUnifiedTopology: true,
          useNewUrlParser: true })
          .then(()=>{
                const connection = mongoose.connection;
                console.log("DB Connected!");
          })
          .catch(()=>{
              console.log('Check your internet connection');
    });
}
module.exports = {
    db_connection
}