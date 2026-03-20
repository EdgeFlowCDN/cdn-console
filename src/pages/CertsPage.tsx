import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getCertificates, deleteCert } from '../api/client';
import type { Certificate } from '../types';

const CertsPage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await getCertificates();
      setCerts(res.data);
    } catch {
      message.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleDelete = async (id: number) => {
    await deleteCert(id);
    message.success('Certificate deleted');
    fetchCerts();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Domain ID', dataIndex: 'domain_id', key: 'domain_id', width: 100 },
    { title: 'Issuer', dataIndex: 'issuer', key: 'issuer' },
    { title: 'Valid From', dataIndex: 'not_before', key: 'not_before', render: (t: string) => new Date(t).toLocaleDateString() },
    {
      title: 'Valid Until', dataIndex: 'not_after', key: 'not_after',
      render: (t: string) => {
        const d = new Date(t);
        const expired = d < new Date();
        return <Tag color={expired ? 'red' : 'green'}>{d.toLocaleDateString()}</Tag>;
      },
    },
    { title: 'Auto Renew', dataIndex: 'auto_renew', key: 'auto_renew', render: (v: boolean) => v ? <Tag color="blue">Yes</Tag> : 'No' },
    {
      title: 'Actions', key: 'actions',
      render: (_: unknown, record: Certificate) => (
        <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Certificates</h2>
      <Table dataSource={certs} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default CertsPage;
