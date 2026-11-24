<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Settings,
  Camera,
  Music2,
  Plus,
  Pencil,
  Check,
  X,
  Disc3,
  FileAudio,
} from 'lucide-vue-next'

import { addTrack, playTrack } from '../data/player'

const userName = ref('Кристина')
const isEditing = ref(false)
const editedName = ref('')

const avatar = ref(null)
const avatarInput = ref(null)

const audioInput = ref(null)
const selectedTrack = ref(null)

onMounted(() => {
  const savedName = localStorage.getItem('aure-user-name')

  if (savedName) {
    userName.value = savedName
  }
})

onBeforeUnmount(() => {
  if (avatar.value) {
    URL.revokeObjectURL(avatar.value)
  }
})

function openAvatarPicker() {
  avatarInput.value?.click()
}

function changeAvatar(event) {
  const file = event.target.files?.[0]

  if (!file) return

  if (avatar.value) {
    URL.revokeObjectURL(avatar.value)
  }

  avatar.value = URL.createObjectURL(file)
}

function startEditing() {
  editedName.value = userName.value
  isEditing.value = true
}

function saveName() {
  const newName = editedName.value.trim()

  if (newName) {
    userName.value = newName
    localStorage.setItem('aure-user-name', newName)
  }

  isEditing.value = false
}

function cancelEditing() {
  editedName.value = userName.value
  isEditing.value = false
}

function openAudioPicker() {
  audioInput.value?.click()
}

function uploadTrack(event) {
  const file = event.target.files?.[0]

  if (!file) return

  const track = addTrack(file)

  selectedTrack.value = {
    name: file.name.replace(/\.[^/.]+$/, ''),
    size: (file.size / (1024 * 1024)).toFixed(2),
    type: file.type || 'Аудиофайл',
  }

  playTrack(track)

  event.target.value = ''
}
</script>

<template>
  <div class="profile-page">

    <section class="profile-header">

      <div class="profile-avatar-wrapper">
        <button
          class="profile-avatar"
          @click="openAvatarPicker"
          title="Изменить фотографию"
        >
          <img v-if="avatar" :src="avatar" alt="Фото профиля" />

          <div v-else class="avatar-placeholder">
            <Music2 :size="48" />
          </div>

          <div class="avatar-camera">
            <Camera :size="18" />
          </div>
        </button>

        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="changeAvatar"
        />
      </div>

      <div class="profile-info">

        <div v-if="!isEditing" class="profile-name-row">
          <h1>{{ userName }}</h1>
        </div>

        <div v-else class="profile-edit-name">
          <input
            v-model="editedName"
            type="text"
            maxlength="30"
            placeholder="Твоё имя"
            @keyup.enter="saveName"
            @keyup.esc="cancelEditing"
          />

          <button class="icon-action save" @click="saveName">
            <Check :size="19" />
          </button>

          <button class="icon-action cancel" @click="cancelEditing">
            <X :size="19" />
          </button>
        </div>

        <div class="profile-stats">
          <div class="profile-stat">
            <strong>0</strong>
            <span>Подписчиков</span>
          </div>

          <div class="profile-stat">
            <strong>2</strong>
            <span>Подписки</span>
          </div>
        </div>

        <button
          v-if="!isEditing"
          class="edit-profile-button"
          @click="startEditing"
        >
          <Pencil :size="16" />
          Редактировать профиль
        </button>

      </div>

      <RouterLink
        to="/settings"
        class="profile-settings-button"
        title="Настройки"
      >
        <Settings :size="24" />
      </RouterLink>

    </section>

    <!-- МОИ ПЛЕЙЛИСТЫ -->
    <section class="profile-section">

      <div class="profile-section-heading">
        <div>
          <h2>Мои плейлисты</h2>
          <p>Твои музыкальные подборки</p>
        </div>

        <RouterLink to="/library" class="show-all-link">
          Показать все <span>›</span>
        </RouterLink>
      </div>

      <div class="profile-playlists">
        <RouterLink to="/library" class="playlist-card">
          <div class="playlist-cover">
            <div class="playlist-cover-glow"></div>
            <Music2 :size="34" />
          </div>

          <div class="playlist-details">
            <h3>Silence</h3>
            <span>4 трека</span>
          </div>
        </RouterLink>
      </div>

    </section>

    <!-- МОИ РЕЛИЗЫ -->
    <section class="profile-section releases-section">

      <div class="profile-section-heading">
        <div>
          <h2>Мои релизы</h2>
          <p>Твоя музыка и авторские композиции</p>
        </div>
      </div>

      <div v-if="!selectedTrack" class="releases-empty">
        <div class="releases-icon">
          <Disc3 :size="42" />
        </div>

        <h3>
          Загрузи свой первый трек<br />
          и начни свой путь в качестве артиста
        </h3>

        <button
          class="add-release-button"
          title="Загрузить аудиофайл"
          @click="openAudioPicker"
        >
          <Plus :size="34" />
        </button>
      </div>

      <div v-else class="uploaded-release">

        <div class="uploaded-release-icon">
          <FileAudio :size="30" />
        </div>

        <div class="uploaded-release-info">
          <h3>{{ selectedTrack.name }}</h3>
          <span>{{ selectedTrack.size }} МБ · {{ selectedTrack.type }}</span>
          <span class="uploaded-status">Файл выбран</span>
        </div>

        <button
          class="add-another-track"
          @click="openAudioPicker"
          title="Выбрать другой трек"
        >
          <Plus :size="22" />
        </button>

      </div>

      <input
        ref="audioInput"
        type="file"
        accept="audio/*"
        class="hidden-input"
        @change="uploadTrack"
      />

    </section>

  </div>
</template>