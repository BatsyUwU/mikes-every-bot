const ReactionRole = require('../../database/models/ReactionRole');
const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rrdel',
    aliases: ['reactionroledel'],
    description: 'Delete/Remove a reaction role!',
    category: 'reaction_roles',
    usage: '[p]rrdel <channel mention/id/name> <message id> <emoji mentions/id> <role mention/id/name>',
    timeout: 9e3,
    run: async(bot, message, args) =>{
        if(!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send(`You need the manage roles permission in order to use this command!`);
       
        if(args[0] && args[1] && args[2] && args[3]){
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[0]);
            if(typeof channel === 'undefined') return message.channel.send(`Couldn't find a channel for ${args[0]}`);
            const msg = await channel.messages.fetch(args[1]).catch(err=> { return message.channel.send('Invalid message id at ' + args[1])});
            if(!msg) return;
            if(!regex.test(args[2]) && isNaN(args[2])) return message.channel.send('Invalid emoji at ' + args[2]);
            const emoji = bot.emojis.cache.get(args.join(' ').split(regex)[3]) || bot.emojis.cache.get(args[2]);
            if(!emoji || typeof emoji === 'undefined')  return message.channel.send('Invalid emoji at ' + args[2]);
            const role = message.guild.roles.cache.get(args[3]) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args[3]);
            if(!role || typeof role === 'undefined') return message.channel.send('Invalid role at ' + args[3], { disableMentions: 'all'});
            await ReactionRole.deleteOne({
                Guild: message.guild.id,
                Role: role.id,
                Emoji: emoji.id,
                Message: msg.id,
                Channel: channel.id,
                Active: true,
                
            }).then(console.log);
            return message.channel.send(new MessageEmbed().setDescription(`Succesfully deleted the reaction role with the emoji ${emoji.toString()} and role ${role.toString()} for [this reaction role](${msg.url})`).setColor('RANDOM'))
        } else{
            return message.channel.send("Invalid Command Usage. Try\n\n```[p]rrdel <channel mention/id/name> <message id> <emoji mentions/id> <role mention/id/name>```");


        }
    }
}
/*
const reactionrole = new ReactionRole({
                                    Guild: message.guild.id,
                                    Role: role.id,
                                    Emoji: emoji.id,
                                    Message: msg.id,
                                    Channel: channel.id,
                                    Active: true,
                                    RemoveRole: false
                                });
                                */