const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

module.exports = {

//╭──────────────────────Main──────────────────────╮//   
    SESSION_ID: process.env.SESSION_ID || "Put_your_sesion_id_here❤️",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://raw.githubusercontent.com/Eboxsl/ELAUTO/refs/heads/main/Elixa/Hi.png",
    ALIVE_MSG: process.env.ALIVE_MSG || "Elixs Is Alive Nox👍🇱🇰✅ ",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
    OWNER: process.env.OWNER || "Your Name",
    MODE: process.env.MODE || "public",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94763936166",
//╰────────────────────────────────────────────────╯//

//╭──────────────────────Auto──────────────────────╮//
    AUTO_REPLY: process.env.AUTO_REPLY || "true",
    AUTO_STICKER: process.env.AUTO_STICKER || "true",
    AUTO_VOICE: process.env.AUTO_VOICE || "true",
    AUTO_BADWORD: process.env.AUTO_BADWORD || "true",
//╰────────────────────────────────────────────────╯//

    ALIVE_MODE: process.env.ALIVE_MODE || "elixa", // modes are elixa and hack

    MOVIE: process.env.MOVIE || "false",// need over 4 GB ram
    
    
};
