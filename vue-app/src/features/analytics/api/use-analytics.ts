import { ref, computed, onMounted } from 'vue'
import { AnalyticsService } from '../model/analytics-service'
import { SmokingRecordService } from '../../smoking-record/model/smoking-record-service'
import type { ChartData } from '../model/types'
import type { ChartOptions } from 'chart.js'

export function useAnalytics() {
  const isLoading = ref(false)
  const service = ref<AnalyticsService | null>(null)

  // 統計データ
  const stats = computed(() => {
    if (!service.value) return { todayCount: 0, weekCount: 0, monthCount: 0 }
    return service.value.getStats()
  })

  // 日別グラフデータ（過去30日）
  const dailyChartData = computed((): ChartData => {
    if (!service.value) {
      return {
        labels: [],
        datasets: []
      }
    }

    const dailyData = service.value.getDailyData(30)
    
    return {
      labels: dailyData.map(data => {
        const d = new Date(data.date)
        return `${d.getMonth() + 1}/${d.getDate()}`
      }),
      datasets: [{
        label: '喫煙本数',
        data: dailyData.map(data => data.count),
        borderColor: '#f56565',
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  })

  // 時間別グラフデータ
  const hourlyChartData = computed((): ChartData => {
    if (!service.value) {
      return {
        labels: [],
        datasets: []
      }
    }

    const hourlyData = service.value.getHourlyData()
    
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}時`),
      datasets: [{
        label: '喫煙回数',
        data: hourlyData.map(data => data.count),
        backgroundColor: 'rgba(72, 187, 120, 0.6)',
        borderColor: '#48bb78',
        borderWidth: 1
      }]
    }
  })

  // 月別グラフデータ
  const monthlyChartData = computed((): ChartData => {
    if (!service.value) {
      return {
        labels: [],
        datasets: []
      }
    }

    const monthlyData = service.value.getMonthlyData(12)
    
    return {
      labels: monthlyData.map(data => {
        const [year, month] = data.month.split('-')
        return `${year}/${month}`
      }),
      datasets: [{
        label: '月間喫煙本数',
        data: monthlyData.map(data => data.count),
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

  const loadData = async () => {
    isLoading.value = true
    try {
      const records = SmokingRecordService.getAll()
      service.value = new AnalyticsService(records)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    isLoading,
    stats,
    dailyChartData,
    hourlyChartData,
    monthlyChartData,
    chartOptions,
    hourlyChartOptions,
    loadData
  }
}