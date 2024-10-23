const BotService = require('./src/service/botService')
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new BotService(token)

bot.app()