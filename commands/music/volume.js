module.exports={
    name: "volume",
    aliases: ['setvolume'],
    usage: "[p]volume <amount>",
    description: "Set the current volume!",
    category: "music",
    run: async(bot, message, args) =>{
        const { channel } = message.member.voice;
        if(!channel) return message.channel.send(`You must be in a voice channel!`);
        const player = bot.music.players.get(message.guild.id);
        if(!player) return message.channel.send(`I am currently not in a voice channel or the current guilds player has been destroyed.`);
        if(!player.playing) return message.channel.send(`I am not playing any songs!`);
        if(channel.id !== player.voiceChannel.id) return message.channel.send(`You must be in this voice channel: \`${player.voiceChannel.name}\``);
        if(player){
            if(!args[0]) return message.channel.send(`Current Volume: \`${player.volume}\``)
            const count = parseInt(args[0]);
            if(isNaN(args[0])) return message.channel.send(`That is not a valid number to set the volume to!`);
            if(count >= 201) return message.channel.send(`The max volume I can be at is 200.`);
            player.setVolume(count);
            message.channel.send(`The current volume has been set to \`${count}\``)
        }
    }
}