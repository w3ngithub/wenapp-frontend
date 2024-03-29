import React from 'react'
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import data from './data'

const SynchronizedLineChart = () => (
  <ResponsiveContainer width="100%" height={700}>
    <div>
      <p className="text-center">A demo of synchronized AreaCharts</p>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            syncId="anyId"
            margin={{top: 10, right: 0, left: -15, bottom: 0}}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#003366"
              fill="#003366"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center">Maybe some other content</p>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            syncId="anyId"
            margin={{top: 10, right: 0, left: -15, bottom: 0}}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#003366"
              fill="#003366"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            syncId="anyId"
            margin={{top: 10, right: 0, left: -15, bottom: 0}}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#003366"
              fill="#003366"
            />
            <Brush />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </ResponsiveContainer>
)

export default SynchronizedLineChart
