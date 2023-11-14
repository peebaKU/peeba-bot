import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } from "@discordjs/voice";
import { Client, Snowflake, TextChannel } from "discord.js";

module.exports = async (guildId: Snowflake, textChannel: TextChannel | undefined) => {
    const voiceConnection = getVoiceConnection(guildId)
    if(!voiceConnection){
        textChannel?.send("I'm not in any voice channel")
        return
    }
    voiceConnection.destroy()



    
}