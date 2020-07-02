const { VultrexHaste } = require('vultrex.haste')
const { inspect } = require("util")
const { stripIndents } = require('common-tags')
const haste = new VultrexHaste({ url: "https://hastebin.com" });
const { MessageEmbed } = require("discord.js")

module.exports=async(bot, messages) =>{
    var guildArray = [];
var channelArray = [];
    messages.forEach(async(mes) =>{
        if(mes.partial) await mes.fetch();
        guildArray.push(mes.guild);
        channelArray.push(mes.channel)
    } );
    var guild = guildArray[0];
    var channel = channelArray[0];
    console.log(guild.name)
    var logsChannels = await bot.db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    console.log(logsChannel.guild.name)
    if(!logsChannel && logsChannel===null) return;
    else{
        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        let i = 0;
        let output = messages.map((m, index) => `${++i}, ${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}(${m.author.id}): ${m.content}`).join("\n");

        const embed = new MessageEmbed()
        .setTitle(`${messages.size} messages have been deleted.`)
        //@ts-ignore
           .setDescription(stripIndents`
           \`${messages.size}\` messages have been bulk deleted in <#${channel.id}>\`[#${channel.name}]\`.
            ${messages.length < 40 ? messages.map(m => `${m.author.tag}: ${m.content}`).join('\n') : ''}


           `)
           .addField("\u200B", stripIndents`
           [Haste Link](${output.length > 0 ? await haste.post(`Message Delete Bulk Logging Made by Mike Harrison.\n\n\n\n\n${output}`) : output})
           `)
           .setColor("RANDOM")
            

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })

            


    }
}
