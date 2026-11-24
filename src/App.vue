<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import {
  House,
  Search,
  Library,
  Heart,
  UserRound,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
} from 'lucide-vue-next'

import {
  player,
  setAudioElement,
  togglePlayback,
  playNext,
  playPrevious,
  setVolume,
  seekTo,
  updateProgress,
  toggleFavorite,
} from './data/player'

const audioElement = ref(null)

onMounted(() => {
  setAudioElement(audioElement.value)
})

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)

  return `${minutes}:${String(remaining).padStart(2, '0')}`
}

function changeProgress(event) {
  seekTo(Number(event.target.value))
}

function changeVolume(event) {
  setVolume(Number(event.target.value))
}
</script>

<template>
  <div class="app-layout">

    <aside class="sidebar">
      <div class="logo">
        <Music2 :size="27" />
        <span>Aure Music</span>
      </div>

      <div class="nav-label">МЕНЮ</div>

      <nav class="navigation">
        <RouterLink to="/" class="nav-item">
          <House :size="21" />
          <span>Главная</span>
        </RouterLink>

        <RouterLink to="/search" class="nav-item">
          <Search :size="21" />
          <span>Поиск</span>
        </RouterLink>

        <RouterLink to="/library" class="nav-item">
          <Library :size="21" />
          <span>Моя музыка</span>
        </RouterLink>

        <RouterLink to="/favorites" class="nav-item">
          <Heart :size="21" />
          <span>Избранное</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <span>© AURE MUSIC</span>
      </div>
    </aside>

    <div class="main-area">

      <header class="topbar">
        <div class="greeting">
          <span>Погружайтесь в свой музыкальный мир</span>
        </div>

        <RouterLink to="/profile" class="user-avatar" title="Профиль">
          <UserRound :size="22" />
        </RouterLink>
      </header>

      <main class="page-content">
        <RouterView />
      </main>

    </div>

    <footer class="player">

      <div class="track-info">
        <div class="track-cover">
          <img
            v-if="player.currentTrack?.cover"
            :src="player.currentTrack.cover"
            alt="Обложка"
          />
          <Music2 v-else :size="23" />
        </div>

        <div class="track-text">
          <div class="track-title">
            {{ player.currentTrack?.name || 'Выберите трек' }}
          </div>

          <div class="track-artist">
            {{ player.currentTrack?.artist || 'Aure Music' }}
          </div>
        </div>

        <button
  type="button"
  class="icon-button"
  @click.stop.prevent="toggleFavorite(player.currentTrack)"
  :title="player.currentTrack?.favorite
    ? 'Убрать из избранного'
    : 'Добавить в избранное'"
  :style="{
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '5px',
    position: 'relative',
    zIndex: 1000,
    pointerEvents: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: player.currentTrack?.favorite ? '#ff3b5c' : '#ffffff'
  }"
>
  <Heart
    :size="20"
    :stroke-width="2"
    :fill="player.currentTrack?.favorite ? '#ff3b5c' : 'none'"
    :color="player.currentTrack?.favorite ? '#ff3b5c' : '#ffffff'"
  />
</button>
      </div>

      <div class="player-controls">

        <button class="icon-button" @click="playPrevious" title="Предыдущий трек">
          <SkipBack :size="20" />
        </button>

        <button
          class="play-button"
          @click="togglePlayback"
          :disabled="!player.currentTrack"
          title="Воспроизведение"
        >
          <Pause v-if="player.isPlaying" :size="21" />
          <Play v-else :size="21" />
        </button>

        <button class="icon-button" @click="playNext" title="Следующий трек">
          <SkipForward :size="20" />
        </button>

        <div class="player-progress">
          <span>{{ formatTime(player.currentTime) }}</span>

          <input
            type="range"
            min="0"
            :max="player.duration || 0"
            step="0.1"
            :value="player.currentTime"
            @input="changeProgress"
          />

          <span>{{ formatTime(player.duration) }}</span>
        </div>

      </div>

      <div class="volume">
        <VolumeX v-if="player.volume === 0" :size="19" />
        <Volume2 v-else :size="19" />

        <input
          class="volume-line"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="player.volume"
          @input="changeVolume"
        />
      </div>

    </footer>

    <audio
      ref="audioElement"
      @timeupdate="updateProgress"
      @loadedmetadata="updateProgress"
      @durationchange="updateProgress"
      @ended="playNext"
    ></audio>

  </div>
</template>
