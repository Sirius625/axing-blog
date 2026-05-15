import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSongUrl, getLyric } from '@/api/http'
import { addHistory, playSongCount } from '@/api/http1'

export interface Song {
  id: number
  name: string
  ar: { name: string }[]
  al: { picUrl: string, name?: string }
  dt: number
}

export interface LyricLine {
  time: number
  text: string
}

export const usePlayerStore = defineStore('player', () => {
  // --- 音频实例 ---
  const audioPlayer = new Audio()
  audioPlayer.volume = 0.8

  // --- 状态 ---
  const currentSong = ref<Song | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)
  const lyrics = ref<LyricLine[]>([])
  const currentLyricIndex = ref(-1)
  const showLyricModal = ref(false)

  // 播放队列
  const playQueue = ref<Song[]>([])
  const queueIndex = ref(0)

  // --- 计算属性 ---
  const progressPercent = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // --- 方法 ---

  // 设置播放队列
  const setPlayQueue = (songs: Song[], startIndex: number = 0) => {
    playQueue.value = songs
    queueIndex.value = startIndex
    if (songs.length > 0) {
      playSong(songs[startIndex])
    }
  }

  // 播放歌曲
  const playSong = async (song: Song) => {
    const indexInQueue = playQueue.value.findIndex(s => s.id === song.id)
    if (indexInQueue !== -1) {
      queueIndex.value = indexInQueue
    }

    currentSong.value = song
    lyrics.value = []
    currentLyricIndex.value = -1

    // 记录播放历史（仅登录用户）
    if (localStorage.getItem('token')) {
      addHistory(song).catch(() => {})
      playSongCount(song).catch(() => {})
    }

    try {
      const res = await getSongUrl(song.id)
      const url = res.data?.[0]?.url
      if (url) {
        audioPlayer.src = url
        audioPlayer.play()
        isPlaying.value = true
        fetchLyrics(song.id)
      } else {
        console.warn('No URL found for song:', song.name)
      }
    } catch (e) {
      console.error('Play error', e)
    }
  }

  // 获取歌词
  const fetchLyrics = async (id: number) => {
    try {
      const res = await getLyric(id)
      const lyricStr = res.data
      if (lyricStr) {
        parseLyrics(lyricStr)
      }
    } catch (e) {
      console.error('Fetch lyrics error', e)
    }
  }

  // 解析歌词
  const parseLyrics = (lyricStr: string) => {
    const lines = lyricStr.split('\n')
    const parsed: LyricLine[] = []
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    lines.forEach(line => {
      const match = timeReg.exec(line)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const milliseconds = parseInt(match[3].padEnd(3, '0'))
        const time = minutes * 60 + seconds + milliseconds / 1000
        const text = line.replace(timeReg, '').trim()
        if (text) {
          parsed.push({ time, text })
        }
      }
    })
    lyrics.value = parsed
  }

  const togglePlay = () => {
    if (!currentSong.value) return
    if (isPlaying.value) {
      audioPlayer.pause()
    } else {
      audioPlayer.play()
    }
    isPlaying.value = !isPlaying.value
  }

  const prevSong = () => {
    if (playQueue.value.length === 0) return
    let prevIndex = queueIndex.value - 1
    if (prevIndex < 0) {
      prevIndex = playQueue.value.length - 1
    }
    queueIndex.value = prevIndex
    playSong(playQueue.value[prevIndex])
  }

  const nextSong = () => {
    if (playQueue.value.length === 0) return
    let nextIndex = queueIndex.value + 1
    if (nextIndex >= playQueue.value.length) {
      nextIndex = 0
    }
    queueIndex.value = nextIndex
    playSong(playQueue.value[nextIndex])
  }

  const seekTo = (time: number) => {
    audioPlayer.currentTime = time
    currentTime.value = time
  }

  const toggleMute = () => {
    if (volume.value === 0) {
      volume.value = 0.8
      audioPlayer.volume = 0.8
    } else {
      volume.value = 0
      audioPlayer.volume = 0
    }
  }

  const setVolume = (vol: number) => {
    volume.value = vol
    audioPlayer.volume = vol / 100
  }

  const toggleLyricModal = () => {
    if (!currentSong.value) return
    showLyricModal.value = !showLyricModal.value
  }

  // 初始化音频事件监听
  const initAudioListeners = () => {
    let rafId: number | null = null

    const onTimeUpdate = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        currentTime.value = audioPlayer.currentTime
        duration.value = audioPlayer.duration || 0

        if (lyrics.value.length > 0) {
          const idx = lyrics.value.findIndex((l, i) => {
            const next = lyrics.value[i + 1]
            return audioPlayer.currentTime >= l.time && (!next || audioPlayer.currentTime < next.time)
          })
          if (idx !== -1 && idx !== currentLyricIndex.value) {
            currentLyricIndex.value = idx
          }
        }
      })
    }

    const onEnded = () => {
      isPlaying.value = false
      nextSong()
    }

    audioPlayer.addEventListener('timeupdate', onTimeUpdate)
    audioPlayer.addEventListener('ended', onEnded)

    // 返回清理函数
    return () => {
      audioPlayer.removeEventListener('timeupdate', onTimeUpdate)
      audioPlayer.removeEventListener('ended', onEnded)
    }
  }

  // 清理
  const destroy = () => {
    audioPlayer.pause()
    audioPlayer.src = ''
  }

  return {
    // 状态
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    lyrics,
    currentLyricIndex,
    showLyricModal,
    playQueue,
    queueIndex,
    // 计算属性
    progressPercent,
    // 方法
    setPlayQueue,
    playSong,
    togglePlay,
    prevSong,
    nextSong,
    seekTo,
    toggleMute,
    setVolume,
    toggleLyricModal,
    initAudioListeners,
    destroy
  }
})
