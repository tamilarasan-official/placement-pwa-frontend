import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Analytics } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineDocumentText, HiOutlineCheckCircle } from 'react-icons/hi';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import StatCard from '../ui/StatCard';
import Skeleton from '../ui/Skeleton';

const STATUS_COLORS: Record<string, string> = {
  APPLIED: '#3b82f6',
  SHORTLISTED: '#eab308',
  INTERVIEWED: '#a855f7',
  SELECTED: '#22c55e',
  REJECTED: '#ef4444',
};

const DEPT_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics()
      .then((res) => { if (res.success) setAnalytics(res.analytics); })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6"><Skeleton className="h-28" /><Skeleton className="h-80" /></div>;
  if (!analytics) return null;

  const stats = [
    { label: 'Total Students', value: analytics.total_students, icon: HiOutlineUsers, color: 'blue' as const },
    { label: 'Total Companies', value: analytics.total_companies, icon: HiOutlineOfficeBuilding, color: 'indigo' as const },
    { label: 'Applications', value: analytics.total_applications, icon: HiOutlineDocumentText, color: 'purple' as const },
    { label: 'Placed', value: analytics.placed_students, icon: HiOutlineCheckCircle, color: 'green' as const },
  ];

  // Radial data for placement rate
  const placementPct = Math.min(analytics.placement_percentage, 100);
  const radialData = [{ name: 'Placement', value: placementPct, fill: '#22c55e' }];

  // Pie data for status distribution
  const pieData = analytics.status_distribution
    ? Object.entries(analytics.status_distribution).map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name] || '#9ca3af',
      }))
    : [];

  // Bar data for departments
  const deptData = (analytics.department_stats || []).map((d) => ({
    department: d.department || 'Unknown',
    count: d.count,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Rate Gauge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Placement Rate</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                startAngle={180}
                endAngle={0}
                data={radialData}
                barSize={16}
              >
                <RadialBar
                  background={{ fill: '#e5e7eb' }}
                  dataKey="value"
                  cornerRadius={8}
                />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                  fill="#111827"
                >
                  {placementPct.toFixed(1)}%
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs"
                  fill="#6b7280"
                >
                  of students placed
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Application Status Distribution</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-16">No application data yet</p>
          )}
        </div>
      </div>

      {/* Department Stats Bar Chart */}
      {deptData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Students by Department</h3>
          <ResponsiveContainer width="100%" height={Math.max(220, deptData.length * 45)}>
            <BarChart data={deptData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                type="category"
                dataKey="department"
                width={80}
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                {deptData.map((_entry, i) => (
                  <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
