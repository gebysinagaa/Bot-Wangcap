/*
┏╼━━━━━━━━━━━━━━━━━━╾┓
BASE : https://github.com/AlifatahFauzi
RECODE : t.me/marsellmawujadidev 
CH : https://whatsapp.com/channel/0029VbBFzoWDDmFYnclusM13
┗╼━━━━━━━━━━━━━━━━━━╾┛
*/

process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

require("./settings.js")
require("./library/webp.js")
require("./library/myfunction.js")
require("./library/database.js")

const {
	default: makeWASocket,
	makeCacheableSignalKeyStore,
	useMultiFileAuthState,
	DisconnectReason,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
	prepareWAMessageMedia,
	generateWAMessageFromContent,
	generateMessageID,
	downloadContentFromMessage,
	makeInMemoryStore,
	getContentType,
	jidDecode,
    MessageRetryMap,
	proto,
	delay, 
	Browsers
} = require("@whiskeysockets/baileys")

const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const PhoneNumber = require("awesome-phonenumber") 
const readline = require("readline")
const chalk = require("chalk");
const qrcode = require("qrcode-terminal");
const FileType = require('file-type');
const os = require('os');
const nou = require('node-os-utils');
const speed = require('performance-now');
let timestamp = speed();
let latensi = speed() - timestamp;
let tio = nou.os.oos();
var tot = nou.drive.info();
const ConfigBaileys = require("./library/utils.js");

// default public
let mode = { public: false }
if (fs.existsSync("./library/database/mode.json")) {
   mode = JSON.parse(fs.readFileSync("./library/database/mode.json"))
}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })


async function InputNumber(promptText) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

setInterval(async () => {
  const sessi = await fs.readdirSync('./Session').filter(e => e !== 'creds.json');
  const satuJam = 60 * 60 * 1000; 
  const sekarang = Date.now();
  for (let i of sessi) {
    const path = `./Session/${i}`;
    const stats = fs.statSync(path);
    const modifiedTime = stats.mtimeMs;
    if (sekarang - modifiedTime > satuJam) {
      fs.unlinkSync(path);
    }
  }
}, 60000 * 30)


const groupMetadataCache = new Map()

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('Session');
    const pairingCode = true

    const marsel = makeWASocket({
        browser: Browsers.ubuntu("Firefox"),  
        generateHighQualityLinkPreview: true,  
        printQRInTerminal: !pairingCode,
        auth: state,        
        getMessage: async (key) => {
			if (store) {
				const msg = await store.loadMessage(key.remoteJid, key.id)
				return msg.message || undefined
			}
		},
        logger: pino({ level: "silent" }), 
        cachedGroupMetadata: async (jid) => {
  if (groupMetadataCache.has(jid)) {
    return groupMetadataCache.get(jid);
  }
  try {
    const metadata = await marsel.groupMetadata(jid);
    groupMetadataCache.set(jid, metadata);
    return metadata;
  } catch (err) {
    console.error(`Failed to fetch metadata for group ${jid}:`, err);
    // jangan return null, kasih objek kosong
    return { id: jid, subject: 'Unknown Group', participants: [] };
  }
},
    });
    
    if (pairingCode && !marsel.authState.creds.registered) {
    let phoneNumber = await InputNumber(chalk.green.bold('Enter Your Number (628) :\n'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
        setTimeout(async () => {
        const code = await marsel.requestPairingCode(phoneNumber, `${global.pairingCode}`)
        await console.log(`${chalk.yellow.bold('Your Code')} : ${chalk.cyan.bold(code)}`)
        }, 4000)
    }
    
    store?.bind(marsel.ev)

    marsel.ev.on('creds.update', saveCreds);

    marsel.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
            if (!connection) return;
            if (connection === "connecting") {
            if (qr && !pairingCode) {
            console.log("Scan QR ini di WhatsApp:");
            qrcode.generate(qr, { small: true }); 
            }
            }
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
                console.error(lastDisconnect.error);

                switch (reason) {
                    case DisconnectReason.badSession:
                        console.log("Bad Session File, Please Delete Session and Scan Again");
                        process.exit();
                    case DisconnectReason.connectionClosed:
                        console.log("[SYSTEM] Connection closed, reconnecting...");
                        await startBot();
                    case DisconnectReason.connectionLost:
                        console.log("[SYSTEM] Connection lost, trying to reconnect...");
                        await startBot();
                    case DisconnectReason.connectionReplaced:
                        console.log("Connection Replaced, Another New Session Opened. Please Close Current Session First.");
                        await marsel.logout();
                        break;
                    case DisconnectReason.restartRequired:
                        console.log("Restart Required...");
                        await startBot();
                    case DisconnectReason.loggedOut:
                        console.log("Device Logged Out, Please Scan Again And Run.");
                        await marsel.logout();
                        break;
                    case DisconnectReason.timedOut:
                        console.log("Connection TimedOut, Reconnecting...");
                        await startBot();
                    default:
                        await startBot();    
                }
            } else if (connection === "open") {
                await loadConnect(marsel)    
                console.clear()                          
console.log(chalk.green.bold(`${namaBot} Successful Connected To WhatsApp!\n`)) 
// Header bot
console.log(chalk.magenta.bold("\n┏━━━━━━━━━━━━━━━━━━━━━━━┓"))
console.log(chalk.magenta.bold("┃ BOT - INFORMASI "))
console.log(chalk.magenta.bold("┗━━━━━━━━━━━━━━━━━━━━━━━┛"))

console.log(
  chalk.whiteBright(`
❏ Bot Name     : `) + chalk.green(global.namaBot) +
chalk.whiteBright(`
❏ Developer    : `) + chalk.yellow(global.namaOwner) +
chalk.whiteBright(`
❏ Number Owner : `) + chalk.cyan(global.owner) +
chalk.whiteBright(`
❏ Version      : `) + chalk.blue(versiBot) +
chalk.whiteBright(`
❏ Type         : `) + chalk.red("Case") +
chalk.whiteBright(`
❏ Prefix       : `) + chalk.magenta(".")
)

// Header server
console.log(chalk.magenta.bold("\n┏━━━━━━━━━━━━━━━━━━━━━━━┓"))
console.log(chalk.magenta.bold("┃ SERVER - INFORMASI "))
console.log(chalk.magenta.bold("┗━━━━━━━━━━━━━━━━━━━━━━━┛"))

console.log(
  chalk.whiteBright(`
❏ Uptime VPS   : `) + chalk.green(runtime(os.uptime())) +
chalk.whiteBright(`
❏ Platform     : `) + chalk.yellow(nou.os.type()) +
chalk.whiteBright(`
❏ Total RAM    : `) + chalk.blue(formatp(os.totalmem())) +
chalk.whiteBright(`
❏ Total Disk   : `) + chalk.cyan(`${tot.totalGb} GB`) +
chalk.whiteBright(`
❏ Total CPU    : `) + chalk.red(os.cpus().length + " Core") +
chalk.whiteBright(`
❏ Uptime Panel : `) + chalk.magenta(runtime(process.uptime())) +
chalk.whiteBright(`
❏ Respon Bot   : `) + chalk.green(latensi.toFixed(4) + " detik\n")
)
            }
        });
 
