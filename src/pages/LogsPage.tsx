import React, { useState } from 'react';
import { Row, Col, Input, Select, Button, Table, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

interface LogEntry {
  key: string;
  time: string;
  client_ip: string;
  method: string;
  host: string;
  uri: string;
  status: number;
  cache_status: string;
  request_time: number;
}

const mockLogs: LogEntry[] = [
  { key: '1', time: '2026-03-20 10:01:12', client_ip: '192.168.1.10', method: 'GET', host: 'cdn.example.com', uri: '/images/logo.png', status: 200, cache_status: 'HIT-MEM', request_time: 0.002 },
  { key: '2', time: '2026-03-20 10:01:15', client_ip: '10.0.0.5', method: 'GET', host: 'cdn.example.com', uri: '/js/app.bundle.js', status: 200, cache_status: 'HIT-DISK', request_time: 0.015 },
  { key: '3', time: '2026-03-20 10:01:18', client_ip: '172.16.0.20', method: 'GET', host: 'static.example.org', uri: '/api/data.json', status: 200, cache_status: 'MISS', request_time: 0.320 },
  { key: '4', time: '2026-03-20 10:02:01', client_ip: '192.168.1.10', method: 'GET', host: 'cdn.example.com', uri: '/css/main.css', status: 200, cache_status: 'HIT-MEM', request_time: 0.001 },
  { key: '5', time: '2026-03-20 10:02:30', client_ip: '10.0.0.8', method: 'GET', host: 'static.example.org', uri: '/fonts/roboto.woff2', status: 304, cache_status: 'HIT-MEM', request_time: 0.001 },
  { key: '6', time: '2026-03-20 10:03:00', client_ip: '172.16.0.25', method: 'POST', host: 'cdn.example.com', uri: '/api/upload', status: 403, cache_status: 'MISS', request_time: 0.050 },
  { key: '7', time: '2026-03-20 10:03:22', client_ip: '192.168.2.100', method: 'GET', host: 'cdn.example.com', uri: '/images/hero.jpg', status: 200, cache_status: 'HIT-DISK', request_time: 0.025 },
  { key: '8', time: '2026-03-20 10:04:10', client_ip: '10.0.0.5', method: 'GET', host: 'static.example.org', uri: '/videos/intro.mp4', status: 200, cache_status: 'MISS', request_time: 1.250 },
  { key: '9', time: '2026-03-20 10:04:45', client_ip: '172.16.0.20', method: 'GET', host: 'cdn.example.com', uri: '/favicon.ico', status: 200, cache_status: 'HIT-MEM', request_time: 0.001 },
  { key: '10', time: '2026-03-20 10:05:02', client_ip: '192.168.1.50', method: 'GET', host: 'cdn.example.com', uri: '/api/health', status: 502, cache_status: 'MISS', request_time: 5.001 },
  { key: '11', time: '2026-03-20 10:05:30', client_ip: '10.0.0.12', method: 'GET', host: 'static.example.org', uri: '/images/banner.webp', status: 200, cache_status: 'HIT-DISK', request_time: 0.018 },
  { key: '12', time: '2026-03-20 10:06:00', client_ip: '192.168.1.10', method: 'GET', host: 'cdn.example.com', uri: '/js/vendor.js', status: 200, cache_status: 'HIT-MEM', request_time: 0.003 },
  { key: '13', time: '2026-03-20 10:06:15', client_ip: '172.16.0.30', method: 'DELETE', host: 'cdn.example.com', uri: '/api/cache/key123', status: 404, cache_status: 'MISS', request_time: 0.010 },
];

const columns: ColumnsType<LogEntry> = [
  { title: 'Time', dataIndex: 'time', key: 'time', width: 180 },
  { title: 'Client IP', dataIndex: 'client_ip', key: 'client_ip', width: 140 },
  { title: 'Method', dataIndex: 'method', key: 'method', width: 80 },
  { title: 'Host', dataIndex: 'host', key: 'host', width: 180 },
  { title: 'URI', dataIndex: 'uri', key: 'uri', ellipsis: true },
  {
    title: 'Status', dataIndex: 'status', key: 'status', width: 80,
    render: (status: number) => {
      let color = '#52c41a';
      if (status >= 400) color = '#ff4d4f';
      else if (status >= 300) color = '#faad14';
      return <span style={{ color, fontWeight: 600 }}>{status}</span>;
    },
  },
  {
    title: 'Cache Status', dataIndex: 'cache_status', key: 'cache_status', width: 120,
    render: (val: string) => {
      let color = '#ff4d4f';
      if (val === 'HIT-MEM') color = '#52c41a';
      else if (val === 'HIT-DISK') color = '#1890ff';
      return <span style={{ color, fontWeight: 600 }}>{val}</span>;
    },
  },
  {
    title: 'Request Time', dataIndex: 'request_time', key: 'request_time', width: 120,
    render: (val: number) => `${val.toFixed(3)}s`,
  },
];

const LogsPage: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [statusCode, setStatusCode] = useState<string | undefined>(undefined);
  const [cacheStatus, setCacheStatus] = useState<string | undefined>(undefined);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);

  const handleSearch = () => {
    let results = [...mockLogs];
    if (domain) {
      results = results.filter((l) => l.host.includes(domain));
    }
    if (statusCode) {
      const prefix = parseInt(statusCode, 10);
      results = results.filter((l) => Math.floor(l.status / 100) === prefix / 100);
    }
    if (cacheStatus) {
      results = results.filter((l) => l.cache_status === cacheStatus);
    }
    setFilteredLogs(results);
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Input placeholder="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} allowClear />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <RangePicker style={{ width: '100%' }} />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="Status Code" allowClear style={{ width: '100%' }} value={statusCode} onChange={setStatusCode}>
            <Select.Option value="200">2xx</Select.Option>
            <Select.Option value="300">3xx</Select.Option>
            <Select.Option value="400">4xx</Select.Option>
            <Select.Option value="500">5xx</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="Cache Status" allowClear style={{ width: '100%' }} value={cacheStatus} onChange={setCacheStatus}>
            <Select.Option value="HIT-MEM">HIT-MEM</Select.Option>
            <Select.Option value="HIT-DISK">HIT-DISK</Select.Option>
            <Select.Option value="MISS">MISS</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Search</Button>
          </Space>
        </Col>
      </Row>
      <Table<LogEntry> columns={columns} dataSource={filteredLogs} pagination={{ pageSize: 20 }} scroll={{ x: 1000 }} />
    </div>
  );
};

export default LogsPage;
