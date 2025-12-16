import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlassCard from './GlassCard';

const COLORS = {
    'Supportive/Empathetic': '#003049', // Brand Primary
    'Informative/Neutral': '#EAE2B7',   // Cream (Maybe too light? Let's use a Grey or light Blue) -> Actually, used Cream in badge.
    // Pie chart on white background... Cream is invisible. 
    // Let's use #6B7280 (Gray) or #219EBC (Blue)
    // I'll use #219EBC (from Tailwind config mapping)
    // Wait, I defined brand colors in tailwind.config.js but Recharts needs HEX.
    // Brand Primary: #003049
    // Brand Red: #D62828
    // Brand Orange: #F77F00
    // Brand Accent: #FCBF49
    'Informative/Neutral': '#475569',   // Slate 600 for contrast
    'Critical/Disapproving': '#D62828', // Brand Red
    'Sarcastic/Ironic': '#F77F00',      // Brand Orange
    'Angry/Hostile': '#991B1B',         // Darker Red
    'Appreciative/Praising': '#FCBF49', // Brand Accent (Yellow)
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
            <h3 className="text-xl font-bold mb-4 text-brand-primary">Sentiment Distribution</h3>
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
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                color: '#003049',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#003049', fontWeight: 600 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default SentimentChart;
