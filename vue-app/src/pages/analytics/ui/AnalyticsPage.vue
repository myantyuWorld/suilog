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
import { useSettings } from '../../../features/settings'

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

const { savedData: settings } = useSettings()

// 統計データの展開
const todayCount = computed(() => stats.value.todayCount)
const weekCount = computed(() => stats.value.weekCount)
const monthCount = computed(() => stats.value.monthCount)

// 目標達成状況の計算
const dailyGoalProgress = computed(() => {
  const dailyGoal = settings.value.dailyGoal
  const progress = (todayCount.value / dailyGoal) * 100
  return Math.min(progress, 100)
})

// 今月の平均と目標の比較
const monthlyAverage = computed(() => {
  const today = new Date()
  const currentDayOfMonth = today.getDate()
  return currentDayOfMonth > 0 ? Math.round(monthCount.value / currentDayOfMonth) : 0
})

// 月間予算使用状況の推定（仮想的な計算）
const estimatedMonthlyCost = computed(() => {
  // 1本あたり約25円として計算（一般的なタバコ価格から推定）
  const costPerCigarette = 25
  return monthCount.value * costPerCigarette
})

const monthlyBudgetProgress = computed(() => {
  const budget = settings.value.monthlyBudgetGoal
  const progress = (estimatedMonthlyCost.value / budget) * 100
  return progress
})
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
          <div class="mt-2">
            <div class="text-xs text-gray-500">目標: {{ settings.dailyGoal }}本</div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                class="h-1.5 rounded-full transition-all duration-300"
                :class="dailyGoalProgress >= 100 ? 'bg-green-600' : 'bg-orange-600'"
                :style="{ width: dailyGoalProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
          <h3 class="text-sm text-gray-600 mb-2 font-medium">今週</h3>
          <p class="text-2xl font-bold text-gray-800 m-0">{{ weekCount }}本</p>
        </div>
        <div class="bg-white rounded-xl p-6 text-center shadow-lg">
          <h3 class="text-sm text-gray-600 mb-2 font-medium">今月</h3>
          <p class="text-2xl font-bold text-gray-800 m-0">{{ monthCount }}本</p>
          <div class="text-xs text-gray-500 mt-1">
            日平均: {{ monthlyAverage }}本
          </div>
        </div>
      </section>

      <!-- 目標達成状況 -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 日別目標 -->
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">日別目標達成状況</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">今日の進捗</span>
              <span class="text-sm font-medium" :class="dailyGoalProgress >= 100 ? 'text-green-600' : 'text-orange-600'">
                {{ Math.round(dailyGoalProgress) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300"
                :class="dailyGoalProgress >= 100 ? 'bg-green-600' : 'bg-orange-600'"
                :style="{ width: Math.min(dailyGoalProgress, 100) + '%' }"
              ></div>
            </div>
            <div class="text-sm text-gray-600">
              {{ todayCount }}/{{ settings.dailyGoal }}本
              <span v-if="dailyGoalProgress >= 100" class="text-green-600 font-medium">
                （目標達成！）
              </span>
              <span v-else class="text-gray-500">
                （あと{{ settings.dailyGoal - todayCount }}本）
              </span>
            </div>
          </div>
        </div>

        <!-- 月間予算 -->
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">月間予算使用状況</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">予算使用率</span>
              <span class="text-sm font-medium" :class="monthlyBudgetProgress >= 100 ? 'text-red-600' : monthlyBudgetProgress >= 80 ? 'text-orange-600' : 'text-green-600'">
                {{ Math.round(monthlyBudgetProgress) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300"
                :class="monthlyBudgetProgress >= 100 ? 'bg-red-600' : monthlyBudgetProgress >= 80 ? 'bg-orange-600' : 'bg-green-600'"
                :style="{ width: Math.min(monthlyBudgetProgress, 100) + '%' }"
              ></div>
            </div>
            <div class="text-sm text-gray-600">
              {{ estimatedMonthlyCost.toLocaleString() }}/{{ settings.monthlyBudgetGoal.toLocaleString() }}円
              <div class="text-xs text-gray-500 mt-1">
                ※1本25円で計算した推定値
              </div>
            </div>
          </div>
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