import React from 'react'
import { format, eachDayOfInterval, startOfWeek, endOfWeek, addWeeks } from 'date-fns'

const ContributionGraph = ({ tasks }) => {
  const getContributionData = () => {
    const weeks = 12
    const daysInWeek = 7
    const today = new Date()
    const startDate = startOfWeek(addWeeks(today, -weeks + 1))
    const endDate = endOfWeek(today)
    const allDates = eachDayOfInterval({ start: startDate, end: endDate })

    const data = allDates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const totalRewards = tasks.filter(task => 
        task.completedDates.some(d => d.startsWith(dateStr))
      ).reduce((sum, task) => sum + task.reward, 0)
      return {
        date: dateStr,
        count: totalRewards
      }
    })

    return data
  }

  const contributionData = getContributionData()
  const maxRewards = Math.max(...contributionData.map(d => d.count))

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100'
    const intensity = Math.min(4, Math.floor((count / maxRewards) * 4))
    return [
      'bg-green-100',
      'bg-green-300',
      'bg-green-500',
      'bg-green-700',
      'bg-green-900'
    ][intensity]
  }

  // Calculate number of columns based on container width
  const columns = Math.min(52, Math.floor(window.innerWidth / 16))

  return (
    <div className="w-full">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {contributionData.map((day, index) => (
          <div
            key={index}
            className={`aspect-square ${getColor(day.count)} rounded-sm`}
            title={`${format(new Date(day.date), 'yyyy-MM-dd')} - ${day.count} 星星`}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        过去 {Math.ceil(contributionData.length / 7)} 周的任务完成情况
      </div>
    </div>
  )
}

export default ContributionGraph
