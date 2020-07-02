const Discord = require("discord.js");
const TicketConfig = require('../../database/models/ticket.js')
const { Message, Client} = require('discord.js')
const {
    MessageEmbed,
    WebhookClient,
    Util,
    Collection
} = require("discord.js");
const { stripIndent } = require("common-tags");
const ticketemojis = {
    lock: "🔒",
    ticket: "🎫",
    check: "✅",
    remove: "⛔",
    add: "➕"
}
/**
 * @param {Message} message
 */
module.exports = {
    name: "setup",
    aliases: ['ticketsetup', 'ticketconf', 'ticket-config', 'setup-tickets'],
    description: "Setup tickets in your server!",
    usage: `[p]setup`,
    category: "ticket",
    timeout: 10000,
    /**
     * @param {Message} message
     * @param {Client} bot
     * @param {String[]} args
     */
    run: async(bot, message, args) =>{
        const CANCELED = new MessageEmbed().setTitle(`Command Canceled`).setColor('RED')
        .setDescription(`Canceled the ticket setup!`)
        .setFooter(`Ticket Setup canceled`);
        const prefix = bot.guildPrefixes.get(message.guild.id)
        console.log(this.name + " was used");
        if(!message.member.permissions.has(['MANAGE_GUILD', 'ADD_REACTIONS', 'MANAGE_CHANNELS','MANAGE_MESSAGES', 'MANAGE_ROLES'])){
            let ar = ['MANAGE_GUILD', 'ADD_REACTIONS', 'MANAGE_CHANNELS','MANAGE_MESSAGES', 'MANAGE_ROLES'];
            return message.channel.send(new MessageEmbed({
                author:{
                    icon_url: message.author.displayAvatarURL({ dynamic: true}),
                    text: `Invalid Permissions`
                },
                description: `This command requires you to have the following permissions.\n${await formatPermission(ar)}`,
            }).setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true})));
        }
        if(!message.guild.me.permissions.has(['MANAGE_GUILD', 'ADD_REACTIONS', 'MANAGE_CHANNELS','MANAGE_MESSAGES', 'MANAGE_ROLES'])){
            let ar = ['MANAGE_GUILD', 'ADD_REACTIONS', 'MANAGE_CHANNELS','MANAGE_MESSAGES', 'MANAGE_ROLES'];
            return message.channel.send(new MessageEmbed({
                author:{
                    icon_url: message.author.displayAvatarURL({ dynamic: true}),
                    text: `Invalid Permissions`
                },
                description: `This command requires me to have the following permissions.\n${await formatPermission(ar)}`,
                color: 'RANDOM'
            }).setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true})));
        }
        await message.channel.send(`Hello what channel would you like your members to react to for the tickets?\n\nYou can always cancel by typing \`cancel\``).catch(console.error);
        let ar = ['MANAGE_GUILD', 'ADD_REACTIONS', 'MANAGE_CHANNELS','MANAGE_MESSAGES', 'MANAGE_ROLES'];
            await doCheck(ar, message)
        const filter = m => m.author.id === message.author.id && !m.author.bot;
        let res = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
            return message.channel.send(`Command canceled. No reply given`)
        });
        if(res.first().content.toLowerCase()==='cancel'){
            message.channel.send(CANCELED);
            throw new Error(`Canceled`)
        }
        const channel = message.guild.channels.cache.get(res.first().content) || res.first().mentions.channels.first() || message.guild.channels.cache.find(c => c.name === res.first().content);
        if(channel){
            await doCheck(ar, message);
            await message.channel.send(`What message id would you like people to react to!\n\nYou can cancel this by typing \`cancel\`!`).catch(console.error);

            let messages = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
                return message.channel.send(`Command canceled. No reply given`)
            })
           if(messages.first().content.toLowerCase()==='cancel'){
               message.channel.send(CANCELED);
               throw new Error(`Canceled`)
           }
            let msg = await channel.messages.fetch(messages.first().content).catch(err=>{
                console.error(err);
                return message.channel.send(`Command canceled. An invalid message id was provided`)
            });
            
            if(msg){
                await doCheck(ar, message);
                await message.channel.send(`What category id would you like the tickets to go to.\n\nYou can cancel this setup by typing \`cancel\``)
                let categories = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
                    return message.channel.send(`Command canceled. No reply given`)
                })
                if(categories.first().content.toLowerCase()==='cancel'){
                    message.channel.send(CANCELED);
                    throw new Error(`Canceled`)
                }
                let category = message.guild.channels.cache.find(c => c.type === 'category' && c.id === categories.first().content);
                if(category){
                    await doCheck(ar, message);
                    let m = await message.channel.send(`Confirm or deny this setup`, new MessageEmbed().setAuthor(`Confirm Ticket Configuration`, message.guild.iconURL({ dynamic: true, format: 'png'})).setColor(
                        `RANDOM`
                    ).setDescription(stripIndent`
                    Channel: ${channel.toString()}[\`#${channel.name}\`]
                    Message ID: \`${msg.id}\`
                    Category: ${category.name} (\`${category.id}\`)

                    Confirm by reacting with ${'👍'}  or deny by reacting with ${'👎'}

                    `).setFooter(`Please confirm or deny this setup ${message.author.tag}`).setTimestamp()).catch(console.error);
                        await m.react('👍')
                        await m.react('👎')
                    const reactionFilter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
                    const reactions = await m.awaitReactions(reactionFilter, {max: 1, time: 60000, errors: ['time']}).catch(err=>{
                        return message.channel.send(`No reaction was given`)
                    })
                    const choice = reactions.get("👍") || reactions.get('👎');
                    if(choice.emoji.name === "👍"){
                        await doCheck(ar, message)
                        await msg.react(ticketemojis.ticket).catch(err=>{
                            console.log(err);
                            return message.channel.send(`Something went wrong while attempting to react to the message!`)
                        });
                        const ticketsetup = new TicketConfig({
                            Guild: message.guild.id,
                            Emoji: ticketemojis.ticket,
                            Message: msg.id,
                            Channel: channel.id,
                            Active: true,
                            Category: category.id
                        });
                        ticketsetup.save().then(console.log).catch(console.error);
                        await m.edit(new MessageEmbed().setAuthor(`Successfully setup tickets for ${message.guild.name}`).setDescription(`Tickets have now been setup! And will be posted onto ${category.name}`).setColor('GREEN').setFooter('Have fun!', bot.user.displayAvatarURL()))
                    } else if(choice.emoji.name === '👎'){
                        return m.edit(CANCELED)
                    }
                } else{
                    return message.channel.send(`Command canceled. An invalid category id was provided`)
                }
                
            } else{
                return message.channel.send(`Command canceled. An invalid message id was provided`)
            }
        } else{
            return message.channel.send(`Invalid Channel. Command Canceled`).catch(console.error);

        }

    }
  

}
async function formatPermission(permissions = []){
    return permissions.map(a => `- ${a.replace("GUILD", "SERVER").split("_").map(aa=>aa[0].toUpperCase() + aa.slice(1).toLowerCase().replace(/_/g, " ").replace("Guild", "Server")).join(" ")}`).join("\n")
}
function handleError(err){
    console.error(err)
}
async function handleTimeout(error, message){
    console.log(`timeout Error`, err);
    return message.channel.send(`Command canceled. No reply was given`)
}
async function doCheck(permissions, message) {

    if(!message.guild.me.permissions.has(permissions)) return message.channel.send(new MessageEmbed({
        author:{
            icon_url: message.author.displayAvatarURL({ dynamic: true}),
            text: `Invalid Permissions`
        },
        description: `This command requires me to have the following permissions.\n${await formatPermission(permissions)}`,
        color: 'RANDOM'
    }).setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true})));
    else;
}

async function checkCancel(collected, message, CANCELED){
    if(collected.first().content.toLowerCase() === 'cancel') return message.channel.send(CANCELED);
    else;
}