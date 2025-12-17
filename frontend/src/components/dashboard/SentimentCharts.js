import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../ui/Card';

// Define a color palette for the various sentiments
const SENTIMENT_COLORS = {
  supportive_empathetic: '#4CAF50', // Green
  appreciative_praising: '#81C784', // Light Green
  informative_neutral: '#64B5F6',   // Blue
  sarcastic_ironic: '#FFC107',      // Amber
  critical_disapproving: '#FF9800', // Orange
  angry_hostile: '#F44336',         // Red
};

const SentimentCharts = ({ summary }) => {
  // Transform the summary object into an array that Recharts can use
  const chartData = Object.keys(summary)
    .filter(key => key !== 'totalComments') // Exclude non-sentiment keys
    .map(key => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format name for display
      value: summary[key],
    }));

  return (
    <Card title="Overall Sentiment">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name.toLowerCase().replace(/ /g, '_')] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SentimentCharts;