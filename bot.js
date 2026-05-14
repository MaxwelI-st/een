// ========================================
// ええんちゃうBot - Railway / Node.js版
// ？で終わるメッセージに反応する
// ========================================

import { Client, GatewayIntentBits } from "discord.js";

// ── バリエーション（weight で出現率を調整）──
const VARIANTS = [
  { text: "ええんちゃう",                           weight: 60 },
  { text: "ええんちゃう？知らんけど",               weight: 6  },
  { text: "まあ、ええんちゃう？",                   weight: 5  },
  { text: "ええんちゃうかな〜",                     weight: 5  },
  { text: "絶対ええんちゃう！間違いないわ",         weight: 4  },
  { text: "ええんちゃう？たぶんやけど…",           weight: 4  },
  { text: "ええんちゃう。深く考えんでええって",     weight: 4  },
  { text: "ええんちゃう？（ハナホジ）",             weight: 3  },
  { text: "全然ええんちゃう！！",                   weight: 3  },
  { text: "ええんちゃう！？すごいやん！",           weight: 2  },
  { text: "……別にええんちゃう？",                  weight: 2  },
  { text: "ええんちゃう？……ホンマにええんか？",     weight: 2  },
  { text: "ええんちゃうー",                         weight: 3  },
  { text: "いいんじゃないでしょうか",               weight: 1  }, // 激レア
];

function pickVariant() {
  const total = VARIANTS.reduce((s, v) => s + v.weight, 0);
  let r = Math.random() * total;
  for (const v of VARIANTS) {
    r -= v.weight;
    if (r <= 0) return v.text;
  }
  return VARIANTS[0].text;
}

// ── 設定 ──
const TARGET_CHANNEL_ID = "1030486690856439841";
let enabled = true;

// ── Bot 起動 ──
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot起動: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // 自分自身（Bot）のメッセージは無視
  if (message.author.bot) return;

  const text = message.content.trim();

  // オンオフコマンド（どのチャンネルからでも操作可能）
  if (text === "!eenon") {
    enabled = true;
    await message.reply("✅ ええんちゃうBot オンにしたで");
    return;
  }
  if (text === "!eenoff") {
    enabled = false;
    await message.reply("😴 ええんちゃうBot オフにしたで");
    return;
  }

  // 対象チャンネル以外はスルー
  if (message.channelId !== TARGET_CHANNEL_ID) return;

  // オフの時はスルー
  if (!enabled) return;

  // 末尾が「？」か「?」で終わってるか判定
  if (text.endsWith("？") || text.endsWith("?")) {
    await message.reply(pickVariant());
  }
});

client.login(process.env.BOT_TOKEN);

// ── Render用ダミーサーバー ──
// RenderのWeb Serviceはポート(PORT)を使用しないとデプロイエラーになるため追加
import http from "http";
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running!");
}).listen(PORT, () => {
  console.log(`✅ ダミーサーバー起動 (Port: ${PORT})`);
});
