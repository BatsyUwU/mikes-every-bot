const Discord = require("discord.js");
const db = require("quick.db")
const {
    MessageEmbed,
    WebhookClient,
    Util,
    Collection
} = require("discord.js");
var arr = [];
const modRoleSchema = require("../../database/models/ModRole");
module.exports = {
    name: "setmodrole",
    aliases: [`set-mod-role`],
    description: "",
    usage: `[p]setmodrole [mentioned roles] | [p]setmodrole [role ids joined with ,]`,
    category: "00",
    timeout: 10000,
    run: async(bot, message, args) =>{
        const prefix = bot.guildPrefixes.get(message.guild.id)
        console.log(this.name + " was used");
       let modRoles = await modRoleSchema.findOne({ Guild: message.guild.id});
       let modRole;
       if(!modRoles) modRole = message.guild.roles.highest;
       if(modRoles) modRole = message.guild.roles.cache.get(modRoles.Role);
        
    
        if(!message.member.permissions.has("ADMINISTRATOR")&&!message.member.roles.cache.has(modRole.id)) return message.channel.send(`You need the modrole role or the administrator permission in order to execute this command!`);
        if(message.mentions.roles.size){
           let roles = await getRoleFromMention(message);
            if(modRole == message.guild.roles.highest){
                let newModRoles = new modRoleSchema({
                Guild: message.guild.id,
                Role: roles
            });
           newModRoles.save();
           await message.channel.send({ embed:{
               description: `Succesfully pushed the roles ${roles.map(r => `<@&${r}>`).join(", ")}`,
               color: "RANDOM"
           }})
        }else{
            modRole.Role.push(roles)
            modRole.save();
            await message.channel.send({ embed:{
                description: `Succesfully updated the roles ${roles.map(r => `<@&${r}>`).join(", ")}`,
                color: "RANDOM"
            }})
        }
           return;
        }
        else{
            let roleIdTest = args.join(" ").split(/,\s*/);
        for(const roleId of roleIdTest){
            if(message.guild.roles.cache.get(roleId)){
                console.log("exists")
            }else{
                message.channel.send(`Invalid Role ID`)
            }
        }
    }

    }
}
async function getRoleFromMention(message) {
    let rolesArray = [];

    var rolesSize = message.mentions.roles.filter(r => r.id !== message.guild.id).size;

    if(rolesSize >=1){
        message.mentions.roles.forEach(r =>{
            rolesArray.push(r.id)
            console.log(r.name)
        })
    }
    console.log(rolesArray)
    return rolesArray;

}