const express = require("express");

const app = express();
const { Timers } = require("./vars.js")
const { Music } = require('./vars.js');

module.exports = async(bot) => {
    app.listen(9897, () => console.log(`Loading on port ${process.env.PORT}`));
    app.get(`/api/v1/view/guilds/get/:id`, async(req, res) => {
        const { id } = req.params;
        if(!bot.guilds.cache.has(id)){
            res.status(404).send({
                message: "Invalid Guild ID",
                method: "GET",
                status: 404
                
            });

        } else if(bot.guilds.cache.has(id)){
            let arr = [];
            let Musiscs = Music.get(id);
            if(!Musiscs) Musiscs = { 
                msg: 'Not Found',
                code: 404,
                method: 'GET'
            }
            const guild = bot.guilds.cache.get(id)
            const obj = {
                Guild: {
                    id: id,
                    name: bot.guilds.cache.get(id).name,
                    owner:{
                        tag: guild.owner.user.tag,
                        id: guild.owner.user.id
                    }
                },
                timers: arr,
                music: Musiscs
            }
            if(Timers.has(id)){ Timers.get(id).Timers.forEach(async t =>{
                arr.push(t);
            });
            res.status(200).send(obj)
        }
           
            res.status(200).send(JSON.stringify(obj));
        }
   });
   
}