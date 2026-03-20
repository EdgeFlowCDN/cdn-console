import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  GlobalOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  ClearOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import LoginPage from './pages/LoginPage';
import DomainsPage from './pages/DomainsPage';
import DomainDetailPage from './pages/DomainDetailPage';
import NodesPage from './pages/NodesPage';
import PurgePage from './pages/PurgePage';
import CertsPage from './pages/CertsPage';

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
    { key: '/domains', icon: <GlobalOutlined />, label: <Link to="/domains">Domains</Link> },
    { key: '/nodes', icon: <CloudServerOutlined />, label: <Link to="/nodes">Nodes</Link> },
    { key: '/certs', icon: <SafetyCertificateOutlined />, label: <Link to="/certs">Certificates</Link> },
    { key: '/purge', icon: <ClearOutlined />, label: <Link to="/purge">Cache Purge</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          EdgeFlow
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} defaultSelectedKeys={['/domains']} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', minHeight: 280 }}>
          <Routes>
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/domains/:id" element={<DomainDetailPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/certs" element={<CertsPage />} />
            <Route path="/purge" element={<PurgePage />} />
            <Route path="/" element={<Navigate to="/domains" replace />} />
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
