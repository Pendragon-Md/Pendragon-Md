require("dotenv").config();
let gg = process.env.MODS;
if (!gg) {
  gg = "94760510568";   // මෙලෙස දිස්වෙන number එක වෙනස් නොකරන්න  // 
}
/*

██████╗░███████╗███╗░░██╗██████╗░██████╗░░█████╗░░██████╗░░█████╗░███╗░░██╗░░░░░░███╗░░░███╗██████╗░
██╔══██╗██╔════╝████╗░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗████╗░██║░░░░░░████╗░████║██╔══██╗
██████╔╝█████╗░░██╔██╗██║██║░░██║██████╔╝███████║██║░░██╗░██║░░██║██╔██╗██║█████╗██╔████╔██║██║░░██║
██╔═══╝░██╔══╝░░██║╚████║██║░░██║██╔══██╗██╔══██║██║░░╚██╗██║░░██║██║╚████║╚════╝██║╚██╔╝██║██║░░██║
██║░░░░░███████╗██║░╚███║██████╔╝██║░░██║██║░░██║╚██████╔╝╚█████╔╝██║░╚███║░░░░░░██║░╚═╝░██║██████╔╝
╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝░░╚════╝░╚═╝░░╚══╝░░░░░░╚═╝░░░░░╚═╝╚═════╝░
*/
//මෙතන හිස් තැන් වල ඔබගේ දත්ත පුරවා Bot ක්‍රියා කරන්න

global.owner = gg.split(",");
global.mongodb = process.env.MONGODB || "mongodb+srv://queenlara:Dmoa0817.@queenlara.jz3uzcg.mongodb.net/?retryWrites=true&w=majority"; 
global.sessionId = process.env.SESSION_ID || "pendragonmds";
global.prefa = process.env.PREFIX || ".";
global.tenorApiKey = process.env.TENOR_API_KEY || "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c";
global.packname = process.env.PACKNAME || `Pendragon Bot`;
global.author = process.env.AUTHOR || "by: Bk Developers";
global.port = process.env.PORT || "10000";
global.openAiAPI = process.env.OPENAI_API || "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";
global.owner = gg.split(",");

module.exports = {
  mongodb: global.mongodb,
};
