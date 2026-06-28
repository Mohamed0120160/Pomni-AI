async function handleDevelopersList(m, conn, bot) {
    const owners = bot?.config?.owners;

    if (!Array.isArray(owners) || !owners.length) {
        return m.reply('📋 *قائمة المطورين*\n⊱⋅ ──────────── ⋅⊰\n> لا يوجد مطورين مُعرَّفين حاليًا في إعدادات البوت.');
    }

    await m.reply(`📋 *قائمة مطوّري البوت*\n⊱⋅ ──────────── ⋅⊰\n> عدد المطورين: ${owners.length}`);

    for (const owner of owners) {
        if (!owner || !owner.jid) continue;

        const num = owner.jid.split('@')[0];
        const displayName = owner.name || num;

        const caption =
            `*♡ 👨‍💻 ${displayName} ♡*\n⊱⋅ ──────────── ⋅⊰\n` +
            `> الاسم: ${displayName}\n` +
            `> الرقم: ${num}`;

        try {
            // رسالة نصية واضحة بالاسم والرقم
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

            // كرت تواصل (vCard) — يوفر أزرار "رسالة"/"حفظ جهة اتصال" أصلية من واتساب
            await conn.sendMessage(m.chat, {
                contacts: {
                    displayName,
                    contacts: [{
                        vcard:
                            `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nitem1.TEL;waid=${num}:${num}\nEND:VCARD`
                    }]
                }
            }, { quoted: m });
        } catch (e) {
            console.error('[plugins/developers.js] فشل إرسال كرت مطور:', owner.jid, e);
            // فشل إرسال كرت مطوّر واحد ما يجب يوقف باقي الكروت
        }
    }
}

const handler = async (m, { conn, bot }) => {
    try {
        return await handleDevelopersList(m, conn, bot);
    } catch (e) {
        console.error('[plugins/developers.js]', e);
        m.reply('❌ حصل خطأ أثناء تنفيذ الأمر.');
    }
};

handler.command = ['developers', 'المطورين'];
handler.category = 'info';
handler.usage = ['developers'];
handler.usePrefix = false;

export default handler;
