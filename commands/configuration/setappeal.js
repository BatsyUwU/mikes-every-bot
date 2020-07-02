const GuildCase = require("../../database/models/GuildCase");
const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
   
    Collection
} = require("discord.js");

const modRoleSchema = require("../../database/models/ModRole");
module.exports = {
    name: "setappeal",
    aliases: ['set-appeals'],
    description: "Set the appeals channel!",
    usage: `[p]setappeal <channel mention/name/id>`,
    category: "configuration",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.guildPrefixes.get(message.guild.id)
        console.log(this.name + " was used");
         let modRoles = await modRoleSchema.findOne({ Guild: message.guild.id});
                
        let modRole;
        if(!modRoles) modRole = message.guild.roles.highest;
        if(modRoles) modRole = modRoles.Role;
        if(!message.member.permissions.has("ADMINISTRATOR")&&!message.member.roles.cache.has(modRole.id)) return message.channel.send(`You need the modrole role or the administrator permission in order to execute this command!`);
       
        
        if(!args[0]) return message.channel.send({ embed: {
            description: `Invalid Arguments. Try\n\`${prefix}set-appeals [--on|true|false|--off] [channel id/mention/name]\``,
            color: "RANDOM",

        }});
        async function it(){
            if(args[0].toLowerCase()==="--on"||args[0].toLowerCase()==="true"){
                if(!args[1]) return message.channel.send(`Please specify a channel!`)
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.startsWith(args[1]));
                if(typeof channel === "undefined") return message.channel.send(`Invalid Channel try again.`);
                var ar = ['MANAGE_WEBHOOKS', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
                if(!channel.permissionsFor(message.guild.me).has([`READ_MESSAGE_HISTORY`, 'MANAGE_WEBHOOKS', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'])) return message.channel.send(`I need the following permissions \`${ar.map(a => `${a.split("_").map(aa=>aa[0].toUpperCase() + aa.slice(1).toLowerCase().replace(/_/g, " ")).join(" ")}`).join(", ")}\` in <#${channel.id}> `)

                db.set(`appealschannel_${message.guild.id}`, channel.id);
                await channel.createWebhook(`${bot.user.username.replace("!", "")}-logging`, {
                    avatar: bot.user.displayAvatarURL(),
                    reason: `Logs channel setup!`
                });
                
            await message.channel.send(`Set the appeal channel to  <#${channel.id}>!`);

            } else if(args[0].toLowerCase()==="--off" || args[0].toLowerCase()==="false"){
                db.delete(`appealschannel_${message.guild.id}`);
                await message.channel.send(`Turned off appealing!`)
            }
        }
        if(args[0]){
            try{
                await it();
            }catch(Err){
                console.log(Err)
            }
        }

    }
}