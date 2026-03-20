import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  ClearOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import DomainsPage from './pages/DomainsPage';
import DomainDetailPage from './pages/DomainDetailPage';
import NodesPage from './pages/NodesPage';
import PurgePage from './pages/PurgePage';
import CertsPage from './pages/CertsPage';
import SecurityPage from './pages/SecurityPage';

const { Header, Sider, Content } = Layout;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: '/domains', icon: <GlobalOutlined />, label: <Link to="/domains">Domains</Link> },
    { key: '/nodes', icon: <CloudServerOutlined />, label: <Link to="/nodes">Nodes</Link> },
    { key: '/certs', icon: <SafetyCertificateOutlined />, label: <Link to="/certs">Certificates</Link> },
    { key: '/purge', icon: <ClearOutlined />, label: <Link to="/purge">Cache Purge</Link> },
    { key: '/security', icon: <LockOutlined />, label: <Link to="/security">Security</Link> },
    { key: '/logs', icon: <FileSearchOutlined />, label: <Link to="/logs">Logs</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          EdgeFlow
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} defaultSelectedKeys={['/dashboard']} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', minHeight: 280 }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/domains/:id" element={<DomainDetailPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/certs" element={<CertsPage />} />
            <Route path="/purge" element={<PurgePage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);

export default App;
