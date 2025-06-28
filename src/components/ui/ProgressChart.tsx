import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ProgressChartProps {
  data: any;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  // Enhanced mock data for demonstration
  const chartData = [
    { day: 'Mon', xp: 450, quests: 3, battles: 1, mood: 7.5, focus: 85 },
    { day: 'Tue', xp: 680, quests: 4, battles: 2, mood: 8.2, focus: 92 },
    { day: 'Wed', xp: 320, quests: 2, battles: 1, mood: 6.8, focus: 78 },
    { day: 'Thu', xp: 890, quests: 6, battles: 3, mood: 9.1, focus: 95 },
    { day: 'Fri', xp: 720, quests: 5, battles: 2, mood: 8.5, focus: 88 },
    { day: 'Sat', xp: 950, quests: 7, battles: 4, mood: 8.8, focus: 90 },
    { day: 'Sun', xp: 600, quests: 4, battles: 2, mood: 8.0, focus: 85 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md p-4 rounded-lg border border-neon-cyan/30 shadow-xl">
          <p className="text-white font-bold mb-2 font-space">{`${label}`}</p>
          <div className="space-y-1">
            <p className="text-neon-cyan font-space">
              <span className="inline-block w-3 h-3 bg-neon-cyan rounded-full mr-2"></span>
              XP: {payload[0]?.value}
            </p>
            <p className="text-neon-purple font-space">
              <span className="inline-block w-3 h-3 bg-neon-purple rounded-full mr-2"></span>
              Quests: {payload[1]?.value || 0}
            </p>
            <p className="text-neon-pink font-space">
              <span className="inline-block w-3 h-3 bg-neon-pink rounded-full mr-2"></span>
              Battles: {payload[2]?.value || 0}
            </p>
            <p className="text-neon-yellow font-space">
              <span className="inline-block w-3 h-3 bg-neon-yellow rounded-full mr-2"></span>
              Mood: {payload[3]?.value || 0}/10
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="h-80 relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#EC4899" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis 
            yAxisId="mood"
            orientation="right"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* XP Line */}
          <Line
            type="monotone"
            dataKey="xp"
            stroke="#06B6D4"
            strokeWidth={3}
            dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#06B6D4', strokeWidth: 2, fill: '#ffffff' }}
            name="XP"
          />
          
          {/* Mood Line */}
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#EC4899"
            strokeWidth={3}
            dot={{ fill: '#EC4899', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#EC4899', strokeWidth: 2, fill: '#ffffff' }}
            name="Mood"
            yAxisId="mood"
          />
          
          {/* Focus Line */}
          <Line
            type="monotone"
            dataKey="focus"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
            name="Focus"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 text-xs font-space">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-neon-cyan"></div>
          <span className="text-neon-cyan">XP Earned</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-neon-pink"></div>
          <span className="text-neon-pink">Mood Level</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-neon-purple border-dashed border-t"></div>
          <span className="text-neon-purple">Focus Score</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressChart;