const { MessageEmbed } = require('discord.js');

module.exports={
    name: 'shuffle',
    aliases: ['shuffle-queue', 'shuff', 'shuffles'],
    description: 'Shuffle the current queue!',
    usage: '[p]shuffle',
    category: 'music',
    run: async(bot, message, args) => {
        const { channel } = message.member.voice;
        if(!channel) return message.channel.send(`Please join a voice channel!`);
        const player = bot.music.players.get(message.guild.id);
        if(!player) return message.channel.send(`I am currently not in a voice channel or the current guild's player has been destroyed.`);
        if(!player.playing) return message.channel.send(`I am currently not playing anything!`);
        if(channel && player){
            if(channel.id === player.voiceChannel.id){
                player.queue.shuffle();
                message.channel.send(`Shuffled the current queue!`);
            }else{
                return message.channel.send(`You must be in my current vc \`${player.voiceChannel.name}\` in order to shuffle the queue`);
            }
        }
    }
}