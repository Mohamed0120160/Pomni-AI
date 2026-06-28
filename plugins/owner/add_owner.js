const handler = async (m, { conn, bot }) => {
  const cmd = m.command?.toLowerCase();

  // ─── قائمة المطورين ───────────────────────────────────────────
  if (["قائمة_المطورين", "list_owners"].includes(cmd)) {
    const addedOwners = bot.config.owners.filter(o => o.added);

    if (!addedOwners.length) {
      return m.reply("📋 *لا يوجد مطورين مضافين حتى الآن.*");
    }

    const list = addedOwners
      .map((o, i) => `${i + 1}. 👤 ${o.name || "Owner"}\n    📞 ${o.jid}`)
      .join("\n\n");

    return m.reply(`📋 *قائمة المطورين المضافين:*\n\n${list}`);
  }

  // ─── إضافة / حذف: نحتاج تحديد المستخدم ──────────────────────
  let targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
  let targetJid = m.lid2jid(m.mentionedJid?.[0] || m.quoted?.sender);

  if (!targetJid || !targetLid) {
    return m.reply("⚠️ *يرجى منشن الشخص أو الرد على رسالته* ⚠️");
  }

  const user = (await conn.groupMetadata(m.chat)).participants.find(
    p =>
      p.id === targetLid ||
      p.id === m.sender ||
      p.phoneNumber === targetJid
  );

  if (!user) {
    return m.reply("⚠️ *لم يتم العثور على المستخدم في المجموعة.*");
  }

  // ─── حذف مطور ────────────────────────────────────────────────
  if (["شيل_مطور", "حذف_مطور", "remove_owner"].includes(cmd)) {
    const index = bot.config.owners.findIndex(
      o => o.jid === user.phoneNumber || o.lid === user.id
    );

    if (index === -1) {
      return m.reply("⚠️ *هذا الشخص ليس مطوراً مضافاً.*");
    }

    // منع حذف المطورين الأصليين (غير المضافين عبر الأمر)
    if (!bot.config.owners[index].added) {
      return m.reply("🚫 *لا يمكن حذف مطور أصلي من خلال هذا الأمر.*");
    }

    bot.config.owners.splice(index, 1);
    return m.reply("🗑️ *تم حذف المطور بنجاح.*");
  }

  // ─── إضافة مطور ──────────────────────────────────────────────
  const alreadyOwner = bot.config.owners.some(
    o => o.jid === user.phoneNumber || o.lid === user.id
  );

  if (alreadyOwner) {
    return m.reply("⚠️ *هذا الشخص مضاف كمطور بالفعل.*");
  }

  bot.config.owners.push({
    name: "Owner",
    jid: user.phoneNumber,
    lid: user.id,
    added: true, // علامة للتمييز بين المضافين والأصليين
  });

  m.reply("📂 *تم إضافة مطور جديد بنجاح!*");
};

handler.usage = ["اضافه-مطور", "حذف-مطور", "قائمة-المطورين"];
handler.category = "owner";
handler.command = [
  "ضيف_مطور",
  "اضافه_مطور",
  "شيل_مطور",
  "حذف_مطور",
  "قائمة_المطورين",
  // English aliases
  "add_owner",
  "remove_owner",
  "list_owners",
];
handler.owner = true;

export default handler;
                
