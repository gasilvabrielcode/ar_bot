const { BotkitConversation } = require("botkit");
const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");
const WelcomeData = ['Oi', 'Hello', 'tudo bem?', 'preciso de ajuda!','ola', '']

module.exports = function (controller) {
  const ONBOARDING_PROMPT = "onboarding_prompt";
  const PROFILE_DIALOG = "profile_dialog";

  const textPrompt = new TextPrompt(ONBOARDING_PROMPT);

  const profile = new WaterfallDialog(PROFILE_DIALOG, [
    async (step) => {
      return await step.prompt(ONBOARDING_PROMPT, "Qual o seu nome?");
    },
    async (step) => {
      step.values.name = step.result;
      return await step.next();
    },
    async (step) => {
      return step.endDialog(step.values);
    },
  ]);

  let onboarding = new BotkitConversation("onboarding", controller);

  onboarding.say("Olá! Sou a assistente virtual da aula remota. Tudo bem?");
  onboarding.addChildDialog(PROFILE_DIALOG, "profile");
  onboarding.say({
    text: "Com o que posso lhe ajudar?",
    quick_replies: [
      {
        title: "Biometria",
        payload: "biometria",
      },
      {
        title: "Como acessar as aulas",
        payload: "sala de aula",
      },
      {
        title: "Habilitar minha Camera",
        payload: "camera",
      }
    ],
  });

  controller.addDialog(textPrompt);
  controller.addDialog(profile);
  controller.addDialog(onboarding);

  controller.hears(
    WelcomeData,
    "message",
    async (bot, message) => {
      await bot.beginDialog("onboarding");
      console.log(message.incoming_message.channelData);
    }
  );
  controller.hears(
    ['ajuda'],
    "message",
    async (bot, message) => {
      await bot.reply(
        message,
        'Com o que posso lhe ajudar?'
      )
    }
  );
  // Para o fluxo de qualquer dialogo e função
  controller.interrupts(["ajuda"], "message", async (bot, message) => {
    bot.reply(
      message,
      "Se você ainda está tendo problemas, recomendo entrar em contato com o seu CFC. Aqui só posso lhe ajudar com a plataforma."
    );
    await bot.reply(message, {
      text: "É so clicar em uma das opções aqui!",
      quick_replies: [
        {
          title: "Como acessar as aulas",
          payload: "sala de aula",
        },
        {
          title: "Ajuda",
          payload: "help",
        },
        {
          title: "Biometria",
          payload: "biometria",
        },
        {
          title: "Habilitar minha Camera",
          payload: "camera",
        }
      ],
    });
  });
};
