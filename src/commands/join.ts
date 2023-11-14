import { Client, GuildMember, Message } from "discord.js";
import {joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, createAudioResource} from "@discordjs/voice"
import { queueManager } from "../index";
import { SongQueue } from "../libs/SongQueue";
import { setTimeout } from "timers";


module.exports = async (client: Client, requester: GuildMember, message: Message | undefined): Promise<void> => {

    const resource = createAudioResource('rct.mp3')
    if(!requester.voice.channel){
        if(message != undefined){await message.channel.send({content: "You are not in any voice channel!"})}
        return 
    }

    if(getVoiceConnection(requester.guild.id)){
        if(message != undefined){await message.channel.send({content: "I'm already in voice channel!"})}
        return
    }

    const voiceConnection = joinVoiceChannel({
        guildId: requester.guild.id,
        channelId: requester.voice.channel.id,
        adapterCreator: requester.guild.voiceAdapterCreator,
        selfDeaf: false
    })
    
    queueManager[requester.guild.id] = new SongQueue(requester.guild.id, voiceConnection)
    setTimeout(()=>{
        const player = queueManager[requester.guild.id].audioPlayer
        voiceConnection.subscribe(player!)
        queueManager[requester.guild.id].audioPlayer?.play(resource)
    },200)
    
    voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
        console.log("Bot disconnected!")
        if(queueManager[requester.guild.id]){
            delete queueManager[requester.guild.id]
            console.log("Queue destroyed")
        }
    })

    if((message != undefined) && (voiceConnection)){
        await message.channel.send({content: `I'm joined ${requester.voice.channel.name} channel!`})
        return
    }
    return

    

}