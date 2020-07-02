const { MessageEmbed } = require('discord.js');

module.exports = {
name: 'invite',
aliases: ['invitebot'],
    description: 'Invite the bot to a server! All support is appreciated!',
    usage: '[p]invite',
    catgeory: 'info',
    run: async(bot, message, args ) => {
        let link = `https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`
        let recommended = `https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=1983118839&scope=bot`
        let noperms = `https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=2048&scope=bot`
        const embed = new MessageEmbed()
            .setAuthor(`Invite me to a server!`, bot.user.displayAvatarURL({ format: 'png'}), link)
            .setColor('BLUE')
            .setDescription(`Invite me to your server with these links!\n[Admin Permissions (suggested)](${link})\n[Recommended Permissions](${recommended})\n[No permissions (Not Recommended)](${noperms})\n[No permissions and no discord integration](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&&scope=bot)\n[Support Server](https://discord.gg/qWmYunG)`)
        return message.channel.send(embed)
    }
}