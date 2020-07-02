const ReactionRole = require('../../database/models/ReactionRole');
const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
module.exports = {
    name: 'rradd',
    aliases: ['reaction-role-add', 'rr-add', 'reactionroleadd', 'crm', 'crr'],
    description: `Setup a reaction role for your server!`,
    usage: '[p]rradd | [p]rradd <channel: mention/id/name> <messageID> <emoji mention/id/name> <role mention/id/name> <add/remove>',
    category: 'reaction_roles',
    run: async(bot, message, args) => {
        if(!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send(`You need the manage roles permission in order to use this command!`);
         if(args[0] && args[1] && args[2] && args[3] && args[4]){
             const channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[0]) || message.mentions.channels.first();
             if(channel){
                const msg = await channel.messages.fetch(args[1]);
                if(message){
                    const emojis = args.join(" ").split(regex)[3];
                    const emoji = bot.emojis.cache.get(emojis) || bot.emojis.cache.find(e => e.name === args[2]) || bot.emojis.cache.get(args[2]);
                    if(emoji){
                        const role = message.guild.roles.cache.get(args[3]) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args[3]);
                        if(role){
                            if(args[4].toLowerCase()==="add"){
                                const reactionrole = new ReactionRole({
                                    Guild: message.guild.id,
                                    Role: role.id,
                                    Emoji: emoji.id,
                                    Message: msg.id,
                                    Channel: channel.id,
                                    Active: true,
                                    RemoveRole: false
                                });
                                reactionrole.save().then(console.log).catch(console.error);
                                await msg.react(emoji);
                                await message.channel.send({
                                    embed:{
                                        description: `The emoji ${emoji.toString()} has been set to add the role ${role.toString()} for [this reaction role](${msg.url})`,
                                        color: 'RANDOM'
                                    }
                                });
                            } else if(args[4].toLowerCase()==="remove"){
                                const reactionrole = new ReactionRole({
                                    Guild: message.guild.id,
                                    Role: role.id,
                                    Emoji: emoji.id,
                                    Message: msg.id,
                                    Channel: channel.id,
                                    Active: true,
                                    RemoveRole: true
                                });
                                reactionrole.save().then(console.log).catch(console.error);
                                await msg.react(emoji);
                                await message.channel.send({
                                    embed:{
                                        description: `The emoji ${emoji.toString()} has been set to remove the role ${role.toString()} for [this reaction role](${msg.url})`,
                                        color: 'RANDOM'
                                    }
                                });
                            } else{
                                return message.channel.send(`Please choose an option from the follwing: \`add\` - Adds the role\n\`remove\` - removes the role.`)
                            }
                        } else{
                            return message.channel.send(`Invalid role. Try using the collector instead!`)
                        }
                    } else{
                        return message.channel.send(`Invalid emoji. Try using the collector instead!`)
                    }
                }else{
                    return message.channel.send(`Invalid Message. try using the collector instead!`)
                }
             } else{
                 return message.channel.send(`Invalid Channel. Try using the collector instead!`)
             }
             return;
         } //rradd #channel message emoji role add/remove
        await message.channel.send(`Hello what chanel would you like this to be in?`);
        let channel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
            console.log(err);
            return message.channel.send(`Command Canceled no response was given.`)
        })
        const chan = channel.first().mentions.channels.first() || message.guild.channels.cache.get(channel.first().content) || message.guild.channels.cache.find(c => c.name === channel.first().content);
        if(chan){
            await message.channel.send(`What emoji would you like. Note: Unicode emojis dont work at the moment but dont worry were fixing it.`);
            const emojis = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                console.log(err);
                return message.channel.send(`Command Canceled no response was given.`)
            });
            const emoje = emojis.first().content;
            const emoji = bot.emojis.cache.get(emoje) || bot.emojis.cache.find(e => e.name === emoje) || bot.emojis.cache.get(emoje.split(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)[3]);
            if(emoji){
                await message.channel.send(`Would you like to add a message id or let the bot make one by itself? Respond with yes if you would, or no if you would like the bot to do it itself?`);
                const isDenied = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                    console.log(err);
                    return message.channel.send(`Command Canceled no response was given.`)
                });
                const isAccepted = isDenied.first().content;
                if(isAccepted.toLowerCase() === "yes"){
                    await message.channel.send(`Please specify a message id.`);
                    const messageIDS = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err =>{
                        console.log(err);
                        return message.channel.send(`Command Canceled no response was given.`)
                    });
                    const messageId = messageIDS.first().content;
                    const msg = await chan.messages.fetch(messageId).catch(Err =>{
                        console.log(Err);
                        return message.channel.send(`Command Canceled. Unfound message id`);
                    });
                    if(msg){
                        await message.channel.send(`Would you like to add or remove the role? Respond with \`add\` for add and \`remove\` for removing.`);
                        const isRoleAdded = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.log(err);
                            return message.channel.send(`Command canceled. No response given`)
                        });
                        const pollOfIsRoleAdded = isRoleAdded.first().content;
                        if(pollOfIsRoleAdded.toLowerCase()==="add"){
                            await message.channel.send(`Finally what role would you like!`);
                        const roles = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.error(err);
                            return message.channel.send(`Command canceled no response was given.`);

                        });
                        const role = roles.first().mentions.roles.first() || message.guild.roles.cache.get(roles.first().content) || message.guild.roles.cache.find(c=>c.name===roles.first().content);
                        if(role){
                           if(role.position > message.member.roles.highest.position && message.author.id !== message.guild.ownerID) return message.channel.send(`This role is higher than you!`)
                            const reactionrole = new ReactionRole({
                                Guild: message.guild.id,
                                Role: role.id,
                                Emoji: emoji.id,
                                Message: msg.id,
                                Channel: chan.id,
                                Active: true,
                                RemoveRole: false
                            });
                            reactionrole.save().then(console.log).catch(console.error);
                            await msg.react(emoji);
                            await message.channel.send({
                                embed:{
                                    description: `The emoji ${emoji.toString()} has been co responded with the role ${role.toString()} for [this reaction role](${msg.url})`,
                                    color: 'RANDOM'
                                }
                            });
                        
                        
                        } else{
                            return message.channel.send(`Unfound role.`)
                        }
                        } else if(pollOfIsRoleAdded.toLowerCase()==="remove"){
                            await message.channel.send(`Finally what role would you like!`);
                        const roles = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.error(err);
                            return message.channel.send(`Command canceled no response was given.`);

                        });
                        const role = roles.first().mentions.roles.first() || message.guild.roles.cache.get(roles.first().content) || message.guild.roles.cache.find(c=>c.name===roles.first().content);
                        if(role){
                           
                            const reactionrole = new ReactionRole({
                                Guild: message.guild.id,
                                Role: role.id,
                                Emoji: emoji.id,
                                Message: msg.id,
                                Channel: chan.id,
                                Active: true,
                                RemoveRole: true
                            });
                            reactionrole.save().then(console.log).catch(console.error);
                            await msg.react(emoji);
                            await message.channel.send({
                                embed:{
                                    description: `The emoji ${emoji.toString()} has been co responded to remove the role ${role.toString()} for [this reaction role](${msg.url})`,
                                    color: 'RANDOM'
                                }
                            });
                        
                        
                        } else{
                            return message.channel.send(`Unfound role.`)
                        }
                        }
                    
                    } else{
                        return message.channel.send(`Command canceled. Unfound message id`)
                    }
                } else if(isAccepted.toLowerCase()==="no"){
                    
                    if(chan){
                        await message.channel.send(`Would you like to add or remove the role? Respond with \`add\` for add and \`remove\` for removing.`);
                        const isRoleAdded = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.log(err);
                            return message.channel.send(`Command canceled. No response given`)
                        });
                        const pollOfIsRoleAdded = isRoleAdded.first().content;
                        if(pollOfIsRoleAdded.toLowerCase()==="add"){
                            await message.channel.send(`Finally what role would you like!`);
                        const roles = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.error(err);
                            return message.channel.send(`Command canceled no response was given.`);

                        });
                       
                        const role = roles.first().mentions.roles.first() || message.guild.roles.cache.get(roles.first().content) || message.guild.roles.cache.find(c=>c.name===roles.first().content);
                        if(role){
                            const msg = await chan.send({
                                embed:{
                                    title: `Reaction Role`,
                                    description: `A reaction role has been added!\n\nReact with ${emoji.toString()} to get the role \`${role.name}\``,
                                    color: 'RANDOM',
                                    footer:{
                                        text: 'Reaction Role bot made by Mike H.',
                                        icon_url: message.guild.iconURL({ dynamic: true})
                                    },
                                    timestamp: new Date()
        
                                }
                            });
                            const reactionrole = new ReactionRole({
                                Guild: message.guild.id,
                                Role: role.id,
                                Emoji: emoji.id,
                                Message: msg.id,
                                Channel: chan.id,
                                Active: true,
                                RemoveRole: false
                            });
                            reactionrole.save().then(console.log).catch(console.error);
                            await msg.react(emoji);
                            await message.channel.send({
                                embed:{
                                    description: `The emoji ${emoji.toString()} has been co responded with the role ${role.toString()} for [this reaction role](${msg.url})`,
                                    color: 'RANDOM'
                                }
                            });
                        
                        
                        } else{
                            return message.channel.send(`Unfound role.`)
                        }
                        } else if(pollOfIsRoleAdded.toLowerCase()==="remove"){
                            await message.channel.send(`Finally what role would you like!`);
                        const roles = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60e3, errors: ['time']}).catch(err=>{
                            console.error(err);
                            return message.channel.send(`Command canceled no response was given.`);

                        });
                        const role = roles.first().mentions.roles.first() || message.guild.roles.cache.get(roles.first().content) || message.guild.roles.cache.find(c=>c.name===roles.first().content);
                        if(role){
                            const msg = await chan.send({
                                embed:{
                                    title: `Reaction Role`,
                                    description: `A reaction role has been added!\n\nReact with ${emoji.toString()} to get removed from the role \`${role.name}\``,
                                    color: 'RANDOM',
                                    footer:{
                                        text: 'Reaction Role bot made by Mike H.',
                                        icon_url: message.guild.iconURL({ dynamic: true})
                                    },
                                    timestamp: new Date()
        
                                }
                            });
                           
                            const reactionrole = new ReactionRole({
                                Guild: message.guild.id,
                                Role: role.id,
                                Emoji: emoji.id,
                                Message: msg.id,
                                Channel: chan.id,
                                Active: true,
                                RemoveRole: true
                            });
                            reactionrole.save().then(console.log).catch(console.error);
                            await msg.react(emoji);
                            await message.channel.send({
                                embed:{
                                    description: `The emoji ${emoji.toString()} has been co responded to remove the rol ${role.toString()} for [this reaction role](${msg.url})`,
                                    color: 'RANDOM'
                                }
                            });
                        
                        
                        } else{
                            return message.channel.send(`Unfound role.`)
                        }
                        }
                    
                    } else{
                        return message.channel.send(`Command canceled. Unfound message id`)
                    }
                }
            } else{
                return message.channel.send(`Command canceled. Either the emoji doesn't exist or isnt in the bots cache.`)
            }
         } else{
            return message.channel.send(`Command canceled. Invalid Channel`)
        }
    }
}