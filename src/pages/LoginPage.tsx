import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/client';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(values.username, values.password);
      if (res.data.requires_2fa) {
        setRequires2FA(true);
        setCredentials({ username: values.username, password: values.password });
      } else {
        localStorage.setItem('token', res.data.token);
        message.success('Login successful');
        navigate('/');
      }
    } catch {
      message.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitTOTP = async () => {
    if (!credentials) return;
    setLoading(true);
    try {
      const res = await login(credentials.username, credentials.password, totpCode);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        message.success('Login successful');
        navigate('/');
      } else {
        message.error('Invalid 2FA code');
      }
    } catch {
      message.error('Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="EdgeFlow CDN Console" style={{ width: 400 }}>
        {!requires2FA ? (
          <Form onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please enter username' }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <p style={{ marginBottom: 16, textAlign: 'center' }}>Enter the 6-digit code from your authenticator app</p>
            <Input
              prefix={<SafetyOutlined />}
              placeholder="000000"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              style={{ fontSize: 24, textAlign: 'center', letterSpacing: 8, marginBottom: 16 }}
              onPressEnter={onSubmitTOTP}
            />
            <Button type="primary" loading={loading} block onClick={onSubmitTOTP} disabled={totpCode.length !== 6}>
              Verify
            </Button>
            <Button
              type="link"
              block
              style={{ marginTop: 8 }}
              onClick={() => { setRequires2FA(false); setTotpCode(''); setCredentials(null); }}
            >
              Back to login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
