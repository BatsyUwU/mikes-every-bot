const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
module.exports = async(bot, guild, user) =>{
   
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        
        const embed = new MessageEmbed()
           .setAuthor(`${user.tag} has been unbanned.`, `https://images.emojiterra.com/google/android-pie/512px/1f513.png`)
           .setDescription(`${user.tag}(${user.id}) has been unbanned.`)
           .setFooter(`User ID: ${user.id}`)
           .setColor("GREEN")
           .setTimestamp()
           .setThumbnail(user.displayAvatarURL({ dynamic: true}));


        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

            


    }
}