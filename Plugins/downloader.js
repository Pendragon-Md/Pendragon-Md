/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░
*/

const axios = require("axios");
let mergedCommands = [
  "igdl",
  "instadl",
  "fbdl",
  "facebookdl",
  "mediafiredl",
  "mediafire",
];

module.exports = {
  name: "downloader",
  alias: [...mergedCommands],
  uniquecommands: ["igdl", "fbdl", "mediafiredl"],
  description: "All file dowloader commands",
  start: async (Pendragon, m, { inputCMD, text, doReact, prefix, pushName }) => {
    switch (inputCMD) {
      case "igdl":
      case "instadl":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු instagram Reel/Video සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}igdl https://www.instagram.com/p/CP7Y4Y8J8ZU/*`
          );
        }
        if (!text.includes("instagram")) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු instagram Reel/Video සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}igdl https://www.instagram.com/p/CP7Y4Y8J8ZU/*`
          );
        }
        await doReact("📥");
        await Pendragon.sendMessage(
          m.from,
          { text: "*කරුණාකර රැඳී සිටින්න, මම ඔබේ වීඩියෝව බාගත කරමි...*" },
          { quoted: m }
        );

        try {
          const res = await axios.get(
            "https://fantox001-scrappy-api.vercel.app/instadl?url=" + text
          );
          const scrappedURL = res.data.videoUrl;

          Pendragon.sendMessage(
            m.from,
            {
              video: { url: scrappedURL },
              caption: `Downloaded by: *${botName}* \n\n_*🎀 Powered by:*Bk Developers**\n\n_*🧩 Url:*_ https://github.com/Pendragon-Md/Pendragon-Md \n`,
            },
            { quoted: m }
          );
        } catch (err) {
          await doReact("❌");
          await m.reply(
            `වීඩියෝ ප්රවේශය ප්රතික්ෂේප කර ඇත! එය පුද්ගලික හෝ වෙනත් සීමාවන් ඇත.`
          );
        }
        break;

      case "mediafiredl":
      case "mediafire":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු Mediafire සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}mediafire put_link*`
          );
        }
        if (!text.includes("mediafire.com")) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු Mediafire සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}mediafire put_link*`
          );
        }

        const MDF = await mediafireDl(text);
        if (MDF[0].size.split("MB")[0] >= 100)
          return m.reply("ගොනුව ප්‍රමාණයෙන් විශාල වැඩිය!");

        let txt = `        *『 Mediafire Downloader 』*
        
*🎀 File Name* : ${MDF[0].nama}
*🧩 File Size* : ${MDF[0].size}
*📌 File Format* : ${MDF[0].mime}

Downloading...`;

        await doReact("📥");
        await m.reply(txt);

        Pendragon.sendMessage(
          m.from,
          {
            document: { url: MDF[0].url },
            mimetype: MDF[0].mime,
            fileName: MDF[0].nama,
          },
          { quoted: m }
        );
        break;

      case "fbdl":
      case "facebookdl":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු Facebook සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}fbdl put_link*`
          );
        }
        if (!text.includes("fb") && !text.includes("facebook")) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර වලංගු Facebook සබැඳියක් සපයන්න !\n\nඋදාහරණයක්: *${prefix}fbdl put_link*`
          );
        }

        await doReact("📥");
        await m.reply(`කරුණාකර රැඳී සිටින්න, මම ඔබේ වීඩියෝව බාගත කරමි...`);
        try {
          const res = await axios.get(
            "https://fantox001-scrappy-api.vercel.app/fbdl?url=" + text
          );
          const scrappedURL = res.data.videoUrl;

          Pendragon.sendMessage(
            m.from,
            {
              video: { url: scrappedURL },
              caption: `Downloaded by: *${botName}* \n\n_*🎀 Powered by:**Bk Developers* *\n\n_*🧩 Url:*_ https://github.com/Pendragon-Md/Pendragon-Md \n`,
            },
            { quoted: m }
          );
        } catch (err) {
          await doReact("❌");
          await m.reply(
            `වීඩියෝ ප්රවේශය ප්රතික්ෂේප කර ඇත! එය පුද්ගලික හෝ හිමිකරුගේ මිතුරන්ට පමණක් එය බැලිය හැක.`
          );
        }

        break;

      default:
        break;
    }
  },
};

async function mediafireDl(url) {
  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Content-Type": "application/json",
    },
    timeout: 100000,
  });
  const $ = cheerio.load(res.data);
  const results = [];
  const link = $("a#downloadButton").attr("href");
  const size = $("a#downloadButton")
    .text()
    .replace("Download", "")
    .replace("(", "")
    .replace(")", "")
    .replace("\n", "")
    .replace("\n", "")
    .replace("                         ", "");
  const seplit = link.split("/");
  const res5 = seplit[5];
  resdl = res5.split(".");
  resdl = resdl[1];
  results.push({ res5, resdl, size, link });
  return results;
}
