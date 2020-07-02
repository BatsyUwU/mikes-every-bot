const { MessageEmbed } = require('discord.js');

module.exports={
    name: "firstsearch",
    aliases: ['first-track', 'first-search', 'first-result'],
    description: 'Play the first result of your query instead of choosing numbers!',
    usage: '[p]firstsearch <track name/url>',
    category: 'music',
    run: async(bot, message, args)=>{
        if(!args[0]) return message.channel.send(`Please specify something to play!`);
        const query = args.join(' ');
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
                 const urlcheck = videoPattern.test(query)
                 if(playlistPattern.test(query)){
                    let player = bot.music.players.get(message.guild.id)
                    if(!player){
                        player = bot.music.players.spawn({
                            guild: message.guild,
                            voiceChannel: message.member.voice.channel,
                            textChannel: message.channel
                        });
                    }
                     await bot.music.search(query, message.author) .then(async res=>{
                         switch (res.loadType){
                             case "PLAYLIST_LOADED": 
                             console.log(res.playlist)
                                 res.playlist.tracks.forEach(trackks=> player.queue.add(trackks));
                                 const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration})).duration, true);
                                 message.channel.send({
                                     embed:{
                                         description: `**${duration}** [Enqueuing ${res.playlist.tracks.length} tracks](${query})\n[<@${message.author.id}>]`,
                                         color: "RANDOM"
                                     }
                                 })
                                 if(!player.playing) player.play();
                         }
                     }
                         ).catch(err=>{
                         message.channel.send(`Looks like I couldnt find a track for ${query}.`);
                         m.delete();
                         console.log(err);
                         return;
                     });
                     return;
                 }
        const searchResults = await bot.music.search(query, message.author).catch(err=>{
            message.channel.send(`Looks like I couldnt find a track for ${query}.`);
            console.log(err);
            return;
        });
        const track = searchResults.tracks[0];
        let player = bot.music.players.get(message.guild.id)
        if(!player){
            player = bot.music.players.spawn({
                guild: message.guild,
                voiceChannel: message.member.voice.channel,
                textChannel: message.channel
            });
        }
            player.queue.add(track);
            console.log(track);
            const e = new MessageEmbed()
                .setDescription(`[Enqueing - ${track.title}](${track.uri})\n[<@${track.requester.id}>]`)
                .setColor("RANDOM")

                message.channel.send(e);
            if (!player.playing) player.play();
       
    }
}