/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░
*/

const { getRandom } = require("../System/Function");
const { webp2mp4File } = require("../System/Uploader");
const { toAudio } = require("../System/File-Converter");
const { exec } = require("child_process");
const fs = require("fs");
const PDFDocument = require("pdfkit");
let { GraphOrg } = require("../System/Uploader");

const util = require("util");
let mergedCommands = [
  "toimg",
  "toimage",
  "togif",
  "tomp4",
  "tomp3",
  "toaudio",
  "tourl",
  "topdf",
  "imgtopdf",
];

module.exports = {
  name: "converters",
  alias: [...mergedCommands],
  uniquecommands: [
    "toimg",
    "togif",
    "tomp4",
    "tomp3",
    "toaudio",
    "tourl",
    "topdf",
    "imgtopdf",
  ],
  description: "සියලුම පරිවර්තක සම්බන්ධ විධාන",
  start: async (
    Pendragon,
    m,
    { inputCMD, text, quoted, doReact, prefix, mime }
  ) => {
    switch (inputCMD) {
      case "toimg":
      case "toimage":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return m.reply(
            `*සජීවීකරනය* නොකරන ලද ස්ටිකරයකට mention දෙන්න.`
          );
        }
        await doReact("🎴");
        let mediaMess = await Pendragon.downloadAndSaveMediaMessage(quoted);
        let ran = await getRandom(".png");
        exec(`ffmpeg -i ${mediaMess} ${ran}`, (err) => {
          fs.unlinkSync(mediaMess);
          if (err) {
            Pendragon.sendMessage(
              m.from,
              {
                text: `කරුණාකර *සජීවිකරනය* නොකරන ලද sticker එකට mention ලබා දීම ! \n\n හෝ භාවිතා කරන්න *${prefix}togif* / *${prefix}tomp4*  to process *Animated* sticker !`,
              },
              { quoted: m }
            );
            return;
          }
          let buffer = fs.readFileSync(ran);
          Pendragon.sendMessage(
            m.from,
            { image: buffer, caption: `_Converted by:_  *${botName}*\n` },
            { quoted: m }
          );
          fs.unlinkSync(ran);
        });
        break;

      case "tomp4":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return reply(
            `කරුණාකර *Animation* Sticker එකකට reply දෙන්න එය වීඩියෝවක් බවට පරිවර්තනය කර ගැනිමට හැක.!`
          );
        }
        await doReact("🎴");
        let mediaMess2 = await Pendragon.downloadAndSaveMediaMessage(quoted);
        let webpToMp4 = await webp2mp4File(mediaMess2);

        await Pendragon.sendMessage(
          m.from,
          {
            video: { url: webpToMp4.result },
            caption: `_Converted by:_  *${botName}*\n`,
          },
          { quoted: m }
        );
        fs.unlinkSync(mediaMess2);
        break;

      case "togif":
        if (!m.quoted && !/webp/.test(mime)) {
          await doReact("❔");
          return m.reply(
            `කරුණාකර reply කරන්න *Animated* sticker එකකට එය it to gif ලෙස් පරිවර්තනය කර ගැනීමට හැක. !`
          );
        }
        await doReact("🎴");
        let mediaMess3 = await Pendragon.downloadAndSaveMediaMessage(quoted);
        let webpToMp42 = await webp2mp4File(mediaMess3);

        await Pendragon.sendMessage(
          m.from,
          {
            video: { url: webpToMp42.result },
            caption: `_Converted by:_  *${botName}*\n`,
            gifPlayback: true,
          },
          { quoted: m }
        );
        fs.unlinkSync(mediaMess3);

        break;

      case "tomp3":
        if (/document/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න *${prefix}tomp3*`
          );
        }
        if (!/video/.test(mime) && !/audio/.test(mime)) {
          await doReact("❌");
          return reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න *${prefix}tomp3*`
          );
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න ${prefix}tomp3`
          );
        }
        await doReact("🎶");
        let media = await quoted.download();
        await Pendragon.sendPresenceUpdate("recording", m.from);
        let audio = await toAudio(media, "mp4");
        Pendragon.sendMessage(
          m.from,
          {
            document: audio,
            mimetype: "audio/mpeg",
            fileName: `Converted By ${botName} ${m.id}.mp3`,
          },
          { quoted: m }
        );

        break;

      case "toaudio":
        if (/document/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න *${prefix}tomp3*`
          );
        }
        if (!/video/.test(mime) && !/audio/.test(mime)) {
          await doReact("❌");
          return m.reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න *${prefix}tomp3*`
          );
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `ඔබට MP3 බවට පරිවර්තනය කිරීමට අවශය වීඩියෝව/ශ්‍රවය ලෙස් පිලිතුරු දෙන්න ${prefix}tomp3`
          );
        }
        await doReact("🎶");
        let media2 = await quoted.download();
        await Pendragon.sendPresenceUpdate("recording", m.from);
        let audio2 = await toAudio(media2, "mp4");
        Pendragon.sendMessage(
          m.from,
          { audio: audio2, mimetype: "audio/mpeg" },
          { quoted: m }
        );
        break;

      case "tourl":
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(
            `Plese provide an *Image* / *Video* to generate a link! With Caption ${prefix}tourl`
          );
        }
        let media5 = await Pendragon.downloadAndSaveMediaMessage(quoted);
        if (/image/.test(mime)) {
          await doReact("🔗");
          let anu = await GraphOrg(media5);
          m.reply(`*Generated Image URL:* \n\n${util.format(anu)}\n`);
        } else if (/video/.test(mime)) {
          await doReact("▶️");
          try {
            let anu = await GraphOrg(media5);
            m.reply(`*Generated Video URL:* \n\n${util.format(anu)}\n`);
          } catch (e) {
            await doReact("❌");
            await fs.unlinkSync(media5);
            return Pendragon.sendMessage(
              m.from,
              {
                text: `*ඔයගේ video එකෙ size එක වැඩියි!*\n\n*වැඩිම video size:* 5MB`,
              },
              { quoted: m }
            );
          }
        } else {
          await doReact("❌");
          return m.reply(
            `කරුණාකර සබැදියක් ජනනය කිරීමට *පිංතුරයක් හෝ වීඩීයෝවක්* සපයන්න!`
          );
        }
        await fs.unlinkSync(media5);
        break;

      case "topdf":
      case "imgtopdf":
        if (/image/.test(mime)) {
          await doReact("📑");
          let mediaMess4 = await Pendragon.downloadAndSaveMediaMessage(quoted);

          async function generatePDF(path) {
            return new Promise((resolve, reject) => {
              const doc = new PDFDocument();

              const imageFilePath = mediaMess4.replace(/\\/g, "/");
              doc.image(imageFilePath, 0, 0, {
                width: 612, // It will make your image to horizontally fill the page - Change it as per your requirement
                align: "center",
                valign: "center",
              });

              doc.pipe(fs.createWriteStream(path));

              doc.on("end", () => {
                resolve(path);
              });

              doc.end();
            });
          }

          try {
            let randomFileName = `./${Math.floor(
              Math.random() * 1000000000
            )}.pdf`;
            const pdfPATH = randomFileName;
            await generatePDF(pdfPATH);
            pdf = fs.readFileSync(pdfPATH);

            setTimeout(async () => {
              let pdf = fs.readFileSync(pdfPATH);

              Pendragon.sendMessage(
                m.from,
                {
                  document: pdf,
                  fileName: `Converted By ${botName}.pdf`,
                },
                { quoted: m }
              );

              fs.unlinkSync(mediaMess4);
              fs.unlinkSync(pdfPATH);
            }, 1000);
          } catch (error) {
            await doReact("❌");
            console.error(error);
            return m.reply(
              `රූපය PDF බවට පරිවර්තනය කිරීමේදී දෝශයක් ඇති විය.`
            );
          }
        } else {
          await doReact("❔");
          return m.reply(`PDF බවට පරිවර්තනය කිරීම සදහා *image* එකකට පිලිතුරු ලබා දෙන්න!`);
        }
        break;

      default:
        break;
    }
  },
};
