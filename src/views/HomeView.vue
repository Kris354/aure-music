<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Music2, Play, Pause } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { player, playTrack } from '../data/player'

const userName = ref(localStorage.getItem('aure-user-name') || 'Кристина')

function updateUserName() {
  userName.value = localStorage.getItem('aure-user-name') || 'Кристина'
}

onMounted(() => {
  window.addEventListener('storage', updateUserName)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateUserName)
})
</script>

<template>
  <section class="home">

    <!-- ПРИВЕТСТВИЕ -->
    <div class="welcome">
      <h1>Привет, <span>{{ userName }}!</span></h1>
      <p class="subtitle">
        Рады видеть тебя в твоём музыкальном мире.
        Включай любимые треки и наслаждайся моментом.
      </p>
    </div>

    <!-- МОИ ТРЕКИ -->
    <div class="section-heading">
      <div>
        <h2>Мои треки</h2>
        <span>Твоя музыкальная коллекция</span>
      </div>

      <RouterLink to="/library" class="show-all">
        Показать все <span>›</span>
      </RouterLink>
    </div>

    <div v-if="player.tracks.length" class="my-tracks-grid">
      <div
        v-for="(track, index) in player.tracks"
        :key="track.id"
        class="my-track-card"
        role="button"
        tabindex="0"
        @click="playTrack(track)"
        @keydown.enter="playTrack(track)"
        @keydown.space.prevent="playTrack(track)"
      >
        <div class="my-track-cover">
          <img
            v-if="track.cover"
            :src="track.cover"
            :alt="`Обложка ${track.name}`"
          />
          <Music2 v-else />

          <span>{{ String(index + 1).padStart(2, '0') }}</span>

          <div class="my-track-play">
            <Pause
              v-if="player.currentTrack?.id === track.id && player.isPlaying"
              :size="22"
              fill="currentColor"
            />
            <Play v-else :size="22" fill="currentColor" />
          </div>
        </div>

        <h3>{{ track.name }}</h3>
        <p>{{ track.artist }}</p>
      </div>
    </div>

    <div v-else class="empty-tracks">
      <div class="music-icon">♫</div>
      <p>В твоей коллекции пока нет треков</p>
    </div>

    <!-- ДЛЯ ВАС -->
    <div class="section-heading">
      <div>
        <h2>Для вас</h2>
        <span>Подборки и музыкальные миксы</span>
      </div>
    </div>

    <div class="albums-grid">
      <div class="album-card album-favourite">
        <span class="album-number">01 / PERSONAL MIX</span>
        <div class="album-bottom">
          <h3>Favourite Mix</h3>
          <p>Микс с вашими любимыми треками</p>
        </div>
      </div>

      <div class="album-card album-rock">
        <span class="album-number">02 / ROCK COLLECTION</span>
        <div class="album-bottom">
          <h3>Rock Energy</h3>
          <p>Музыка, которая заряжает энергией</p>
        </div>
      </div>

      <div class="album-card album-indie">
        <span class="album-number">03 / INDIE VIBES</span>
        <div class="album-bottom">
          <h3>Indie Mood</h3>
          <p>Новые оттенки знакомого звучания</p>
        </div>
      </div>

      <div class="album-card album-night">
        <span class="album-number">04 / NIGHT SESSION</span>
        <div class="album-bottom">
          <h3>Late Night</h3>
          <p>Музыка для поздних вечеров</p>
        </div>
      </div>
    </div>

    <!-- РЕКОМЕНДАЦИИ -->
    <div class="section-heading tracks-heading">
      <div>
        <h2>Рекомендуем послушать</h2>
        <span>На основе твоих предпочтений</span>
      </div>
    </div>

    <div class="empty-tracks">
      <div class="music-icon">♫</div>
      <p>Здесь скоро появятся новые рекомендации</p>
    </div>

  </section>
</template>