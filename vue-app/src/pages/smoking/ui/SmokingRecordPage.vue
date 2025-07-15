<template>
  <div class="smoking-record-page">
    <div class="today-stats">
      <h2>今日の喫煙記録</h2>
      <div class="count">{{ todayCount }}本</div>
    </div>

    <div class="record-form">
      <h3>新しい記録を追加</h3>
      <form @submit.prevent="handleAddRecord">
        <div class="form-group">
          <label for="location">場所（オプション）</label>
          <input 
            id="location"
            v-model="newRecord.location"
            type="text"
            placeholder="例: 自宅、会社、屋外など"
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="notes">メモ（オプション）</label>
          <textarea 
            id="notes"
            v-model="newRecord.notes"
            placeholder="気持ちや状況など"
            rows="3"
            :disabled="isLoading"
          ></textarea>
        </div>
        
        <button type="submit" class="add-button" :disabled="isLoading">
          {{ isLoading ? '追加中...' : '記録を追加' }}
        </button>
      </form>
    </div>

    <div class="records-history">
      <h3>最近の記録</h3>
      <div v-if="isLoading" class="loading">
        読み込み中...
      </div>
      <div v-else-if="recentRecords.length === 0" class="no-records">
        記録がありません
      </div>
      <div v-else class="records-list">
        <div 
          v-for="record in recentRecords" 
          :key="record.id"
          class="record-item"
        >
          <div class="record-header">
            <span class="timestamp">{{ formatDateTime(record.timestamp) }}</span>
            <button 
              @click="handleDeleteRecord(record.id)"
              class="delete-button"
              :disabled="isLoading"
            >
              削除
            </button>
          </div>
          <div v-if="record.location" class="record-location">
            📍 {{ record.location }}
          </div>
          <div v-if="record.notes" class="record-notes">
            💭 {{ record.notes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSmokingRecord } from '../../../features/smoking-record'

const {
  recentRecords,
  todayCount,
  isLoading,
  loadRecords,
  addRecord,
  deleteRecord,
  formatDateTime
} = useSmokingRecord()

const newRecord = ref({
  location: '',
  notes: ''
})

const handleAddRecord = async () => {
  await addRecord({
    timestamp: new Date(),
    location: newRecord.value.location || undefined,
    notes: newRecord.value.notes || undefined
  })
  
  newRecord.value = {
    location: '',
    notes: ''
  }
}

const handleDeleteRecord = async (id: string) => {
  if (confirm('この記録を削除しますか？')) {
    await deleteRecord(id)
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.smoking-record-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.today-stats {
  text-align: center;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.count {
  font-size: 3rem;
  font-weight: bold;
  color: #dc3545;
  margin-top: 1rem;
}

.record-form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #0056b3;
}

.records-history {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-records,
.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timestamp {
  font-weight: 500;
  color: #333;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #c82333;
}

.record-location,
.record-notes {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

h2, h3 {
  margin: 0 0 1rem 0;
  color: #333;
}
</style>