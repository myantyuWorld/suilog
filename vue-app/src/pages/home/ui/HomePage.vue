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
            :value="state.data.name"
            @input="updateField('name', ($event.target as HTMLInputElement).value)"
            type="text" 
            placeholder="名前を入力"
            required
          />
          <span v-if="state.errors.name" class="error">{{ state.errors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">メール:</label>
          <input 
            id="email" 
            :value="state.data.email"
            @input="updateField('email', ($event.target as HTMLInputElement).value)"
            type="email" 
            placeholder="メールアドレスを入力"
            required
          />
          <span v-if="state.errors.email" class="error">{{ state.errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="message">メッセージ:</label>
          <textarea 
            id="message" 
            :value="state.data.message"
            @input="updateField('message', ($event.target as HTMLTextAreaElement).value)"
            placeholder="メッセージを入力"
            required
          ></textarea>
          <span v-if="state.errors.message" class="error">{{ state.errors.message }}</span>
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
import { onMounted } from 'vue'
import { config } from '../../../shared/config'
import { formatDate } from '../../../shared/lib/utils'
import { useUserForm } from '../../../features/user-form'

const {
  state,
  savedData,
  isValid,
  loadSavedData,
  submitForm,
  clearSavedData,
  updateField
} = useUserForm()

const handleSubmit = async () => {
  const success = await submitForm()
  if (success) {
    alert('データが保存されました！')
  }
}

const clearData = async () => {
  const success = await clearSavedData()
  if (success) {
    alert('データが削除されました')
  }
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

.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>