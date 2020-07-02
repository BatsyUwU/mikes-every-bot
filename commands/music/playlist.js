const { MessageEmbed } = require('discord.js');
const { Music } = require("../../vars.js");
const { Utils } = require('erela.js');
module.exports={
    name: 'playlist',
    aliases: ['play-list', 'playlists'],
    usage: '[p]playlist <youtube playlist uri/soundcloud>',
    description: 'Play a playlist!',
    categpory: "music",
    run: async(bot, message, args) => {
        if(!args[0]) return message.channel.send(`You must specify a playlist!`);
        const query = args.join(' ');
        const prefix = bot.guildPrefixes.get(message.guild.id);
       /* const playlistCheck = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
       /* if(!playlistCheck.test(query)) return message.channel.send(`Invalid Playlist. Try \`${prefix}play ${query}\` instead.`)*/
       
        let player = bot.music.players.get(message.guild.id)
                if(!player){
                    player = bot.music.players.spawn({
                        guild: message.guild,
                        voiceChannel: message.member.voice.channel,
                        textChannel: message.channel
                    });
                }
                let m = await message.channel.send(`Searching.....`)
                 await bot.music.search(query, message.author) 
                 .then(async res=>{
                     switch (res.loadType){
                         case "PLAYLIST_LOADED": 
                         
                             res.playlist.tracks.forEach(trackks=> player.queue.add(trackks));
                             const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration})).duration, true);
                            const ee_e = new MessageEmbed()
                                .setDescription(`Now Playing Playlist ${res.playlist.info.name} and queueing ${res.playlist.tracks.length} tracks. ${duration} till it ends.`)
                                .setColor("RANDOM")
                            message.channel.send(ee_e);
                            await m.delete();
                             if(!player.playing) player.play();
                     }
                 }
                     ).catch(err=>{
                     message.channel.send(`Looks like I couldnt find a track for ${query}.`);
                     m.delete();
                     console.log(err);
                     return;
                 });
    }
}