const fs = require('fs');

module.exports = bot =>{
    fs.readdirSync("./commands/").forEach(commandCategory =>{
        const commandCategories = fs.readdirSync(`./commands/${commandCategory}/`).filter(cat => cat.endsWith(".js"));
        for(let commandFile of commandCategories) {
            let command = require(`../commands/${commandCategory}/${commandFile}`);
            if(command.name){
                bot.commands.set(command.name, command);
                console.log(`✅ Just checked ${commandFile} looks like ${command.name} loaded fine!`);
                if(command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(commandAlias => bot.aliases.set(commandAlias, command.name));

            } else {
                if(!command.name){
                    console.log(`✅ ${commandFile} doesn't have a command name using the file name!`);
                    command.name = commandFile.split(".")[0];
                    console.log(`Used ${command.name} as the ${commandFile} name`);
                    bot.commands.set(command.name, command)
                }
                continue;
            }
        }
    
    })
}