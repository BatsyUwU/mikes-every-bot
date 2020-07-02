
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "queue",
    description: "View the current queue",
    usage: "[p]queue",
    category: "music",
    aliases: ['viewqueue', 'que', 'q'],


  run:  async(client, message, args) => {
    const player = client.music.players.get(message.guild.id);
    if (player) {
      
      let currentPage = 0;
      const embeds = await getEmbeds(player.queue);
      const queueEmbed = await message.channel.send(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`));
      await queueEmbed.react('⬅️');
      await queueEmbed.react('➡️');
      await queueEmbed.react('❌');

      const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && !user.bot;
      const collector = queueEmbed.createReactionCollector(filter);

      collector.on('collect', async (reaction, user) => {
        
        if (reaction.emoji.name === '➡️') {
          if (currentPage < embeds.length-1) {
            currentPage++;
            queueEmbed.edit(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`));
          } 
        } else if (reaction.emoji.name === '⬅️') {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`));
          }
        } else {
          collector.stop();
          console.log('Stopped collector..');
          await queueEmbed.delete();
        }
      });
    }
  }
}

async function getEmbeds(queue) {
  const embeds = [];
  let k = 10;
  for(let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current.map(track => `${++j}) [${track.title}](${track.uri}) [<@${track.requester.id}>] \`${require('erela.js').Utils.formatTime(track.duration, true)}\``).join('\n');
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(`Current Song: ${queue[0].title}`, queue[0].requester.displayAvatarURL({ dynamic: true}), queue[0].uri)
      .setDescription(`${info}`);

    embeds.push(embed);
  }
  return embeds;
}