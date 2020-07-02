

module.exports = {
    name: 'say',
    aliases: ['announce'],
    description: 'Say a message to a channel',
    usage: '[p]say <channel mention/id/name>/here> <message>',
    category: 'fun',
    timeout: 10e3,
    run: async(bot, message, args) =>{
        if(args[0] && args[1]){
            let channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
            if(args[0].toLowerCase()==='here') channel = message.channel;
            if(typeof channel == 'undefined') return message.channel.send("Invalid usage try\n\n```[p]say <channel mention/id/name>/here> <message>```")
            if(!channel.permissionsFor(message.member).has('SEND_MESSAGES')) return message.channel.send(`You dont have permission to send messages to that channel.`);
            if(args.slice(1).join(' ').includes('nigger')) return message.channel.send('You cannot say swear words.');
            if(!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send('I dont have permission to send messages in that channel');
            else {
                await channel.send(args.slice(1).join(' '), { disableMentions: 'everyone'});
                message.delete().catch(console.log)
            }
        } else{
            return message.channel.send("Invalid usage try\n\n```[p]say <channel mention/id/name>/here> <message>```")
        }
    }
}