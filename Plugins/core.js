/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░


██████╗░██╗░░██╗  ██████╗░███████╗██╗░░░██╗███████╗██╗░░░░░░█████╗░██████╗░███████╗██████╗░░██████╗
██╔══██╗██║░██╔╝  ██╔══██╗██╔════╝██║░░░██║██╔════╝██║░░░░░██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
██████╦╝█████═╝░  ██║░░██║█████╗░░╚██╗░██╔╝█████╗░░██║░░░░░██║░░██║██████╔╝█████╗░░██████╔╝╚█████╗░
██╔══██╗██╔═██╗░  ██║░░██║██╔══╝░░░╚████╔╝░██╔══╝░░██║░░░░░██║░░██║██╔═══╝░██╔══╝░░██╔══██╗░╚═══██╗
██████╦╝██║░╚██╗  ██████╔╝███████╗░░╚██╔╝░░███████╗███████╗╚█████╔╝██║░░░░░███████╗██║░░██║██████╔╝
╚═════╝░╚═╝░░╚═╝  ╚═════╝░╚══════╝░░░╚═╝░░░╚══════╝╚══════╝░╚════╝░╚═╝░░░░░╚══════╝╚═╝░░╚═╝╚═════╝░

*/

const fs = require("fs");
const axios = require("axios");
const path = require("path");
let mergedCommands = [
  "help",
  "panel",
  "menu",
  "sc",
  "support",
  "supportgc",
  "script",
];

module.exports = {
  name: "others",
  alias: [...mergedCommands],
  uniquecommands: ["sc", "support"],
  description: "සියලු බලතල විධාන",
  start: async (Pendragon, m, { pushName, prefix, inputCMD, doReact }) => {
    let pic = fs.readFileSync("./Assets/pendragon.jpg");
    switch (inputCMD) {

      case "support":
      case "supportgc":
        await doReact("🔰");
        let txt2 = `              🧣 *Support Group* 🧣\n\n*${botName}* ව්යාපෘතිය, සහා ඔබට උදව් කිරීමට අපි සැමවිටම සතුටු වෙමු.\n\n*Link:* ${suppLtel
        }\n\n*සටහන:* කරුණාකර සමූහය තුළ අයාචිත තැපැල් කිරීමෙන් වළකින්න, අවසරයකින් තොරව *පරිපාලකයින්ට සෘජුව* පණිවිඩ යැවීමෙන් වළකින්න. *කණ්ඩායම* තුළ උදවු ඉල්ලන්න.\n\n*Pendragon භාවිතා කිරීම ගැන ස්තුතියි.*`;
        Pendragon.sendMessage(m.from, { image: pic, caption: txt2 }, { quoted: m });
        break;

      case "help":
      case "panel":
      case "menu":
        await doReact("☃️");
        await Pendragon.sendPresenceUpdate("composing", m.from);
        function readUniqueCommands(dirPath) {
          const allCommands = [];

          const files = fs.readdirSync(dirPath);

          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              const subCommands = readUniqueCommands(filePath);
              allCommands.push(...subCommands);
            } else if (stat.isFile() && file.endsWith(".js")) {
              const command = require(filePath);

              if (Array.isArray(command.uniquecommands)) {
                const subArray = [file, ...command.uniquecommands];
                allCommands.push(subArray);
              }
            }
          }

          return allCommands;
        }

        function formatCommands(allCommands) {
          let formatted = "";

          for (const [file, ...commands] of allCommands) {
            const capitalizedFile =
              file.replace(".js", "").charAt(0).toUpperCase() +
              file.replace(".js", "").slice(1);

            formatted += `⚡   📖 *${capitalizedFile}*    ⚡\n\n`;
            //formatted += `\`\`\`${commands.join("\n")}\`\`\`\n\n\n`;
            // Adding a - before each command
            formatted += `\`\`\`${commands
              .map((cmd) => `•   ${prefix + cmd}`)
              .join("\n")}\`\`\`\n\n\n`;
          }

          return formatted.trim();
        }

        const pluginsDir = path.join(process.cwd(), "Plugins");

        const allCommands = readUniqueCommands(pluginsDir);
        const formattedCommands = formatCommands(allCommands);
        var helpText = `\nසාදරයෙන් පිලිගන්නවා *${pushName}* ,\n\nI am *${botName}*, ඔබගේ කම්මැලි WhatsApp අත්දැකීම මීළඟ මට්ටමට ගෙනයාම සඳහා සාදන ලද WhatsApp bot එකක්.\n\n*🔖 මගේ උපසර්ගය වන්නේ:*  ${prefix}\n\n${formattedCommands}\n\n\n*©️ Team BK DEVELOPERS - 2023*`;
        await Pendragon.sendMessage(
          m.from,

          { video: { url: botVideo }, gifPlayback: true, caption: helpText },
          { quoted: m }
        );

        break;
      default:
        break;
    }
  },
};
