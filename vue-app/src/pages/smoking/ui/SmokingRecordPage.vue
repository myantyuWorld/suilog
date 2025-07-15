<script setup lang="ts">
import { useSmokingRecord } from '../../../features/smoking-record'

const {
  recentRecords,
  todayCount,
  isLoading,
  newRecord,
  formatDateTime,
  handleAddRecord,
  handleDeleteRecord
} = useSmokingRecord()
</script>

<template>
  <div class="max-w-3xl mx-auto p-8">
    <div class="text-center bg-gray-50 p-8 rounded-lg mb-8">
      <h2 class="text-gray-800 mb-0">今日の喫煙記録</h2>
      <div class="text-5xl font-bold text-red-600 mt-4">{{ todayCount }}本</div>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-sm mb-8">
      <h3 class="text-gray-800 mb-4">新しい記録を追加</h3>
      <form @submit.prevent="handleAddRecord">
        <div class="mb-4">
          <label for="location" class="block mb-2 font-medium">場所（オプション）</label>
          <input 
            id="location"
            v-model="newRecord.location"
            type="text"
            placeholder="例: 自宅、会社、屋外など"
            :disabled="isLoading"
            class="w-full p-2 border border-gray-300 rounded text-base"
          />
        </div>
        
        <div class="mb-4">
          <label for="notes" class="block mb-2 font-medium">メモ（オプション）</label>
          <textarea 
            id="notes"
            v-model="newRecord.notes"
            placeholder="気持ちや状況など"
            rows="3"
            :disabled="isLoading"
            class="w-full p-2 border border-gray-300 rounded text-base"
          ></textarea>
        </div>
        
        <button type="submit" class="bg-blue-600 text-white py-3 px-6 border-0 rounded text-base cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50" :disabled="isLoading">
          {{ isLoading ? '追加中...' : '記録を追加' }}
        </button>
      </form>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-sm">
      <h3 class="text-gray-800 mb-4">最近の記録</h3>
      <div v-if="isLoading" class="text-center text-gray-600 p-8">
        読み込み中...
      </div>
      <div v-else-if="recentRecords.length === 0" class="text-center text-gray-600 p-8">
        記録がありません
      </div>
      <div v-else class="flex flex-col gap-4">
        <div 
          v-for="record in recentRecords" 
          :key="record.id"
          class="bg-gray-50 p-4 rounded border-l-4 border-red-600"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium text-gray-800">{{ formatDateTime(record.timestamp) }}</span>
            <button 
              @click="handleDeleteRecord(record.id)"
              class="bg-red-600 text-white py-1 px-2 border-0 rounded text-sm cursor-pointer transition-colors hover:bg-red-700 disabled:opacity-50"
              :disabled="isLoading"
            >
              削除
            </button>
          </div>
          <div v-if="record.location" class="text-sm text-gray-600 mt-2">
            📍 {{ record.location }}
          </div>
          <div v-if="record.notes" class="text-sm text-gray-600 mt-2">
            💭 {{ record.notes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


