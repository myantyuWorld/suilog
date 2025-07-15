<script setup lang="ts">
import { config } from '../../../shared/config'
import { formatDate } from '../../../shared/lib/utils'
import { useUserForm } from '../../../features/user-form'

const {
  state,
  savedData,
  updateField,
  handleSubmit,
  clearData
} = useUserForm()

</script>

<template>
  <div class="max-w-3xl mx-auto p-8">
    <h1>{{ config.app.name }}</h1>
    <p>{{ config.app.description }}</p>
    
    <div class="bg-gray-100 p-8 rounded-lg my-8">
      <h2>サンプルフォーム</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block mb-2 font-bold">名前:</label>
          <input 
            id="name" 
            :value="state.data.name"
            @input="updateField('name', ($event.target as HTMLInputElement).value)"
            type="text" 
            placeholder="名前を入力"
            required
            class="w-full p-2 border border-gray-300 rounded text-base"
          />
          <span v-if="state.errors.name" class="text-red-600 text-sm mt-1 block">{{ state.errors.name }}</span>
        </div>
        
        <div class="mb-4">
          <label for="email" class="block mb-2 font-bold">メール:</label>
          <input 
            id="email" 
            :value="state.data.email"
            @input="updateField('email', ($event.target as HTMLInputElement).value)"
            type="email" 
            placeholder="メールアドレスを入力"
            required
            class="w-full p-2 border border-gray-300 rounded text-base"
          />
          <span v-if="state.errors.email" class="text-red-600 text-sm mt-1 block">{{ state.errors.email }}</span>
        </div>
        
        <div class="mb-4">
          <label for="message" class="block mb-2 font-bold">メッセージ:</label>
          <textarea 
            id="message" 
            :value="state.data.message"
            @input="updateField('message', ($event.target as HTMLTextAreaElement).value)"
            placeholder="メッセージを入力"
            required
            class="w-full p-2 border border-gray-300 rounded text-base h-24 resize-y"
          ></textarea>
          <span v-if="state.errors.message" class="text-red-600 text-sm mt-1 block">{{ state.errors.message }}</span>
        </div>
        
        <button type="submit" class="bg-blue-600 text-white py-3 px-6 border-0 rounded cursor-pointer text-base hover:bg-blue-700 transition-colors">送信</button>
      </form>
    </div>
    
    <div class="bg-green-50 p-8 rounded-lg my-8" v-if="savedData">
      <h2>保存されたデータ</h2>
      <div class="mb-4">
        <p class="my-2"><strong>名前:</strong> {{ savedData.name }}</p>
        <p class="my-2"><strong>メール:</strong> {{ savedData.email }}</p>
        <p class="my-2"><strong>メッセージ:</strong> {{ savedData.message }}</p>
        <p class="my-2"><strong>保存日時:</strong> {{ formatDate(savedData.createdAt) }}</p>
      </div>
      <button @click="clearData" class="bg-blue-600 text-white py-3 px-6 border-0 rounded cursor-pointer text-base hover:bg-blue-700 transition-colors">データを削除</button>
    </div>
  </div>
</template>