marsel.ev.on('messages.upsert', async (m) => {
    try {
        const msg = m.messages[0];
        if (!msg.message) return;
        m = await ConfigBaileys(marsel, msg);
        await loadDataBase(marsel, msg);
        const botNumber = await marsel.decodeJid(marsel.user.id)
        if (!marsel.public && m.sender !== botNumber) return;
        if (m.isBaileys) return;
        require("./marsel.js")(marsel, m, groupMetadataCache);
    } catch (err) {
        console.error("Error on message:", err);
    }
});
    marsel.public = mode.public
    
    marsel.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };
    
    marsel.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
        ? message.mtype.replace(/Message/gi, "")
        : mime.split("/")[0];
    const Randoms = Date.now()
    const fil = Randoms
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? "./library/database/Sampah/" + fil + "." + type.ext : filename;
    await fs.writeFileSync(trueFileName, buffer);

    return trueFileName;
    };
    
    
marsel.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
    } else {
        buffer = await imageToWebp(buff);
    }

    await marsel.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

    marsel.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
    } else {
        buffer = await videoToWebp(buff);
    }

    await marsel.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

marsel.sendContact = async (jid, kon, quoted = '', opts = {}) => {
		let list = []
		for (let i of kon) {
			list.push({
				displayName: `${namaOwner}`,
				vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${namaOwner}\nFN:${namaOwner}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.ADR:;;Indonesia;;;;\nitem2.X-ABLabel:Region\nEND:VCARD` //vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await marsel.getName(i + '@s.whatsapp.net')}\nFN:${await marsel.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:whatsapp@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/conn_dev\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
			})
		}
		marsel.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
	}
	
	marsel.getName = async (jid = '', withoutContact = false) => {
    try {
        jid = marsel.decodeJid(jid || '');

        withoutContact = marsel.withoutContact || withoutContact;

        let v;

        // Jika jid adalah grup
        if (jid.endsWith('@g.us')) {
            return new Promise(async (resolve) => {
                try {
                    v = marsel.chats[jid] || {};
                    if (!(v.name || v.subject)) {
                        v = await marsel.groupMetadata(jid).catch(() => ({}));
                    }

                    resolve(
                        v.name ||
                        v.subject ||
                        (typeof jid === 'string'
                            ? PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
                            : 'Unknown Group')
                    );
                } catch (err) {
                    resolve('Unknown Group');
                }
            });
        } else {

            v =
                jid === '0@s.whatsapp.net'
                    ? { jid, vname: 'WhatsApp' }
                    : areJidsSameUser(jid, marsel.user.id)
                    ? marsel.user
                    : marsel.chats[jid] || {};
        }

        // Validasi dan fallback hasil
        const safeJid = typeof jid === 'string' ? jid : '';
        const result =
            (withoutContact ? '' : v.name) ||
            v.subject ||
            v.vname ||
            v.notify ||
            v.verifiedName ||
            (safeJid && safeJid !== 'undefined' && safeJid !== ''
                ? PhoneNumber('+' + safeJid.replace('@s.whatsapp.net', '')).getNumber('international').replace(new RegExp("[()+-/ +/]", "gi"), "")
                : 'Unknown Contact');
        return result;
    } catch (error) {
        return 'Error occurred';
    }
}

}

startBot();
