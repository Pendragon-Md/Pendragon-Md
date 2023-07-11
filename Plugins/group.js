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
  setWelcome, // ------------------- SET WELCOME MESSAGE
  checkWelcome, // ----------------- CHECK WELCOME MESSAGE STATUS
  delWelcome, // ------------------- DELETE WELCOME MESSAGE
  setAntilink, // ------------------ SET ANTILINK
  checkAntilink, // ---------------- CHECK ANTILINK STATUS
  delAntilink, // ------------------ DELETE ANTILINK
  setGroupChatbot, // -------------- SET GROUP CHATBOT
  checkGroupChatbot, // ------------ CHECK GROUP CHATBOT STATUS
  delGroupChatbot,
} = require("../System/MongoDB/MongoDb_Core");
let mergedCommands = [
  "admins",
  "admin",
  "setgcname",
  "delete",
  "antilink",
  "welcome",
  "del",
  "demote",
  "gclink",
  "grouplink",
  "group",
  "gc",
  "groupinfo",
  "gcinfo",
  "hidetag",
  "htag",
  "leave",
  "promote",
  "remove",
  "revoke",
  "setgcdesc",
  "setppgc",
  "tagall",
  "chatbotgc",
  "antilink",
  "welcome",
];

module.exports = {
  name: "groupanagement",
  alias: [...mergedCommands],
  uniquecommands: [
    "admins",
    "setgcname",
    "delete",
    "demote",
    "gclink",
    "antilink",
    "welcome",
    "group",
    "gc",
    "gcinfo",
    "tagall",
    "hidetag",
    "leave",
    "promote",
    "remove",
    "revoke",
    "setgcdesc",
    "setppgc",
    "chatbotgc",
  ],
  description: "සියලුම ශ්‍රව්‍ය සංස්කරණ විධාන",
  start: async (
    Pendragon,
    m,
    {
      inputCMD,
      text,
      prefix,
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
    }
  ) => {
    let messageSender = m.sender;
    let quotedsender = m.quoted ? m.quoted.sender : mentionByTag[0];
    switch (inputCMD) {
      case "admins":
      case "admin":
        if (!isMedia) {
          message = m.quoted ? m.quoted.msg : "『 *පරිපාලකවරුන්ගේ අවධානයට*";
        } else {
          message =
            "『 *පරිපාලකවරුන්ගේ අවධානයට*\n\n*🎀 පණිවිඩය:* මෙය පරීක්ෂා කරන්න !";
        }
        await doReact("🏅");
        Pendragon.sendMessage(
          m.from,
          { text: message, mentions: groupAdmin },
          { quoted: m }
        );
        break;

      case "setgcname":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `කරුණාකර නව කණ්ඩායම් නමක් ලබා දෙන්න !\n\nඋදාහරණයක්: *${prefix}setgcname Bot Testing*`
          );
        }
        await doReact("🎐");

        oldGCName = metadata.subject;

        try {
          ppgc = await Pendragon.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        await Pendragon.groupUpdateSubject(m.from, text)
          .then((res) =>
            Pendragon.sendMessage(
              m.from,
              {
                image: { url: ppgc, mimetype: "image/jpeg" },
                caption: `*『 සමූහ නම යාවත්කාලීන කර ඇත*\n\n_🔶 පැරණි නම:_\n*${oldGCName}*\n\n_🔷 අලුත් නම:_\n*${text}*\n`,
              },
              { quoted: m }
            )
          )
          .catch((err) => replay(jsonformat(err)));
        break;

      case "delete":
      case "del":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(`කරුණාකර එය මැකීමට පණිවිඩයකට *පිළිතුරු දෙන්න* !`);
        }
        if (!isBotAdmin) {
          if (!m.quoted.sender.includes(botNumber)) {
            await doReact("❌");
            return m.reply(
              `සමාවන්න, *පරිපාලක* අවසරයකින් තොරව, මට මකා දැමිය හැක්කේ මගේම පණිවිඩ පමණි !`
            );
          }
          key = {
            remoteJid: m.from,
            fromMe: true,
            id: m.quoted.id,
          };
          await doReact("📛");
          await Pendragon.sendMessage(m.from, { delete: key });
        } else {
          if (!isAdmin) {
            await doReact("❌");
            return m.reply(
              `සමාවන්න, අන් අයගේ පණිවිඩ මකා දැමිය හැක්කේ *පරිපාලකයින්ට* පමණි!`
            );
          }
          key = {
            remoteJid: m.from,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender,
          };

          await Pendragon.sendMessage(m.from, { delete: key });
        }

        break;

      case "demote":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`ඔබට ඔබව පහත් කළ නොහැක !`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`කණගාටුයි, මට මාවම පහත් කළ නොහැක !`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`කරුණාකර පරිශීලකයෙකු පහත් කිරීමට ටැග් කරන්න!`);
        } else if (m.quoted) {
          mentionedUser = m.quoted.sender;
        } else {
          mentionedUser = mentionByTag[0];
        }

        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        if (!groupAdmin.includes(userId)) {
          return Pendragon.sendMessage(
            m.from,
            {
              text: `@${
                mentionedUser.split("@")[0]
              } Bot මෙම සමූහයේ *ඇඩ්මින්* නොවේ!`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }
        await doReact("📉");
        try {
          await Pendragon.groupParticipantsUpdate(m.from, [userId], "demote").then(
            (res) =>
              Pendragon.sendMessage(
                m.from,
                {
                  text: `Sorry @${
                    mentionedUser.split("@")[0]
                  } බොට්, ඔබව පහත් කර ඇත* by @${
                    messageSender.split("@")[0]
                  } !`,
                  mentions: [mentionedUser, messageSender],
                },
                { quoted: m }
              )
          );
        } catch (error) {
          await doReact("❌");
          Pendragon.sendMessage(
            m.from,
            {
              text: `පහත හෙලීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය @${
                mentionedUser.split("@")[0]
              } Bot !\n\n*දෝෂය:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        break;

      case "gclink":
      case "grouplink":
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        await doReact("🧩");
        let link = await Pendragon.groupInviteCode(m.from);
        let linkcode = `https://chat.whatsapp.com/${link}`;

        try {
          ppgc = await Pendragon.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        try {
          await Pendragon.sendMessage(
            m.from,
            {
              image: { url: ppgc, mimetype: "image/jpeg" },
              caption: `\n_🎀 කණ්ඩායමේ නම:_ *${metadata.subject}*\n\n_🧩 කණ්ඩායම් සබැඳිය:_\n${linkcode}\n`,
            },
            { quoted: m }
          );
        } catch (err) {
          Pendragon.sendMessage(
            m.from,
            { text: `${mess.botadmin}` },
            { quoted: m }
          );
        }
        break;

      case "group":
      case "gc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        await doReact("⚜️");

        if (text === "close") {
          await Pendragon.groupSettingUpdate(m.from, "announcement").then((res) =>
            m.reply(`සමූහය වසා ඇත!`)
          );
        } else if (text === "open") {
          await Pendragon.groupSettingUpdate(m.from, "not_announcement").then(
            (res) => m.reply(`Group has been opened!`)
          );
        } else {
          await Pendragon.sendMessage(
            m.from,
            {
              image: { url: botImage2 },
              caption: `\n*「 කණ්ඩායම් පණිවිඩ සැකසීම් 」*\n\nපහත විකල්පයක් තෝරන්න.\n\n*_Usage:_*\n\n*${prefix}group open*\n*${prefix}group close*\n`,
            },
            { quoted: m }
          );
        }

        break;

      case "groupinfo":
      case "gcinfo":
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කළ හැක්කේ කණ්ඩායම් වශයෙන් පමණි!`);
        }
        await doReact("🎊");
        try {
          ppgc = await Pendragon.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        participants = m.isGroup ? await metadata.participants : "";
        groupAdmins = m.isGroup
          ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
          : "";
        groupOwner = m.isGroup ? metadata.owner : "";
        desc = metadata.desc ? metadata.desc : "No Description";
        let txt = `                 *『 කණ්ඩායම් තොරතුරු 』*\n\n_🎀 කණ්ඩායමේ නම:_ *${
          metadata.subject
        }*\n\n_🧩 කණ්ඩායම් විස්තරය:_\n${desc}\n\n_👑 සමූහ හිමිකරු:_ @${
          metadata.owner.split("@")[0]
        }\n_💫 සමූහය සාදන ලද්දේ:_ *${moment(`${metadata.creation}` * 1000)
          .tz("Asia/Colombo")
          .format("DD/MM/YYYY")}*\n_📛 සම්පූර්ණ පරිපාලකයින්:_ *${
          groupAdmins.length
        }*\n_🎈 මුළු සහභාගිවන්නන්:_ *${metadata.participants.length}*\n`;

        await Pendragon.sendMessage(
          m.from,
          {
            image: { url: ppgc, mimetype: "image/jpeg" },
            caption: txt,
            mentions: [metadata.owner],
          },
          { quoted: m }
        );
        break;

      case "hidetag":
      case "htag":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isMedia) {
          message2 = m.quoted
            ? m.quoted.msg
            : args[0]
            ? args.join(" ")
            : "『 *සැමගේ අවධානයට* 』";
        } else {
          message2 =
            "『 *සැමගේ අවධානයට* 』\n\n*🎀 පණිවිඩය:* මෙය පරීක්ෂා කරන්න !";
        }

        await doReact("🎌");
        Pendragon.sendMessage(
          m.from,
          { text: message2, mentions: participants.map((a) => a.id) },
          { quoted: m }
        );
        break;

      case "leave":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        await doReact("👋");
        await Pendragon.sendMessage(m.from, {
          image: { url: "https://wallpapercave.com/wp/wp9667218.png" },
          caption: `මම ඉල්ලීම මත මෙම සමූහයෙන් ඉවත් වෙමි... \n\nහැමෝම බලාගන්න :)`,
          mentions: participants.map((a) => a.id),
          quoted: m,
        }).then(async () => {
          Pendragon.groupLeave(m.from).catch((e) => {
            Pendragon.sendMessage(
              m.from,
              { text: `දෝෂයක් සිදු විය !` },
              { quoted: m }
            );
          });
        });
        break;

      case "promote":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`ඔබ දැනටමත් මෙම සමූහයේ *ඇඩ්මින්* කෙනෙක්!`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`I am already an *Admin* of this group!`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`කරුණාකර *ප්‍රවර්ධනය* සඳහා පරිශීලකයෙකු ටැග් කරන්න!`);
        } else if (m.quoted) {
          mentionedUser = m.quoted.sender;
        } else {
          mentionedUser = mentionByTag[0];
        }

        userId = (await mentionedUser) || m.msg.contextInfo.participant;
        if (groupAdmin.includes(userId)) {
          return Pendragon.sendMessage(
            m.from,
            {
              text: `@${
                mentionedUser.split("@")[0]
              } බොට් දැනටමත් මෙම සමූහයේ *පරිපාලකයෙකි!`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }
        await doReact("💹");
        try {
          await Pendragon.groupParticipantsUpdate(m.from, [userId], "promote").then(
            (res) =>
              Pendragon.sendMessage(
                m.from,
                {
                  text: `සුභ පැතුම්  @${
                    mentionedUser.split("@")[0]
                  } Bot 🥳, ඔබ උසස් කර ඇත* by @${
                    messageSender.split("@")[0]
                  } !`,
                  mentions: [mentionedUser, messageSender],
                },
                { quoted: m }
              )
          );
        } catch (error) {
          Pendragon.sendMessage(
            m.from,
            {
              text: `පහත හෙලීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය @${
                mentionedUser.split("@")[0]
              } Bot !\n\n*දෝෂයකි:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        break;

      case "remove":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*Bot* must be *Admin* in order to use this Command!`);
        }
        if (quotedsender.includes(m.sender)) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        if (quotedsender.includes(botNumber)) {
          await doReact("❌");
          return m.reply(`මට මෙම සමූහයෙන් මා ඉවත් කළ නොහැක!`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return Pendragon.sendMessage(
            m.from,
            { text: `කරුණාකර *ඉවත් කිරීමට* පරිශීලකයෙකු ටැග් කරන්න !` },
            { quoted: m }
          );
        } else if (m.quoted) {
          var mentionedUser = m.quoted.sender;
        } else {
          var mentionedUser = mentionByTag[0];
        }

        let users = (await mentionedUser) || m.msg.contextInfo.participant;
        await doReact("⛔");
        if (groupAdmin.includes(users)) {
          return Pendragon.sendMessage(
            m.from,
            {
              text: `*විධානය ප්‍රතික්ෂේප විය !* @${
                mentionedUser.split("@")[0]
              } බොට් මෙම සමූහයේ *පරිපාලකයෙකි* එබැවින් ඔබට ඔහුව ඉවත් කිරීමට අවසර නැත !`,
              mentions: [mentionedUser],
            },
            { quoted: m }
          );
        }

        await Pendragon.groupParticipantsUpdate(m.from, [users], "remove").then(
          (res) =>
            Pendragon.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } වෙතින් සාර්ථකව *ඉවත් කර ඇත* *${metadata.subject}*`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            )
        );

        break;

      case "setppgc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }

        if (!/image/.test(mime)) {
          await doReact("❌");
          return Pendragon.sendMessage(
            m.from,
            {
              text: `ශීර්ෂ පාඨය සමඟ රූපය යවන්න/පිළිතුරු දෙන්න ${
                prefix + "setgcpp"
              } මෙම සමූහයේ Profile Pic එක වෙනස් කිරීමට.`,
            },
            { quoted: m }
          );
        }
        await doReact("🎴");

        let quotedimage = await Pendragon.downloadAndSaveMediaMessage(quoted);
        var { preview } = await generatePP(quotedimage);

        await Pendragon.query({
          tag: "iq",
          attrs: {
            to: m.from,
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [
            {
              tag: "picture",
              attrs: { type: "image" },
              content: preview,
            },
          ],
        });
        fs.unlinkSync(quotedimage);

        ppgc = await Pendragon.profilePictureUrl(m.from, "image");

        Pendragon.sendMessage(
          m.from,
          {
            image: { url: ppgc },
            caption: `\nසමූහ පැතිකඩ පින්තූරය සාර්ථකව යාවත්කාලීන කර ඇත by @${
              messageSender.split("@")[0]
            } !`,
            mentions: [messageSender],
          },
          { quoted: m }
        );

        break;

      case "setgcdesc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }

        if (!text && !m.quoted) {
          await doReact("❔");
          return Pendragon.sendMessage(
            m.from,
            { text: `කරුණාකර නව කණ්ඩායම් විස්තරයක් සපයන්න!` },
            { quoted: m }
          );
        }

        await doReact("📑");

        try {
          ppgc = await Pendragon.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }

        var newGCdesc = m.quoted ? m.quoted.msg : text;

        await Pendragon.groupUpdateDescription(m.from, newGCdesc).then((res) =>
          Pendragon.sendMessage(
            m.from,
            {
              image: { url: ppgc, mimetype: "image/jpeg" },
              caption: `*『 කණ්ඩායම් විස්තරය වෙනස් කරන ලදී 』*\n\n_🧩 නව විස්තරය:_\n*${newGCdesc}*`,
            },
            { quoted: m }
          )
        );

        break;

      case "revoke":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }

        if (m.from == "120363040838753957@g.us") {
          await doReact("❌");
          return m.reply(
            "සමාවන්න, මෙම විධානය *Pendragon Support Group* හි අවසර නැත !\n\nඔබට සහාය කණ්ඩායම් සබැඳිය වෙනස් කිරීමට අවසර නැත !"
          );
        }
        await doReact("💫");

        await Pendragon.groupRevokeInvite(m.from).then((res) =>
          Pendragon.sendMessage(
            m.from,
            { text: `කණ්ඩායම් සබැඳිය *යාවත්කාලීන කර ඇත* සාර්ථකව!` },
            { quoted: m }
          )
        );

        break;

      case "tagall":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }
        if (!isMedia) {
          var message2 = m.quoted
            ? m.quoted.msg
            : args[0]
            ? args.join(" ")
            : "No message";
        } else {
          message2 = "මෙය පරීක්ෂා කරන්න!";
        }

        let mess = `            『 *සැමගේ අවධානයට* 』
    
*⚜️ Tagged by:* @${m.sender.split("@")[0]}
            
*🧩 පණිවුඩය:* ${message2};
│\n`;
        for (let mem of participants) {
          mess += `┟ @${mem.id.split("@")[0]}\n`;
        }
        mess += `╰────────────⊰\n\n                    *ඔයාට ස්තූතියි*\n`;

        await doReact("〽️");
        Pendragon.sendMessage(
          m.from,
          { text: mess, mentions: participants.map((a) => a.id) },
          { quoted: m }
        );

        break;

      case "chatbotgc":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}chatbotgc on`
          );
        }
        chatbotGCStatus = await checkGroupChatbot(m.from);
        if (args[0] == "on") {
          if (chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Group Chatbot* දැනටමත් *සබල කර ඇත* !`);
          }
          await doReact("🧩");
          await setGroupChatbot(m.from);
          await m.reply(
            `*Group Chatbot* *සබල කර ඇත* සාර්ථකව ! \n\nබොට් සඳහන් කර ඇති පණිවිඩවලට බොට් පිළිතුරු නොදේ!`
          );
        } else if (args[0] == "off") {
          if (!chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Group Chatbot* දැනටමත් *Disabled* !`);
          }
          await doReact("🧩");
          await delGroupChatbot(m.from);
          await m.reply(`*Group Chatbot* *අබල කර ඇත* සාර්ථකව !`);
        } else {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}chatbotgc on`
          );
        }

        break;

      case "antilink":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}antilink on`
          );
        }
        antilinkStatus = await checkAntilink(m.from);
        if (args[0] == "on") {
          if (antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Antillink* දැනටමත් *සබල කර ඇත* !`);
          }
          await doReact("⚜️");
          await setAntilink(m.from);
          await m.reply(
            `*Antillink* සාර්ථකව *සබල කර ඇත* ! \n\nබොට් පණිවිඩ වලින් සියලුම සබැඳි ඉවත් කරයි!`
          );
        } else if (args[0] == "off") {
          if (!antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Antillink* දැනටමත් *Disabled* !`);
          }
          await doReact("⚜️");
          await delAntilink(m.from);
          await m.reply(`*Antillink* සාර්ථකව *අක්‍රිය කර ඇත* !`);
        } else {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණ්යක්:*\n\n${prefix}antilink on`
          );
        }

        break;

      case "welcome":
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *ඔබ* *පරිපාලක* විය යුතුය!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`මෙම විධානය භාවිතා කිරීම සඳහා *Bot* *පරිපාලක* විය යුතුය!`);
        }

        if (!text) {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාහරණයක්:*\n\n${prefix}welcome on`
          );
        }
        const welcomeStatus = await checkWelcome(m.from);
        if (args[0] == "on") {
          if (welcomeStatus) {
            await doReact("❌");
            return m.reply(`*සාදරයෙන් පිළිගනිමු* දැනටමත් *සබල කර ඇත* !`);
          }
          await doReact("🎀");
          await setWelcome(m.from);
          await m.reply(
            `*සාදරයෙන් පිළිගනිමු/ආයුබෝවන්* පණිවිඩ *සබල කර ඇත* සාර්ථකව !`
          );
        } else if (args[0] == "off") {
          if (!welcomeStatus) {
            await doReact("❌");
            return m.reply(`*සාදරයෙන් පිළිගනිමු* දැනටමත් *ආබාධිතයි* !`);
          }
          await doReact("🎀");
          await delWelcome(m.from);
          await m.reply(
            `*සාදරයෙන් පිළිගනිමු/ආයුබෝවන්* පණිවිඩ *අබල කර ඇත* සාර්ථකව !`
          );
        } else {
          await doReact("❔");
          return m.reply(
            `කරුණාකර ක්‍රියාත්මක / අක්‍රිය ක්‍රියාව ලබා දෙන්න!\n\n*උදාරණයක්:*\n\n${prefix}welcome on`
          );
        }

        break;

      default:
        break;
    }
  },
};

async function generatePP(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}
