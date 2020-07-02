require('dotenv').config();
const Timeout = new Set();
var {MessageEmbed} = require("discord.js")

const ms = require("ms")
const db = require('quick.db')
const custom = require("../../database/models/custom");
module.exports=async(bot, oldMessage, message)=>{
    if(oldMessage.partial) await oldMessage.fetch().catch(console.error)
    if(message.partial) await message.fetch().catch(console.error)
    if(oldMessage.content === message.content) return;
    if(typeof oldMessage.content === 'undefined') oldMessage.content = `Unfound message content. Sorry about that!`
    if(!message.guild) return;
    if(!message.guild.available) return;
    let guild = message.guild;
    let channel = message.channel;

    var logsChannels = await db.fetch(`logschannel_${guild.id}`) || null;
    
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    if(typeof logsChannel === 'undefined') return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
      
        const embedEditedEtc = new MessageEmbed()
            .setAuthor(`A message has been edited!`, `https://cdn.discordapp.com/attachments/724526717040984085/727388878012547212/11949839881243335407note.svg.med.png`)
            .setColor("GREEN")
            .addField(`Old Message`, oldMessage.content, false)
            .addField(`New Message`, message.content, false)
            .addField(`Context`, `[Beam me up!](${message.url})`)
            .setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`)
            .setTimestamp(message.createdAt)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true}));   
if(message.attachments.size) embedEditedEtc.setImage(message.attachments.first().url)

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embedEditedEtc]
        })

            


    }










    //Handling messages
        if(message.author.bot) return;
        

        var prefix =  bot.guildPrefixes.get(message.guild.id)
        if(message.content.startsWith(`<@${bot.user.id}>`)) prefix = `<@${bot.user.id}>`;
       // if(message.content.startsWith(`<@!${bot.user.id}>`)) prefix = `<@!${bot.user.id}>`;
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
                        embed.setDescription(`You can only use this command every **${ms(command.timeout)}**`)
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
            custom.findOne({ Guild: message.guild.id, Command: cmd}, async(err, data) =>{
                if(err) throw err;
                if(data) {
                   if(data.Content) return getData(data.Content, message)
                }
                else return;
            })
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

            return message.channel.send(data)
            
        }
    })
}