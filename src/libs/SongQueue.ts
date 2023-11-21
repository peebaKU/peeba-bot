import { AudioPlayer, AudioResource, createAudioPlayer, getVoiceConnection, NoSubscriberBehavior, VoiceConnection, AudioPlayerState, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { Snowflake, EmbedBuilder, TextChannel } from "discord.js";
import { Song, SongInfo } from "./Song";
import { Queue } from "queue-typescript"
const Gtts = require('gtts')

export class SongQueue {
    static addSong(song: any) {
        throw new Error("Method not implemented.");
    }
    guildId: Snowflake;
    audioPlayer: AudioPlayer | undefined
    songList: Song[] = []
    notificationQueue = new Queue<AudioResource>()
    notificationPlayer: AudioPlayer
    pointer: number = 0
    voiceConnection: VoiceConnection;
    constructor(guildId: Snowflake, voiceConnection: VoiceConnection) {
        this.guildId = guildId
        this.voiceConnection = voiceConnection
        this.notificationPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        })
    }

    async addSong(song: Song) {
        this.songList.push(song)
        if (!this.audioPlayer) { await this.playSong() }

    }

    async playSong() {
        const audioResource: AudioResource = await this.getCurrentSong().getAudioResource()
        this.audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        })
        this.voiceConnection.subscribe(this.audioPlayer)
        this.audioPlayer.play(audioResource)

        this.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
            // console.log(`Current pointer is ${this.pointer} of list lenght ${this.songList.length}`)
            console.log('song ended')
            await this.nextSong()
        })
    }

    async nextSong() {

        const currentSong = await this.getCurrentSong()
        const songDuration = (await currentSong.getSongInfo()).duration
        let currentAudioResource = await currentSong.getAudioResource()
        const isSkip = (currentAudioResource.playbackDuration <= (songDuration * 0.8) * 1000)
        const info = await this.getCurrentSong().getSongInfo()



        this.pointer += 1;
        if (this.pointer >= (this.songList.length)) {
            this.audioPlayer = undefined;
            console.log("Queue End")
            return
        }
        else {
            await this.playSong()
            return
        }
    }

    stopSpeaking() {
        if (!(this.notificationPlayer.state.status == AudioPlayerStatus.Playing)) {
            return
        }

        this.notificationPlayer.stop()
    }

    skipSong() {
        this.audioPlayer?.stop()
        console.log("Song Skip")
    }

    getCurrentSong(): Song {
        let currentSong = this.songList[this.pointer]
        return currentSong
    }

    async showQueue(textChannel: TextChannel): Promise<void> {
        const embed: EmbedBuilder = new EmbedBuilder()

        for (let i: number = 0; i < this.songList.length; i++) {
            const info = await this.songList[i].getSongInfo()
            if (i == this.pointer) {
                embed.addFields({
                    name: `--> ${i}. ** ${info.title} **`,
                    value: `------------------------------`, inline: false
                })
                embed.setThumbnail(info.thumbnail)
            }
            else {
                embed.addFields({ name: `${i}. ${info.title}`, value: `------------------------------`, inline: false })
            }
        }
        await textChannel.send({ embeds: [embed] })

    }
}

