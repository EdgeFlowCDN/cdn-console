import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDomains, createDomain, deleteDomain } from '../api/client';
import type { Domain } from '../types';

const DomainsPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await getDomains();
      setDomains(res.data);
    } catch {
      message.error('Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDomains(); }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createDomain(values.domain);
      message.success('Domain created');
      setModalOpen(false);
      form.resetFields();
      fetchDomains();
    } catch {
      message.error('Failed to create domain');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDomain(id);
      message.success('Domain deleted');
      fetchDomains();
    } catch {
      message.error('Failed to delete domain');
    }
  };

  const statusColor: Record<string, string> = {
    active: 'green',
    pending: 'orange',
    disabled: 'red',
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Domain', dataIndex: 'domain', key: 'domain',
      render: (text: string, record: Domain) => (
        <Button type="link" onClick={() => navigate(`/domains/${record.id}`)} style={{ padding: 0 }}>{text}</Button>
      ),
    },
    { title: 'CNAME', dataIndex: 'cname', key: 'cname' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status: string) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', render: (t: string) => new Date(t).toLocaleString() },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, record: Domain) => (
        <Popconfirm title="Delete this domain?" onConfirm={() => handleDelete(record.id)}>
          <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Domains</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add Domain
        </Button>
      </div>
      <Table dataSource={domains} columns={columns} rowKey="id" loading={loading} />
      <Modal title="Add Domain" open={modalOpen} onOk={handleCreate} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="domain" label="Domain Name" rules={[{ required: true }]}>
            <Input placeholder="cdn.example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DomainsPage;
