import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlassCard from './GlassCard';

const COLORS = {
    'Supportive/Empathetic': '#10B981',
    'Informative/Neutral': '#3B82F6',
    'Critical/Disapproving': '#EF4444',
    'Sarcastic/Ironic': '#F59E0B',
    'Angry/Hostile': '#DC2626',
    'Appreciative/Praising': '#8B5CF6',
};

const SentimentChart = ({ data }) => {
    // Transform the summary object into an array for Recharts
    const chartData = Object.entries(data)
        .filter(([key]) => key !== 'totalComments')
        .map(([key, value]) => ({
            name: key.replace(/_/g, '/').replace(/\b\w/g, l => l.toUpperCase()), // Format key
            value: value,
        }))
        .filter(item => item.value > 0); // Only show relevant segments

    return (
        <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-slate-100">Sentiment Distribution</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default SentimentChart;
