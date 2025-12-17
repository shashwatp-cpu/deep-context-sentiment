import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlassCard from './GlassCard';

const COLORS = {
    'Supportive/Empathetic': '#22d3ee',
    'Informative/Neutral': '#64748b',
    'Critical/Disapproving': '#fb923c',
    'Sarcastic/Ironic': '#e879f9',
    'Angry/Hostile': '#f97373',
    'Appreciative/Praising': '#4ade80',
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
        <GlassCard className="h-[400px] flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-4 text-slate-50 tracking-tight">Sentiment Distribution</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#020617',
                                borderRadius: '12px',
                                border: '1px solid rgba(148,163,184,0.35)',
                                color: '#e5e7eb',
                                boxShadow: '0 18px 45px rgba(15,23,42,0.85)'
                            }}
                            itemStyle={{ color: '#e5e7eb', fontWeight: 500 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="ml-1 text-xs font-medium text-slate-300">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default SentimentChart;
