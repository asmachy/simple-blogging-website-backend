const express = require('express');
server_connection = (app, PORT)=>{
    // console.log("Process env home",HOME);
    return app.listen(PORT, () => console.log('Server started at port :'+PORT));
}

module.exports = {server_connection};