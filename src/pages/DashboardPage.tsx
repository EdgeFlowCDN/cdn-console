import React, { useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { GlobalOutlined, CloudServerOutlined, ThunderboltOutlined, BarChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const requestsOverTime = [
  { time: '00:00', requests: 1200 },
  { time: '02:00', requests: 900 },
  { time: '04:00', requests: 600 },
  { time: '06:00', requests: 800 },
  { time: '08:00', requests: 2100 },
  { time: '10:00', requests: 3500 },
  { time: '12:00', requests: 4200 },
  { time: '14:00', requests: 3800 },
  { time: '16:00', requests: 4500 },
  { time: '18:00', requests: 5100 },
  { time: '20:00', requests: 3900 },
  { time: '22:00', requests: 2200 },
];

const cacheStatusData = [
  { name: 'HIT-MEM', value: 5820 },
  { name: 'HIT-DISK', value: 3140 },
  { name: 'MISS', value: 1540 },
];

const COLORS = ['#52c41a', '#1890ff', '#ff4d4f'];

const DashboardPage: React.FC = () => {
  const [stats] = useState({
    totalDomains: 12,
    activeNodes: 8,
    cacheHitRate: 85.3,
    totalRequests: 10500,
  });

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Domains" value={stats.totalDomains} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Active Nodes" value={stats.activeNodes} prefix={<CloudServerOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Cache Hit Rate" value={stats.cacheHitRate} suffix="%" prefix={<ThunderboltOutlined />} precision={1} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Requests" value={stats.totalRequests} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Requests Over Time">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={requestsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#1890ff" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Cache Status Distribution">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={cacheStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}>
                  {cacheStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
