const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");

let mergedCommands = [
  "gpt",
  "ai",
  "imagegen",
  "dalle",
];

module.exports = {
  name: "apenai",
  alias: [...mergedCommands],
  uniquecommands:["ai","dalle"],
  description: "AI විධාන",
  start: async (
    Pendragon,
    m,
    {
      inputCMD,
      text,
      doReact,
      args,
    }
  ) => {
    const configuration = new Configuration({
      apiKey: global.openAiAPI,
    });
    const openai = new OpenAIApi(configuration);

    if (global.openAiAPI == null) {
      await doReact("❌");
      return m.reply(
        "කරුණාකර ඔබගෙ Open Ai Api Key එක .env හො configuration තුල ස්තාපනය කරන්න"
      );
    }

    switch (inputCMD) {
      case "gpt":
      case "ai":
        if (!args.join(" ")) {
          await doReact("❔");
          return m.reply(`කරුණාකර පණිවිඩයක් ලබා දෙන්න!`);
        }
        await doReact("✅");

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        async function generateResponse(prompt, retries = 2) {
          try {
            const completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
            });

            console.log("API Key:", global.openAiAPI);

            return completion.data.choices[0].message.content.trim();
          } catch (error) {
            if (
              error.response &&
              error.response.status === 429 &&
              retries > 0
            ) {
              const retryAfter =
                error.response.headers["retry-after"] * 1000 || 5000;
              m.reply(
                `අනුපාත් සීමාව ඉක්මවා ඇත. නැවත් උත්සහා කරන්න ${
                  retryAfter / 1000
                } තත්පර...`
              );
              await sleep(retryAfter);
              return generateResponse(prompt, retries - 1);
            } else {
              console.error(error);
              await doReact("❌");
              return "ප්‍රතිචාරය ජනනය කිරීමේදි දෝශයක් සිදු විය Api සීමාව ඉක්මවා හෝ වැරදි Api එකක් භාවිතා කිරීම.";
            }
          }
        }

        generateResponse(text)
          .then((response) => {
            return Pendragon.sendMessage(m.from, { text: response }, { quoted: m });
          })
          .catch((error) => {
            console.error("ප්‍රතිචාර ලබා ගැනීමේ දෝශය:", error);
          });
        break;

      case "imagegen":
      case "dalle":
        if (!args.join(" ")) {
          await doReact("❔");
          return m.reply(`කරුණාකර රූප උත්පාදනය සදහා විමසුමක් සපයන්න!`);
        }
        await doReact("✅");
        async function generateImage(prompt) {
          const API_URL = "https://api.openai.com/v1/images/generations";

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${global.openAiAPI}`,
          };

          const data = {
            model: "image-alpha-001",
            prompt: prompt,
            n: 1,
            size: "256x256",
          };

          try {
            const response = await axios.post(API_URL, data, {
              headers: headers,
            });
            return response.data.data[0].url;
          } catch (error) {
            console.error("රූපය උත්පාදනය කිරීමේ දෝශය:", error);
            return null;
          }
        }

        generateImage(text)
          .then((imageUrl) => {
            if (!imageUrl) {
              return m.reply("රූප ජනනය කිරීමේදි දෝශයක් සිදු විය Api සීමාව ඉක්මවා හෝ වැරදි Api එකක් භාවිතා කිරීම.");
            }
            Pendragon.sendMessage(
              m.from,
              { image: { url: imageUrl }, caption: text },
              { quoted: m }
            );
          })
          .catch((error) => {
            console.error("රූපය ලබා ගැනිමේ දෝශය:", error);
          });
        break;

      default:
        break;
    }
  },
};
