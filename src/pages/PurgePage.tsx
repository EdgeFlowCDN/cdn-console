import React, { useState } from 'react';
import { Form, Input, Button, Radio, message, Card } from 'antd';
import { purgeURL, purgeDir, purgeAll } from '../api/client';

const PurgePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [purgeType, setPurgeType] = useState('url');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const domain = values.domain;
      const targets = values.targets?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [];

      switch (purgeType) {
        case 'url':
          await purgeURL(targets, domain);
          break;
        case 'dir':
          await purgeDir(targets, domain);
          break;
        case 'all':
          await purgeAll(domain);
          break;
      }
      message.success('Purge task created');
      form.resetFields();
    } catch {
      message.error('Failed to create purge task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cache Purge</h2>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical">
          <Form.Item label="Purge Type">
            <Radio.Group value={purgeType} onChange={(e) => setPurgeType(e.target.value)}>
              <Radio.Button value="url">URL</Radio.Button>
              <Radio.Button value="dir">Directory</Radio.Button>
              <Radio.Button value="all">Full Site</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="domain" label="Domain" rules={[{ required: true }]}>
            <Input placeholder="cdn.example.com" />
          </Form.Item>
          {purgeType !== 'all' && (
            <Form.Item name="targets" label="URLs/Directories (one per line)" rules={[{ required: true }]}>
              <Input.TextArea rows={5} placeholder="https://cdn.example.com/image.png" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Submit Purge
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PurgePage;
