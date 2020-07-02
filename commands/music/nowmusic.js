const { MessageEmbed } = require("discord.js");
const { stripIndents } = require('common-tags');
const { Utils } = require("erela.js");
module.exports={
    name: "now-music",
    aliases: ['nowmusic'],
    description: "View the current playing song for the guild!",
    usage: "[p]np",
    category: "music",
    run: async(bot, message, args) => {
        const player = bot.music.players.get(message.guild.id);
        if(!player) return message.channel.send(`I am not in a voice channel or this current server's player has been destroyed.`);
        if(player){
            if(!player.queue[0]) return message.channel.send(`I am currently not playing any songs`);
            if(player){
                const embed = new MessageEmbed()
                    .setDescription(stripIndents`
                        Current Song: \`${player.queue[0].title}\`
                        Url: [Click Here](${player.queue[0].uri})
                        Requested By: <@${player.queue[0].requester.id}>
                        Current VC: ${player.voiceChannel.name}
                        Currently Bound Channel: <#${player.textChannel.id}>
                        Duration: \`${Utils.formatTime(player.queue[0].duration, true)}\`
                        Author: \`${player.queue[0].author}\`
                        Paused: \`${!player.playing ? "Yes" : "No"}\`
                    `)
                    .setColor("RANDOM")
                    .setThumbnail(player.queue[0].thumbnail)
                return message.channel.send(embed)
            }
        }
    }
}