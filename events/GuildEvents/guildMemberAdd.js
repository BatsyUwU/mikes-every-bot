const {
    MessageEmbed
} = require("discord.js");

module.exports = async(bot, member)=>{
    const cachedInvites = bot.guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    bot.guildInvites.set(member.guild.id, newInvites);
    try{
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const channel = member.guild.channels.cache.get(bot.db.get(`invitechannel_${message.guild.id}`));
        const totalInvites = bot.db.get(`${usedInvite.inviter.id}_${member.guild.id}`)
        if(channel){
            channel.send(`${member.toString()} joined invited by ${usedInvite.inviter.tag}, (**${totalInvites}** invites.)`)
        }
        }catch(err){
            console.log(err)
        }

}