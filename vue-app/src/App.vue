<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>喫煙記録アプリ</h1>
    <nav>
      <RouterLink to="/">記録</RouterLink>
      <RouterLink to="/about">設定</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  background-color: #f5f5f5;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: #eee;
}

nav a.router-link-exact-active {
  background-color: #007bff;
  color: white;
}
</style>
