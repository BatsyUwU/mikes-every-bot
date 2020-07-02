const {MessageEmbed} = require("discord.js")
const {version} = require("../../package.json")
const ms = require("ms")
module.exports = {
    name: "commands",
    aliases: ['cmd', 'cmds', 'help', 'h'],
    usage: "[p]commands",
    description: "Get dmed all available commands that this bot has!",
    category: "info",
    run: async(bot,message,args)=>{
        const embed = new MessageEmbed()
        embed.setColor("RANDOM")
        embed.setAuthor(`Help Panel`, message.author.displayAvatarURL({ dynamic: true}))
        embed.setFooter(`Version: v${version} | Try doing [p]help [category/command] to get more info on a command!`)
        bot.categories.forEach(cat =>{
            if(cat) embed.addField("**" + cat[0].toUpperCase() + `${cat.slice(1)} Commands (${bot.commands.filter(cmd => cmd.category!=="owner" && cmd.category == cat).size})**`, bot.commands.filter(cmd => cmd.category == cat).map(cmd => `\`${cmd.name}\``).join(", ") || "None")

        } )
        if(!args[0]) return message.channel.send(embed);
        if(args[0]&&bot.categories.includes(args[0].toLowerCase())){
            const commands = bot.commands.filter(c => c.category === args[0].toLowerCase()).map(c => c.name).join(", ")
            const embed = new MessageEmbed()
                .setTitle(`Commands found under: ${args[0].toLowerCase()}`)
                .setDescription(`\`${commands}\``)
                .setColor("RANDOM")
                .setFooter(`Try [p]help <command> to get more info on a command!`)
            return message.channel.send(embed)
        } else if(args[0]&&bot.commands.has(args[0].toLowerCase())||bot.aliases.has(args[0].toLowerCase())){
            const input = args[0]
            const hembed = new MessageEmbed()
            const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));
            let info = `No information found for: **${input.toLowerCase()}**`
            if(!cmd)return message.channel.send(hembed.setColor('RANDOM').setDescription(info));
            if(cmd.name) info = `**Command name**: ${cmd.name}`
            if(cmd.description) hembed.setDescription(cmd.description)
            if(cmd.aliases) hembed.addField(`Aliases`, "`\`\`" + cmd.aliases.map(a=>a).join(', ') + "`\`\`", true)
            if(cmd.category) info = `${cmd.category}:${cmd.name}`
            if(cmd.usage) hembed.addField(`Usage`, "`\`\`" + cmd.usage + "`\`\`", true)
            if(cmd.timeout) hembed.setFooter(`Timeout: ${ms(cmd.timeout)}`)
            hembed.setTitle(info)
            hembed.setColor("RANDOM")
            return message.channel.send(hembed);
            
           
        } else {
            return message.channel.send({embed: {
                description: `No category/command found for: **${args[0].toLowerCase()}**`,
                color: "RANDOM"
            }})
        }


    }
}