const db = require('quick.db')
const ReactionRole = require('../../database/models/ReactionRole')

module.exports=async(bot, reaction, user)=>{
    if(reaction.emoji.name !== '⭐'){
        try{
            if(reaction.message.partial) {
            const fullMsg = await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            ReactionRole.findOne({ Guild: fullMsg.guild.id, Channel: fullMsg.channel.id, Message: fullMsg.id, Emoji: reaction.emoji.id, Active: true}, async(err, data) =>{
                if(err) throw err;
                if(!data) return console.log('A user reacted but no reaction role found.');
                else if(data){
                    const role = await fullMsg.guild.roles.fetch(data.Role);
                    const message = await fullMsg.channel.messages.fetch(data.Message)
                    const member = await fullMsg.guild.members.fetch(user.id);
                    await member.roles.remove(role, `Simple reaction role`);
                    console.log(`${user.tag} has been removed from the role ${role.name} with a reaction role`)
                }
            })
            } else{
                const fullMsg = reaction.message;
                ReactionRole.findOne({ Guild: fullMsg.guild.id, Channel: fullMsg.channel.id, Message: fullMsg.id, Emoji: reaction.emoji.id, Active: true}, async(err, data) =>{
                    if(err) throw err;
                    if(!data) return console.log('Auser reacted but no reaction role found.');
                    else if(data){
                        const role = await fullMsg.guild.roles.fetch(data.Role);
                        const message = await fullMsg.channel.messages.fetch(data.Message)
                        const member = await fullMsg.guild.members.fetch(user.id);
                        await member.roles.remove(role, `Simple reaction role`);
                        console.log(`${user.tag} has been removed from the role ${role.name} with a reaction role`)
                    }
                })
            }

        }catch(err){
            console.log(err)
        }
    }
    if(reaction.emoji.name==='⭐'){
        if(reaction.message.partial){
            try{
                const fetchedMsg = await reaction.message.fetch();
                if(reaction.partial) await reaction.fetch();
                const users = await fetchedMsg.reactions.cache.get('⭐').users.fetch();
                const totalNeededToStar = db.get(`starboardchannel_${fetchedMsg.guild.id}`);
                if(!totalNeededToStar) return;
                const totsCount = totalNeededToStar.starsCount;
            
                const starboard = await bot.channels.fetch(db.get(`starboardchannel_${fetchedMsg.guild.id}`).channelId);
                const messages = await starboard.messages.fetch({ limit: 100 });
                const alreadyThere = messages.find(m => m.embeds[0].footer && m.embeds[0].footer.text.includes(fetchedMsg.id));
                if(alreadyThere){
                    if(users.size === 0) return alreadyThere.delete();
                    alreadyThere.edit(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`);
                }
        }catch(err){
                console.log(err)
            }
        }else{
            const fetchedMsg = reaction.message;
            const users = await fetchedMsg.reactions.cache.get('⭐').users.cache.filter(u=>!u.bot)
                const starboard = await bot.channels.fetch(db.get(`starboardchannel_${fetchedMsg.guild.id}`).channelId);
                const messages = await starboard.messages.fetch({ limit: 100 });
                const alreadyThere = messages.find(m => m.embeds[0].footer && m.embeds[0].footer.text.includes(fetchedMsg.id));
                if(alreadyThere){
                    alreadyThere.edit(`⭐ **${users.size}** in <#${fetchedMsg.channel.id}>`);
                }
        }
    }
}