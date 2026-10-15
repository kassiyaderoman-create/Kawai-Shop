const { Telegraf } = require('telegraf');

// Telegram Bot Tokeningizni kiriting (@BotFather dan olinadi)
const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const ADMIN_ID = 'YOUR_ADMIN_TELEGRAM_ID'; // Buyurtma boradigan Admin ID

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('KAWAI SHOP Do\'koniga xush kelibsiz! ✨', {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍️ Do'konni ochish", web_app: { url: "https://your-domain.com/index.html" } }]
      ]
    }
  });
});

// Mini App'dan kelgan buyurtmani ushlab olish
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.web_app_data.data);
    
    let message = `🛒 **Yangi Buyurtma!**\n\n`;
    message += `👤 **Xaridor:** ${data.user.first_name} (@${data.user.username || 'username_yoq'})\n\n`;
    message += `📦 **Mahsulotlar:**\n`;
    
    data.items.forEach((item, i) => {
      message += `${i + 1}. ${item.title} — ${item.price.toLocaleString()} so'm\n`;
    });

    message += `\n💰 **Jami narxi:** ${data.total.toLocaleString()} so'm`;
    message += `\n🚚 **Dastavka:** ~30 000 so'm (12-16 kun)`;
    message += `\n💳 **To'lov:** 50% oldindan`;

    // Adminga buyurtmani yuborish
    await ctx.telegram.sendMessage(ADMIN_ID, message, { parse_mode: 'Markdown' });

    // Xaridorga tasdiq xabari
    await ctx.reply('✅ Buyurtmangiz qabul qilindi! Operatorimiz tez orada siz bilan bog\'lanadi.');
  } catch (e) {
    console.error(e);
    ctx.reply('Xatolik yuz berdi. Qayta urinib ko\'ring.');
  }
});

bot.launch();
console.log('Bot muvaffaqiyatli ishga tushdi!');