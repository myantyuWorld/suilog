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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Legend,
  type ChartOptions
} from 'chart.js'
import { SmokingRecordManager, type SmokingRecord } from '@/entities/smoking-record'

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

const records = ref<SmokingRecord[]>([])

// 統計データ
const todayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return records.value.filter(record => {
    const recordDate = new Date(record.timestamp)
    recordDate.setHours(0, 0, 0, 0)
    return recordDate.getTime() === today.getTime()
  }).length
})

const weekCount = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)
  
  return records.value.filter(record => 
    record.timestamp >= weekAgo
  ).length
})

const monthCount = computed(() => {
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)
  monthAgo.setHours(0, 0, 0, 0)
  
  return records.value.filter(record => 
    record.timestamp >= monthAgo
  ).length
})

// 日別データ（過去30日）
const dailyChartData = computed(() => {
  const daily = new Map<string, number>()
  const last30Days = []
  
  // 過去30日の日付を生成
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    daily.set(dateStr, 0)
    last30Days.push(dateStr)
  }
  
  // 記録をカウント
  records.value.forEach(record => {
    const dateStr = record.timestamp.toISOString().split('T')[0]
    if (daily.has(dateStr)) {
      daily.set(dateStr, daily.get(dateStr)! + 1)
    }
  })
  
  return {
    labels: last30Days.map(date => {
      const d = new Date(date)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }),
    datasets: [{
      label: '喫煙本数',
      data: last30Days.map(date => daily.get(date) || 0),
      borderColor: '#f56565',
      backgroundColor: 'rgba(245, 101, 101, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// 時間別データ
const hourlyChartData = computed(() => {
  const hourly = new Array(24).fill(0)
  
  records.value.forEach(record => {
    const hour = record.timestamp.getHours()
    hourly[hour]++
  })
  
  return {
    labels: Array.from({ length: 24 }, (_, i) => `${i}時`),
    datasets: [{
      label: '喫煙回数',
      data: hourly,
      backgroundColor: 'rgba(72, 187, 120, 0.6)',
      borderColor: '#48bb78',
      borderWidth: 1
    }]
  }
})

// 月別データ
const monthlyChartData = computed(() => {
  const monthly = new Map<string, number>()
  
  // 過去12ヶ月を生成
  const last12Months = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthly.set(monthStr, 0)
    last12Months.push(monthStr)
  }
  
  // 記録をカウント
  records.value.forEach(record => {
    const monthStr = `${record.timestamp.getFullYear()}-${String(record.timestamp.getMonth() + 1).padStart(2, '0')}`
    if (monthly.has(monthStr)) {
      monthly.set(monthStr, monthly.get(monthStr)! + 1)
    }
  })
  
  return {
    labels: last12Months.map(month => {
      const [year, m] = month.split('-')
      return `${year}/${m}`
    }),
    datasets: [{
      label: '月間喫煙本数',
      data: last12Months.map(month => monthly.get(month) || 0),
      borderColor: '#4299e1',
      backgroundColor: 'rgba(66, 153, 225, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// チャートオプション
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}

const hourlyChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}

onMounted(() => {
  records.value = SmokingRecordManager.getAll()
})
</script>

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