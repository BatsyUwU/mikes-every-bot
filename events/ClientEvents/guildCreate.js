const db = require('quick.db')
const GuildPrefix = require("../../database/models/GuildPrefix");

module.exports= async(bot, guild)=>{
    
    db.set(`prefix_${guild.id}`, process.env.PREFIX)
    bot.commands.forEach(cmd => {
        db.set(`disabled_${guild.id}_${cmd.name}`, false)
        db.set(`enabled_${guild.id}_${cmd.name}`, true)
    })
    let guildp = new GuildPrefix({
        Guild: guild.id,
        Prefix: process.env.PREFIX
    })
    bot.guildPrefixes.set(guild.id, process.env.PREFIX);
    console.log(`Just joined ${guild.name} (${guild.id}) and registered them onto our database!`)
    
    
} 
/* 
*** Enables all commands by default whenver the bot joins a server
*/