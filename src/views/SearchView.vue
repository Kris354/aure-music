<script setup>
import { ref, computed } from 'vue'
import { player, playTrack } from '../data/player'

const searchQuery = ref('')

const filteredTracks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return []

  return player.tracks.filter(track => {
    const name = track.name?.toLowerCase() || ''
    const artist = track.artist?.toLowerCase() || ''

    return name.includes(query) || artist.includes(query)
  })
})

function clearSearch() {
  searchQuery.value = ''
}

function playSelectedTrack(track) {
  playTrack(track)
}
</script>

<template>
  <section class="search-page">
    <div class="search-header">
      <h1>Поиск</h1>
      <p>Найди музыку под своё настроение</p>
    </div>

    <div class="search-bar">
      <span class="search-icon">⌕</span>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск треков и исполнителей..."
      />

      <button
        v-if="searchQuery"
        class="search-clear-button"
        @click="clearSearch"
        aria-label="Очистить поиск"
      >
        ×
      </button>
    </div>

    <div v-if="!searchQuery.trim()" class="search-empty">
      <div class="search-empty-icon">♫</div>
      <h2>Что будем слушать?</h2>
      <p>Введи название трека или имя исполнителя</p>
    </div>

    <div v-else-if="filteredTracks.length" class="search-results">
      <div class="search-section-heading">
        <h2>Результаты поиска</h2>
        <span>{{ filteredTracks.length }}</span>
      </div>

      <div class="search-track-list">
        <button
          v-for="(track, index) in filteredTracks"
          :key="track.id"
          class="search-track-row"
          @click="playSelectedTrack(track)"
        >
          <div class="search-track-cover">
            <span>♫</span>
          </div>

          <div class="search-track-info">
            <span class="search-track-name">{{ track.name }}</span>
            <span class="search-track-artist">{{ track.artist }}</span>
          </div>

          <span class="search-track-play">▶</span>
        </button>
      </div>
    </div>

    <div v-else class="search-empty">
      <div class="search-empty-icon">⌕</div>
      <h2>Ничего не найдено</h2>
      <p>Попробуй изменить поисковый запрос</p>
    </div>
  </section>
</template>
