import { reactive } from 'vue'

const FAVORITES_KEY = 'aure-favorite-tracks'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
  } catch {
    return []
  }
}

const savedFavorites = loadFavorites()

// Основной каталог Aure Music
const initialTracks = [
  {
    id: 'deftones-976-evil',
    name: '976-EVIL',
    artist: 'Deftones',
    url: '/media/tracks/audio/deftones-976-evil.mp3',
    cover: '/media/tracks/covers/976-evil-deftones.jpg',
  },
  {
    id: 'deftones-beware',
    name: 'Beware',
    artist: 'Deftones',
    url: '/media/tracks/audio/beware-deftones.mp3',
    cover: '/media/tracks/covers/beware-deftones.jpg',
  },
  {
    id: 'type-o-negative-black-no-1',
    name: 'Black No. 1',
    artist: 'Type O Negative',
    url: '/media/tracks/audio/type-o-negative-black-no-1.mp3',
    cover: '/media/tracks/covers/black-no-1-type-o-negative.jpg',
  },
  {
    id: 'deftones-cherry-waves',
    name: 'Cherry Waves',
    artist: 'Deftones',
    url: '/media/tracks/audio/cherry-waves-deftones.mp3',
    cover: '/media/tracks/covers/cherry-waves-deftones.jpg',
  },
  {
    id: 'deftones-dai-the-flu',
    name: 'Dai the Flu',
    artist: 'Deftones',
    url: '/media/tracks/audio/dai-the-flu.mp3',
    cover: '/media/tracks/covers/dai-the-flu-deftones.jpg',
  },
  {
    id: 'deftones-entombed',
    name: 'Entombed',
    artist: 'Deftones',
    url: '/media/tracks/audio/entombed-deftones.mp3',
    cover: '/media/tracks/covers/entombed-deftones.jpg',
  },
  {
    id: 'ozzy-osbourne-hellraiser',
    name: 'Hellraiser',
    artist: 'Ozzy Osbourne',
    url: '/media/tracks/audio/hellraiser-ozzy-osbourne.mp3',
    cover: '/media/tracks/covers/hellraiser-ozzy-osbourne.jpg',
  },
  {
    id: 'him-join-me-in-death',
    name: 'Join Me in Death',
    artist: 'HIM',
    url: '/media/tracks/audio/join-me-in-death-him.mp3',
    cover: '/media/tracks/covers/join-me-in-death-him.jpg',
  },
  {
    id: 'papa-roach-last-resort',
    name: 'Last Resort',
    artist: 'Papa Roach',
    url: '/media/tracks/audio/last-resort.mp3',
    cover: '/media/tracks/covers/last-resort-papa-roach.jpg',
  },
  {
    id: 'type-o-negative-life-is-killing-me',
    name: 'Life Is Killing Me',
    artist: 'Type O Negative',
    url: '/media/tracks/audio/life-is-killing-me-type-o-negative.mp3',
    cover: '/media/tracks/covers/life-is-killing-me-type-o-negative.jpg',
  },
  {
    id: 'deftones-mascara',
    name: 'Mascara',
    artist: 'Deftones',
    url: '/media/tracks/audio/mascara-deftones.mp3',
    cover: '/media/tracks/covers/mascara-deftones.jpg',
  },
  {
    id: 'type-o-negative-out-of-the-fire',
    name: 'Out of the Fire',
    artist: 'Type O Negative',
    url: '/media/tracks/audio/out-of-the-fire-type-o-negative.mp3',
    cover: '/media/tracks/covers/out-of-the-fire-type-o-negative.jpg',
  },
  {
    id: 'deftones-risk',
    name: 'Risk',
    artist: 'Deftones',
    url: '/media/tracks/audio/risk-deftones.mp3',
    cover: '/media/tracks/covers/risk-deftones.jpg',
  },
  {
    id: 'deftones-rosemary',
    name: 'Rosemary',
    artist: 'Deftones',
    url: '/media/tracks/audio/rosemary-deftones.mp3',
    cover: '/media/tracks/covers/rosemary-deftones.jpg',
  },
  {
    id: 'type-o-negative-santana-medley',
    name: 'Santana Medley',
    artist: 'Type O Negative',
    url: '/media/tracks/audio/santana-medley-type-o-negative.mp3',
    cover: '/media/tracks/covers/santana-medley-type-o-negative.jpg',
  },
  {
    id: 'deftones-sextape',
    name: 'Sextape',
    artist: 'Deftones',
    url: '/media/tracks/audio/sextape-deftones.mp3',
    cover: '/media/tracks/covers/sextape-deftones.jpg',
  },
  {
    id: 'deftones-xerces',
    name: 'Xerces',
    artist: 'Deftones',
    url: '/media/tracks/audio/xerces-deftones.mp3',
    cover: '/media/tracks/covers/xerces-deftones.jpg',
  },
].map(track => ({
  ...track,
  favorite: savedFavorites.includes(track.id),
  duration: 0,
  inLibrary: true,
}))

