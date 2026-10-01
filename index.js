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

const TOKEN = process.env.Token;

if (!TOKEN) {
    console.error('❌ Токен не найден! Добавь TOKEN в секреты GitHub.');
    process.exit(1);
}

// Папка со звуками (путь от корня проекта)
const SOUNDS_DIR = path.join(__dirname, 'Sounds');

client.once('ready', () => {
    console.log(`✅ Бот запущен: ${client.user.tag}`);
    console.log(`📁 Папка со звуками: ${SOUNDS_DIR}`);
    client.user.setActivity('!sound | звуки', { type: 0 });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!sound') {
        try {
            // Проверяем, существует ли папка
            if (!fs.existsSync(SOUNDS_DIR)) {
                message.reply(`❌ Папка Sounds не найдена по пути: ${SOUNDS_DIR}`);
                return;
            }

            // Читаем все файлы из папки
            const files = fs.readdirSync(SOUNDS_DIR).filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.mp3', '.wav', '.ogg', '.m4a', '.flac'].includes(ext);
            });

            if (files.length === 0) {
                message.reply('❌ В папке Sounds нет звуковых файлов!');
                return;
            }

            // Берём случайный файл
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const filePath = path.join(SOUNDS_DIR, randomFile);
            const fileName = path.parse(randomFile).name;

            // Отправляем файл в чат
            await message.channel.send({
                content: `Это ${fileName}`,
                files: [filePath]
            });

            console.log(`📤 Отправлен файл: ${randomFile}`);

        } catch (error) {
            console.error('❌ Ошибка:', error);
            message.reply(`❌ Ошибка при отправке: ${error.message}`);
        }
    }
});

client.login(TOKEN);
