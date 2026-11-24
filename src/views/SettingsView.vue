<script setup>
import { ref, watch } from 'vue'
import { Settings, Download, Bell, SlidersHorizontal } from 'lucide-vue-next'

const savedSettings = JSON.parse(
  localStorage.getItem('aure-settings') || '{}'
)

const autoDownload = ref(savedSettings.autoDownload ?? false)
const notifications = ref(savedSettings.notifications ?? true)
const quality = ref(savedSettings.quality ?? 'Высокое')

const equalizer = ref(
  savedSettings.equalizer ?? [50, 50, 50, 50, 50]
)

const frequencies = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz']

watch(
  [autoDownload, notifications, quality, equalizer],
  () => {
    localStorage.setItem(
      'aure-settings',
      JSON.stringify({
        autoDownload: autoDownload.value,
        notifications: notifications.value,
        quality: quality.value,
        equalizer: equalizer.value,
      })
    )
  },
  { deep: true }
)
</script>

<template>
  <section class="settings-page">

    <div class="settings-title">
      <div>
        <h1>Настройки</h1>
        <p>Настрой Aure Music под себя</p>
      </div>
      <div class="settings-title-icon">
        <Settings :size="25" />
      </div>
    </div>

    <div class="settings-grid">

      <!-- СКАЧИВАНИЕ -->
      <div class="settings-card">
        <div class="settings-card-heading">
          <div class="settings-icon">
            <Download :size="21" />
          </div>
          <div>
            <h2>Автоскачивание</h2>
            <p>Управление загрузкой музыки</p>
          </div>
        </div>

        <div class="settings-option">
          <div>
            <h3>Автоматическое скачивание</h3>
            <p>Треки будут скачиваться автоматически</p>
          </div>

          <button
            class="settings-toggle"
            :class="{ active: autoDownload }"
            :aria-pressed="autoDownload"
            @click="autoDownload = !autoDownload"
          >
            <span></span>
          </button>
        </div>
      </div>

      <!-- КАЧЕСТВО -->
      <div class="settings-card">
        <div class="settings-card-heading">
          <div class="settings-icon">
            <SlidersHorizontal :size="21" />
          </div>
          <div>
            <h2>Качество звука</h2>
            <p>Выбери качество воспроизведения</p>
          </div>
        </div>

        <div class="quality-options">
          <button
            v-for="item in ['Низкое', 'Среднее', 'Высокое']"
            :key="item"
            :class="{ selected: quality === item }"
            @click="quality = item"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- УВЕДОМЛЕНИЯ -->
      <div class="settings-card">
        <div class="settings-card-heading">
          <div class="settings-icon">
            <Bell :size="21" />
          </div>
          <div>
            <h2>Уведомления</h2>
            <p>Управление оповещениями</p>
          </div>
        </div>

        <div class="settings-option">
          <div>
            <h3>Уведомления приложения</h3>
            <p>Получать уведомления о новинках и обновлениях</p>
          </div>

          <button
            class="settings-toggle"
            :class="{ active: notifications }"
            :aria-pressed="notifications"
            @click="notifications = !notifications"
          >
            <span></span>
          </button>
        </div>
      </div>

      <!-- ЭКВАЛАЙЗЕР -->
      <div class="settings-card equalizer-card">
        <div class="settings-card-heading">
          <div class="settings-icon">
            <SlidersHorizontal :size="21" />
          </div>
          <div>
            <h2>Эквалайзер</h2>
            <p>Настрой звучание под себя</p>
          </div>
        </div>

        <div class="equalizer-controls">
          <div
            v-for="(value, index) in equalizer"
            :key="index"
            class="equalizer-band"
          >
            <span class="equalizer-value">{{ value - 50 > 0 ? '+' : '' }}{{ value - 50 }}</span>

            <input
              v-model.number="equalizer[index]"
              type="range"
              min="0"
              max="100" 
              class="equalizer-slider"
            />

            <span class="equalizer-frequency">
              {{ frequencies[index] }}
            </span>
          </div>
        </div>

        <div class="equalizer-presets">
          <button
            v-for="preset in [
              { name: 'Rock', values: [85, 65, 35, 65, 85] },
              { name: 'Pop', values: [40, 65, 85, 65, 40] },
              { name: 'Bass', values: [100, 85, 50, 35, 35] },
              { name: 'Сброс', values: [50, 50, 50, 50, 50] }
            ]"
            :key="preset.name"
            @click="equalizer = [...preset.values]"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
