const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
const ReactionRole = require('../../database/models/ReactionRole');
const { MessageEmbed, Message, Client } = require('discord.js');
const embed = new MessageEmbed();
module.exports = {
    name: 'rrmake',
    aliases: ['reaction-role-make'],
    description: 'Make a reaction role for your server!',
    usage: 'rrmake',
    category: 'reaction_roles',
    timeout: 10e3,
    /**
     * @param {Message} message
     * @param {Client} bot
     * @param {string[]} args
      */
     run: async(bot, message, args) =>{
         if(!message.member.permissions.has(['MANAGE_ROLES', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'])) {
             let ar = ['MANAGE_ROLES', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'];
             return message.channel.send(new MessageEmbed({
                author:{
                    icon_url: message.author.displayAvatarURL({ dynamic: true}),
                    text: `Invalid Permissions`
                },
                description: `This command requires you to have the following permissions.\n${await formatPermission(ar)}`,
            }).setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true})));
         }
         if(!message.guild.me.permissions.has(['MANAGE_ROLES', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'])) {
            let ar = ['MANAGE_ROLES', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'];
            return message.channel.send(new MessageEmbed({
               author:{
                   icon_url: message.author.displayAvatarURL({ dynamic: true}),
                   text: `Invalid Permissions`
               },
               description: `This command requires me to have the following permissions.\n${await formatPermission(ar)}`,
           }).setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true})));
        }
        await message.channel.send(`Hello, what channel would you like this to be in?`);
        const filter = m => m.author.id === message.author.id && !m.author.bot && message.member.permissions.has(['MANAGE_ROLES', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'ADD_REACTIONS']);
        let channels = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors: ['time']}).catch(err=>handleError(err, message));
        let channel = message.guild.channels.cache.get(channels.first().content) || channels.first().mentions.channels.first() || message.guild.channels.cache.find(c => c.name === channels.first().content);
        if(channel){

            await message.channel.send(`This reaction role will be in <#${channel.id}>! Please provide a color for the embed!`);
            let colors = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors: ['time']}).catch(err=>handleError(err, message));
            let color = require('discord.js').Util.resolveColor(colors.first().content);
            embed.setColor(color);
            await message.channel.send(`What description would you like for the embed? You could do {roles} if you want to display the roles by the emoji.`);
            let descriptions = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors: ['time']}).catch(err=>handleError(err, message));
            let description = descriptions.first().content;
            await message.channel.send(`What emoji would you like. Note: Unicode emojis dont work at the moment but dont worry were fixing it.`);
            const emojis = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                console.log(err);
                return message.channel.send(`Command Canceled no response was given.`)
            });
            const emoje = emojis.first().content;
            const emoji = bot.emojis.cache.get(emoje) || bot.emojis.cache.find(e => e.name === emoje) || bot.emojis.cache.get(emoje.split(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)[3]);
            if(emoji){
                await message.channel.send(`What role would you like?`);
                let roles = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors: ['time']}).catch(err=>handleError(err, message));
                const role = roles.first().mentions.roles.first() || message.guild.roles.cache.get(roles.first().content) || message.guild.roles.cache.find(c=>c.name===roles.first().content);
                if(role){
                    if(description.includes("{roles}"))
                        description = description.replace("{roles}", `${emoji.toString()} - ${role.toString()}[@\`${role.name}\`]`);
                    embed.setDescription(description)
                    embed.setAuthor(`Reaction role menu`, message.guild.iconURL({ dynamic: true}));
                    if(descriptions.first().attachments.size) embed.setImage(descriptions.first().attachments.first().url);
                    let msg = await channel.send(embed).catch(err =>{
                        message.channel.send(`Looks like im missing permission to send messages in that channel.`)
                        console.error(err);
                        return;
                    });
                    await msg.react(emoji).catch(err =>{
                        message.channel.send(`Looks like I dont have the permission to react with messages`);
                        console.error(err);
                        return;
                    })
                    let reactionrole = new ReactionRole({
                        Guild: message.guild.id,
                        Channel: channel.id,
                        Message: msg.id,
                        Emoji: emoji.id,
                        Role: role.id,
                        RemoveRole: false,
                        Active: true

                    });
                    reactionrole.save().then(console.log).catch(console.error);
                    message.channel.send(new MessageEmbed().setDescription(`Succesfully setup a reaction role to add the role ${role.toString()} with the emoji ${emoji.toString()} for [this reaction role](${msg.url})`).setColor('GREEN').setAuthor(`Reaction roles setup!`)).catch(console.error)

                } else{
                    return message.channel.send(`Command canceled. Unfound role`)
                }
            } else{
                return message.channel.send(`Invalid emoji. Command canceled.`)
            }
        } else{
            return message.channel.send(`Command canceled an invalid channel was provided`)
        }
      }
}
async function formatPermission(permissions = []){
    return permissions.map(a => `- ${a.replace("GUILD", "SERVER").split("_").map(aa=>aa[0].toUpperCase() + aa.slice(1).toLowerCase().replace(/_/g, " ").replace("Guild", "Server")).join(" ")}`).join("\n")
}
function handleError(error, message){
    
        message.channel.send(`Command canceled. No reply given`);
        console.log(`An error happened.`, error)
        return;

    
}