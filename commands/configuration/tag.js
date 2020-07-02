const custom = require("../../database/models/custom");

const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "tag",
    description: "Create a custom command for your guild!",
    usage: "[p]tag  <--add/--del/--help/--edit/--aliase>   <tag> <value>",
    category: "configuration",
    aliases: ['cc', 'custom'],
    run: async(bot, message, args) =>{
        
        if(!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send(`You need the manage guild permission in order to execute this command.`);
        if(!args[0]) return message.channel.send(`Please specify an option`)
        if(!args[1]) return message.channel.send(`Please specify a tag!`)
        return getCustomCommand(args, message);
    }
}
function getAliases(args) {
    let customAliases = [];
    args.slice(2).forEach(arg =>{
        customAliases.push(arg)
    })
    console.log(customAliases)
    return customAliases;
}
async function getCustomCommand(args, message) {
    
    custom.findOne({ Guild: message.guild.id, Command: args[1]}, async(err, data) =>{
        if(err) throw err;
        if(data) {
            if(args[0].toLowerCase()==="--del") {
                if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`Only admins can delete tags`);

                else{
                    if(!args[1]) return message.channel.send(`Please specify a tag!`)
                    custom.deleteOne({ Guild: message.guild.id, Command: args[1]}, async(err) =>{
                        if(err) throw err;
                        else;
                    });
                    await message.channel.send(`Succesfully deleted the tag ${args[1]}`)
                }
                return;

            } else if(args[0].toLowerCase()==="--help") {
                if(!args[1]) return message.channel.send(`Please specify a tag!`)
                var embed = new MessageEmbed()
                    .setTitle(`${data.Command}`)
                    .setColor("RANDOM")
                    .setDescription(`Command Name: ${data.Command}\n\nCommand Content: ${data.Content}\nAliases: ${data.Aliases.length ? data.Aliases.map(alias => `\`${alias}\``).join(", ") : 'No Aliases'}`)
                return message.channel.send(embed);
            }
            else if(args[0].toLowerCase()==="--aliase"){
                if(!args[1]) return message.channel.send(`Please specify a tag!`);
                let aliaseArgs =  getAliases(args);
                data.Aliases.push(aliaseArgs.join(', '));
                data.save();
                message.channel.send(`Succesfully added the aliases ${aliaseArgs} to the command ${args[1]}`)
                return;


            }

            else if(args[0].toLowerCase()==="--edit"){
                if(!args[1]) return message.channel.send(`Please specify a tag!`)
                
            data.Content = args.slice(2).join(" ")
            data.save();
            await message.channel.send(`Succesfully updated the tag ${args[1]}`);
            return;
            }
        } else if(!data && args[0].toLowerCase()==="--add") {
             if(!args[1]) return message.channel.send(`Please specify a tag!`)
            let newData = new custom({
                Guild: message.guild.id,
                Command: args[1],
                Content: args.slice(2).join(" ")
            })
            newData.save();
            await message.channel.send(`Succesfully created the tag ${args[1]}`)
        }
    
        

    })
}