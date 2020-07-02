const { MessageEmbed } = require("discord.js");
const { Utils } = require("erela.js")
module.exports = {
    name: "play",
    aliases: ['p', 'pla', 'add', 'addsong'],
    description: "Play a song!",
    usage: "[p]play <song name/url>",
    category: "music",
    run: async(bot, message, args) =>{
        const query = args.join(" ");
        console.log(query);
        const { channel } = message.member.voice;
        if(channel) {
            let i = 0;
            const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
                 const urlcheck = videoPattern.test(query)
            if(urlcheck && !playlistPattern.test(query)){
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
                        .setDescription(`[Enqueing - ${track.title}](${track.uri})\n[<@${track.requester.id}>]\nTime Till it plays: \`${Utils.formatTime(player.queue.duration - track.duration > 0 ? player.queue.duration - track.duration : track.duration, true)}\``)
                        .setColor("RANDOM")
    
                        message.channel.send(`YouTube Url detected queueing first result.`, e);
                    if (!player.playing) player.play();
                return;
                
            }
            if(urlcheck){
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
                            break;
                        case 'TRACK_LOADED':
                             const track = res.tracks[0]
                                player.queue.add(track);
                                console.log(track);
                                const e = new MessageEmbed()
                                    .setDescription(`[Enqueing - ${track.title}](${track.uri})\n[<@${track.requester.id}>]\nTime Till it plays: \`${Utils.formatTime(player.queue.duration - track.duration > 0 ? player.queue.duration - track.duration : track.duration, true)}\``)
                                    .setColor("RANDOM")
                
                                    message.channel.send(`YouTube Url detected queueing first result.`, e);
                                if (!player.playing) player.play();
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
            let m = await message.channel.send("Searching......");
            const searchResults = await bot.music.search(query, message.author).catch(err=>{
                message.channel.send(`Looks like I couldnt find a track for ${query}.`);
                m.delete();
                console.log(err);
                return;
            });
            const tracks = searchResults.tracks.slice(0, 10);
            const tracksInfo = tracks.map(r => `${++i}) [${r.title}](${r.uri})`).join("\n");

            const embed = new MessageEmbed()
                .setAuthor(`Current Tracks Results Found`)
                .setColor("RANDOM")
                .setFooter(`Music Results found Pick a Number`)
                .setDescription(tracksInfo);
            await m.edit("\u200B", embed);
            const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length)
            try{
                const response = await message.channel
                .awaitMessages(filter, {max: 1, time: 60000, errors: ['time']});

            if(response) {
                const entry = response.first().content;
                console.log(entry)
                let player = bot.music.players.get(message.guild.id)
                if(!player){
                    player = bot.music.players.spawn({
                        guild: message.guild,
                        voiceChannel: message.member.voice.channel,
                        textChannel: message.channel
                    });
                }
                const track = tracks[entry - 1];
                
                player.queue.add(track);
                console.log(track);
                const e = new MessageEmbed()
                    .setDescription(`[Enqueing - ${track.title}](${track.uri})\n[<@${track.requester.id}>]\nTime Till it plays: \`${Utils.formatTime(player.queue.duration - track.duration > 0 ? player.queue.duration - track.duration : track.duration, true)}\``)
                    .setColor("RANDOM")

                    message.channel.send(e);
                if (!player.playing) player.play();

            }
            } catch(err) {
                console.log(err)

            }
        
        }
    }

}