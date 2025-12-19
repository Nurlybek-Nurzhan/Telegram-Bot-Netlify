// Helper script to get group chat ID
// Run this after adding the bot to your group and sending a message

require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN not found in .env file");
  process.exit(1);
}

async function getGroupId() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
    );
    const data = await response.json();

    if (!data.ok) {
      console.error("❌ Error:", data.description);
      return;
    }

    if (data.result.length === 0) {
      console.log("⚠️  No messages found.");
      console.log("\nTo get your group chat ID:");
      console.log("1. Add the bot to your group");
      console.log("2. Send any message in the group (e.g., 'Hello')");
      console.log("3. Run this script again\n");
      return;
    }

    console.log("\n📋 Recent chats:\n");

    const chats = new Map();

    data.result.forEach((update) => {
      const message = update.message || update.channel_post;
      if (message && message.chat) {
        const chat = message.chat;
        chats.set(chat.id, {
          id: chat.id,
          type: chat.type,
          title: chat.title || chat.first_name || "Unknown",
        });
      }
    });

    chats.forEach((chat) => {
      console.log(`📍 Chat Type: ${chat.type}`);
      console.log(`   Chat ID: ${chat.id}`);
      console.log(`   Title: ${chat.title}`);
      console.log("");
    });

    console.log(
      "✅ Copy the Chat ID of your group and update it in your .env file:\n"
    );
    console.log("TELEGRAM_CHAT_ID=<your_group_chat_id>\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

getGroupId();
