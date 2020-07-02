const db = require('quick.db');

module.exports={
    name: 'starboard',
    aliases: ['star-board'],
    description: 'Set the starboard of a channel!',
    usage: '[p]starboard <channel mention/id/name> | [p]starboard create',
    category: 'configuration',
    run: async (bot, message, args)=>{
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You need admin in order to use this command");
        if(!message.guild.me.permissions.has(['MANAGE_CHANNELS', 'ADD_REACTIONS'])) return message.channel.send(`I need the manage channels permission in order to execute this command. Along with add reactions`);
        if(!args[0]) return message.channel.send(`Please specify a channel or create.`);
        if(args[0].toLowerCase()==="create"){
            const chan = await message.guild.channels.create("starboard", {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['SEND_MESSAGES']
                    }
                ]
            })
            db.set(`starboardchannel_${message.guild.id}`, chan.id);
            await message.channel.send(`Succesfully created a starboard for this server. <#${chan.id}>`);
        }
        else{
            const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first() || message.guild.channels.cache.find(c => c.name.startsWith(args[0]));
            if(!channel || typeof channel === "undefined") return message.channel.send(`Invalid Channel.`);
            else{
                db.set(`starboardchannel_${message.guild.id}`, channel.id);
                await message.channel.send(`Succesfully set the starboard channel to <#${channel.id}>`)
            }
         }
    }
}