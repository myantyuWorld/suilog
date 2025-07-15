import { ref, computed, onMounted } from 'vue'
import { SmokingRecordService } from '../model/smoking-record-service'
import type { SmokingRecord, CreateSmokingRecordInput } from '../model/types'

export function useSmokingRecord() {
  const records = ref<SmokingRecord[]>([])
  const isLoading = ref(false)

  const todayCount = computed(() => SmokingRecordService.getTodayCount())

  const recentRecords = computed(() => 
    records.value
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20)
  )

  const newRecord = ref({
    location: '',
    notes: ''
  })
  
  const handleAddRecord = async () => {
    await addRecord({
      timestamp: new Date(),
      location: newRecord.value.location || undefined,
      notes: newRecord.value.notes || undefined
    })
    
    newRecord.value = {
      location: '',
      notes: ''
    }
  }
  
  const handleDeleteRecord = async (id: string) => {
    if (confirm('この記録を削除しますか？')) {
      await deleteRecord(id)
    }
  }
  
  onMounted(() => {
    loadRecords()
  })

  const loadRecords = async () => {
    isLoading.value = true
    try {
      records.value = SmokingRecordService.getAll()
    } finally {
      isLoading.value = false
    }
  }

  const addRecord = async (input: CreateSmokingRecordInput) => {
    isLoading.value = true
    try {
      const newRecord = SmokingRecordService.add(input)
      records.value.push(newRecord)
      return newRecord
    } finally {
      isLoading.value = false
    }
  }

  const deleteRecord = async (id: string) => {
    isLoading.value = true
    try {
      const success = SmokingRecordService.delete(id)
      if (success) {
        records.value = records.value.filter(record => record.id !== id)
      }
      return success
    } finally {
      isLoading.value = false
    }
  }

  const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  return {
    records,
    recentRecords,
    todayCount,
    isLoading,
    newRecord,
    loadRecords,
    addRecord,
    deleteRecord,
    formatDateTime,
    handleAddRecord,
    handleDeleteRecord
  }
}