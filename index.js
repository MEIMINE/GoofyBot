const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildIntegrations,
  ],
  partials: [Partials.Channel],
});

// Timer reference
let bumpTimeout;

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

// Function to start or reset bump reminder
function startBumpReminderTimer() {
  if (bumpTimeout) clearTimeout(bumpTimeout);

  bumpTimeout = setTimeout(async () => {
    const channel = await client.channels.fetch(process.env.REMINDER_CHANNEL_ID);
    if (!channel) return console.error("❌ Reminder channel not found.");

    channel.send(`<@&${process.env.REMINDER_ROLE_ID}> Bump the Server!`);
  }, 2 * 60 * 60 * 1000); // 2 hours
}

// Slash command listener (including from bots like Disboard)
client.on('interactionCreate', interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Check if it's the /bump command (usually from the Disboard bot)
  if (
    interaction.commandName === 'bump' &&
    interaction.user.bot === false // A user must trigger it
  ) {
    console.log(`📨 Detected /bump by ${interaction.user.tag}`);
    startBumpReminderTimer();
  }
});

// Optionally: start the reminder system only after bot starts
startBumpReminderTimer();

client.login(process.env.TOKEN);
