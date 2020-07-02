module.exports = {
    name: "join",
    aliases: ['joinvc'],
    category: "music",
    description: "Create a player by making the bot join a voice channel!",
    usage: "[p]join",
    run: async(bot, message, args) =>{
        const { channel } = message.member.voice;
        if(channel) {
           if(bot.music.players.has(message.guild.id)) return message.channel.send(`I am already in a voice channel!`)
            const player = bot.music.players.spawn({
                guild: message.guild,
                voiceChannel: channel,
                textChannel: message.channel
            });
            
        } else {
            message.reply("Please join a voice channel.")
        }
    }
}