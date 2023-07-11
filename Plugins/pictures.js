/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░
*/

const gis = require("g-i-s");
const axios = require("axios");
const hxzapi = require("hxz-api");
let mergedCommands = [
  "gig",
  "gimage",
  "googleimage",
  "image",
  "ppcouple",
  "couplepp",
  "gifsearch",
  "gif",
  "pin",
  "pinterest",
];

module.exports = {
  name: "pictures",
  alias: [...mergedCommands],
  uniquecommands:[
    "image",
    "couplepp",
    "gif",
    "pin",
  ],
  description: "පින්තූර සම්බන්ධ සියලුම විධාන",
  start: async (Pendragon, m, { inputCMD, text, doReact, prefix}) => {
    switch (inputCMD) {
      case "ppcouple":
      case "couplepp":
       await doReact("❤️");
        let imgRes = await axios.get("https://zany-teal-alligator-suit.cyclic.app/couple");
        Pendragon.sendMessage(
          m.from,
          { image: { url: imgRes.data.male }, caption: `_ඔහු වෙනුවෙන්..._` },
          { quoted: m }
        );
        Pendragon.sendMessage(
          m.from,
          { image: { url: imgRes.data.female }, caption: `_ඇය සදහා..._` },
          { quoted: m }
        );
        break;

      case "gig":
      case "gimage":
      case "googleimage":
      case "image":
        if (!text) {
          await doReact("❔");
          return m.reply(`කරුණාකර පින්තූර සෙවුම් පදයක් ලබා දෙන්න!\n\nඋදාහරණයක්: *${prefix}image cheems*`);
        }
        await doReact("🎴");
        gis(text, async (error, result) => {
          n = result;
          let images = n[Math.floor(Math.random() * n.length)].url;
          let resText = `\n_🎀 Image Search Term:_ *${text}*\n\n_🧩 Powered by_ *${botName}*\n`;
          /*
          let buttons = [
            {
                buttonId: `${prefix}gimage ${text}`,
                buttonText: { displayText: ">>" },
                type: 1,
            },
          ];
          */
          await Pendragon.sendMessage(
            m.from,
            {
              image: { url: images },
              caption: resText,
              //footer: `*${botName}*`,
              //buttons: buttons,
              //headerType: 4,
            },
            { quoted: m }
          );
        });
        break;
      case "gif":
      case "gifsearch":
        if (!text) {
          await doReact("❔")
            return m.reply(`කරුණාකර Tenor gif සෙවුම් පදයක් ලබා දෙන්න!\n\nඋදාහරණයක්: *${prefix}gif cheems bonk*`);
        }
        await doReact("🎴");
        let resGif = await axios.get(
          `https://tenor.googleapis.com/v2/search?q=${text}&key=${tenorApiKey}&client_key=my_project&limit=12&media_filter=mp4`
        );
        let resultGif = Math.floor(Math.random() * 12);
        let gifUrl = resGif.data.results[resultGif].media_formats.mp4.url;
        await Pendragon.sendMessage(
          m.from,
          {
            video: { url: gifUrl },
            gifPlayback: true,
            caption: `🎀 Gif serach result for: *${text}*\n`,
          },
          { quoted: m }
        );
        break;

      case "pin":
      case "pinterest":
        if (!text) {
          await doReact("❔")
            return m.reply(`කරුණාකර Pinterest පින්තූර සෙවුම් පදයක් ලබා දෙන්න!\n\nඋදාහරණයක්: *${prefix}pin cheems*`);
          
        }
        await doReact("📍");
        hxzapi
          .pinterest(text)
          .then(async (res) => {
            imgnyee = res[Math.floor(Math.random() * res.length)];
            /*let buttons = [
          {
            buttonId: `${prefix}pinterest ${args.join(" ")}`,
            buttonText: { displayText: ">>" },
            type: 1,
          },
        ];*/
            let txt = `\n_🎀 Pinterest Search Term:_ *${text}*\n\n_🧩 Powered by_ *${botName}*\n`;
            let buttonMessage = {
              image: { url: imgnyee },
              caption: txt,
              //footer: `*${botName}*`,
              //buttons: buttons,
              //headerType: 4,
            };
            Pendragon.sendMessage(m.from, buttonMessage, { quoted: m });
          })
          .catch((_) => _);

        break;

      default:
        break;
    }
  },
};
