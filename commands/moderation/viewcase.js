const GuildCase = require("../../database/models/GuildCase");
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require("discord.js");

module.exports={
    name: "viewcase",
    aliases: ['infraction', 'case', 'view-case'],
    usage: '[p]viewcase <case id>',
    description: `View an infraction by the case id!`,
    category: "moderation",
    run: async(bot, message, args) => {
        if(!args[0]) return message.channel.send(`Please specify a case id!`);
        let caseid = parseInt(args[0]);
        GuildCase.findOne({ Guild: message.guild.id, CaseID: caseid}, async(err, Case) =>{
            if(err) throw err;
            if(!Case) return message.channel.send(`Invalid case id. Case not found!`);
            else if(Case){
                console.log(Case)
                const embed = new MessageEmbed()
                    .setAuthor(`Case ${caseid}`, Case.User.avatarURL)
                    .addField(`Punishment`, Case.Punishment)
                    .addField(`Reason`, Case.Reason)
                    .addField(`Moderator`, `Tag: ${Case.Moderator.tag}\nID: ${Case.Moderator.id}\nMention: <@${Case.Moderator.id}>`)
                    .addField(`User`, `Tag: ${Case.User.tag}\nID: ${Case.User.id}\nMention: <@${Case.User.id}>`)
                    if(Case.Appealed === false && Case.Appeal){
                        embed.addField(`Appeal`, stripIndents`
                            Denied By: \`${Case.Appeal.Appealer.tag}\`
                            Reason: ${Case.Appeal.reason}
                            Denied AT: \`${Case.Appeal.deniedAt}\`
                        `)
                        embed.setColor("RED")
                    }else if(Case.Appealed == true){
                        embed.addField(`Appeal`, stripindets`
                            Accepted By: \`${Case.Appeal.Appealer.tag}\`
                            Accepted At: \`${Case.Appeal.acceptedAt}\`
                        `)
                        embed.setColor("RANDOM")
                    } 
                    else{
                        embed.addField('Appeal', 'None.')
                    }
                return message.channel.send(embed)

            }

        })
}
}