import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message } from 'antd';
import { getNodes, updateNodeStatus } from '../api/client';
import type { Node } from '../types';

const NodesPage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await getNodes();
      setNodes(res.data);
    } catch {
      message.error('Failed to fetch nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNodes(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateNodeStatus(id, status);
      message.success('Status updated');
      fetchNodes();
    } catch {
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: 'Region', dataIndex: 'region', key: 'region' },
    { title: 'ISP', dataIndex: 'isp', key: 'isp' },
    {
      title: 'Status', key: 'status',
      render: (_: unknown, record: Node) => (
        <Select value={record.status} onChange={(v) => handleStatusChange(record.id, v)} style={{ width: 130 }}>
          <Select.Option value="online"><Tag color="green">Online</Tag></Select.Option>
          <Select.Option value="offline"><Tag color="red">Offline</Tag></Select.Option>
          <Select.Option value="maintenance"><Tag color="orange">Maintenance</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: 'Last Heartbeat', dataIndex: 'last_heartbeat', key: 'last_heartbeat',
      render: (t: string | null) => t ? new Date(t).toLocaleString() : '-',
    },
  ];

  return (
    <div>
      <h2>Edge Nodes</h2>
      <Table dataSource={nodes} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default NodesPage;
