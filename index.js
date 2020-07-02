const Discord = require("discord.js");
const {
    Client,
    MessageEmbed,
    WebhookClient,
    Collection,
    
    Intents
} = Discord;
require("dotenv").config();
const Util = require("./utils/Util.js");
const { ErelaClient } = require("erela.js");
const bot = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION', 'USER']
   
});

const database = require("./database/database")
const fs = require("fs");
(async () =>{
    await bot.login(process.env.BOT_TOKEN)
    await database;
    
    bot.db = require("quick.db");
    bot.client = bot;
    
    bot.music = new ErelaClient(bot, [
        {
            host: process.env.HOST,
            port: process.env.PORT,
            password: process.env.PASSWORD
        }
    ]);
    bot.music.on("nodeConnect", node => console.log("New Node Connected"));
    bot.music.on("nodeError", (node, error) => console.log(`Node Error: ${error.message}`));
    bot.music.on("trackStart", (player, track) =>{
        const e = new MessageEmbed()
            .setDescription(`[Now Playing - ${track.title}](${track.uri})\`${require('erela.js').Utils.formatTime(track.duration, true)}\`\n[<@${track.requester.id}>]`)
            .setColor("RANDOM")
        player.textChannel.send(e);
    }); 
    bot.music.on("queueEnd", (player) => {

        player.textChannel.send(`Queue has Ended`); 
        bot.music.players.destroy(player.guild.id);
    });
    
    
    
    bot.util = new Util(bot);
    bot.guildInvites = new Map();
    bot.usedInvites = new Map();
    bot.memberInvites = new Map();
    bot.commands = new Collection();
    bot.guildPrefixes = new Map();
    bot.logChannels = new Map();
    bot.aliases = new Collection();
    bot.categories = fs.readdirSync("./commands/");
    ['CommandHandler', 'EventHandler'].forEach(_ =>{
        require(`./Event Handlers/${_}`)(bot);
    });
    
   
})();

process.on("unhandledRejection", error => console.error("Uncaught Promise Rejection", error));