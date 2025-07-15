<script setup lang="ts">
import { computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useAnalytics } from '../../../features/analytics'

// Chart.js コンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const {
  isLoading,
  stats,
  dailyChartData,
  hourlyChartData,
  monthlyChartData,
  chartOptions,
  hourlyChartOptions
} = useAnalytics()

// 統計データの展開
const todayCount = computed(() => stats.value.todayCount)
const weekCount = computed(() => stats.value.weekCount)
const monthCount = computed(() => stats.value.monthCount)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
    <header class="text-center mb-8">
      <h1 class="text-white text-3xl md:text-4xl font-semibold m-0">分析</h1>
    </header>

    <main class="max-w-6xl mx-auto">
      <!-- 今日の統計 -->
      <section class="grid grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
          <h3 class="text-sm text-gray-600 mb-2 font-medium">今日</h3>
          <p class="text-2xl font-bold text-gray-800 m-0">{{ todayCount }}本</p>
        </div>
        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
          <h3 class="text-sm text-gray-600 mb-2 font-medium">今週</h3>
          <p class="text-2xl font-bold text-gray-800 m-0">{{ weekCount }}本</p>
        </div>
        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
          <h3 class="text-sm text-gray-600 mb-2 font-medium">今月</h3>
          <p class="text-2xl font-bold text-gray-800 m-0">{{ monthCount }}本</p>
        </div>
      </section>

      <!-- 日別グラフ -->
      <section class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h2 class="text-lg text-gray-800 mb-6 font-semibold">日別推移（過去30日）</h2>
        <div class="relative h-60 w-full">
          <Line :data="dailyChartData" :options="chartOptions" />
        </div>
      </section>

      <!-- 時間別グラフ -->
      <section class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h2 class="text-lg text-gray-800 mb-6 font-semibold">時間別分布</h2>
        <div class="relative h-60 w-full">
          <Bar :data="hourlyChartData" :options="hourlyChartOptions" />
        </div>
      </section>

      <!-- 月別グラフ -->
      <section class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h2 class="text-lg text-gray-800 mb-6 font-semibold">月別推移</h2>
        <div class="relative h-60 w-full">
          <Line :data="monthlyChartData" :options="chartOptions" />
        </div>
      </section>
    </main>
  </div>
</template>



<style>
/* スマホ対応: Tailwindでカバーできない細かいスタイルのみ */
@media (max-width: 480px) {
  .stat-card {
    padding: 0.75rem 0.5rem;
  }
  
  .stat-title {
    font-size: 0.75rem;
  }
  
  .stat-value {
    font-size: 1.125rem;
  }
  
  .chart-container {
    height: 180px;
  }
}
</style>