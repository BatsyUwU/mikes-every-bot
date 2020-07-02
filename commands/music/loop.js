

module.exports={
    name: "loop",
    aliases: ['loops'],
    description: "Loop the current track or queue!",
    usage: "[p]loop | [p]loop current",
    category: "music",
    run: async(bot, message, args) =>{
        const { channel } = message.member.voice;
        if(!channel) return message.channel.send(`You must be in a voice channel!`);
        const player = bot.music.players.get(message.guild.id);
        if(!player) return message.channel.send(`I am currently not in a voice channel or the current guilds player has been destroyed.`);
        if(!player.playing) return message.channel.send(`I am not playing any songs!`);
        if(channel.id !== player.voiceChannel.id) return message.channel.send(`You must be in this voice channel: \`${player.voiceChannel.name}\``);
        if(player && player.playing){
            if(!args[0]){
                try{
                    if(player.queueRepeat) player.setQueueRepeat(false)
                    if(!player.queueRepeat) player.setQueueRepeat(true);
                   
                    message.channel.send(`Now ${player.queueRepeat ? "looped" : "unlooped"} the **queue**`);
                }catch(Err){
                    console.log(Err)
                }
            } else if(args[0].toLowerCase()==="current"){
                if(player.trackRepeat == true) player.setTrackRepeat(false)
                if(player.trackRepeat == false) player.setTrackRepeat(true);
                
                message.channel.send(`Now ${player.trackRepeat == true ? "looping" : "unlooping"} the **track**.`);

            }
        }
    }
}