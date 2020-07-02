module.exports = {
    name: "leave",
    aliases: ['stop'],
    category: "music",
    description: "Stop the bot from playing anymore songs!",
    usage: "[p]leave",
    run: async(bot, message, args) =>{
        const { channel } = message.member.voice;
        if(channel) {
           if(!bot.music.players.has(message.guild.id)) return message.channel.send(`I am currently not already in a voice channel or there isnt a player for this guild!`)
            bot.music.players.destroy(message.guild.id)
            
        } else {
            message.reply("Please join a voice channel.")
        }
    }
}