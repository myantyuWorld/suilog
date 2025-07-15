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
  <div class="analytics-page">
    <header class="analytics-header">
      <h1 class="analytics-title">分析</h1>
    </header>

    <main class="analytics-content">
      <!-- 今日の統計 -->
      <section class="stat-cards">
        <div class="stat-card">
          <h3 class="stat-title">今日</h3>
          <p class="stat-value">{{ todayCount }}本</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-title">今週</h3>
          <p class="stat-value">{{ weekCount }}本</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-title">今月</h3>
          <p class="stat-value">{{ monthCount }}本</p>
        </div>
      </section>

      <!-- 日別グラフ -->
      <section class="chart-section">
        <h2 class="chart-title">日別推移（過去30日）</h2>
        <div class="chart-container">
          <Line :data="dailyChartData" :options="chartOptions" />
        </div>
      </section>

      <!-- 時間別グラフ -->
      <section class="chart-section">
        <h2 class="chart-title">時間別分布</h2>
        <div class="chart-container">
          <Bar :data="hourlyChartData" :options="hourlyChartOptions" />
        </div>
      </section>

      <!-- 月別グラフ -->
      <section class="chart-section">
        <h2 class="chart-title">月別推移</h2>
        <div class="chart-container">
          <Line :data="monthlyChartData" :options="chartOptions" />
        </div>
      </section>
    </main>
  </div>
</template>



<style scoped>
.analytics-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.analytics-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analytics-title {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.analytics-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 統計カード */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-title {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* チャートセクション */
.chart-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.125rem;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

/* スマホ対応 */
@media (max-width: 768px) {
  .analytics-page {
    padding: 0.5rem;
  }
  
  .analytics-title {
    font-size: 1.5rem;
  }
  
  .stat-cards {
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1rem 0.75rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .chart-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .chart-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .chart-container {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
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