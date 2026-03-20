import React, { useEffect, useState } from 'react';
import { Card, Button, Steps, Input, message, Modal, Typography, Alert, Spin } from 'antd';
import { SafetyOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { get2FAStatus, setup2FA, verify2FA, disable2FA } from '../api/client';

const { Text, Paragraph } = Typography;

const SecurityPage: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupStep, setSetupStep] = useState(-1); // -1 = not in setup flow
  const [secret, setSecret] = useState('');
  const [otpauthURL, setOtpauthURL] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [disabling, setDisabling] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await get2FAStatus();
      setEnabled(res.data.enabled);
    } catch {
      message.error('Failed to fetch 2FA status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSetup = async () => {
    try {
      const res = await setup2FA();
      setSecret(res.data.secret);
      setOtpauthURL(res.data.url);
      setBackupCodes(res.data.backup_codes);
      setSetupStep(0);
    } catch {
      message.error('Failed to set up 2FA');
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await verify2FA(verifyCode);
      message.success('2FA enabled successfully');
      setSetupStep(2);
      setEnabled(true);
    } catch {
      message.error('Invalid code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    setDisabling(true);
    try {
      await disable2FA(disableCode, disablePassword);
      message.success('2FA disabled successfully');
      setEnabled(false);
      setDisableModalVisible(false);
      setDisableCode('');
      setDisablePassword('');
      setSetupStep(-1);
    } catch {
      message.error('Failed to disable 2FA. Check your code and password.');
    } finally {
      setDisabling(false);
    }
  };

  const resetSetup = () => {
    setSetupStep(-1);
    setSecret('');
    setOtpauthURL('');
    setBackupCodes([]);
    setVerifyCode('');
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 100, textAlign: 'center' }} />;
  }

  const qrURL = otpauthURL
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpauthURL)}&size=200x200`
    : '';

  return (
    <div>
      <h2>Security Settings</h2>

      <Card title="Two-Factor Authentication" style={{ maxWidth: 600 }}>
        {enabled && setupStep === -1 && (
          <div>
            <Alert
              message="2FA is enabled"
              description="Your account is protected with two-factor authentication."
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Button danger onClick={() => setDisableModalVisible(true)}>
              Disable 2FA
            </Button>
          </div>
        )}

        {!enabled && setupStep === -1 && (
          <div>
            <Alert
              message="2FA is not enabled"
              description="Add an extra layer of security to your account by enabling two-factor authentication."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Button type="primary" icon={<SafetyOutlined />} onClick={handleSetup}>
              Enable 2FA
            </Button>
          </div>
        )}

        {setupStep >= 0 && (
          <div>
            <Steps
              current={setupStep}
              items={[
                { title: 'Scan QR Code' },
                { title: 'Verify Code' },
                { title: 'Complete' },
              ]}
              style={{ marginBottom: 24 }}
            />

            {setupStep === 0 && (
              <div>
                <Paragraph>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</Paragraph>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <img src={qrURL} alt="2FA QR Code" style={{ width: 200, height: 200 }} />
                </div>
                <Paragraph>
                  Or enter this secret manually: <Text code copyable>{secret}</Text>
                </Paragraph>
                <Alert
                  message="Save your backup codes"
                  description={
                    <div>
                      <Paragraph>Store these codes in a safe place. You can use them if you lose access to your authenticator app.</Paragraph>
                      <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                        {backupCodes.map((code, i) => (
                          <div key={i}>{code}</div>
                        ))}
                      </div>
                    </div>
                  }
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                <Button type="primary" onClick={() => setSetupStep(1)}>
                  Next
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={resetSetup}>
                  Cancel
                </Button>
              </div>
            )}

            {setupStep === 1 && (
              <div>
                <Paragraph>Enter the 6-digit code from your authenticator app to verify setup:</Paragraph>
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="000000"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: 24, textAlign: 'center', letterSpacing: 8, marginBottom: 16, maxWidth: 250 }}
                  onPressEnter={handleVerify}
                />
                <div>
                  <Button type="primary" onClick={handleVerify} loading={verifying} disabled={verifyCode.length !== 6}>
                    Verify and Enable
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => setSetupStep(0)}>
                    Back
                  </Button>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                <Paragraph>Two-factor authentication has been enabled successfully.</Paragraph>
                <Button type="primary" onClick={resetSetup}>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal
        title="Disable Two-Factor Authentication"
        open={disableModalVisible}
        onOk={handleDisable}
        onCancel={() => { setDisableModalVisible(false); setDisableCode(''); setDisablePassword(''); }}
        confirmLoading={disabling}
        okText="Disable 2FA"
        okButtonProps={{ danger: true, disabled: disableCode.length !== 6 || !disablePassword }}
      >
        <Paragraph>To disable 2FA, enter your current TOTP code and password.</Paragraph>
        <Input
          prefix={<SafetyOutlined />}
          placeholder="6-digit code"
          maxLength={6}
          value={disableCode}
          onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
          style={{ marginBottom: 12 }}
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          value={disablePassword}
          onChange={(e) => setDisablePassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default SecurityPage;
