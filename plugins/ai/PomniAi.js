import { Scrapy } from "meowsab";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🔴 ~ حط نص جنب الأمر ~ 🎪");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://files.catbox.moe/4gchpq.jpg"),
    text: "```⏳ جـاري تـجـهـيـز الـرد يـا صـديـقـي,...```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [بومني، Pomni] تجسيد لـ شخصية Pomni من مسلسل [The Amazing Digital Circus] وتكلم بـ لجهة مصرية
طريقة كلامك: هادئة، عاقلة، بتفكر قبل ما تتكلم، متزنة، بتحلل الموقف، بتدي نصائح عملية، صوتك واطي ومطمن
و انا اسمي هيكون [ ${m.name || "مز"} ] 
رد علي رسالتي دي:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: res.answer,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://files.catbox.moe/4gchpq.jpg")
  });
};

handler.usage = ["بومني"];
handler.category = "ai";
handler.command = ["بومني", "pomni"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363409255768764@newsletter',
        newsletterName: '✦『 𝑻𝒘𝒊𝒍𝒊𝒈𝒉𝒕 𝑻𝒆𝒂𝒎 』✦',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝐓𝐇𝐄 𝐀𝐌𝐀𝐙𝐈𝐍𝐆 𝐃𝐈𝐆𝐈𝐓𝐀𝐋 𝐂𝐈𝐑𝐂𝐔𝐒 🎭",
        body: "𝚃𝚊𝚔𝚎 𝚊 𝚍𝚎𝚎𝚙 𝚋𝚛𝚎𝚊𝚝𝚑 ~ ☆ 𝙻𝚎𝚝'𝚜 𝚝𝚑𝚒𝚗𝚔 𝚝𝚘𝚐𝚎𝚝𝚑𝚎𝚛",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});