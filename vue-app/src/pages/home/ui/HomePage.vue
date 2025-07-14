<template>
  <div class="home-page">
    <h1>{{ config.app.name }}</h1>
    <p>{{ config.app.description }}</p>
    
    <div class="sample-form">
      <h2>サンプルフォーム</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">名前:</label>
          <input 
            id="name" 
            v-model="formData.name" 
            type="text" 
            placeholder="名前を入力"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">メール:</label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            placeholder="メールアドレスを入力"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="message">メッセージ:</label>
          <textarea 
            id="message" 
            v-model="formData.message" 
            placeholder="メッセージを入力"
            required
          ></textarea>
        </div>
        
        <button type="submit">送信</button>
      </form>
    </div>
    
    <div class="saved-data" v-if="savedData">
      <h2>保存されたデータ</h2>
      <div class="data-item">
        <p><strong>名前:</strong> {{ savedData.name }}</p>
        <p><strong>メール:</strong> {{ savedData.email }}</p>
        <p><strong>メッセージ:</strong> {{ savedData.message }}</p>
        <p><strong>保存日時:</strong> {{ formatDate(savedData.createdAt) }}</p>
      </div>
      <button @click="clearData">データを削除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { config } from '../../../shared/config'
import { localStorageService } from '../../../shared/lib/storage'
import { formatDate } from '../../../shared/lib/utils'

interface FormData {
  name: string
  email: string
  message: string
  createdAt: Date
}

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const savedData = ref<FormData | null>(null)

const loadSavedData = () => {
  const data = localStorageService.get<FormData>('user-form')
  if (data) {
    savedData.value = data
  }
}

const handleSubmit = () => {
  const dataToSave: FormData = {
    ...formData.value,
    createdAt: new Date()
  }
  
  localStorageService.set('user-form', dataToSave)
  loadSavedData()
  
  // フォームをリセット
  formData.value = {
    name: '',
    email: '',
    message: ''
  }
  
  alert('データが保存されました！')
}

const clearData = () => {
  localStorageService.remove('user-form')
  savedData.value = null
  alert('データが削除されました')
}

onMounted(() => {
  loadSavedData()
})
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.sample-form {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 100px;
  resize: vertical;
}

button {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #0056b3;
}

.saved-data {
  background: #e8f5e8;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.data-item {
  margin-bottom: 1rem;
}

.data-item p {
  margin: 0.5rem 0;
}
</style>