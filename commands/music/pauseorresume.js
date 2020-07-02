module.exports={
    name: "pause",
    aliases: ['resume'],
    description: `Pause or resume the current song.`,
    usage: "[p]pause/resume",
    category: "music",
    run: async(bot, message, args) => {
        const { channel } = message.member.voice;
        if(!channel) return message.channel.send(`You must be in a voice channel!`);
        const player = bot.music.players.get(message.guild.id);
        if(!player) return message.channel.send(`I am currently not in a voice channel or the current guilds player has been destroyed.`);

        player.pause(player.playing);
        message.channel.send(`Currently ${player.playing ? "resumed" : "paused"} the current queue!`);
    }
}