const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Loads .env file

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Liste mit RegEx-Mustern und Antworten
const responses = [
    {
      pattern: /^\s*(was|bitte was|etwas)[\s\.\?!]*$/i,
      reply: 'Deine hose ist Nass!',
    },
    {
      pattern: /^(3er|fire|dryer|geier)$/i,
      reply: 'Leck meine Eier!',
    },
    {
      pattern: /^(spy|dry|papagei|a3|3)$/i,
      reply: 'Leck mein Ei!',
    },
    {
      pattern: /^\s*(ralf schumacher|ralfschumacher)[\s\.\?!]*$/i,
      reply: (message) => `${message.author} Willst du wissen, wie viel dein Auto wert ist?`,
    },
    {
      pattern: /^\s*ralf[\s\.\?!]*$/i,
      reply: 'Schumacher?!?!',
    },
    {
      pattern: /^\s*schu[h]?[\s\.\?!]*$/i,
      reply: 'ralfmacher?!?!',
    },
    {
      pattern: /^\s*(lol|lool|so|soos)[\s\.\?!]*$/i,
      reply: 'soos',
    },
    {
      pattern: /^\s*aal[\s\.\?!]*$/i,
      reply: 'laal',
    },
];  

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const content = message.content.trim().toLowerCase();

    for (const { pattern, reply } of responses) {
        if (pattern.test(content)) {
        const response = typeof reply === 'function' ? reply(message) : reply;
        message.reply(response);
        break; // nur die erste passende Antwort senden
        }
    }
});

client.login(process.env.TOKEN);
