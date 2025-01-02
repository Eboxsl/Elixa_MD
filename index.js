const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./nj');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./nj');
const axios = require('axios');
const { File } = require('megajs');
const prefix = '.';

const ownerNumber = ['94766428832'];


const { execSync } = require('child_process');

const path = require('path');

const mainFolder = path.join(__dirname, 'main');

if (!fs.existsSync(mainFolder)) {
  execSync('git clone https://github.com/Cyber-E2025/Mage-botaE main');

  ['lib','Elixa', 'plugins'].forEach((folder) => {
    const source = path.join(mainFolder, folder);
    const dest = path.join(__dirname, folder);

    if (fs.existsSync(source) && fs.lstatSync(source).isDirectory()) {
      fs.renameSync(source, dest);
    }
  });
} else {
  console.log('Main folder already exists. Skipping clone and move operations.');
}


//╭─────────────────────Seson Auth──────────────────────╮//
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
const sessdata = config.SESSION_ID.replace('ELIXAMD❤️', ''); // Remove 'ELIXA-MD' from SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
        console.log("Session downloaded ✅");
    });
});

}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//╰────────────────────────────────────────────────╯//

async function connectToWA() {
    console.log("Connecting wa bot 🕦...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('🕦Installing...');
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successfully ✅');
            console.log('Bot connected to WhatsApp ✅');
             console.log(' 𝗚𝗲𝟆𝗮𝗿𝗮𝐭𝗲𝙙 𝝗𝞤 𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗༺');   

            let up = `Elixa MDconnected successfully ✅\n\nPREFIX: ${prefix} \n ❤️🇱🇰Form Nethindu Thaminda \n > 𝗚𝗲𝟆𝗮𝗿𝗮𝐭𝗲𝙙 𝝗𝞤 𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗༺`;
            conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", { image: { url: `https://raw.githubusercontent.com/Eboxsl/ELAUTO/refs/heads/main/Elixa/connect.png` }, caption: up });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return;

        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const quoted = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption : (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const pushname = mek.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;
        const botNumber2 = await jidNormalizedUser(conn.user.id);
        const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
        const isReact = m.message.reactionMessage ? true : false;
        const reply = (teks) => {
            conn.sendMessage(from, { text: teks }, { quoted: mek });
        };

        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            let mime = '';
            let res = await axios.head(url);
            mime = res.headers['content-type'];
            if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
            }
            let type = mime.split("/")[0] + "Message";
            if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
            }
        };


//======================================================//            

        if (!isOwner && config.MODE === "privet") return;
        if (!isOwner && isGroup && config.MODE === "inbox") return;
        if (!isOwner && !isGroup && config.MODE === "groups") return;

//======================================================//            

 const events = require('./command');
        const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
        if (isCmd) {
            const cmd = events.commands.find((cmd) => cmd.pattern === cmdName) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
            if (cmd) {
                if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

                try {
                    cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }

        events.commands.map(async (command) => {
            if (body && command.on === "body") {
                command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
            } else if (mek.q && command.on === "text") {
                command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
            } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
                command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
            } else if (command.on === "sticker" && mek.type === "stickerMessage") {
                command.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
            }
        });
    });
}

app.get("/", (req, res) => {
    res.send(`


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elixa MD - WhatsApp Bot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: url('https://raw.githubusercontent.com/Eboxsl/ELAUTO/refs/heads/main/ELIXA%20MD%20(2).gif') no-repeat center center fixed;
      background-size: cover;
      position: relative;
      overflow: hidden;
    }

    .container {
      text-align: center;
      background-color: rgba(255, 255, 255, 0.15); /* Glassmorphism base */
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px); /* Glassmorphism blur */
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 2; /* Keeps the container on top of the background */
      transition: backdrop-filter 0.3s ease, background-color 0.3s ease;
    }

    /* Hover effect for glassmorphism */
    .container:hover {
      backdrop-filter: blur(20px);
      background-color: rgba(255, 255, 255, 0.25);
    }

    h1 {
      font-size: 2.5rem;
      color: #ffffff;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.2rem;
      color: #ffffff;
      margin-bottom: 30px;
    }

    .whatsapp-btn {
      background-color: #25D366;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .whatsapp-btn:hover {
      background-color: #1ebe55;
    }

    .logo-container {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 auto 20px;
      background-color: rgba(255, 255, 255, 0.2); /* Transparent background */
      border-radius: 50%; /* Makes the container a circle */
      display: flex;
      justify-content: center;
      align-items: center;
      transition: backdrop-filter 0.3s ease, background-color 0.3s ease;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px); /* Glassmorphism for the circle */
      border: 2px solid rgba(255, 255, 255, 0.2); /* Adds a light border */
    }

    /* Glassmorphism effect on hover for logo */
    .logo-container:hover {
      backdrop-filter: blur(15px);
      background-color: rgba(255, 255, 255, 0.3);
    }

    .logo {
      width: 120px;
      height: auto;
      border-radius: 50%; /* Ensures the logo is inside a circle */
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
      p {
        font-size: 1rem;
      }
      .whatsapp-btn {
        padding: 10px 20px;
        font-size: 1rem;
      }
      .logo-container {
        width: 100px;
        height: 100px;
      }
      .logo {
        width: 80px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-container">
      <img src="https://avatars.githubusercontent.com/u/175798358?v=4" alt="Elixa MD Logo" class="logo">
    </div>
    <h1>Congratulations!</h1>
    <p>You have successfully connected with Elixa MD</p>
    <button class="whatsapp-btn" onclick="startChat()">Chat with Elixa MD on WhatsApp</button>
  </div>

  <script>
    function startChat() {
      window.open('https://wa.me/', '_blank');
    }
  </script>
</body>
</html>




    `);
});


app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);  
