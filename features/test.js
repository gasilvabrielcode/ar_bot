const { BotkitConversation } = require("botkit");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async function (controller) {
  let cepData = "";

  let cepDialog = new BotkitConversation("cepDialog", controller);

  cepDialog.ask(
    "Qual o seu cep?",
    async (response, convo, bot, full_message) => {},
    { key: "cep" }
  );

  cepDialog.after(async (results, bot) => {
    cepData = results.cep;
  });

  controller.addDialog(cepDialog);
  // this is a text and example for future dialogs;
  controller.hears(
    ["teste"],
    ["message", "direct_message"],
    async (bot, message) => {
      await bot.reply(message, { type: "typing" });

      await bot.beginDialog("cepDialog");

      const response = await fetch(`https://viacep.com.br/ws/${cepData}/json/`)
        .then(async (response) => {
          setTimeout(async () => {
            console.log(response);
            await bot.changeContext(message.reference);

            await bot.reply(
              message,
              `Seu CEP é ${response.cep}, seu endereço é ${response.logradouro}, seu bairro é ${response.bairro}`
            );
          }, 5000);
        })
        .catch(async (err) => {
          console.log(err);
          await bot.beginDialog("cepDialog");
        });

      /*
    var offset = 0;
    data1.forEach(async(data) => {
        setTimeout(async () => {
        await bot.changeContext(message.reference);

        await bot.reply(message, data)

        await bot.reply(message, { type: 'typing' });
        }, 5000 + offset);

        offset += 1000;
    })
*/
      /*
var delay = 2000

    for(var prop in jsonData) {
        let data = jsonData[prop]

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
                       source: data.ImgData.source  // <- Envia link da imagem
                    }
                ]
            }          
    
            await bot.reply(message, reply);

            await bot.reply(message, { type: 'typing' });

           } else if(data.Img === false) {

            await bot.reply(message, data.text);

            await bot.reply(message, { type: 'typing' });

           }
        
        }
        

        delay += 2500;
    }

    setTimeout(async () => {
        await bot.changeContext(message.reference);
    
        await bot.reply(message, 'O que posso lhe ajudar agora?');

    }, delay + 2500)
   */
    }
  );
};
