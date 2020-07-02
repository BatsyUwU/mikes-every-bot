const GuildCase = require("../../database/models/GuildCase.js");
const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
    
    Collection,
    Message,
    Client
} = require("discord.js");
const { stripIndents } = require("common-tags");
const Util = require("../../utils/Util");
const modRoleSchema = require("../../database/models/ModRole");

module.exports = {
    name: 'infractions',
    aliases: ['warnings'],
    usage: '[p]infractions | [p]infractions @mention/id/tag',
    description: 'View the infractions of a member.',
    category: 'moderation',
    timeout: 5e3,
    /**
     * @param {Client} bot
     * @param {Message} message
     * 
     * @param {string[]} args
    
     */
    run: async(bot, message, args) => {
        if(!message.member.permissions.has(['MANAGE_NICKNAMES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'])){
            let ar = ['MANAGE_NICKNAMES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'];
            return message.channel.send(new MessageEmbed().setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true, format: 'png'})).setDescription(`${message.author.tag} you need the follwing permissions in order to view warnings.\n\n${await formatPermission(ar, "-", "\n")}`).setColor(message.member.displayHexColor));

        }
        if(!message.guild.me.permissions.has(['EMBED_LINKS', 'ADD_REACTIONS', 'ATTACH_FILES'])){
            let ar = ['EMBED_LINKS', 'ADD_REACTIONS', 'ATTACH_FILES'];
            return message.channel.send(new MessageEmbed().setAuthor(`Invalid Permissions`, message.author.displayAvatarURL({ dynamic: true, format: 'png'})).setDescription(`${message.author.tag} I need the follwing permissions in order to view warnings.\n\n${await formatPermission(ar, "-", "\n")}`).setColor(message.guild.me.displayHexColor));


        }
        let member;
        if(!args[0]) member = message.member;
        if(args[0]) member = await bot.util.getUserFromMention(args[0], message.guild.members) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]);
        if(typeof member === "undefined") member = message.member;
        const infractions = await GuildCase.find({
            Guild: message.guild.id,
            UserID: member.id
        });
        if(!infractions || !infractions.length || infractions.length <= 0) return message.channel.send(`${member.user.tag} is squeky clean!`)
        let currentPage = 0;
        const embeds = await getEmbeds(infractions);
        const caseEmbed = await message.channel.send(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`).setAuthor(`Infractions for ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true, format: 'png'})));
        await caseEmbed.react('⬅️');
        await caseEmbed.react('➡️');
        await caseEmbed.react('❌');
  
        const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && !user.bot && message.guild.member(user).permissions.has(['MANAGE_NICKNAMES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS']);

        const collector = caseEmbed.createReactionCollector(filter);
  
        collector.on('collect', async (reaction, user) => {
          
          if (reaction.emoji.name === '➡️') {
            if (currentPage < embeds.length-1) {
              currentPage++;
              caseEmbed.edit(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`).setAuthor(`Infractions for ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true, format: 'png'})));
            } 
          } else if (reaction.emoji.name === '⬅️') {
            if (currentPage !== 0) {
              --currentPage;
              caseEmbed.edit(embeds[currentPage].setFooter(`Current Page: ${currentPage+1}/${embeds.length}`).setAuthor(`Infractions for ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true, format: 'png'})));
            }
          } else {
            collector.stop();
            
            await caseEmbed.delete();
          }
        });

    }
    
}
async function formatPermission(permissions = [''], index = "-", joiner = "\n"){
    return permissions.map(a => `${index} ${a.replace("GUILD", "SERVER").split("_").map(aa=>aa[0].toUpperCase() + aa.slice(1).toLowerCase().replace(/_/g, " ").replace("Guild", "Server")).join(" ")}`).join(joiner)
}

async function getEmbeds(infractions) {
    const embeds = [];
    let k = 10;
    for(let i = 0; i < infractions.length; i += 10) {
      const current = infractions.slice(i, k);
      let j = i;
      k += 10;
      let ind = 0;
      const info = current.map(warning => `${++ind}) Punishment: ${warning.Punishment} Case ID: ${warning.CaseID}, Reason: ${warning.Reason}\nModerator: ${warning.Moderator.tag} (${warning.Moderator.id})`).join('\n\n\n');
      const embed = new MessageEmbed()
      .setColor("RANDOM")
      
        .setDescription(`${info}`);
  
      embeds.push(embed);
    }
    return embeds;
  }