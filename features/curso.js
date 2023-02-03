let cursoData = require("./database/curso.json"); // <-  importa os dados para os textos
let { cursoConhecimento } = require("../conhecimento/basedeconhecimento.js"); // <- import a inteligencia do bot!

module.exports = function (controller) {
  var delay = 1000;

  controller.hears(cursoConhecimento, "message", async (bot, message) => {
    for (var prop in cursoData) {
      let data = cursoData[prop];

      setTimeout(tick, delay);

      async function tick() {
        await bot.changeContext(message.reference);

        if (data.Img === true) {
          let reply = {
            text: data.text,
            files: [
              {
                url: data.ImgData.url,
                image: true,
                source: data.ImgData.source, // <- Envia link da imagem
              },
            ],
          };

          await bot.reply(message, reply);

          await bot.reply(message, { type: "typing" });
        } else if (data.Img === false) {
          await bot.reply(message, data.text);

          await bot.reply(message, { type: "typing" });
        }
      }

      delay += 2500;
    }

    setTimeout(async () => {
      await bot.changeContext(message.reference);

      await bot.reply(message, "Se você não encontrou o que buscava recomendo entrar em contato com seu CFC!");
    }, delay + 2500);
  });
};
