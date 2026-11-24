
<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

import {
  Plus,
  Heart,
  Music2,
  ArrowLeft,
  Pencil,
  Trash2,
  ImagePlus,
  Disc3,
  Play,
  Pause,
  Check,
  Upload,
  FileAudio,
} from 'lucide-vue-next'

import {
  player,
  playTrack,
  addTrack,
} from '../data/player'

const STORAGE_KEY = 'aure-playlists'

function loadPlaylists() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

const playlists = ref(loadPlaylists())
const screen = ref('list')
const selectedPlaylistId = ref(null)
const playlistName = ref('')
const playlistCover = ref('')
const editingTrackIds = ref([])
const audioInput = ref(null)
const coverInput = ref(null)

const selectedPlaylist = computed(() =>
  playlists.value.find(item => item.id === selectedPlaylistId.value)
)

const availableTracks = computed(() => player.tracks)

const playlistTracks = computed(() => {
  if (!selectedPlaylist.value) return []

  return selectedPlaylist.value.trackIds
    .map(id => player.tracks.find(track => track.id === id))
    .filter(Boolean)
})

watch(
  playlists,
  value => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
  { deep: true }
)

function openCreate() {
  selectedPlaylistId.value = null
  playlistName.value = ''
  playlistCover.value = ''
  editingTrackIds.value = []
  screen.value = 'create'
}

function openPlaylist(playlist) {
  selectedPlaylistId.value = playlist.id
  screen.value = 'details'
}

function openEdit(playlist) {
  selectedPlaylistId.value = playlist.id
  playlistName.value = playlist.name
  playlistCover.value = playlist.cover || ''
  editingTrackIds.value = [...playlist.trackIds]
  screen.value = 'edit'
}

function savePlaylist() {
  const name = playlistName.value.trim()
  if (!name) return

  const playlist = {
    id: selectedPlaylistId.value || Date.now(),
    name,
    cover: playlistCover.value,
    trackIds: selectedPlaylistId.value
      ? [...editingTrackIds.value]
      : [],
  }

  if (selectedPlaylistId.value) {
    const index = playlists.value.findIndex(
      item => item.id === selectedPlaylistId.value
    )

    if (index !== -1) {
      playlists.value[index] = playlist
    }
  } else {
    playlists.value.push(playlist)
  }

  selectedPlaylistId.value = playlist.id
  screen.value = 'details'
}

function deletePlaylist(playlist) {
  if (!confirm(`Удалить плейлист «${playlist.name}»?`)) return

  playlists.value = playlists.value.filter(
    item => item.id !== playlist.id
  )

  screen.value = 'list'
  selectedPlaylistId.value = null
}

function chooseCover() {
  coverInput.value?.click()
}

function changeCover(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Выбери файл изображения')
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    playlistCover.value = reader.result
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

function toggleTrack(trackId) {
  if (editingTrackIds.value.includes(trackId)) {
    editingTrackIds.value = editingTrackIds.value.filter(
      id => id !== trackId
    )
  } else {
    editingTrackIds.value.push(trackId)
  }
}

function saveTrackSelection() {
  const playlist = selectedPlaylist.value
  if (!playlist) return

  playlist.trackIds = [...editingTrackIds.value]
}

function uploadAudio(event) {
  const files = Array.from(event.target.files || [])

  files.forEach(file => {
    if (!file.type.startsWith('audio/')) return

    const track = addTrack(file)

    if (!editingTrackIds.value.includes(track.id)) {
      editingTrackIds.value.push(track.id)
    }
  })

  event.target.value = ''
}

function playPlaylistTrack(track) {
  playTrack(track)
}

function goBack() {
  if (screen.value === 'edit') {
    screen.value = selectedPlaylist.value ? 'details' : 'list'
  } else {
    screen.value = 'list'
  }
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--:--'

  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)

  return `${minutes}:${String(remaining).padStart(2, '0')}`
}
</script>

