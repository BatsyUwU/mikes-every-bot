const db = require('quick.db');
const { MessageEmbed, UserManager, MessageReaction, User, Client } = require('discord.js');
const ReactionRole = require('../../database/models/ReactionRole')
const Ticket = require('../../database/models/ticketCommand');
const TicketConfig = require('../../database/models/ticket')
/**
 * 
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Client} bot
 */
//let ticketar = [ "🔒","🎫","✅","⛔","➕"]
let ticketar = [`🔒`, `🎫`, `✅`, `⛔`, `➕`]

module.exports = async(bot, reaction, user) =>{
    if(user.partial) await user.fetch()
    if(user.bot) return;
    if(reaction.emoji.name !== '⭐' && reaction.emoji.name !== '🎫' && !ticketar.includes(reaction.emoji.name)){
        try{
            if(reaction.message.partial) {
                if(user.bot) return;
            const fullMsg = await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            ReactionRole.findOne({ Guild: fullMsg.guild.id, Channel: fullMsg.channel.id, Message: fullMsg.id, Emoji: reaction.emoji.id, Active: true}, async(err, data) =>{
                if(err) throw err;
                if(!data) return console.log('Auser reacted but no reaction role found.');
                else if(data){
                    const role = await fullMsg.guild.roles.fetch(data.Role);
                    if(!role) return;
                    if(role.position > fullMsg.guild.me.roles.highest.position) return user.send(`I am not permitted to give you this role!`);
                    const message = await fullMsg.channel.messages.fetch(data.Message)
                    const member = await fullMsg.guild.members.fetch(user.id);
                    if(data.RemoveRole === false) {
                        if(!member.roles.cache.has(role.id)) {
                            await member.roles.add(role, `Simple reaction role`);
                            console.log(`${user.tag} has got the role ${role.name} with a reaction role`)
                        }
                       
                     } else if(data.RemoveRole === true){
                         if(member.roles.cache.has(role.id)) {
                             await member.roles.remove(role, `Simple reaction role`);
                             console.log(`${user.tag} has been removed from the role ${role.name} with a reaction role`)
                         }
                     } else{
                        if(!member.roles.cache.has(role.id)) {
                            await member.roles.add(role, `Simple reaction role`);
                            console.log(`${user.tag} has got the role ${role.name} with a reaction role`)
                        }
                       }
                }
            })
            } else{
                const fullMsg = reaction.message;
                if(user.bot) return;
                ReactionRole.findOne({ Guild: fullMsg.guild.id, Channel: fullMsg.channel.id, Message: fullMsg.id, Emoji: reaction.emoji.id, Active: true}, async(err, data) =>{
                    if(err) throw err;
                    if(!data) return console.log('A reacted but no reaction role found.');
                    else if(data){
                        const role = await fullMsg.guild.roles.fetch(data.Role);
                        if(!role) return;
                    if(role.position > fullMsg.guild.me.roles.highest.position) return user.send(`I am not permitted to give you this role!`);
                    
                        const message = await fullMsg.channel.messages.fetch(data.Message)
                        const member = await fullMsg.guild.members.fetch(user.id);
                        if(data.RemoveRole === false) {
                            if(!member.roles.cache.has(role.id)) {
                                await member.roles.add(role, `Simple reaction role`);
                                console.log(`${user.tag} has got the role ${role.name} with a reaction role`)
                            }
                           
                         } else if(data.RemoveRole === true){
                             if(member.roles.cache.has(role.id)) {
                                 await member.roles.remove(role, `Simple reaction role`);
                                 console.log(`${user.tag} has been removed from the role ${role.name} with a reaction role`)
                             }
                         } else{
                            if(!member.roles.cache.has(role.id)) {
                                await member.roles.add(role, `Simple reaction role`);
                                console.log(`${user.tag} has got the role ${role.name} with a reaction role`)
                            }
                           }
                    }
                })
            }

        }catch(err){
            console.log(err)
        }
    }
    else if(reaction.emoji.name==='⭐'){
        try{
            if(reaction.message.partial){
                const fetchedMsg = await reaction.message.fetch();
                if(reaction.partial) await reaction.fetch();

                const users = await fetchedMsg.reactions.cache.get('⭐').users.fetch();
                const totalNeededToStar = db.get(`starboardchannel_${fetchedMsg.guild.id}`);
                if(!totalNeededToStar) return;
                const totsCount = totalNeededToStar.starsCount;
                const starboard = await bot.channels.fetch(db.get(`starboardchannel_${fetchedMsg.guild.id}`).channelId);
                if(reaction.message.channel.id === starboard.id){
                   const firstuser =  fetchedMsg.reactions.cache.get('⭐').users.cache.filter(u => !u.bot).first();
                   let m = await fetchedMsg.channel.send(firstuser.toString() + " you cannot star messages in the starboard!")
                   await m.delete({ timeout: 12e3});
                   fetchedMsg.reactions.removeAll();
                   return;
                }
                const embed = new MessageEmbed()
                    .setAuthor(fetchedMsg.author.tag, fetchedMsg.author.displayAvatarURL({ dynamic: true}))
                    .setDescription(fetchedMsg.content)
                    .setColor("YELLOW")
                    .addField("**Source**", `[Jump To Message](${fetchedMsg.url})`)
                    .setFooter(`Id: ${fetchedMsg.id}`)
                    .setTimestamp()
                    
                if(fetchedMsg.attachments.size) embed.setImage(fetchedMsg.attachments.first().proxyURL)
                const alreadyThere = await starboard.messages.fetch({ limit: 100});
                const alreadytheres = alreadyThere.find(m => m.embeds[0].footer && m.embeds[0].footer.text.includes(fetchedMsg.id));
                if(alreadytheres){

                     return alreadytheres.edit(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`, embed);
                }
                if(fetchedMsg.deleted) return alreadytheres.delete();
                if(reaction.message.channel.id === starboard.id){
                    const firstuser =  fetchedMsg.reactions.cache.get('⭐').users.cache.filter(u => !u.bot).first();
                    let m = await fetchedMsg.channel.send(firstuser.toString() + " you cannot star messages in the starboard!")
                    await m.delete({ timeout: 6e3});
                    fetchedMsg.reactions.removeAll();
                    return;
                 }
                else{
                    if(users.size < totsCount) return;
                   else await starboard.send(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`, embed)
                }
                }else{
                    const fetchedMsg = reaction.message;
                    const starboard = await bot.channels.fetch(db.get(`starboardchannel_${fetchedMsg.guild.id}`));
                const embed = new MessageEmbed()
                    .setAuthor(fetchedMsg.author.tag, fetchedMsg.author.displayAvatarURL({ dynamic: true}))
                    .setDescription(fetchedMsg.content)
                    .setColor("YELLOW")
                    .addField("**Source**", `[Jump To Message](${fetchedMsg.url})`)
                    .setFooter(`Id: ${fetchedMsg.id}`)
                    .setTimestamp()
                    
                if(fetchedMsg.attachments.size) embed.setImage(fetchedMsg.attachments.first().proxyURL)
                const users = fetchedMsg.reactions.cache.get('⭐').users.cache.filter(u=>!u.bot)
                const alreadyThere = await starboard.messages.fetch({ limit: 100});
                const alreadytheres = alreadyThere.find(m => m.embeds[0].footer && m.embeds[0].footer.text.includes(fetchedMsg.id));
                if(alreadytheres) return alreadytheres.edit(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`, embed);
                if(fetchedMsg.deleted) return alreadytheres.delete();
                await starboard.send(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`, embed)
            }

        }catch(err){
            console.log(err)
        }
    } else if(reaction.emoji.name === '🎫'){
        if(reaction.message.partial){
            try{
                const fullMsg = await reaction.message.fetch().catch(console.error);
                if(reaction.partial) await reaction.fetch();
                if(user.bot) return;
                const message = fullMsg;
                const d = async() => await reaction.users.remove(user).catch(console.error);
                 const ticketcount = await Ticket.find({ Guild: fullMsg.guild.id});
                let ticketnumber;
                if(ticketcount.length) ticketnumber = await formatNumber(ticketcount.length);
                if(!ticketcount.length) ticketnumber = `0001`;
                TicketConfig.findOne({ Guild: message.guild.id, Channel: message.channel.id, Emoji: reaction.emoji.name, Message: message.id, Active: true}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return;
                    else if(data){
                        await d();
                        if(!message.guild.channels.cache.has(data.Category)) return;
                        let channel = await message.guild.channels.create(`ticket-${ticketnumber}`, {
                            topic: `${user.tag} needs help! Ticket configuration made by Mike H.`,
                            parent: data.Category,

                        }).catch(console.error);
                        await channel.updateOverwrite(message.guild.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false,
                            VIEW_CHANNEL: false
                        }).catch(console.error);
                        await channel.updateOverwrite(user, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            ADD_REACTIONS: true,
                            READ_MESSAGE_HISTORY: true
                        }).catch(console.error);
                        const ticketemojis = {
    lock: "🔒",
    ticket: "🎫",
    check: "✅",
    remove: "⛔",
    add: "➕"
}
                        let closemessage = await channel.send(`@everyone ${user.toString()}, ticket-${ticketnumber}`, {
                            embed:{
                                title: `Ticket-${ticketnumber}`,
                                description: `React with ${ticketemojis.lock} to close this ticket.\nReact with ${ticketemojis.remove} to remove a user from this ticket.\nReact with ${ticketemojis.add} to add a user to this ticket.`,
                                color: 'RANDOM',
                                footer:{
                                    text: 'Ticket bot system v1.0.0 made by Mike H.',
                                    icon_url: user.displayAvatarURL({ dynamic: true, format: 'png'})
                                }
                            }
                        }).catch(console.error);
                        await closemessage.react(ticketemojis.lock).catch(console.error);
                        await closemessage.react(ticketemojis.add).catch(console.error);
                        await closemessage.react(ticketemojis.remove).catch(console.error)
                        const ticket = new Ticket({
                            Guild: message.guild.id,
                            Channel: channel.id,
                            Resolved: false,
                            User: user.id,
                            CloseMessage: closemessage.id,
                            Category: data.Category

                        });
                        ticket.save().then(console.log).catch(console.error);
                        let mm_m = await message.channel.send(`${user.toString()} Ticket created! ${channel.toString()} \`#${channel.name}\``).catch(console.error)
                        await mm_m.delete({ timeout: 20e3}).catch(console.error);
                        
                        //let ticketar = [ "🔒","🎫","✅","⛔","➕"]
                    }
                })
            }catch(err){
                console.error(err)
            }
        } else{
            const fullMsg = reaction.message;
            if(user.bot) return;
                const message = fullMsg;
                const d = async() => await reaction.users.remove(user).catch(console.error);
                 const ticketcount = await Ticket.find({ Guild: fullMsg.guild.id});
                let ticketnumber;
                if(ticketcount.length) ticketnumber = await formatNumber(ticketcount.length+1);
                if(!ticketcount.length) ticketnumber = `0001`;
                TicketConfig.findOne({ Guild: message.guild.id, Channel: message.channel.id, Emoji: reaction.emoji.name, Message: message.id, Active: true}, async(err, data) => {
                    if(err) throw err;
                    if(!data) return;
                    else if(data){
                        await d();
                        if(!message.guild.channels.cache.has(data.Category)) return;
                        let channel = await message.guild.channels.create(`ticket-${ticketnumber}`, {
                            topic: `${user.tag} needs help! Ticket configuration made by Mike H.`,
                            parent: data.Category,

                        }).catch(console.error);
                        await channel.updateOverwrite(message.guild.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false,
                            VIEW_CHANNEL: false
                        }).catch(console.error);
                        await channel.updateOverwrite(user, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            ADD_REACTIONS: true,
                            READ_MESSAGE_HISTORY: true
                        }).catch(console.error);
                        const ticketemojis = {
    lock: "🔒",
    ticket: "🎫",
    check: "✅",
    remove: "⛔",
    add: "➕"
}
                        let closemessage = await channel.send(`@everyone ${user.toString()}, ticket-${ticketnumber}`, {
                            embed:{
                                title: `Ticket-${ticketnumber}`,
                                description: `React with ${ticketemojis.lock} to close this ticket.\nReact with ${ticketemojis.remove} to remove a user from this ticket.\n
                                React with ${ticketemojis.add} to add a user to this ticket.

                                
                                
                                `,
                                color: 'RANDOM',
                                footer:{
                                    text: 'Ticket bot system v1.0.0 made by Mike H.',
                                    icon_url: user.displayAvatarURL({ dynamic: true, format: 'png'})
                                }
                            }
                        }).catch(console.error);
                        await closemessage.react(ticketemojis.lock).catch(console.error);
                        await closemessage.react(ticketemojis.add).catch(console.error);
                        await closemessage.react(ticketemojis.remove).catch(console.error)
                        const ticket = new Ticket({
                            Guild: message.guild.id,
                            Channel: channel.id,
                            Resolved: false,
                            User: user.id,
                            CloseMessage: closemessage.id,
                            Category: data.Category

                        });
                        ticket.save().then(console.log).catch(console.error);
                        let mm_m = await message.channel.send(`${user.toString()} Ticket created! ${channel.toString()} \`#${channel.name}\``).catch(console.error)
                        await mm_m.delete({ timeout: 20e3}).catch(console.error);
                      
                        //let ticketar = [ "🔒","🎫","✅","⛔","➕"]
                    }
                })
        }
    }
    else if(reaction.emoji.name === '🔒'){
        if(reaction.partial) await reaction.fetch().catch(console.error);
/**
 * @param {MessageReaction} reaction
 */
        if(reaction.message.fetch) await reaction.message.fetch().catch(console.error)
        const message = reaction.message;
        Ticket.findOne({ Guild: message.guild.id, Channel: message.channel.id, Resolved: false,  CloseMessage: message.id, Category: message.channel.parentID}, async(err, data) =>{
            if(err) throw err;
            if(!data) return;
            else if(data){
                reaction.message.reactions.removeAll().catch(console.error);
                await message.react('✅').catch(console.error);
                await message.react('🚫')
                const ticketemojis = {
                    lock: "🔒",
                    ticket: "🎫",
                    check: "✅",
                    remove: "⛔",
                    add: "➕"
                }
                
                const reactionFilter = (reaction, userReacted) => ['✅', '🚫'].includes(reaction.emoji.name) && !userReacted.bot && userReacted.id === user.id;
                const reactions = await reaction.message.awaitReactions(reactionFilter, {max: 1, time: 60000, errors: ['time']}).catch(async(err)=>{
                    await reaction.message.reactions.removeAll().catch(console.error);
                    const closemessage = message;
                    await closemessage.react(ticketemojis.lock).catch(console.error);
                        await closemessage.react(ticketemojis.add).catch(console.error);
                        await closemessage.react(ticketemojis.remove).catch(console.error)
                        let msg_1 = await message.channel.send(`${user.toString()} You ran out of time!`);
                        await msg_1.delete({ timeout: 10e3})
                })
                const choice = reactions.get("✅") || reactions.get('🚫');
                if(choice.emoji.name === '✅'){
                    await message.channel.delete();
                    data.Resolved = true;
                    data.save();
                } else if(choice.emoji.name === '🚫'){
                    await reaction.message.reactions.removeAll().catch(console.error);
                    const closemessage = message;
                    await closemessage.react(ticketemojis.lock).catch(console.error);
                        await closemessage.react(ticketemojis.add).catch(console.error);
                        await closemessage.react(ticketemojis.remove).catch(console.error)
                }
                
            }
        })
    } else if(reaction.emoji.name === '➕'){
        if(reaction.partial) await reaction.fetch().catch(console.error);
        if(reaction.message.partial) await reaction.message.fetch().catch(console.error);
        const message = reaction.message;
        Ticket.findOne({ Guild: message.guild.id, Channel: message.channel.id, Resolved: false, CloseMessage: message.id, Category: message.channel.parentID}, async(err, data) =>{
        
        if(err) throw err;
         if(!data) return;
         else if(data){
            if(!message.guild.member(user).permissionsIn(message.channel).has('MANAGE_CHANNELS')) {
                await reaction.users.remove(user).catch(console.error);
                let m_1 = await message.channel.send(`${user.toString()} you need the manage channel permission in order to add a member to a ticket!`);
                return m_1.delete({ timeout: 12e3})
            }
            else{
                await message.channel.send(`Please provide a user id/mention/tag to add to this channel!`);
                let responses = await message.channel.awaitMessages(m => m.author.id === user.id && !m.author.bot, { max: 1, time: 60e3, errors:['time']}).catch(async(err)=>{
                    await reaction.users.remove(user).catch(console.error);
                    let mm_1 = await message.channel.send(`You haven't responded. Canceled.`);
                    return mm_1.delete({ timeout: 12e3})
                });
                const { content } = responses.first();
                const member = message.guild.members.cache.get(content) || await bot.util.getUserFromMention(content, message.guild.members) || message.guild.members.cache.find(m => m.tag === content);
                if(member){
                    await message.channel.updateOverwrite(member, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    }).catch(console.error);
                    let im = await message.channel.send(`${member.toString()} has been added onto here successfully`);
                    await im.delete({ timeout: 12e3});
                    await reaction.users.remove(user).catch(console.error);
                } else{
                    await reaction.users.remove(user).catch(console.error);
                    let mm = await message.channel.send(`Invalid member. Command canceled.`);
                    return mm.delete({ timeout: 12e3})
                }
            }
         }
        })
    } else if(reaction.emoji.name === '⛔'){
        if(reaction.partial) await reaction.fetch().catch(console.error);
        if(reaction.message.partial) await reaction.message.fetch().catch(console.error);
        const message = reaction.message;
        Ticket.findOne({ Guild: message.guild.id, Channel: message.channel.id, Resolved: false, CloseMessage: message.id, Category: message.channel.parentID}, async(err, data) =>{
        
        if(err) throw err;
         if(!data) return;
         else if(data){
            if(!message.guild.member(user).permissionsIn(message.channel).has('MANAGE_CHANNELS')) {
                await reaction.users.remove(user).catch(console.error);
                let m_1 = await message.channel.send(`${user.toString()} you need the manage channel permission in order to remove a member from a ticket!`);
                return m_1.delete({ timeout: 12e3})
            }
            else{
                await message.channel.send(`Please provide a user id/mention/tag to remove from this channel!`);
                let responses = await message.channel.awaitMessages(m => m.author.id === user.id && !m.author.bot, { max: 1, time: 60e3, errors:['time']}).catch(async(err)=>{
                    await reaction.users.remove(user).catch(console.error);
                    let mm_1 = await message.channel.send(`You haven't responded. Canceled.`);
                    return mm_1.delete({ timeout: 12e3})
                });
                const { content } = responses.first();
                const member = message.guild.members.cache.get(content) || await bot.util.getUserFromMention(content, message.guild.members) || message.guild.members.cache.find(m => m.tag === content);
                if(member){
                    await message.channel.updateOverwrite(member, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false,
                        READ_MESSAGE_HISTORY: false
                    }).catch(console.error);
                    let im = await message.channel.send(`${member.toString()} has been removed from here successfully`);
                    await im.delete({ timeout: 12e3});
                    await reaction.users.remove(user).catch(console.error);
                } else{
                    await reaction.users.remove(user).catch(console.error);
                    let mm = await message.channel.send(`Invalid member. Command canceled.`);
                    return mm.delete({ timeout: 12e3})
                }
            }
         }
        })
    }
}
async function formatNumber(number){
    if(number < 10) return `000${number}`;
    if(number >= 10 && number < 100) return `00${number}`;
    if(number >= 100 && number < 1000) return `0${number}`;
    if(number >= 1000) return `${number}`
}