const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { stripIndents } = require('common-tags');
module.exports = async(bot, oldRole, role) =>{
   let guild = role.guild;
    var logsChannels = await db.fetch(`logschannel_${guild.id}`) 
    var logsChannel =  bot.channels.cache.get(logsChannels);
    if(!logsChannel && logsChannel===null) return;
    else{
        //https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk

        
        
        var hooks = await logsChannel.fetchWebhooks();
        var webhook = hooks.first();
        let newRolePerms = role.permissions.toArray();
        let oldRolePerms = oldRole.permissions.toArray();
        let ar = [];
        newRolePerms.forEach(async(p) =>{
            if(!oldRolePerms.includes(p)){
                const embed = new MessageEmbed()
                .setAuthor(`Role Permissions Updated`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
            .setDescription(`Added ${p.toLowerCase().replace(/_/g, " ")}`)
        .setColor("GREEN")
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp()
             

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })
            } else{
               return;
            }
        })
        oldRolePerms.forEach(async(p)=>{
            if(!newRolePerms.includes(p)){
                const embed = new MessageEmbed()
                .setAuthor(`Role Permissions Updated`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
            .setDescription(`Removed ${p.toLowerCase().replace(/_/g, " ")}`)
        .setColor("RED")
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp()
             

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })
            }
        })
      if(role.name !== oldRole.name){
            const embed = new MessageEmbed()
          .setAuthor(`Role Name Updated`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
            .setDescription(`${oldRole.name} ~~> ${role.name}`)
        .setColor("GREEN")
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp()
             

        await webhook.send({
            avatarURL: bot.user.displayAvatarURL(),
            username: bot.user.username + "-logging",
            embeds: [embed]
        })
        }
        else if(role.hexColor !== oldRole.hexColor){
            const embed = new MessageEmbed()
            .setAuthor(`Role Color Updated`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
              .setDescription(`${oldRole.color} ~~> ${role.color}`)
          .setColor("GREEN")
          .setFooter(`Role ID: ${role.id}`)
          .setTimestamp()
               
  
          await webhook.send({
              avatarURL: bot.user.displayAvatarURL(),
              username: bot.user.username + "-logging",
              embeds: [embed]
          })
        }
        else if(role.hoist == true && oldRole.hoist == false){
            const embed = new MessageEmbed()
            .setAuthor(`Role Hoisted`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
              .setDescription(`${role.name} has been hoisted`)
          .setColor(role.color)
          .setFooter(`Role ID: ${role.id}`)
          .setTimestamp()
               
  
          await webhook.send({
              avatarURL: bot.user.displayAvatarURL(),
              username: bot.user.username + "-logging",
              embeds: [embed]
          })
        }
        else if(role.hoist == false && oldRole.hoist == true){
            const embed = new MessageEmbed()
            .setAuthor(`Role Unhoisted`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
              .setDescription(`${role.name} has been unhoisted`)
          .setColor("GREEN")
          .setFooter(`Role ID: ${role.id}`)
          .setTimestamp()
               
  
          await webhook.send({
              avatarURL: bot.user.displayAvatarURL(),
              username: bot.user.username + "-logging",
              embeds: [embed]
          })
        }
        else if(role.position !== oldRole.position) {
            const embed = new MessageEmbed()
            .setAuthor(`Role Position Updated`, `https://lh3.googleusercontent.com/proxy/LIjnfilWkXCExRCM8HwnzoTNKNbPQeh45jsywaWpzJllQhoNrOxsNPSxxa0eGtBgkBRdJKqkhoOLtgBJiOH5i25whAx68qk`)
              .setDescription(`**Pos ${oldRole.position}. ~~> Pos ${role.position}.`)
          .setColor("GREEN")
          .setFooter(`Role ID: ${role.id}`)
          .setTimestamp()
               
  
          await webhook.send({
              avatarURL: bot.user.displayAvatarURL(),
              username: bot.user.username + "-logging",
              embeds: [embed]
          })
        }
        
        
        

            


    }
}