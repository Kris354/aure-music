<script setup>
import { computed } from 'vue'
import { Heart, Music2, Play, Pause } from 'lucide-vue-next'
import { player, playTrack, toggleFavorite } from '../data/player'

const favoriteTracks = computed(() =>
  player.tracks.filter(track => track.favorite)
)
</script>

<template>
  <div class="library-page favorites-page">

    <div class="library-heading">
      <div>
        <h1>Любимые треки</h1>
        <p>Музыка, которая тебе особенно нравится</p>
      </div>
    </div>

    <div v-if="favoriteTracks.length" class="playlist-track-list">

      <div class="playlist-track-heading">
        <span>Название</span>
        <span>Исполнитель</span>
      </div>

      <div
        v-for="(track, index) in favoriteTracks"
        :key="track.id"
        class="playlist-track-row"
      >
        <span class="playlist-track-number">{{ index + 1 }}</span>

        <div class="playlist-track-icon">
          <img
            v-if="track.cover"
            :src="track.cover"
            :alt="track.name"
          />
          <Music2 v-else :size="18" />
        </div>

        <div class="playlist-track-name">
          <strong>{{ track.name }}</strong>
          <span>{{ track.artist }}</span>
        </div>

        <button
          class="favorite-remove-button"
          title="Убрать из избранного"
          @click="toggleFavorite(track)"
        >
          <Heart :size="19" fill="currentColor" />
        </button>

        <button
          class="playlist-track-play"
          :title="player.currentTrack?.id === track.id && player.isPlaying
            ? 'Сейчас играет'
            : 'Воспроизвести'"
          @click="playTrack(track)"
        >
          <Pause
            v-if="player.currentTrack?.id === track.id && player.isPlaying"
            :size="17"
            fill="currentColor"
          />
          <Play v-else :size="17" />
        </button>
      </div>

    </div>

    <div v-else class="library-empty favorites-empty">
      <Heart :size="42" />
      <h2>Здесь пока пусто</h2>
      <p>
        Отмечай понравившиеся треки сердечком —
        они появятся здесь
      </p>
    </div>

  </div>
</template>
