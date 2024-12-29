'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { format } from 'date-fns';
import ContributionGraph from '@/components/ContributionGraph';
import AchievementList from '@/components/AchievementList';
import Navigation from '@/components/Navigation';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

export default function History() {
  const { completions } = useTaskCompletion();
  const rewardChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const data = last7Days.map(date => 
      completions.filter(task => 
        task.completedAt.startsWith(date)
      ).reduce((sum, task) => sum + (task.reward || 0), 0)
    );

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
    } as ChartData<'line'>;
  }, [completions]);

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto p-4 space-y-8">

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-cartoon">
          <h3 className="text-lg font-bold mb-4">奖励点数</h3>
          <Line options={options} data={rewardChartData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-cartoon">
          <h3 className="text-lg font-bold mb-4">分布图</h3>
          <ContributionGraph tasks={completions} />
        </div>

          <AchievementList  />
      </main>
    </>
  );
}