export const player = reactive({
  tracks: initialTracks,
  currentTrack: null,
  isPlaying: false,
  isExpanded: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
})

let audioElement = null

function saveFavorites() {
  const favorites = player.tracks
    .filter(track => track.favorite && typeof track.id === 'string')
    .map(track => track.id)

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function setAudioElement(element) {
  audioElement = element

  if (audioElement) {
    audioElement.volume = player.volume
  }
}

export function addTrack(file) {
  const track = {
    id: `upload-${Date.now()}-${Math.random()}`,
    name: file.name.replace(/\.[^/.]+$/, ''),
    artist: 'Моя музыка',
    url: URL.createObjectURL(file),
    cover: null,
    favorite: false,
    duration: 0,
    inLibrary: true,
  }

  player.tracks.push(track)

  return track
}

export function playTrack(track) {
  if (!audioElement || !track?.url) return

  if (player.currentTrack?.id === track.id) {
    togglePlayback()
    return
  }

  player.currentTrack = track
  player.currentTime = 0
  player.duration = track.duration || 0

  audioElement.src = track.url
  audioElement.load()

  audioElement.play()
    .then(() => {
      player.isPlaying = true
    })
    .catch(error => {
      console.error('Не удалось воспроизвести трек:', error)
      player.isPlaying = false
    })
}

export function togglePlayback() {
  if (!audioElement || !player.currentTrack) return

  if (audioElement.paused) {
    audioElement.play()
      .then(() => {
        player.isPlaying = true
      })
      .catch(error => {
        console.error('Не удалось продолжить воспроизведение:', error)
        player.isPlaying = false
      })
  } else {
    audioElement.pause()
    player.isPlaying = false
  }
}

export function playNext() {
  if (!player.tracks.length) return

  const currentIndex = player.tracks.findIndex(
    track => track.id === player.currentTrack?.id
  )

  const nextIndex = currentIndex < 0
    ? 0
    : (currentIndex + 1) % player.tracks.length

  playTrack(player.tracks[nextIndex])
}

export function playPrevious() {
  if (!player.tracks.length) return

  if (audioElement && audioElement.currentTime > 3) {
    audioElement.currentTime = 0
    player.currentTime = 0
    return
  }

  const currentIndex = player.tracks.findIndex(
    track => track.id === player.currentTrack?.id
  )

  const previousIndex = currentIndex <= 0
    ? player.tracks.length - 1
    : currentIndex - 1

  playTrack(player.tracks[previousIndex])
}

export function setVolume(value) {
  const volume = Math.max(0, Math.min(1, Number(value)))

  player.volume = volume

  if (audioElement) {
    audioElement.volume = volume
  }
}

export function seekTo(value) {
  if (!audioElement || !Number.isFinite(audioElement.duration)) return

  audioElement.currentTime = value
  player.currentTime = value
}

export function updateProgress() {
  if (!audioElement) return

  player.currentTime = audioElement.currentTime
  player.duration = audioElement.duration || 0

  if (player.currentTrack) {
    player.currentTrack.duration = player.duration
  }
}

export function toggleFavorite(track = player.currentTrack) {
  if (!track) return

  track.favorite = !track.favorite
  saveFavorites()
}