/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░
*/

const fs = require("fs");
const Jimp = require("jimp");
const moment = require("moment-timezone");
const {
  banUser, //----------------------- BAN
  checkBan, // --------------------- CHECK BAN STATUS
  unbanUser, // -------------------- UNBAN
  addMod, // ----------------------- ADD MOD
  checkMod, // --------------------- CHECK MOD STATUS
  delMod, // ----------------------- DEL MOD
  setChar, // ---------------------- SET CHAR ID
  getChar, // ---------------------- GET CHAR ID
  activateChatBot, // -------------- ACTIVATE PM CHATBOT
  checkPmChatbot, // --------------- CHECK PM CHATBOT STATUS
  deactivateChatBot, // ------------ DEACTIVATE PM CHATBOT
  setBotMode, // ------------------- SET BOT MODE
  getBotMode, // ------------------- GET BOT MODE
  banGroup, // --------------------- BAN GROUP
  checkBanGroup, //----------------- CHECK BAN STATUS OF A GROUP
  unbanGroup, // ------------------- UNBAN GROUP
} = require("../System/MongoDB/MongoDb_Core");

const {
  userData,
  groupData,
  systemData,
} = require("../System/MongoDB/MongoDB_Schema.js");

let mergedCommands = [
  "addmod",
  "setmod",
  "delmod",
  "removemod",
  "modlist",
  "mods",
  "ban",
  "banuser",
  "unban",
  "unbanuser",
  "banlist",
  "listbans",
  "setchar",
  "dmchatbot",
  "pmchatbot",
  "bangroup",
  "bangc",
  "unbangroup",
  "unbangc",
  "setbotmode",
  "mode",
];

