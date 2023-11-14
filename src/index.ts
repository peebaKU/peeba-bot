import { SpeechEvents, addSpeechEvent } from 'discord-speech-recognition';
import { Client, GatewayIntentBits, VoiceChannel } from "discord.js";
import { config } from "dotenv";
import voiceMessage from 'discord-speech-recognition/dist/bot/voiceMessage';
import DisTube from 'distube';
import { joinVoiceChannel } from '@discordjs/voice';
import { SongQueue } from './libs/SongQueue';


config()

const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
    ]
})
export type QueueManager = { [guildId: string]: SongQueue };
const queueManager: QueueManager = {};
export { queueManager };

const distube = new DisTube(client,{
    leaveOnStop:false
})


client.on('ready',()=>{
    console.log("bot is ready");
})


client.on('messageCreate',(msg)=>{
    console.log(msg.author.username);
    if(msg.content=="join" || msg.content==="+j"){
        if(!msg.member?.voice.channelId){
            return;
        }
        const connection = joinVoiceChannel({
            channelId:msg.member.voice.channelId,
            guildId:msg.member.voice.guild.id,
            adapterCreator:msg.member.voice.guild.voiceAdapterCreator,
            selfDeaf:false
        })
        require("./commands/join")(client,msg.member,msg)
        
    }
})
addSpeechEvent(client,{lang:"th-TH",profanityFilter:false})

client.on(SpeechEvents.speech,async (msg:voiceMessage)=>{
    if(!msg.content){
        return
    }
    if(msg.content.startsWith("เปิดเพลง") && msg.content.split("เปิดเพลง")[1] != "")
    {
        const songName = `เพลง${msg.content.split("เปิดเพลง")[1]}`
        console.log(songName);
        require("./commands/play")(client,msg.member,songName,undefined,queueManager)
    }
    else if(msg.content.startsWith("ผีบ้าออกไป"))
    {
        require("./commands/leave")(msg.guild.id,undefined)
    }
    else if(msg.content.startsWith("เปลี่ยนเพลง")){
        require("./commands/skip")(msg.guild.id,undefined)
    }

    
})

const TOKEN = process.env.TOKEN
client.login(TOKEN)