/*
┏╼━━━━━━━━━━━━━━━━━━╾┓
BASE : https://github.com/AlifatahFauzi
RECODE : t.me/marsellmawujadidev 
CH : https://whatsapp.com/channel/0029VbBFzoWDDmFYnclusM13
┗╼━━━━━━━━━━━━━━━━━━╾┛
*/

const chalk = require("chalk");
const fs = require("fs");

global.pairingCode = "GEBYLUCU" 
global.owner = ""
global.versiBot = "1.0"
global.namaBot = "Berviz Assisten"
global.namaOwner = "Marsellmawujadidev"
global.footer = 'https://www.instagram.com/marszlmanurung_______'

global.idSaluran = '120363419090897465@newsletter'
global.namaSaluran = 'ⓘ- 𝗔𝗯𝗼𝘂𝘁𝗠𝗿𝘀 ϟ'
global.thumnail = './thumb/berviz.jpg'

global.mess = {
 owner: "Maaf hanya untuk owners bot",
 admin: "Maaf hanya untuk admin groups",
 botAdmin: "Maaf bot harus dijadikan admin",
 group: "Maaf hanya dapat digunakan di dalam group",
 private: "Silahkan gunakan fitur di private chat",
}

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.blue(">> Update File :"), chalk.black.bgWhite(`${__filename}`))
delete require.cache[file]
require(file)
})