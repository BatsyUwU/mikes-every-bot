require('dotenv').config();
const Giveaway = require("../../database/models/Giveaway");

const database = require("../../database/database");
const GuildPrefix = require("../../database/models/GuildPrefix")
const {scheduleGiveaways } = require("../../utils/structures/giveaway");
module.exports=async(bot)=>{
   
    const current = new Date();
    const giveaways = await Giveaway.find({
        endsOn: { $gt: current }
    });
    await scheduleGiveaways(bot, giveaways);
    database.then((conn)=> console.log("Connected to MongoDB")).catch(err => console.log(err));
    bot.user.setActivity(`Do bots breath? | m!invite`, {
        type: "PLAYING",
        

    });
    
    
    bot.guilds.cache.forEach(async(guild) =>{
        
      GuildPrefix.findOne({ Guild: guild.id}, async(err, data) =>{
          if(err) throw err;
          if(data){
              console.log(`Prefix for ${guild.name} ${data.Prefix}`);
              bot.guildPrefixes.set(guild.id, data.Prefix);
          } else if(!data){
              let newPrefix = new GuildPrefix({
                  Guild: guild.id,
                  Prefix: process.env.PREFIX
              });
              newPrefix.save();
              bot.guildPrefixes.set(guild.id, process.env.PREFIX);
              console.log(`Set ${guild.name}'s prefix to be ${process.env.PREFIX}`);

          }
      });
        
    })
    
   console.log(`${bot.user.tag} is online and has loaded\n${bot.commands.size} commands\nBot ping is ${bot.ws.ping}ms\nRun ${process.env.PREFIX}help for any command help`)
}