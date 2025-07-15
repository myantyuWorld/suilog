<script setup lang="ts">
import { useSettings } from '../../../features/settings'

const {
  state,
  savedData,
  updateField,
  handleSubmit,
  resetToDefaults
} = useSettings()
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">設定</h1>
    
    <div class="bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">目標設定</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 一日の目標本数 -->
        <div>
          <label for="dailyGoal" class="block text-sm font-medium text-gray-700 mb-2">
            一日の目標本数
          </label>
          <div class="relative">
            <input 
              id="dailyGoal" 
              :value="state.data.dailyGoal"
              @input="updateField('dailyGoal', parseInt(($event.target as HTMLInputElement).value) || 0)"
              type="number"
              min="1"
              max="100"
              placeholder="20"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="absolute right-3 top-2 text-gray-500 text-sm">本</span>
          </div>
          <span v-if="state.errors.dailyGoal" class="text-red-600 text-sm mt-1 block">
            {{ state.errors.dailyGoal }}
          </span>
          <p class="text-gray-500 text-sm mt-1">
            一日あたりの喫煙目標本数を設定してください（1-100本）
          </p>
        </div>
        
        <!-- 一ヶ月の目標金額 -->
        <div>
          <label for="monthlyBudgetGoal" class="block text-sm font-medium text-gray-700 mb-2">
            月間予算目標
          </label>
          <div class="relative">
            <input 
              id="monthlyBudgetGoal" 
              :value="state.data.monthlyBudgetGoal"
              @input="updateField('monthlyBudgetGoal', parseInt(($event.target as HTMLInputElement).value) || 0)"
              type="number"
              min="1"
              max="1000000"
              placeholder="15000"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="absolute right-3 top-2 text-gray-500 text-sm">円</span>
          </div>
          <span v-if="state.errors.monthlyBudgetGoal" class="text-red-600 text-sm mt-1 block">
            {{ state.errors.monthlyBudgetGoal }}
          </span>
          <p class="text-gray-500 text-sm mt-1">
            一ヶ月あたりのタバコ代予算を設定してください（1-1,000,000円）
          </p>
        </div>
        
        <!-- 成功メッセージ -->
        <div v-if="state.isSaved" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="text-green-800">
              <p class="text-sm">設定が保存されました！</p>
            </div>
          </div>
        </div>
        
        <!-- ボタン -->
        <div class="flex space-x-4 pt-4">
          <button 
            type="submit" 
            :disabled="state.isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ state.isLoading ? '保存中...' : '設定を保存' }}
          </button>
          
          <button 
            type="button"
            @click="resetToDefaults"
            class="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            デフォルトに戻す
          </button>
        </div>
      </form>
    </div>
    
    <!-- 現在の設定表示 -->
    <div class="bg-gray-50 shadow-sm rounded-lg p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">現在の設定</h3>
      <div class="space-y-2">
        <p class="text-gray-700">
          <span class="font-medium">一日の目標本数:</span> {{ savedData.dailyGoal }}本
        </p>
        <p class="text-gray-700">
          <span class="font-medium">月間予算目標:</span> {{ savedData.monthlyBudgetGoal.toLocaleString() }}円
        </p>
      </div>
    </div>
  </div>
</template>