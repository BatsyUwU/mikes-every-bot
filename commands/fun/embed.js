const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['embed-announce', 'embed-say'],
    description: 'Say a message to a channel',
    usage: '[p]embed <channel mention/id/name>/here> <message>',
    category: 'fun',
    timeout: 10e3,
    run: async(bot, message, args) =>{
        if(args[0] && args[1]){
            let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
            if(args[0].toLowerCase()==='here') channel = message.channel;
            if(typeof channel == 'undefined') return message.channel.send("Invalid usage try\n\n```[p]embed <channel mention/id/name>/here> <message>```")
            if(!channel.permissionsFor(message.member).has(['EMBED_LINKS', 'SEND_MESSAGES'])) return message.channel.send(`You dont have permission to embed links or send messages to that channel.`);
            if(args.slice(1).join(' ').includes('nigger')) return message.channel.send('You cannot say swear words.');
            if(!channel.permissionsFor(message.guild.me).has(['EMBED_LINKS', 'SEND__MESSAGES'])) return message.channel.send('I dont have permission to or send messages in that channel');
            else {
                await channel.send(new MessageEmbed().setDescription(args.slice(1).join(' ')).setColor('RANDOM'));
            message.delete()
            }
        } else{
            return message.channel.send("Invalid usage try\n\n```[p]embed <channel mention/id/name>/here> <message>```")
        }
    }
}