module.exports = {
  name: "moderators",
  alias: [...mergedCommands],
  uniquecommands: [
    "addmod",
    "delmod",
    "mods",
    "ban",
    "unban",
    "banlist",
    "setchar",
    "pmchatbot",
    "bangroup",
    "unbangroup",
    "mode",
  ],
  description: "All Moderator/Owner Commands",
  start: async (
    Pendragon,
    m,
    {
      inputCMD,
      text,
      mods,
      isCreator,
      banData,
      prefix,
      db,
      isintegrated,
      doReact,
      args,
      itsMe,
      participants,
      metadata,
      mentionByTag,
      mime,
      isMedia,
      quoted,
      botNumber,
      isBotAdmin,
      groupAdmin,
      isAdmin,
      pushName,
      groupName,
    }
  ) => {
   isUsermod = await checkMod(m.sender);
        if (!isCreator && !isintegrated && !isUsermod) {
          await doReact("❌");
          return m.reply(
            "සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ මගේ *Mods* පමණි!"
          );
        }
    switch (inputCMD) {
      case "addmod":
      case "setmod":
        if (!text && !m.quoted) {
          await doReact("❌");
          return m.reply(`කරුණාකර *මොඩ්* සෑදීමට පරිශීලකයෙකු ටැග් කරන්න!`);
        }
         mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        userId = mentionedUser;
        isUsermod = await checkMod(userId);
        if (!isCreator && !isintegrated && isUsermod) {
          await doReact("❌");
          return m.reply(
            "සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ මගේ *හිමිකරුට* පමණි! *Added Mods* හට මෙම අවසරය නොමැත."
          );
        }
        if (!userId) return m.reply("කරුණාකර තහනම් කිරීමට වලංගු පරිශීලකයෙකු සඳහන් කරන්න!");

        try {
          if (isUsermod) {
            await doReact("✅");
            return Pendragon.sendMessage(
              m.from,
              {
                text: `@${userId.split("@")[0]} දැනටමත් mod ලෙස ලියාපදිංචි වී ඇත`,
                mentions: [userId],
              },
              { quoted: m }
            );
          }

          // Add user to the mods list and save to the database
          await doReact("✅");
          await addMod(userId)
            .then(() => {
              Pendragon.sendMessage(
                m.from,
                {
                  text: `@${
                    userId.split("@")[0]
                  } mods වෙත සාර්ථකව ලියාපදිංචි වී ඇත`,
                  mentions: [userId],
                },
                { quoted: m }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
        break;

      case "delmod":
      case "removemod":
        // Check if a user is mentioned
        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`කරුණාකර *mod* වෙතින් ඉවත් කිරීමට පරිශීලකයෙකු ටැග් කරන්න!`);
        }
        mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        userId = mentionedUser;
        isUsermod = await checkMod(userId);
        if (!isCreator && !isintegrated && isUsermod) {
          await doReact("❌");
          return m.reply(
            "සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ මගේ *හිමිකරුට* පමණි! *Added Mods* හට මෙම අවසරය නොමැත."
          );
        }
        if (!userId) return m.reply("කරුණාකර තහනම් කිරීමට වලංගු පරිශීලකයෙකු සඳහන් කරන්න!");

        try {
          if (!isUsermod) {
            await doReact("✅");
            return Pendragon.sendMessage(
              m.from,
              {
                text: `@${userId.split("@")[0]} මාදිලියක් ලෙස ලියාපදිංචි වී නොමැත !`,
                mentions: [userId],
              },
              { quoted: m }
            );
          }

          await delMod(userId)
            .then(() => {
              Pendragon.sendMessage(
                m.from,
                {
                  text: `@${
                    userId.split("@")[0]
                  } mods වෙත සාර්ථකව ඉවත් කර ඇත`,
                  mentions: [userId],
                },
                { quoted: m }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
        break;

      case "modlist":
      case "mods":
        await doReact("✅");
        try {
          var modlist = await userData.find({ addedMods: "true" });
          var modlistString = "";
          var ownerList = global.owner;
          modlist.forEach((mod) => {
            modlistString += `\n@${mod.id.split("@")[0]}\n`;
          });
          var mention = await modlist.map((mod) => mod.id);
          let xy = modlist.map((mod) => mod.id);
          let yz = ownerList.map((owner) => owner + "@s.whatsapp.net");
          let xyz = xy.concat(yz);

          ment = [ownerList.map((owner) => owner + "@s.whatsapp.net"), mention];
          let textM = `    🧣  *${botName} මෝඩ්ස්*  🧣\n\n`;

          if (ownerList.length == 0) {
            textM = "*කිසිදු Mods එකතු කර නැත !*";
          }

          textM += `\n〽️ *අයිතිකරුවන්* 〽️\n`;

          for (var i = 0; i < ownerList.length; i++) {
            textM += `\n〄  @${ownerList[i]}\n`;
          }

          if (modlistString != "") {
            textM += `\n🧩 *Mods එකතු කරන ලදි* 🧩\n`;
            for (var i = 0; i < modlist.length; i++) {
              textM += `\n〄  @${modlist[i].id.split("@")[0]}\n`;
            }
          }

          if (modlistString != "" || ownerList.length != 0) {
            textM += `\n\n📛 *අවහිර කිරීම වළක්වා ගැනීමට ඔවුන් අයාචිත තැපැල් කරන්න එපා!*\n\n🎀 ඕනෑම උදව්වක් සඳහා, type *${prefix}support* and ask in group.\n\n*💫 Thanks for using ${botName}. 💫*\n`;
          }

          Pendragon.sendMessage(
            m.from,
            {
              video: { url: botVideo },
              gifPlayback: true,
              caption: textM,
              mentions: xyz,
            },
            { quoted: m }
          );
        } catch (err) {
          console.log(err);
          await doReact("❌");
          return Pendragon.sendMessage(
            m.from,
            { text: `මෝඩ් ලැයිස්තුව ලබා ගැනීමේදී අභ්‍යන්තර දෝෂයක් ඇති විය.` },
            { quoted: m }
          );
        }

        break;

      case "ban":
      case "banuser":
        if (!text && !m.quoted) {
          await doReact("❌");
          return Pendragon.sendMessage(
            m.from,
            { text: `කරුණාකර පරිශීලකයෙකු *තහනම් කරන්න*!` },
            { quoted: m }
          );
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }
        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        chechBanStatus = await checkBan(userId);
        checkUserModStatus = await checkMod(userId);
        userNum = userId.split("@")[0];
        globalOwner = global.owner;
        if (checkUserModStatus == true || globalOwner.includes(userNum)) {
          await doReact("❌");
          return m.reply(`සමාවන්න, මට *හිමිකරුවෙකු* හෝ *මොඩ්* තහනම් කළ නොහැක!`);
        }
        if (chechBanStatus) {
          await doReact("✅");
          return Pendragon.sendMessage(
            m.from,
            {
              text: `@${mentionedUser.split("@")[0]} දැනටමත් *තහනම් කර ඇත* !`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        } else {
          banUser(userId).then(async () => {
            await doReact("✅");
            await Pendragon.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } *${pushName}* විසින් සාර්ථකව *තහනම් කර ඇත*`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          });
        }

        break;

      case "unban":
      case "unbanuser":
        if (!text && !m.quoted) {
          await doReact("❌");
          return m.reply(`කරුණාකර පරිශීලකයෙකු *තහනම් කරන්න* වෙත ටැග් කරන්න!`);
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }
        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        chechBanStatus = await checkBan(userId);
        if (chechBanStatus) {
          unbanUser(userId).then(async () => {
            await doReact("✅");
            await Pendragon.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } *${pushName}* විසින් සාර්ථකව *තහනම් නොකළ* කර ඇත.`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          });
        } else {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `@${mentionedUser.split("@")[0]} *තහනම් කර නැත* !`,
            mentions: [mentionedUser],
            quoted: m,
          });
        }
        break;

      case "setchar":
        if (!text) {
          await doReact("❌");
          return Pendragon.sendMessage(
            m.from,
            { text: `සැකසීමට කරුණාකර 0-2 අතර අක්ෂර අංකයක් ඇතුළත් කරන්න!` },
            { quoted: m }
          );
        }
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }

        const intinput = parseInt(text);
        if (intinput < 0 || intinput > 19) {
          await doReact("❌");
          return Pendragon.sendMessage(
            m.from,
            { text: `සැකසීමට කරුණාකර 0-2 අතර අක්ෂර අංකයක් ඇතුළත් කරන්න!` },
            { quoted: m }
          );
        }
        const botNames = [
          "Pendragon MD",
          "Queen Amdi",
          "Sew Queen",
        ];
        const botLogos = [
          "https://wallpapercave.com/wp/wp5924545.jpg", //Pendragon Md
          "https://wallpapercave.com/wp/wp11253614.jpg", //Queen Amdi
          "https://images5.alphacoders.com/126/1264439.jpg", //Sew Queen
        ];

        checkChar = await getChar();
        if (checkChar === intinput) {
          await doReact("✅");
          return Pendragon.sendMessage(
            m.from,
            {
              image: { url: botLogos[intinput] },
              caption: `අක්ෂර අංකය *${intinput}* - *${botNames[intinput]}* දැනටමත් පෙරනිමිය වේ!`,
            },
            { quoted: m }
          );
        }
        await doReact("✅");
        await setChar(intinput);
        await Pendragon.sendMessage(
          m.from,
          {
            image: { url: botLogos[intinput] },
            caption: `අක්ෂර අංකය *${intinput}* - *${botNames[intinput]}* *${pushName}* විසින් සාර්ථකව සකසා ඇත.`,
          },
          { quoted: m }
        );
        break;

      case "dmchatbot":
      case "pmchatbot":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}pmchatbot on`
          );
        }
        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }
        pmChatBotStatus = await checkPmChatbot();
        await doReact("🧩");
        if (args[0] === "on") {
          if (pmChatBotStatus) {
            await doReact("❌");
            return Pendragon.sendMessage(m.from, {
              text: `පුද්ගලික Chatbot දැනටමත් *සබල කර ඇත* !`,
              quoted: m,
            });
          } else {
            await activateChatBot();
            await m.reply(
              `*PM Chatbot* *සබල කර ඇත* සාර්ථකව ! \n\nබොට් සියලුම කතාබස් වලට PM හි පිළිතුරු දෙනු ඇත!`
            );
          }
        } else if (args[0] === "off") {
          if (!pmChatBotStatus) {
            await doReact("❌");
            return Pendragon.sendMessage(m.from, {
              text: `Private Chatbot දැනටමත් *Disabled* !`,
              quoted: m,
            });
          } else {
            await deactivateChatBot();
            await m.reply(`*PM Chatbot* *අබල කර ඇත* සාර්ථකව !`);
          }
        } else {
          await doReact("❌");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}pmchatbot on`
          );
        }

        break;

      case "bangroup":
      case "bangc":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කළ හැක්කේ කණ්ඩායම් වශයෙන් පමණි!`);
        }

        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }

        groupBanStatus = await checkBanGroup(m.from);
        if (groupBanStatus) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `මෙම කණ්ඩායම දැනටමත් *තහනම් කර ඇත* !`,
            quoted: m,
          });
        } else {
          await doReact("🧩");
          await banGroup(m.from);
          await m.reply(`*${groupName}* සාර්ථකව *තහනම් කර ඇත* !`);
        }

        break;

      case "unbangroup":
      case "unbangc":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කළ හැක්කේ කණ්ඩායම් වශයෙන් පමණි!`);
        }

        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }

        groupBanStatus = await checkBanGroup(m.from);
        if (!groupBanStatus) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `මෙම කණ්ඩායම තහනම් නොවේ!`,
            quoted: m,
          });
        } else {
          await doReact("🧩");
          await unbanGroup(m.from);
          await m.reply(`*${groupName}* සාර්ථකව *තහනම් කිරීම ඉවත් කර ඇත* !`);
        }

        break;

      case "setbotmode":
      case "mode":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `කරුණාකර *ස්වයං / පුද්ගලික / පොදු* මාදිලියේ නම් ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}mode public`
          );
        }

        chechSenderModStatus = await checkMod(m.sender);
        if (!chechSenderModStatus && !isCreator && !isintegrated) {
          await doReact("❌");
          return Pendragon.sendMessage(m.from, {
            text: `සමාවන්න, මෙම විධානය භාවිතා කළ හැක්කේ *හිමිකරුවන්* සහ *Mods* පමණි!`,
            quoted: m,
          });
        }

        chechbotMode = await getBotMode();

        if (args[0] == "self") {
          if (chechbotMode == "self") {
            await doReact("❌");
            return m.reply(
              `බොට් දැනටමත් *ස්වයං* මාදිලියේ ඇත !\n\nbot භාවිතා කළ හැක්කේ *Bot Hoster (Bot number)* හට පමණි.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("self");
            await m.reply(`බොට් *ස්වයං* ප්‍රකාරයට සකසා ඇත සාර්ථකයි !`);
          }
        } else if (args[0] == "private") {
          if (chechbotMode == "private") {
            await doReact("❌");
            return m.reply(
              `බොට් දැනටමත් *පෞද්ගලික* මාදිලියේ ඇත !\n\nbot *හිමිකරුවන් / Mods* හට පමණක් bot භාවිතා කළ හැක.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("private");
            await m.reply(`බොට් *පෞද්ගලික* ප්‍රකාරයට සකසා ඇත සාර්ථකයි !`);
          }
        } else if (args[0] == "public") {
          if (chechbotMode == "public") {
            await doReact("❌");
            return m.reply(
              `බොට් දැනටමත් *පොදු* මාදිලියේ ඇත!\n\nඕනෑම කෙනෙකුට bot භාවිතා කළ හැකිය.`
            );
          } else {
            await doReact("🧩");
            await setBotMode("public");
            await m.reply(`බොට් *පොදු* ප්‍රකාරයට සකසා ඇත සාර්ථකයි !`);
          }
        } else {
          await doReact("❌");
          return m.reply(
            `කරුණාකර *ස්වයං / පුද්ගලික / පොදු* මාදිලියේ නම් ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}mode public`
          );
        }

        break;

      default:
        break;
    }
  },
};
