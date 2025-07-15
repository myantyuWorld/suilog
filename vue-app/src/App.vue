<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-gray-100 p-4 border-b border-gray-300">
    <h1 class="m-0 mb-4 text-gray-800">喫煙記録アプリ</h1>
    <nav class="flex gap-4">
      <RouterLink 
        to="/" 
        class="px-4 py-2 no-underline text-gray-600 rounded transition-colors duration-200 hover:bg-gray-200 router-link-exact-active:bg-blue-600 router-link-exact-active:text-white"
      >
        記録
      </RouterLink>
      <RouterLink 
        to="/analytics" 
        class="px-4 py-2 no-underline text-gray-600 rounded transition-colors duration-200 hover:bg-gray-200 router-link-exact-active:bg-blue-600 router-link-exact-active:text-white"
      >
        分析
      </RouterLink>
      <RouterLink 
        to="/settings" 
        class="px-4 py-2 no-underline text-gray-600 rounded transition-colors duration-200 hover:bg-gray-200 router-link-exact-active:bg-blue-600 router-link-exact-active:text-white"
      >
        設定
      </RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
