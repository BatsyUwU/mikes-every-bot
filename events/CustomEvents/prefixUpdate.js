module.exports = async(bot, prefix) =>{
    console.log(`${prefix.guild.name}'s prefix has been updated to \`${prefix.prefix}\`!`);
    prefix.textChannel.send(`The current prefix has been updated to \`${prefix.prefix}\`!`)
}