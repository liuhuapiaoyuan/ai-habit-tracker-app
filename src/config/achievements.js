import { isWithinInterval, subDays, startOfDay, endOfDay, parseISO } from 'date-fns'

// 辅助函数：检查连续天数
const checkConsecutiveDays = (dates, requiredDays) => {
  if (!dates.length) return false
  
  // 按日期排序
  const sortedDates = [...new Set(dates.map(d => d.split('T')[0]))].sort()
  
  // 从最新日期开始往前检查
  let consecutiveDays = 1
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const current = parseISO(sortedDates[i])
    const previous = parseISO(sortedDates[i - 1])
    
    // 如果日期相差1天，增加连续天数
    if (Math.floor((current - previous) / (1000 * 60 * 60 * 24)) === 1) {
      consecutiveDays++
      if (consecutiveDays >= requiredDays) return true
    } else {
      // 连续中断，重新计数
      consecutiveDays = 1
    }
  }
  
  return consecutiveDays >= requiredDays
}

// 辅助函数：检查时间段内的任务数
const checkTasksInTimeRange = (dates, startHour, endHour) => {
  return dates.some(date => {
    const hour = parseISO(date).getHours()
    return hour >= startHour && hour < endHour
  })
}

export const achievements = [
  {
    id: 1,
    title: '初出茅庐',
    description: '完成第一个任务',
    icon: '🏅',
    condition: (tasks) => {
      return tasks.some(t => t.completedDates?.length === 1)
    }
  },
  {
    id: 2,
    title: '坚持不懈',
    description: '连续7天完成任务',
    icon: '🔥',
    condition: (tasks) => {
      const allDates = tasks.flatMap(t => t.completedDates || [])
      return checkConsecutiveDays(allDates, 7)
    }
  },
  {
    id: 3,
    title: '任务大师',
    description: '完成100个任务',
    icon: '🏆',
    condition: (tasks) => {
      return tasks.reduce((sum, t) => sum + (t.completedDates?.length || 0), 0) >= 100
    }
  },
  {
    id: 4,
    title: '早起鸟儿',
    description: '在早上6点前完成任务',
    icon: '🌅',
    condition: (tasks) => {
      const allDates = tasks.flatMap(t => t.completedDates || [])
      return checkTasksInTimeRange(allDates, 0, 6)
    }
  },
  {
    id: 5,
    title: '周末战士',
    description: '在周末完成10个任务',
    icon: '🎉',
    condition: (tasks) => {
      const weekendTasks = tasks.reduce((count, task) => {
        const weekendDates = (task.completedDates || []).filter(date => 
          [0, 6].includes(parseISO(date).getDay())
        )
        return count + weekendDates.length
      }, 0)
      return weekendTasks >= 10
    }
  },
  {
    id: 6,
    title: '健康先锋',
    description: '完成50个健康相关任务',
    icon: '💪',
    condition: (tasks) => {
      const healthTasks = tasks.filter(t => 
        (t.title.includes('健康') || t.title.includes('运动')) &&
        t.completedDates?.length > 0
      )
      return healthTasks.reduce((sum, t) => sum + (t.completedDates?.length || 0), 0) >= 50
    }
  },
  {
    id: 7,
    title: '学习达人',
    description: '完成30个学习相关任务',
    icon: '📚',
    condition: (tasks) => {
      const studyTasks = tasks.filter(t => 
        (t.title.includes('学习') || t.title.includes('阅读')) &&
        t.completedDates?.length > 0
      )
      return studyTasks.reduce((sum, t) => sum + (t.completedDates?.length || 0), 0) >= 30
    }
  },
  {
    id: 8,
    title: '效率专家',
    description: '在一天内完成5个任务',
    icon: '⏱️',
    condition: (tasks) => {
      const dateGroups = tasks.flatMap(t => t.completedDates || [])
        .reduce((groups, date) => {
          const day = date.split('T')[0]
          groups[day] = (groups[day] || 0) + 1
          return groups
        }, {})
      return Object.values(dateGroups).some(count => count >= 5)
    }
  },
  {
    id: 9,
    title: '早起冠军',
    description: '连续30天在早上7点前完成任务',
    icon: '🌞',
    condition: (tasks) => {
      const earlyDates = tasks.flatMap(t => 
        (t.completedDates || []).filter(d => parseISO(d).getHours() < 7)
      )
      return checkConsecutiveDays(earlyDates, 30)
    }
  },
  {
    id: 10,
    title: '习惯养成者',
    description: '坚持使用应用30天',
    icon: '📅',
    condition: (tasks) => {
      const allDates = tasks.flatMap(t => t.completedDates || [])
      return new Set(allDates.map(d => d.split('T')[0])).size >= 30
    }
  },
  {
    id: 11,
    title: '任务收集者',
    description: '创建50个不同任务',
    icon: '📋',
    condition: (tasks) => tasks.length >= 50
  },
  {
    id: 12,
    title: '完美主义者',
    description: '连续7天完成所有任务',
    icon: '✨',
    condition: (tasks) => {
      const allDates = tasks.flatMap(t => t.completedDates || [])
      const dateCounts = allDates.reduce((acc, date) => {
        const day = date.split('T')[0]
        acc[day] = (acc[day] || 0) + 1
        return acc
      }, {})
      return Object.values(dateCounts).every(count => count >= tasks.length)
    }
  },
  {
    id: 13,
    title: '早起挑战者',
    description: '连续7天在早上6点前完成任务',
    icon: '⏰',
    condition: (tasks) => {
      const earlyDates = tasks.flatMap(t => 
        (t.completedDates || []).filter(d => parseISO(d).getHours() < 6)
      )
      return checkConsecutiveDays(earlyDates, 7)
    }
  },
  {
    id: 14,
    title: '周末达人',
    description: '在周末完成20个任务',
    icon: '🎊',
    condition: (tasks) => {
      const weekendTasks = tasks.reduce((count, task) => {
        const weekendDates = (task.completedDates || []).filter(date => 
          [0, 6].includes(parseISO(date).getDay())
        )
        return count + weekendDates.length
      }, 0)
      return weekendTasks >= 20
    }
  },
  {
    id: 15,
    title: '健康生活家',
    description: '完成100个健康相关任务',
    icon: '🥗',
    condition: (tasks) => {
      const healthTasks = tasks.filter(t => 
        (t.title.includes('健康') || t.title.includes('运动')) &&
        t.completedDates?.length > 0
      )
      return healthTasks.reduce((sum, t) => sum + (t.completedDates?.length || 0), 0) >= 100
    }
  },
  {
    id: 16,
    title: '终身学习者',
    description: '完成100个学习相关任务',
    icon: '🎓',
    condition: (tasks) => {
      const studyTasks = tasks.filter(t => 
        (t.title.includes('学习') || t.title.includes('阅读')) &&
        t.completedDates?.length > 0
      )
      return studyTasks.reduce((sum, t) => sum + (t.completedDates?.length || 0), 0) >= 100
    }
  },
  {
    id: 17,
    title: '效率大师',
    description: '在一天内完成10个任务',
    icon: '🚀',
    condition: (tasks) => {
      const dateGroups = tasks.flatMap(t => t.completedDates || [])
        .reduce((groups, date) => {
          const day = date.split('T')[0]
          groups[day] = (groups[day] || 0) + 1
          return groups
        }, {})
      return Object.values(dateGroups).some(count => count >= 10)
    }
  },
  {
    id: 18,
    title: '早起王者',
    description: '连续100天在早上7点前完成任务',
    icon: '👑',
    condition: (tasks) => {
      const earlyDates = tasks.flatMap(t => 
        (t.completedDates || []).filter(d => parseISO(d).getHours() < 7)
      )
      return checkConsecutiveDays(earlyDates, 100)
    }
  },
  {
    id: 19,
    title: '习惯大师',
    description: '坚持使用应用100天',
    icon: '📆',
    condition: (tasks) => {
      const allDates = tasks.flatMap(t => t.completedDates || [])
      return new Set(allDates.map(d => d.split('T')[0])).size >= 100
    }
  },
  {
    id: 20,
    title: '任务收藏家',
    description: '创建100个不同任务',
    icon: '📚',
    condition: (tasks) => tasks.length >= 100
  }
]
