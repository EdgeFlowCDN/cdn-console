import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, message, Popconfirm, Descriptions } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDomain, getOrigins, createOrigin, deleteOrigin, getCacheRules, createCacheRule, deleteCacheRule } from '../api/client';
import type { Domain, Origin, CacheRule } from '../types';

const DomainDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const domainId = Number(id);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [cacheRules, setCacheRules] = useState<CacheRule[]>([]);
  const [originModalOpen, setOriginModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [originForm] = Form.useForm();
  const [ruleForm] = Form.useForm();

  const fetchAll = async () => {
    try {
      const [d, o, r] = await Promise.all([
        getDomain(domainId),
        getOrigins(domainId),
        getCacheRules(domainId),
      ]);
      setDomain(d.data);
      setOrigins(o.data);
      setCacheRules(r.data);
    } catch {
      message.error('Failed to load domain details');
    }
  };

  useEffect(() => { fetchAll(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainId]);

  const handleCreateOrigin = async () => {
    const values = await originForm.validateFields();
    await createOrigin(domainId, values);
    message.success('Origin added');
    setOriginModalOpen(false);
    originForm.resetFields();
    fetchAll();
  };

  const handleCreateRule = async () => {
    const values = await ruleForm.validateFields();
    await createCacheRule(domainId, values);
    message.success('Cache rule added');
    setRuleModalOpen(false);
    ruleForm.resetFields();
    fetchAll();
  };

  const originColumns = [
    { title: 'Address', dataIndex: 'addr', key: 'addr' },
    { title: 'Port', dataIndex: 'port', key: 'port', width: 80 },
    { title: 'Weight', dataIndex: 'weight', key: 'weight', width: 80 },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80, render: (p: number) => p === 0 ? <Tag color="blue">Primary</Tag> : <Tag>Backup</Tag> },
    { title: 'Protocol', dataIndex: 'protocol', key: 'protocol', width: 80 },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_: unknown, record: Origin) => (
        <Popconfirm title="Delete?" onConfirm={async () => { await deleteOrigin(domainId, record.id); fetchAll(); }}>
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const ruleColumns = [
    { title: 'Path Pattern', dataIndex: 'path_pattern', key: 'path_pattern' },
    { title: 'TTL (seconds)', dataIndex: 'ttl', key: 'ttl', width: 120 },
    { title: 'Ignore Query', dataIndex: 'ignore_query', key: 'ignore_query', width: 120, render: (v: boolean) => v ? 'Yes' : 'No' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80 },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_: unknown, record: CacheRule) => (
        <Popconfirm title="Delete?" onConfirm={async () => { await deleteCacheRule(domainId, record.id); fetchAll(); }}>
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  if (!domain) return null;

  return (
    <div>
      <h2>{domain.domain}</h2>
      <Descriptions bordered size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="CNAME">{domain.cname}</Descriptions.Item>
        <Descriptions.Item label="Status"><Tag color={domain.status === 'active' ? 'green' : 'red'}>{domain.status}</Tag></Descriptions.Item>
        <Descriptions.Item label="Created">{new Date(domain.created_at).toLocaleString()}</Descriptions.Item>
      </Descriptions>

      <Tabs items={[
        {
          key: 'origins',
          label: 'Origins',
          children: (
            <>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setOriginModalOpen(true)} style={{ marginBottom: 16 }}>Add Origin</Button>
              <Table dataSource={origins} columns={originColumns} rowKey="id" size="small" />
            </>
          ),
        },
        {
          key: 'cache-rules',
          label: 'Cache Rules',
          children: (
            <>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setRuleModalOpen(true)} style={{ marginBottom: 16 }}>Add Rule</Button>
              <Table dataSource={cacheRules} columns={ruleColumns} rowKey="id" size="small" />
            </>
          ),
        },
      ]} />

      <Modal title="Add Origin" open={originModalOpen} onOk={handleCreateOrigin} onCancel={() => setOriginModalOpen(false)}>
        <Form form={originForm} layout="vertical">
          <Form.Item name="addr" label="Origin Address" rules={[{ required: true }]}>
            <Input placeholder="https://origin.example.com" />
          </Form.Item>
          <Form.Item name="weight" label="Weight" initialValue={100}>
            <InputNumber min={1} max={1000} />
          </Form.Item>
          <Form.Item name="priority" label="Priority (0=Primary)" initialValue={0}>
            <InputNumber min={0} max={10} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Add Cache Rule" open={ruleModalOpen} onOk={handleCreateRule} onCancel={() => setRuleModalOpen(false)}>
        <Form form={ruleForm} layout="vertical">
          <Form.Item name="path_pattern" label="Path Pattern" initialValue="/*">
            <Input placeholder="/*.jpg" />
          </Form.Item>
          <Form.Item name="ttl" label="TTL (seconds)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ignore_query" label="Ignore Query String" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DomainDetailPage;
