const db = require("quick.db");
const {
    MessageEmbed,
    Collection
} = require("discord.js");

const GuildCase = require("../../database/models/GuildCase.js");
module.exports = async(bot, guild, author, CaseId, reason) => {
    let prefix = bot.guildPrefixes.get(guild.id);

    const ACCEPT = bot.emojis.cache.find(e => e.name === "success").id;
    console.log(db.get(`appealschannel_${guild.id}`))
    const REJECT = bot.emojis.cache.find(e => e.name === "RedTick").id;
    let appealChannel = bot.channels.cache.get(db.get(`appealschannel_${guild.id}`));
    console.log("hey?")
    if(appealChannel){
        try{
            console.log("hyyy")
            console.log(CaseId)
            let caseid = parseInt(CaseId)
            GuildCase.findOne({ Guild: guild.id, CaseID: caseid}, async(err, appeal) =>{
                if(err) throw err;
                if(!appeal) return author.send({ embed:{ description: "Your appeal was denied. Reason: Unfound Case ID"}});
                else if(appeal){
                    console.log("hi?")
                    if(appeal.User.id !== author.id) return author.send({ embed:{
                        description: `Your appeal was denied. Reason: Not Your Case.`,
                        footer:{
                            text: "Think we're wrong? Get in touch with our support team!"
                        }
                    }}).catch(console.error);
                    if(appeal.Appealed === true) return author.send({ embed:{
                        description: `Your case has already been appealed!`,
                        color: "GREEN"
                    }})
                    else{
                        let _e = new MessageEmbed()
                            .setAuthor(`Appeal by ${author.tag}`, author.displayAvatarURL({ dynamic: true}))
                            .setDescription(`${author.tag}(${author.id}) wants to appeal Case: ${CaseId}`)
                            .addField(`Case Punishment`, appeal.Punishment)
                            .addField(`Moderator`, `${appeal.Moderator.tag}(${appeal.Moderator.id})`)
                            .addField(`Reason for Punishment`, appeal.Reason)
                            .addField(`Reason For Appeal`, reason)
                            
                        let msg = await appealChannel.send(_e);
                        await msg.react(ACCEPT)
                        await msg.react(REJECT)
                        

                        await handleAppeal(author, REJECT, ACCEPT, appeal, appealChannel, caseid, reason, guild, msg).catch(console.error)
                        
                    }
                }
            })



        }catch(err){
            console.log(err);
             
        }
    }
}

async function handleAppeal( author, REJECT, ACCEPT, appeal, appealChannel, CaseId, reason, guild, msg){
    let _e = new MessageEmbed()
                            
                                    const reactionFilter_ = (reaction, user) => [ACCEPT, REJECT].includes(reaction.emoji.id) && !user.bot && guild.members.cache.get(user.id).permissions.has("ADMINISTRATOR");
                        const reactions_ = await msg.awaitReactions(reactionFilter_, { max: 1, time: 4.32e+7, errors: ["time"]}).catch(err => author.send(`Looks like no one accepted or denied your appeal.`))
                        const choice_ = reactions_.get(ACCEPT) || reactions_.get(REJECT);
                        if(choice_.emoji.id === ACCEPT){
                            const USER = reactions_.get(ACCEPT).users.cache.filter(u => !u.bot).first();
                            const e = new MessageEmbed()
                                .setAuthor(`Appeal Accepted!`)
                                .setDescription(`Appealed the case ${appeal.CaseID}. Removed the punishment **${appeal.Punishment}** for ${appeal.User.tag}.`)
                                
                                .setColor("GREEN")

                        author.send(e).catch(console.error);
                        msg.edit(new MessageEmbed())
                        appeal.Appealed = true;
                        appeal.isDeniedAppeal = false;
                        appeal.Appeal = {
                            Appealer:{
                            tag: USER.tag,
                            id: USER.id,
                            avatarURL: USER.displayAvatarURL({ dynamic: true}),
                            },
                            acceptedAt: new Date(Date.now()).toLocaleString()

                        };
                        appeal.save();
                            return;
                    }
                    if(choice_.emoji.id === REJECT){
                    const USER = reactions_.get(REJECT).users.cache.filter(u => !u.bot).first();
                    const user = USER;
                    
                    reactions_.get(REJECT).users.cache.filter(u => !u.bot && u.id !== USER.id).forEach(rruser=>{
                        reactions_.get(REJECT).users.remove(rruser);
                    });
                    let m = await user.send(`${USER.toString()} Please provide a reason to reject the appeal! Remember this isn't a command so just reply! Cancel anytime by typing \`cancel\` you have 10 minutes!`);
                    let response = await m.channel.awaitMessages(ms => ms.author.id === USER.id && !ms.author.bot, { max: 1, time: 600e3, errors: ['time']}).catch(err =>{
                        m.channel.send(`You ran out of time!`)
                        console.error(err);
                        return;
                    });
                    const { content } = response.first();
                   if(content.toLowerCase()==="cancel"){
                       m.channel.send(`Canceled the command and sent a notice!`);
                       author.send({ embed: { description: "Looks like no one answered your appeal. Try again!", color: "RANDOM"}}).catch(console.error);
                    appealChannel.messages.fetch(msg.id).then(mm_ =>{
                        mm_.edit({ 
                            embed:{
                                description: `This Appeal has been canceled.`,
                                color: "RED"
                            }
                        }).catch(console.error);
                    }).catch(console.error);
                    return;
                   }

                   const b = new MessageEmbed()
                        .setTitle(`Appeal denied`)
                        .setDescription(`Case: \`${CaseId}\` has been denied for an appeal.`)
                        .addField(`Denied By`, `${USER.tag} (${USER.id})`)
                        .addField(`Reason`, content)

                        .setColor("RED")
                    author.send(b).catch(console.error)
                    appeal.Appealed = false;
                    appeal.isDeniedAppeal = true;
                        appeal.Appeal = {
                            Appealer:{
                            tag: USER.tag,
                            id: USER.id,
                            avatarURL: USER.displayAvatarURL({ dynamic: true}),
                            
                            },
                            deniedAt: new Date(Date.now()).toLocaleDateString(),
                            reason: content

                        };
                    appeal.save();
                
                appealChannel.messages.fetch(msg.id).then(mmsg_1_1 =>{
                    const v_ = new MessageEmbed()
                        .setTitle(`Appeal Denied`)
                        .setDescription(`Case: \`${CaseId}\` has been denied for an appeal.`)
                        .addField(`Denied By`, `${USER.tag} (${USER.id})`)
                        .addField(`Reason`, content)
                    mmsg_1_1.edit(v_).catch(console.error)
                }).catch(console.error)
            }
                
            

}