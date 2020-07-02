const { MessageEmbed } = require('discord.js');

const selections = new Set();
const constants = ['queue all', 'queue tracks', 'cancel'];

module.exports = {
    name: "search",
    usage: "[p]search <Song name/url>",
    description: "Search For Songs to play! Type queue tracks or queue all when youre done!",
    aliases: ['ytsearch', 'searchsongs'],
    category: "music",

  run: async (client, message, args) => {
    const query = args.join(' ');
    const bot = client;
    const { channel } = message.member.voice;
    let player = client.music.players.get(message.guild.id);
    if(!player){
        player = client.music.players.spawn({
            guild: message.guild,
            voiceChannel: message.member.voice.channel,
            textChannel: message.channel
        });
    }
    if (channel && player) {
      if (channel.id === player.voiceChannel.id) {
        const searchResults = await client.music.search(query, message.author);
        const tracks = searchResults.tracks.slice(0, 10);
        let i = 0;
        const tracksInfo = tracks.map(track => `${++i}) [${track.title}](${track.uri})`);
        const embed = new MessageEmbed()
          .setAuthor(`Search Results Found`)
          .setDescription(tracksInfo)
          .setFooter('Music Results Found pick a number.');
        
        message.channel.send(embed);
        const filter = m => (m.author.id === message.author.id)
          && (channel.id === player.voiceChannel.id)
          && ((m.content >= 1 && m.content <= tracks.length) || constants.includes(m.content.toLowerCase()));
      
        const collector = await message.channel.createMessageCollector(filter);
        const tracksToQueue = await handleCollector(collector, tracks);

        i = 0;
        const selectedTracksInfo = tracksToQueue.map(track => `${++i}) [${track.title}](${track.uri})`);
        const selectedTracksEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`Confirm or Deny`)
          .setDescription(selectedTracksInfo);
        
        const msg = await message.channel.send(selectedTracksEmbed);
        await msg.react('👍');
        await msg.react('👎');

        try {
          const reactionFilter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && (user.id === message.author.id);
          const reactions = await msg.awaitReactions(reactionFilter, { max: 1, time: 15000, errors: ['time'] });
          const selectedReaction = reactions.get('👍') || reactions.get('👎');
          if (selectedReaction.emoji.name === '👍') {
            for (const track of tracksToQueue) {
              player.queue.add(track);
              console.log(`${track.title} was queued.`)
            }
            if (!player.playing) player.play();
          } else {
            message.channel.send('Cancelled. No tracks were queued');
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      message.channel.send('Please spawn a player or join a voice channel');
    }
  }
}

function handleCollector(collector, tracks) {
  const tracksToQueue = [];
  return new Promise((resolve, reject) => {
    try {
      collector.on('collect', message => {
        if (message.content.toLowerCase() === 'queue all') {
            
          collector.stop();
          selections.clear();
          resolve(tracks);
        } else if(message.content.toLowerCase() === "cancel"){
            collector.stop();
            selections.clear();
            message.channel.send(`Stopped the command.`)
        }
        else if (message.content.toLowerCase() === 'queue tracks') {
          collector.stop();
          selections.clear();
          resolve(tracksToQueue);
        } else {
          const entry = message.content;
          console.log(selections);
          if (selections.has(entry)) {
            message.channel.send('You already selected that song!');
          } else {
            message.channel.send(`Selected - ${tracks[entry-1].title}\n\nType \`queue tracks\` or \`queue all\` once  you're all done! Remember, Cancel any time by typing \`cancel\``);
            tracksToQueue.push(tracks[entry-1]);
            selections.add(entry);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  })
}