<template>
  <div class="library-page">

    <!-- СПИСОК ПЛЕЙЛИСТОВ И МОЯ МУЗЫКА -->
    <template v-if="screen === 'list'">

      <div class="library-heading">
        <div>
          <h1>Моя музыка</h1>
          <p>Твоя личная музыкальная коллекция</p>
        </div>
      </div>

      <div class="playlist-grid">

        <button class="playlist-card create-card" @click="openCreate">
          <div class="playlist-cover create-cover">
            <Plus :size="38" />
          </div>
          <span>Создать плейлист</span>
        </button>

        <RouterLink to="/favorites" class="playlist-card">
          <div class="playlist-cover favorites-cover">
            <Heart :size="39" />
          </div>
          <span>Любимые треки</span>
        </RouterLink>

        <button
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-card"
          @click="openPlaylist(playlist)"
        >
          <div class="playlist-cover">
            <img
              v-if="playlist.cover"
              :src="playlist.cover"
              :alt="playlist.name"
            />
            <Music2 v-else :size="35" />
          </div>
          <span>{{ playlist.name }}</span>
        </button>

      </div>

      <div class="library-tracks-section" style="margin-top: 32px;">

        <div class="library-heading">
          <div>
            <h2>Все треки</h2>
            <p>Загруженная музыка — {{ player.tracks.length }}</p>
          </div>

          <button
            class="playlist-add-music"
            @click="audioInput?.click()"
          >
            <Upload :size="17" />
            Загрузить музыку
          </button>
        </div>

        <div v-if="player.tracks.length" class="playlist-track-list">

          <div class="playlist-track-heading">
            <span>Название</span>
            <span>Длительность</span>
          </div>

          <div
            v-for="(track, index) in player.tracks"
            :key="track.id"
            class="playlist-track-row"
          >
            <span class="playlist-track-number">
              {{ index + 1 }}
            </span>

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

            <span class="playlist-track-duration">
              {{ formatDuration(track.duration) }}
            </span>

            <button
              class="playlist-track-play"
              title="Воспроизвести"
              @click="playPlaylistTrack(track)"
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

        <div v-else class="library-empty compact">
          <Disc3 :size="38" />
          <p>Твоя музыкальная коллекция пока пуста</p>
          <span>Загрузи свои аудиофайлы, чтобы они появились здесь</span>

          <button
            class="playlist-primary-button"
            @click="audioInput?.click()"
          >
            <Upload :size="17" />
            Загрузить музыку
          </button>
        </div>

      </div>

    </template>

    <!-- СОЗДАНИЕ ПЛЕЙЛИСТА -->
    <template v-else-if="screen === 'create'">

      <div class="library-subheading">
        <button class="back-button" @click="goBack">
          <ArrowLeft />
        </button>
        <h1>Новый плейлист</h1>
      </div>

      <div class="playlist-create-panel">
        <p class="playlist-hint">Придумай название плейлиста</p>

        <button class="cover-picker large" @click="chooseCover">
          <img
            v-if="playlistCover"
            :src="playlistCover"
            alt="Обложка плейлиста"
          />
          <ImagePlus v-else :size="42" />
          <span>Добавить обложку</span>
        </button>

        <input
          v-model="playlistName"
          class="playlist-name-input"
          placeholder="Название плейлиста"
          maxlength="40"
          @keyup.enter="savePlaylist"
        />

        <button
          class="playlist-primary-button"
          :disabled="!playlistName.trim()"
          @click="savePlaylist"
        >
          Создать
        </button>
      </div>

    </template>

    <!-- СТРАНИЦА ПЛЕЙЛИСТА -->
    <template v-else-if="screen === 'details' && selectedPlaylist">

      <div class="library-subheading">
        <button class="back-button" @click="goBack">
          <ArrowLeft />
        </button>
        <h1>{{ selectedPlaylist.name }}</h1>
      </div>

      <div class="playlist-detail-header">

        <div class="playlist-detail-cover">
          <img
            v-if="selectedPlaylist.cover"
            :src="selectedPlaylist.cover"
            :alt="selectedPlaylist.name"
          />
          <Music2 v-else :size="55" />
        </div>

        <div class="playlist-detail-info">
          <span>ПЛЕЙЛИСТ</span>
          <h2>{{ selectedPlaylist.name }}</h2>
          <p>{{ playlistTracks.length }} трек(ов)</p>

          <div class="playlist-detail-actions">
            <button
              class="playlist-primary-button"
              @click="openEdit(selectedPlaylist)"
            >
              <Pencil :size="16" />
              Редактировать
            </button>

            <button
              class="playlist-delete-button"
              title="Удалить плейлист"
              @click="deletePlaylist(selectedPlaylist)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

      </div>

      <div class="playlist-track-list">

        <div
          v-if="playlistTracks.length"
          class="playlist-track-heading"
        >
          <span>Название</span>
          <span>Длительность</span>
        </div>

        <div
          v-for="(track, index) in playlistTracks"
          :key="track.id"
          class="playlist-track-row"
        >
          <span class="playlist-track-number">
            {{ index + 1 }}
          </span>

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

          <span class="playlist-track-duration">
            {{ formatDuration(track.duration) }}
          </span>

          <button
            class="playlist-track-play"
            title="Воспроизвести"
            @click="playPlaylistTrack(track)"
          >
            <Pause
              v-if="player.currentTrack?.id === track.id && player.isPlaying"
              :size="17"
              fill="currentColor"
            />
            <Play v-else :size="17" />
          </button>
        </div>

        <div
          v-if="!playlistTracks.length"
          class="library-empty compact"
        >
          <Music2 :size="34" />
          <p>В этом плейлисте пока нет музыки</p>
          <span>Добавь свои треки через редактирование</span>
        </div>

      </div>

    </template>

    <!-- РЕДАКТИРОВАНИЕ -->
    <template v-else-if="screen === 'edit' && selectedPlaylist">

      <div class="library-subheading">
        <button class="back-button" @click="goBack">
          <ArrowLeft />
        </button>
        <h1>Редактирование</h1>
      </div>

      <div class="playlist-edit-header">

        <button class="cover-picker" @click="chooseCover">
          <img
            v-if="playlistCover"
            :src="playlistCover"
            alt="Обложка"
          />
          <ImagePlus v-else :size="35" />
          <span>Изменить</span>
        </button>

        <div class="playlist-edit-name">
          <label>Название плейлиста</label>
          <input v-model="playlistName" maxlength="40" />
        </div>

      </div>

      <div class="playlist-edit-music">

        <div class="playlist-edit-heading">
          <div>
            <h2>Музыка в плейлисте</h2>
            <p>Отметь треки, которые хочешь добавить</p>
          </div>

          <button
            class="playlist-add-music"
            @click="audioInput?.click()"
          >
            <Upload :size="17" />
            Загрузить музыку
          </button>
        </div>

        <div
          v-if="availableTracks.length"
          class="playlist-choose-list"
        >
          <label
            v-for="track in availableTracks"
            :key="track.id"
            class="playlist-choose-row"
          >
            <input
              type="checkbox"
              :checked="editingTrackIds.includes(track.id)"
              @change="toggleTrack(track.id)"
            />

            <span class="playlist-choose-icon">
              <FileAudio :size="19" />
            </span>

            <span class="playlist-choose-name">
              <strong>{{ track.name }}</strong>
              <small>{{ track.artist }}</small>
            </span>
          </label>
        </div>

        <div v-else class="library-empty compact">
          <Disc3 :size="34" />
          <p>Пока нет загруженных треков</p>
          <span>Загрузи музыку кнопкой выше</span>
        </div>

        <div class="playlist-edit-footer">

          <button
            class="playlist-secondary-button"
            @click="goBack"
          >
            Отмена
          </button>

          <button
            class="playlist-primary-button"
            :disabled="!playlistName.trim()"
            @click="saveTrackSelection(); savePlaylist()"
          >
            <Check :size="17" />
            Сохранить
          </button>

        </div>

      </div>

    </template>

    <!-- СКРЫТЫЕ INPUT -->
    <input
      ref="coverInput"
      type="file"
      accept="image/*"
      class="playlist-hidden-input"
      @change="changeCover"
    />

    <input
      ref="audioInput"
      type="file"
      accept="audio/*"
      multiple
      class="playlist-hidden-input"
      @change="uploadAudio"
    />

  </div>
</template>
