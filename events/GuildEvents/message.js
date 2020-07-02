require('dotenv').config();
const Timeout = new Set();
var {MessageEmbed} = require("discord.js")

const ms = require("ms")
const db = require('quick.db')
const custom = require("../../database/models/custom");
module.exports=async(bot,message)=>{
    if(!message.guild) return;
    if(!message.guild.available) return;
    
    
        if(message.author.bot) return;
        if(!message.guild) return;

        var prefix = bot.guildPrefixes.get(message.guild.id);
        if(message.content===`<@${bot.user.id}>`) return message.channel.send(`My current prefix for this guild is \`${prefix}\`\nTo get started type \`${prefix}help\`!`);
        if(message.content===`<@!${bot.user.id}>`) return message.channel.send(`My current prefix for this guild is \`${prefix}\`\nTo get started type \`${prefix}help\`!`);
        
        if(message.content.startsWith(`<@${bot.user.id}>`)) prefix = `<@${bot.user.id}>`;
         if(message.content.startsWith(`<@!${bot.user.id}>`)) prefix = `<@!${bot.user.id}>`;
       // if(message.content.startsWith(`<@${bot.user.id}> `)) prefix = `<@${bot.user.id}> `;
       
        bot.prefix = prefix;
       
        if(!message.content.toLowerCase().startsWith(prefix)) return;
        
        if(!message.member) message.member = await message.guild.fetchMember(message);
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase()
        if(cmd.length == 0 ) return;
        var command = bot.commands.get(cmd)
        if(!command) command = bot.commands.get(bot.aliases.get(cmd));
        
        
        if(command){
            let check = db.get(`enabled_${message.guild.id}_${command.name}`)
            var checkEmbed = new MessageEmbed()
            checkEmbed.setTitle(`${command.name[0].toUpperCase() + command.name.slice(1)} has been disabled`)
            checkEmbed.setColor("RED");
            checkEmbed.setDescription(`${command.name[0].toUpperCase() + command.name.slice(1)} has been disabled on this server. Tell a server admin to re enable it.`)
            checkEmbed.setTimestamp()
            if(check==false) return message.channel.send(checkEmbed)
          
                
               
           else{
        
            

            if(command.timeout){
                if(Timeout.has(`${message.author.id}${command.name}`)){
                        var embed = new MessageEmbed()
                        embed.setTitle(`${command.name[0].toUpperCase() + command.name.slice(1)} is under cooldown!`)
                        embed.setColor("RED")
                        embed.setDescription(`You can only use this command every **${ms(command.timeout, { long: true})}**`)
                    return message.channel.send(embed)
                } else {
                    Timeout.add(`${message.author.id}${command.name}`)
                    setTimeout(()=>{
                        Timeout.delete(`${message.author.id}${command.name}`)
                    }, command.timeout)
                }
            
        
    }
            command.run(bot, message,args)
            }
        } else {
            let customCommand = await custom.find({ Guild: message.guild.id });
            let c =  customCommand.find(cc => cc.Command === cmd) || customCommand.find(cc => cc.Aliases.includes(cmd));
            console.log(c)
            if(c){
                return getData(c.Content, message)
            }
        } 
        
        

    
}
async function getData(data, message) {
    return new Promise(async(resolve, reject) =>{
        if(data){
            if(data.includes("{@author}"))
            data = data.replace("{@author}", message.member.toString());
            if(data.includes("{guild.name}"))
            data = data.replace("{guild.name}", message.guild.name)
            if(data.includes("{guild.id}"))
            data = data.replace("{guild.id}", message.guild.id)
            resolve(data)

            return message.channel.send(data, { disableMentions: 'everyone'})
            
        }
    })
}