/*
.setTitle(response.title)
.setDescription(`**${response.prize[0].toUpperCase() + response.prize.slice(1)}**\n\n\nReact with 🎉 to enter.\nHost: <@${message.author.id}>`)

.setColor("#7289da")
.setFooter(`${response.winners} winner(s) | Ends On`)
.setTimestamp(Date.now() + ms(response.duration))
                    */

const ms = require("ms");
const {saveGiveaway, scheduleGiveaways} = require('../../utils/structures/giveaway')
const { MessageEmbed } = require("discord.js");
const Giveaways = require("../../database/models/Giveaway")
module.exports={
    name: "giveawayedit",
    aliases: ['giveaway-edit', 'edit-giveaway'],
    description: "Edit a currently running giveaway in your server!",
    usage: "[p]giveawayedit",
    category: "giveaways",
    run: async(bot, message, args) => {
        const prefix = bot.guildPrefixes.get(message.guild.id);
        let giveawayRole = message.guild.roles.cache.get(bot.db.get(`giveawayrole_${message.guild.id}`));
        if(!giveawayRole) giveawayRole = message.guild.roles.cache.find(r => r.name === "Giveaways") || message.guild.roles.highest;
        if(!message.member.permissions.has("MANAGE_GUILD")&&!message.member.roles.cache.has(giveawayRole.id)) return message.channel.send(`You must have the manage server permission or a role called **giveaways** in order to edit a giveaway`);
        try{
            message.channel.send(`Alright lets edit a giveaway! Please specify a channel mention/id/name. Rememebr this isnt a command so just respond! You have 60 seconds.`);

            const channeltoget = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                return message.channel.send("Canceled you didnt respond");
            })
            const channel = channeltoget.first().mentions.channels.first() || message.guild.channels.cache.get(channeltoget.first().content) || message.guild.channels.cache.find(c => c.name.startsWith(channeltoget.first().content));
            if(channel){
               message.channel.send(`Perfect lets edit a giveaway in <#${channel.id}>. Please provide the message id on which the giveaway is on.`);
               const messageid = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                   console.log(err);
                   return message.channel.send("Canceled you didnt respond.")
               });
               const messageID = messageid.first().content;
               channel.messages.fetch(messageID).then(async(msg)=>{
                   Giveaways.findOne({ guildId: message.guild.id, channelId: channel.id, messageId: msg.id}, async(err, data) =>{
                       if(err) throw err;
                       if(!data) return message.channel.send("Canceled no giveaways found for that message id.")
                       else if(data){
                        message.channel.send(`Found a giveaway succesfully with the message id ${msg.id}. What would you like to edit.\nOptions: \`title, prize, duration, winners\``);
                        let arr = ['title', 'prize',  'duration', 'winners'];
                        const filter = m =>{
                            if(arr.includes(m.content.toLowerCase()) && m.author.id === message.author.id) return true;
                            else return false;
                        }
                        const responses = await message.channel.awaitMessages(filter, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                            console.error(err);
                            return message.channel.send(`Canceled you havent responded.`)
                        });
                        const { content } = responses.first();
                        if(content.toLowerCase()==="title"){
                            message.channel.send(`Please provide a title`);
                            const titles = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(Err =>{
                                console.log(Err);
                                message.channel.send("Canceled you didnt respond");
                            });
                            const title = titles.first().content;
                            if(title) {
                                data.title = title;
                                data.edited = true;
                                data.isNewGiveaway = false;
                                data.save();
                                await scheduleGiveaways(bot, [data]);
                                const e = new MessageEmbed()
                                .setTitle(data.title)
                                .setDescription(`**${data.prize}**\n\n\nReact with 🎉 to enter.\nHost: ${data.host}`)
                                
                                .setColor("#7289da")
                                .setFooter(`${data.winners} winner(s) | Ends On`)
                                .setTimestamp(data.endsOn)
                                await msg.edit(e);
                                
                            }
                            return;
                        }
                        if(content.toLowerCase()==="prize"){
                            message.channel.send(`Please specify a prize.`);
                            const prizes = await message.channel.awaitMessages(mm => mm.author.id === message.author.id, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
                                console.log(err);
                                message.channel.send(`Canceled you didnt respond.`);
                            });
                           const prize = prizes.first().content;
                           if(prize){
                               data.prize = prize;
                               
                                data.edited = true;
                                data.isNewGiveaway = false;
                                data.save();
                                
                                const e = new MessageEmbed()
                                .setTitle(data.title)
                                .setDescription(`**${data.prize}**\n\n\nReact with 🎉 to enter.\nHost: ${data.host}`)
                                
                                .setColor("#7289da")
                                .setFooter(`${data.winners} winner(s) | Ends On`)
                                .setTimestamp(data.endsOn)
                                await msg.edit(e);
                           }
                        }
                       }
                   })
               }).catch(Err =>{
                   console.log(Err);
                   return message.channel.send("Canceled invalid message id.")
               })
            } else{
                return message.channel.send(`Canceled invalid channel`)
            }
        }catch(err){
            console.log(err);
        }
    }
}