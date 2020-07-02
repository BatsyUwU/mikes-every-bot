const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
    Util,
    Collection
} = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ['botping'],
    description: "Test the bots ping!",
    usage: "[p]ping",
    category: "Info Commands",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.db.get(`prefix_${message.guild.id}`) || process.env.PREFIX;
        console.log(this.name + " was used");
       let m = await  message.channel.send({ embed: { description: "pinging"}});
       const _ = new MessageEmbed()
            .setTitle(`Fetched!`)
            .setDescription(`**Pong!**\n\nBot Ping is \`${bot.ws.ping}ms\`\nApi Latency \`${m.createdTimestamp - message.createdTimestamp}ms\``)
            .setColor("RANDOM")
            .setFooter(`Shard ${message.guild.shardID}/${bot.ws.shards.size}`)
        await m.edit(_)
        m.edit("\u200B")
    }
}