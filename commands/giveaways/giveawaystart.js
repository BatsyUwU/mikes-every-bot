const {MessageEmbed} = require("discord.js")
const ms = require("ms")
const {saveGiveaway, scheduleGiveaways} = require('../../utils/structures/giveaway')
let moment = require("moment")
require("moment-duration-format")
const prompts = [
    `I see you want to start a giveaway! To start off what channel should we put it on!\nPlease provide a channel mention/id/or name!`,
    "Alright lets start this giveaway in that channel! Give this giveaway a title!(So your members know what this is about)",
    
    `Super cool titile! Now how long do you want this giveaway to last? (Use time format such as: "1h,1s" etc)`,
    `Perfect amount of time! Now how many winners do you want?`,
    `What should we giveaway? (Your prize)`
]//channel, title, time, winners, prize
module.exports={
    name: "giveaway",
    description: "Create a giveaway for a channel!",
    usage: "[p]giveaway <channel id/mention/name>",
    category: "giveaways",
    aliases: ['gcreate', 'giveawayy', 'gstart', 'giveaway-start'],
    timeout: 5000,
    run: async(bot,message,args)=>{
        let giveawayRole = message.guild.roles.cache.get(bot.db.get(`giveawayrole_${message.guild.id}`));
        if(!giveawayRole) giveawayRole = message.guild.roles.cache.find(r => r.name === "Giveaways") || message.guild.roles.highest;
        if(message.member.permissions.has("MANAGE_GUILD") || message.member.roles.cache.has(giveawayRole.id)){
            try{
               
               const response = await getResponses(message)
              if(typeof response.channelId === 'undefined') return message.channel.send('Command canceled. Invalid channel')
              
                   const embed = new MessageEmbed()
                .setTitle(`Please confirm this giveaway!`)
                .setColor(message.member.displayHexColor)
                .addField(`Channel`, `<#${response.channelId}>`, false)
                .addField(`Giveaway Title`, response.title)
                .addField(`Giveaway Prize`, response.prize)
                .addField(`Giveaway Time`, response.duration)
                .addField(`Giveaway Winners`, response.winners)
            const msg = await message.channel.send(embed);
            const channel = message.guild.channels.cache.get(response.channelId)
            msg.react("👍")
            msg.react("👎")
            const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
            const reactions = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
            const choice = reactions.get("👍") || reactions.get('👎');
            if(choice.emoji.name == "👍"){
                console.log("Confirmed Giveaway")
                 response.endsOn = new Date(Date.now() + ms(response.duration));
                 let bruhTime = Date.now() + ms(response.duration)
                const giveawayEmbed = new MessageEmbed()
                               
                    
                    .setTitle(response.title)
                    .setDescription(`**${response.prize[0].toUpperCase() + response.prize.slice(1)}**\n\n\nReact with 🎉 to enter.\nHost: <@${message.author.id}>`)

                    .setColor("#7289da")
                    .setFooter(`${response.winners} winner(s) | Ends On`)
                    .setTimestamp(Date.now() + ms(response.duration))
                    
                const giveawayMsg = await channel.send(`🎉 **Giveaway Time** 🎉`, giveawayEmbed)
                giveawayMsg.react("🎉");
                response.messageId = giveawayMsg.id;
                response.guildId = giveawayMsg.guild.id;
                response.isNewGiveaway = false;
                response.edited = false;
                response.host = `<@${message.author.id}>`;
                await saveGiveaway(response).then(m => console.log(m));
                await scheduleGiveaways(bot, [response]).then(m => console.log(m))
                const b = new MessageEmbed()
                    .setTitle(`Confirmed The Giveaway!`)
                    .setDescription(`This giveaway is now starting in <#${channel.id}> for ${response.prize}. [Jump To Giveaway](https://discord.com/channels/${message.guild.id}/${channel.id}/${giveawayMsg.id})`)
                    .setColor("GREEN")
                    .setFooter(`${response.winners} winner(s)`)
                    .setTimestamp()
                msg.edit(b)
                
            } else if(choice.emoji.name === "👎") {
                console.log(`Denied Giveaway`)
                const d = new MessageEmbed()
                    .setTitle(`Looks like we aren't having a giveaway after all..`)
                    .setDescription(`Canceled this giveaway...For now`)
                    .setColor("RED")
                    .setFooter(`Wumpus...cancel the giveaway!`)
                    .setTimestamp()
                msg.edit(d)
            }
        
            } catch(err){
                console.log(err)
            }
        }
        else{
            message.channel.send(`Looks like you need the manage server permission or a role called giveaways!`)
        }
    }

}
async function getResponses(message) {

    const validTime = /^\d+(s|m|h|d|w)$/;
    const validNumber = /\d+/;
    const responses = { }
    

    for(let i = 0; i < prompts.length; i++) {
        await message.channel.send(prompts[i]);
        const response = await message.channel.awaitMessages(m=> m.author.id === message.author.id, { max: 1});
        responses.off = false;
        const { content } = response.first();
        if(content.toLowerCase()==="cancel") {
            responses.off = true;
            return message.chanel.send(`Canceled this command!`);
            }
        if(i ===0) {
            const c = message.guild.channels.cache.get(content) || response.first().mentions.channels.first() || message.guild.channels.cache.find(c => c.name===content);
            if(typeof c === "undefined"){
                responses.off = true;
            return message.channel.send(`Looks like thats an invalid channel.`)
            return;
        }else{
            responses.channelId = c.id;
            }

    }
        else if(i === 1)
            responses.title = content;
        else if(i === 2) {
            if(validTime.test(content))
                responses.duration = content;
        else
            throw new Error(`Invalid Time Format`)
            
        }
        else if(i === 3){
            if(validNumber.test(content))
                responses.winners = content;
            else
                throw new Error(`Invalid number for winners`);
               
        }
        else if(i === 4)
            responses.prize = content;
    }
    return responses;
}