const Giveaway = require("../../database/models/Giveaway");
const schedule = require("node-schedule")
// const newGiveaway = await Giveaway.findOne({ channelId: giveaways[i].channelId, messageId: giveaways[i].messageId})
                            
const {MessageEmbed} = require("discord.js")
async function saveGiveaway(response) {
    const {
        title, prize, winners, duration, guildId, messageId, channelId, endsOn, host, isNewGiveaway, edited
    } = response;

    const giveaway = new Giveaway({
        title,
        prize, 
        winners,
        duration, 
        guildId, 
        messageId, 
        channelId, 
        endsOn,
        host,
        edited: edited,
        isNewGiveaway: isNewGiveaway,
        createdOn: new Date(),
    });
    return giveaway.save();
}
/*
const { channelId, messageId, endsOn, prize, host } = giveaways[i];
        console.log('Scheduling job for ' + endsOn);
        schedule.scheduleJob(endsOn, async () => {
            const channel = await client.channels.fetch(channelId)
            if (channel) {
                const message = await channel.messages.fetch(messageId);

                if(message) {
                    const { embeds, reactions} = message;
                    const reaction = reactions.cache.get("🎉");
                    const users = await reaction.users.fetch();
                    const entries = users.filter(user => !user.bot).array();
                    const winner = entries[0];

                    if(embeds.length === 1){
                        const embed = embeds[0];
                        let winners = determineWinners(entries, giveaways[i].winners)
                        winners = winners.map(user => user.toString()).join(', ')
                        embed.setTitle(`This giveaway has now ended!`)
                        embed.setDescription(`${prize}\n\n\nWinner(s): ${winners}\nHost: ${host}`)
                        embed.setColor(embed.color)
                        embed.setFooter(`This giveaway ended at`)
                        embed.setTimestamp()
                        const v = new MessageEmbed()
                        v.setDescription(`[Giveaway Link](https://discord.com/channels/${message.guild.id}/${channelId}/${message.id})`)
                        v.setColor(embed.color)
                        await message.edit(embed)
                        await message.channel.send(`Congrats ${winners} you won the giveaway for **${prize}**!`, v)
                    }
                }
            }
        })
        */
async function scheduleGiveaways(client, giveaways){
   for(let i = 0; i < giveaways.length; i++){
        if((await Giveaway.findOne({ guildId: giveaways[i].guildId, channelId: giveaways[i].channelId, messageId: giveaways[i].messageId })).edited == true){
           const newGiveaway = await Giveaway.findOne({ guildId: giveaways[i].guildId, messageId: giveaways[i].messageId, channelId: giveaways[i].channelId});

            const { channelId, messageId, endsOn, prize, host } = newGiveaway;
        console.log('Scheduling job for ' + endsOn);
        schedule.scheduleJob(endsOn, async () => {
            const channel = await client.channels.fetch(channelId)
            if (channel) {
                const message = await channel.messages.fetch(messageId);

                if(message) {
                    const { embeds, reactions} = message;
                    const reaction = reactions.cache.get("🎉");
                    const users = await reaction.users.fetch();
                    const entries = users.filter(user => !user.bot).array();
                    const winner = entries[0];

                    if(embeds.length === 1){
                        const embed = embeds[0];
                        let winners = determineWinners(entries, giveaways[i].winners)
                        winners = winners.map(user => user.toString()).join(', ')
                        embed.setTitle(`This giveaway has now ended!`)
                        embed.setDescription(`${prize}\n\n\nWinner(s): ${winners}\nHost: ${host}`)
                        embed.setColor(embed.color)
                        embed.setFooter(`This giveaway ended at`)
                        embed.setTimestamp()
                        const v = new MessageEmbed()
                        v.setDescription(`[Giveaway Link](https://discord.com/channels/${message.guild.id}/${channelId}/${message.id})`)
                        v.setColor(embed.color)
                        await message.edit(embed)
                        await message.channel.send(`Congrats ${winners} you won the giveaway for **${prize}**!`, v)
                    }
                }
            }
        })
        } else{
            const { channelId, messageId, endsOn, prize, host } = giveaways[i];
            console.log('Scheduling job for ' + endsOn);
            schedule.scheduleJob(endsOn, async () => {
                const channel = await client.channels.fetch(channelId)
                if (channel) {
                    const message = await channel.messages.fetch(messageId);
    
                    if(message) {
                        const { embeds, reactions} = message;
                        const reaction = reactions.cache.get("🎉");
                        const users = await reaction.users.fetch();
                        const entries = users.filter(user => !user.bot).array();
                        const winner = entries[0];
                        
                        if(embeds.length === 1){
                            const embed = embeds[0];
                            if(entries.length <= 0) {
                                embed.setTitle(`No winners have been found :(`)
                                embed.setDescription(`Looks like i could'nt find a winner for this giveaway ):`)
                                embed.setColor('BLURPLE')
                                embed.setFooter(`Hey, since no one won maybe ill take the prize for myself hehe`)
                            return message.edit(embed)
                            }
                            let winners = determineWinners(entries, giveaways[i].winners)
                            winners = winners.map(user => user.toString()).join(', ')
                            embed.setTitle(`This giveaway has now ended!`)
                            embed.setDescription(`${prize}\n\n\nWinner(s): ${winners}\nHost: ${host}`)
                            embed.setColor(embed.color)
                            embed.setFooter(`This giveaway ended at`)
                            embed.setTimestamp()
                            const v = new MessageEmbed()
                            v.setDescription(`[Giveaway Link](https://discord.com/channels/${message.guild.id}/${channelId}/${message.id})`)
                            v.setColor(embed.color)
                            await message.edit(embed)
                            await message.channel.send(`Congrats ${winners} you won the giveaway for **${prize}**!`, v)
                        }
                    }
                }
            })
        }
   }
    
}
async function handleNewGiveaway(giveaways){
    const newGiveaway = await Giveaway.fineOne({ guildId: giveaways.guildId, messageId: giveaways.messageId, channelId: giveaways.channelId});

    return newGiveaway;
}
function determineWinners(users, max) {
    if(users.length <= max) return users;
    const numbers = new Set();
    const winnersArray = [];
    let i = 0;
    while (i < max) {
        const random = Math.floor(Math.random() * users.length);
        const selected = users[random];
        if(!numbers.has(random)) {
            winnersArray.push(selected);
            i++;
        }
    }
    return winnersArray;
}

async function getAllUsers(reaction) {
    let entries = [];
    let users = await reaction.users.fetch();
    entries = entries.concat(users);
    while (users.size === 100) {
        const { id } = users.last();
        users = await reactions.users.fetch({ after: id });
        entries = entries.concat(users);
    }
    return entries;
}



module.exports = {
    saveGiveaway,
    scheduleGiveaways
}
//25:36