const {MessageEmbed, Message, Client} = require("discord.js")
const ms = require("ms")
const {saveGiveaway, scheduleGiveaways} = require('../../utils/structures/giveaway')
let moment = require("moment")
require("moment-duration-format")

const humanizeDuration  = require('humanize-duration');
const prompts = [
    `I see you want to start a giveaway! To start off what channel should we put it on!\nPlease provide a channel mention/id/or name!`,
    
    
    `Alright lets start this giveaway in that channel! Now how long do you want this giveaway to last? (Use time format such as: "1h,1s" etc)`,
    `Perfect amount of time! Now how many winners do you want?`,
    `What should we giveaway? (Your prize)`
]//channel, title, time, winners, prize
module.exports={
    name: "giveaway",
    description: "Create a giveaway for a channel!",
    usage: "[p]giveaway <channel id/mention/name>",
    category: "giveaways",
    aliases: ['gcreate', 'giveawayy', 'gstart', 'giveaway-start'],
    timeout: 5000,
    /**
     * @param {Message} message
     * @param {Client} bot
     * @param {string[]} args

     */
    run: async(bot,message,args)=>{
        const prefix = bot.guildPrefixes.get(message.guild.id);
       
        let giveawayRole = message.guild.roles.cache.get(bot.db.get(`giveawayrole_${message.guild.id}`));
        if(!giveawayRole) giveawayRole = message.guild.roles.cache.find(r => r.name === "Giveaways") || message.guild.roles.highest;
        if(message.member.permissions.has("MANAGE_GUILD") || message.member.roles.cache.has(giveawayRole.id)){
            try{
               
               const response = await getResponses(message);
               if(response.channelId === undefined) return message.channel.send('Command canceled. Invalid channel')
               response.rolereqs = [];
               response.serverreqs = [message.guild.id];
               response.serverar = [];
               if(typeof response.channelId === 'undefined') return;
                else {
                    await message.channel.send(`Would you like role requirements?\n\nYES: Mention the roles seperated by a comma (\`,\`)\nNO: Reply with **no**`);
                    let rolereqs = await message.channel.awaitMessages(m=>m.author.id===message.author.id, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
                        return message.channel.send(`Command canceled. No response given.`)
                    });
                    let c = rolereqs.first().content.split(/,\s*/);
                    if(rolereqs.first().content.toLowerCase().startsWith('no')) response.rolereqs = [];
                    else{
                        c.filter(cc=>cc.startsWith("<@&") && cc.endsWith(">") || message.guild.roles.cache.some(r=>r.name.toLowerCase()===cc.toLowerCase() || message.guild.roles.cache.has(cc))).forEach(cc=>{
                            if(rolereqs.first().mentions.roles.size) rolereqs.first().mentions.roles.forEach(r=>response.rolereqs.push(r.id));
                            else {
                                const r = message.guild.roles.cache.get(cc) || message.guild.roles.cache.find(c=>c.name.toLowerCase()===cc.toLowerCase());
                                response.rolereqs.push(r.id);
                            }
                        })
                    }
                    const doReply = (err)=>{
                        console.error(err);
                        return message.channel.send(`Command canceled. No response given`)
                    }
                    await message.channel.send(`Would you like server requirements?\nYES: Provide an invite to these servers seperated with a comma (**,**)\nNO: Respond with **no**\nNote the bot must be in the server in order to use this requiremnt`);
                    
                let serverreqs = await message.channel.awaitMessages(m=>m.author.id===message.author.id, { max: 1, time: 60e3, erros:['time']}).catch(doReply);
                const s_ = serverreqs.first().content.split(/,\s*/);
                if(serverreqs.first().content.toLowerCase()==='no') { response.serverreqs = []}
                else{
                    s_.filter(ss_ => new RegExp(/(?:https?:\/\/)?(?:www\.)?discord(?:\.gg| (?:app)?\.com\/invite)\/(\S+)/).test(ss_)).forEach(async(ss_)=>{
                        let i = await bot.fetchInvite(ss_.split(/(?:https?:\/\/)?(?:www\.)?discord(?:\.gg| (?:app)?\.com\/invite)\/(\S+)/)[1]);
                        console.log(i.guild.name, i.toString())
                        response.serverreqs.push(i.guild.id);
                       response.serverar.push(`[${i.guild.name}](${i.toString()})`);
                        console.log(response.serverar)
                    });

                }
                
            const channel = message.guild.channels.cache.get(response.channelId)
            
           
                console.log("Confirmed Giveaway");
                let totalTime = ms(response.duration);
                 response.endsOn = new Date(Date.now() + ms(response.duration));
                 let bruhTime = Date.now() + ms(response.duration)
                 
                const giveawayEmbed = new MessageEmbed()
                            
                    .setTitle(response.prize)
                    .setDescription(`React with 🎉 to enter!\nWinner(s): ${response.winners}\nTime Left: **${humanizeDuration(totalTime, { round: true})}**\nHost: ${message.author.toString()}`)
                   .setColor("#7289da")
                        .setFooter(`Ends On`)
                        .setTimestamp(Date.now() + ms(response.duration))
            
                let t = ``;
                if(response.rolereqs.length) t += `Must Have The Following Role(s): ${response.rolereqs.map((r, i)=> `${message.guild.roles.cache.get(r).toString()}`).join(' , ')}`;
                if(response.serverreqs.length) t+= `\n\nMust be in the follwing server(s): ${response.serverar.map(s=>s)}`;
                if(response.serverreqs.length && !response.rolereqs.length) giveawayEmbed.addField(`Requirements`, t, false);
                if(!response.serverreqs.length && response.rolereqs.length) giveawayEmbed.addField(`Requirements`, t, false);
                if(response.serverreqs.length && response.rolereqs.length) giveawayEmbed.addField(`Requirements`, t, false);
                const giveawayMsg = await channel.send(`🎉 **Giveaway Time** 🎉`, giveawayEmbed)
                giveawayMsg.react("🎉");
                let duration;
                if(totalTime <= 20e3) duration = 2e3;
                if(totalTime >= 20e3+1) duration = 10e3;
                const e_m_b = new MessageEmbed()
                .setTitle(response.prize)
                .setDescription(`React with 🎉 to enter!\nWinner(s): ${response.winners}\nTime Left: **${humanizeDuration(totalTime, { round: true})}**\nHost: ${message.author.toString()}`)
               .setColor("#7289da")
                    .setFooter(`Ends On`)
                    .setTimestamp(Date.now() + ms(response.duration))
        
            let d_1 = ``;
            if(response.rolereqs.length) d_1 += `Must Have The Following Role(s): ${response.rolereqs.map((r, i)=> `${message.guild.roles.cache.get(r).toString()}`).join(' , ')}`;
            if(response.serverreqs.length) d_1+= `\n\nMust be in the follwing server(s): ${response.serverar.map(s=>s)}`;
            if(response.serverreqs.length && !response.rolereqs.length) e_m_b.addField(`Requirements`, d_1, false);
            if(!response.serverreqs.length && response.rolereqs.length) e_m_b.addField(`Requirements`, d_1, false);
            if(response.serverreqs.length && response.rolereqs.length) e_m_b.addField(`Requirements`, d_1, false);
                giveawayMsg.edit(e_m_b)
                
                function Timer(){
                    totalTime = totalTime - duration;
                    if(totalTime <= 5e3 && totalTime > 999){
                        const ih = new MessageEmbed()
                        .setTitle(response.prize + " last chance to enter!!!")
                    .setDescription(`React with 🎉 to enter!\nWinner(s): ${response.winners}\nTime Left: **${humanizeDuration(totalTime, { round: true})}**\nHost: ${message.author.toString()}`)
                   .setColor("RED")
                        .setFooter(`Ends On`)
                        .setTimestamp(Date.now() + ms(response.duration))
            
                let t_ = ``;
                if(response.rolereqs.length) t_ += `Must Have The Following Role(s): ${response.rolereqs.map((r, i)=> `${message.guild.roles.cache.get(r).toString()}`).join(' , ')}`;
                if(response.serverreqs.length) t_+= `\nMust be in the following server(s): ${response.serverar.map(s=>s)}`;
                if(response.serverreqs.length && !response.rolereqs.length) ih.addField(`Requirements`, t_, false);
                if(!response.serverreqs.length && response.rolereqs.length) ih.addField(`Requirements`, t_, false);
                if(response.serverreqs.length && response.rolereqs.length) ih.addField(`Requirements`, t_, false);
            
              
                    
                return giveawayMsg.edit(ih)
                    }
                    else if(totalTime > 999){
                        const em = new MessageEmbed()
                        .setTitle(response.prize)
                    .setDescription(`React with 🎉 to enter!\nWinner(s): ${response.winners}\nTime Left: **${humanizeDuration(totalTime, { round: true})}**\nHost: ${message.author.toString()}`)
                   .setColor("#7289da")
                        .setFooter(`Ends On`)
                        .setTimestamp(Date.now() + ms(response.duration))
            
                let t_1 = ``;
                if(response.rolereqs.length) t_1 += `Must Have The Following Role(s): ${response.rolereqs.map((r, i)=> `${message.guild.roles.cache.get(r).toString()}`).join(' , ')}`;
                if(response.serverreqs.length) t_1+= `\n\nMust be in the following server(s): ${response.serverar.map(s=>s)}`;
                if(response.serverreqs.length && !response.rolereqs.length) em.addField(`Requirements`, t_1, false);
                if(!response.serverreqs.length && response.rolereqs.length) em.addField(`Requirements`, t_1, false);
                if(response.serverreqs.length && response.rolereqs.length) em.addField(`Requirements`, t_1, false);
                
               return giveawayMsg.edit(em)
                    }
                }
                response.timer = setInterval(Timer, duration)
                response.messageId = giveawayMsg.id;
                response.title = response.prize;
                response.guildId = giveawayMsg.guild.id;
                response.isNewGiveaway = false;
                response.Resolved = false;
                response.edited = false;
                response.host = `<@${message.author.id}>`;
                await saveGiveaway(response).then(m => console.log(m));
                await scheduleGiveaways(bot, [response]).then(m => console.log(m))
                const b = new MessageEmbed()
                    .setAuthor(`A giveaway has been created!`)
                    .setColor('RANDOM')
                    .setDescription(`A giveaway is now going on in <#${channel.id}> for the prize of **${response.prize}**\nMessage ID: \`${giveawayMsg.id}\`.\nWinners: **${response.winners}**`)
                message.channel.send(b)
           
               }
              
              
                   
        
            } catch(err){
                console.log(err)
            }
        }
        else{
            message.channel.send(`Looks like you need the manage server permission or a role called giveaways!`)
        }
    }

}
async function getResponses(message) {

    const validTime = /^\d+(s|m|h|d|w)$/;
    const validNumber = /\d+/;
    const responses = { }
    

    for(let i = 0; i < prompts.length; i++) {
        await message.channel.send(prompts[i]);
        const response = await message.channel.awaitMessages(m=> m.author.id === message.author.id, { max: 1, time: 60e3, errors:['time']}).catch(err=>{
            responses.channelId = undefined;
            return message.channel.send(`Canceled. No response given`);
        });
        responses.off = false;
        const { content } = response.first();
        if(content.toLowerCase()==="cancel") {
            responses.off = true;
            responses.channelId = undefined;
            return message.chanel.send(`Canceled this command!`);
            }
        if(i ===0) {
            const c = message.guild.channels.cache.get(content) || response.first().mentions.channels.first() || message.guild.channels.cache.find(c => c.name===content);
            if(typeof c === "undefined"){
                responses.off = true;
            return message.channel.send(`Looks like thats an invalid channel.`)
            return;
        }else{
            responses.channelId = c.id;
            }

    }
       
        else if(i === 1) {
            if(validTime.test(content))
                responses.duration = content;
        else{
            message.channel.send(`Failed to parse time ${content}`)
            throw new Error(`Invalid Time Format`)
        }
            
        }
        else if(i === 2){
            if(validNumber.test(content) && Number(content) < 51)
                responses.winners = content;
            else{
                message.channel.send(`Command canceled. Please provide a **number** between 1-50.`)
                throw new Error(`Invalid number for winners`);
            }
               
        }
        else if(i === 3)
            responses.prize = content;
    }
    return responses;
}