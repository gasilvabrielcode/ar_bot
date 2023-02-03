const { BotkitConversation } = require("botkit");
const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = function (controller) {
  const CEP_PROMPT = "cep_prompt";
  const CEP_DIALOG = "cep_dialog";

  const textPrompt = new TextPrompt(CEP_PROMPT);

  const address = new WaterfallDialog(CEP_DIALOG, [
    async (step) => {
      return await step.prompt(CEP_PROMPT, "Qual o seu CEP?");
    },
    async (step) => {
      step.values.cep = step.result;
      var cep = step.values.cep;
      cep = cep.replace(/\.|\-/g, "");
      cep = cep.replace(/ /g, "");

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      console.log(data);
      return await step.endDialog(data);
    },
  ]);

  let cep_validadion = new BotkitConversation("cep_validadion", controller);

  cep_validadion.addChildDialog(CEP_DIALOG, "address");
  cep_validadion.say(
    "seu cep é {{vars.address.cep}} e o seu bairro é {{vars.address.bairro}} e a sua rua é {{vars.address.logradouro}}, e a sua cidade é {{vars.address.localidade}}"
  );
  cep_validadion.say("Isso foi um EXEMPLO de integração!");

  controller.addDialog(address);
  controller.addDialog(textPrompt);
  controller.addDialog(cep_validadion);

  controller.hears(["cep"], "message", async (bot, message) => {
    await bot.beginDialog("cep_validadion");
  });
  controller.hears(["icetran"], "message", async (bot, message) => {
    var reply = {
      text: "Logo do ICETRAN",
      files: [
        {
          url: "https://i.imgur.com/UyiEdfe.png",
          image: true,
        },
      ],
    };
    await bot.reply(message, reply);
  });

  // Nada para ver aqui...
  controller.hears(["rickroll"], "message", async (bot, message) => {
    await bot.reply(message, "Você disse...");
    await bot.reply(message, "Rickroll?");
    var reply = {
      text: "!!!!",
      files: [
        {
          url: "",
          image: true,
        },
      ],
    };
    await bot.reply(message, reply);
  });

  controller.hears(
    ["Ponto de encontro com as francesas"],
    "message",
    async (bot, message) => {
      await bot.reply(message, "Rua Francelina domingos de Jesus, 160");
    }
  );
};
