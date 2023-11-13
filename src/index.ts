import { SpeechEvents, addSpeechEvent } from 'discord-speech-recognition';
import { joinVoiceChannel } from "@discordjs/voice";
import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import voiceMessage from 'discord-speech-recognition/dist/bot/voiceMessage';


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

client.on('ready',()=>{
    console.log("bot is ready");
})

client.on('messageCreate',(msg)=>{
    console.log(msg.author.username);
    if(msg.content=="join"){
        if(!msg.member?.voice.channelId){
            return;
        }
        const connection = joinVoiceChannel({
            channelId:msg.member.voice.channelId,
            guildId:msg.member.voice.guild.id,
            adapterCreator:msg.member.voice.guild.voiceAdapterCreator,
            selfDeaf:false
        })
    }
})
addSpeechEvent(client,{lang:"th-TH"})

client.on(SpeechEvents.speech,(msg:voiceMessage)=>{
    if(!msg.content){
        return
    }
    console.log(`${msg.author.username} said: ${msg.content}`);
})

const TOKEN = process.env.TOKEN
client.login(TOKEN)