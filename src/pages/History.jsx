import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useTasks } from '../hooks/useTasks'
import { format } from 'date-fns'
import ContributionGraph from '../components/ContributionGraph'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function History() {
  const { tasks } = useTasks()

  const getRewardChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return format(date, 'yyyy-MM-dd')
    }).reverse()

    const data = last7Days.map(date => 
      tasks.filter(task => 
        task.completedDates.some(d => d.startsWith(date))
      ).reduce((sum, task) => sum + task.reward, 0)
    )

    return {
      labels: last7Days.map(date => format(new Date(date), 'MM/dd')),
      datasets: [{
        label: '奖励点数',
        data: data,
        borderColor: '#06D6A0',
        backgroundColor: 'rgba(6, 214, 160, 0.2)',
        fill: true,
        tension: 0.4
      }]
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">完成记录</h2>

      <div className="bg-white p-4 rounded-lg shadow-cartoon mb-8">
        <h3 className="text-lg font-bold mb-4">奖励点数趋势</h3>
        <Line data={getRewardChartData()} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-cartoon">
        <h3 className="text-lg font-bold mb-4">任务完成贡献图</h3>
        <ContributionGraph tasks={tasks} />
      </div>
    </div>
  )
}
