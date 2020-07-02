const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
module.exports = async(bot, message) =>{
    const embed = new MessageEmbed();
    var logsChannels = await db.fetch(`logschannel_${message.guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    if(typeof logsChannel === 'undefined') return;
    else if(logsChannel){
        if(message.partial) return;
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
       
        let msgEmbed;
        if(message.embeds[0])  msgEmbed = new MessageEmbed(message.embeds[0])
        let mimage = message.attachments.map(at => at.proxyURL).join(" , ") || null;
        if(!msgEmbed){
        const embed = new MessageEmbed()
       
            .setAuthor(`A message has been deleted.`, `https://cdn.discordapp.com/attachments/723332457067315220/727394822801063937/5-55818_trashcan-png-clip-art-garbage-bin-transparent-png.png`)

            .setColor("RANDOM")
            .setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
            .setDescription(`${message.author.tag} has deleted a message in <#${message.channel.id}>\n\n${mimage !== null ? "Attachements\n" + mimage : "No Attachments."}`)
            .addField(`Content`, message.content || "No Content");
        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })
    } else{
        const em = new MessageEmbed();
        var fields = msgEmbed.fields.map((field, index) => `${index + 1}) Name: ${field.name || "No Name"} Content: ${field.value || "No Content"}`).join("\n") || "No Fields"
    em.setAuthor(`Message Deleted and Embed Detected`, `https://cdn.discordapp.com/attachments/723332457067315220/727394822801063937/5-55818_trashcan-png-clip-art-garbage-bin-transparent-png.png`)
    em.setDescription(`Message deleted by ${message.author.toString()} (${message.author.id}) in ${message.channel.toString()}[\`#${message.channel.name}\`]\n\n${message.content || 'No content'}`)
    em.setColor(msgEmbed.color || "RANDOM")
    em.setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
    em.setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
    em.setTimestamp()
    em.addField(`Embed Fields`, fields || "No Fields", false)
    em.addField(`Description`, `${msgEmbed.description || "No Description"}`)
    em.addField(`Footer`, `Text: ${msgEmbed.footer ? msgEmbed.footer.text : "No Footer Text"}\nIcon: ${msgEmbed.footer !== null && msgEmbed.footer.icon_url !== null ? "[Footer Icon]" + "(" + msgEmbed.footer.icon_url + ")": "No Icon"}`)
    em.addField(`Embed Title and Author`,  `Title: ${msgEmbed.title || "No Title"}\nAuthor: ${msgEmbed.author ? msgEmbed.author.name : "No Author"}`)
    em.addField(`Embed Links`, `Image: ${msgEmbed.image !== null && msgEmbed.image ? "[Click Here]" + "(" + msgEmbed.image.url + ")": "No Image url"}\nTitle Url: ${msgEmbed.url ? "[Click Here]" + "(" + msgEmbed.url + ")" : "No Url"}\nThumbnail: ${msgEmbed.thumbnail ? "[Click Here]" + "(" + msgEmbed.thumbnail.url + ")" : "No Thumbnail"}`)

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [em]
        })
    }
            



}}
