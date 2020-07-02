const ms = require("ms");
const { MessageEmbed } = require('discord.js');

const { Timers } = require('../../vars.js');
module.exports = {
    name: 'timer',
    aliases: ['timer-create', 'timers'],
    usage: '[p]timer <time: (h/m/w/d/s)> <reminder>',
    description: 'Set a timeout for your server!',
    category: 'fun',
    run: async(bot, message, args) => {
        if(!args[0]) return message.channel.send('Please specify a time!');
        let time = ms(args[0])
        const timerid = Math.floor(Math.random() * parseInt(message.channel.id) / 10 - 10);
        if(!args.slice(1).join(" ")) return message.channel.send('Please specify a reminder');
        if(Timers.has(message.guild.id)){
            Timers.get(message.guild.id).Timers.push({
                id: message.author.id,
                reminder: args.slice(1).join(' '),
                endsOn: new Date(Date.now() + time).toLocaleDateString("en-US"),
                timer: time,
                ended: false,
                timerID: timerid,
                channel: message.channel.id
            });
            
            console.log(time)
            message.channel.send({
                embed:{
                    description: `Your timer has been set for \`${ms(time, { long: true})}\`.${args.slice(1).join(' ')}`,
                    color: 'RANDOM'
                }
            })
            setTimeout(async () =>{
                const embed = new MessageEmbed()
                    .setTitle(`Your timer in ${message.guild.name} has ended`)
                    .setDescription(args.slice(1).join(' '))
                    .setColor('GREEN')
                message.author.send(embed).catch(err =>{
                    message.channel.send(message.author.toString(), embed);
                    console.error(err);
                });
                Timers.get(message.guild.id).Timers.find(t => t.timerID === timerid).ended = true;
    
            }, time)
    
        }
        else {
            Timers.set(message.guild.id, {
            Timers: [
                {
                id: message.author.id,
                reminder: args.slice(1).join(' '),
                endsOn: new Date(Date.now() + time).toLocaleDateString("en-US"),
                timer: time,
                ended: false,
                timerID: timerid,
                channel: message.channel.id
            }
        ]
        })
        message.channel.send({
            embed:{
                description: `Your timer has been set for \`${ms(time, { long: true})}\`. ${args.slice(1).join(' ')}`,
                color: 'RANDOM'
            }
        })
        setTimeout(async () =>{
            const embed = new MessageEmbed()
                .setTitle(`Your timer in ${message.guild.name} has ended`)
                .setDescription(args.slice(1).join(' '))
                .setColor('GREEN')
            message.author.send(embed).catch(err =>{
                message.channel.send(message.author.toString(), embed);
                console.error(err);
            });
            Timers.get(message.guild.id).Timers.find(t => t.timerID === timerid).ended = true;

        }, time)

    }
    }
}