const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Токен берётся из секретов GitHub (Settings -> Secrets and variables -> Actions)
const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error(' Токен не найден. Добавь TOKEN в настройках репозитория.');
    process.exit(1);
}

client.once('ready', () => {
    console.log(`Бот запущен: ${client.user.tag}`);
    client.user.setActivity('капец | я гений', { type: 0 });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === 'Музыка') {
        const soundsDir = './Sounds';
        if (!fs.existsSync(soundsDir)) {
            message.reply('Папка Sounds не найдена.');
            return;
        }
        const files = fs.readdirSync(soundsDir).filter(f => f.endsWith('.mp3'));
        if (files.length === 0) {
            message.reply('В папке Sounds нет звуков');
            return;
        }
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const songName = path.parse(randomFile).name;

        message.reply({
            content: `🎵 Играет: **${songName}**`,
            files: [path.join(soundsDir, randomFile)]
        });
    }
});

client.login(TOKEN);
