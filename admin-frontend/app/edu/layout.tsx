'use client';
import {
  DesktopOutlined,
  FolderOutlined,
  HomeOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, theme } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Key, ReactNode, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('首页概览', 'home', <HomeOutlined />),
  getItem('分类管理', 'categories', <TagsOutlined />),
  getItem('资源管理', 'resources', <FolderOutlined />, [
    getItem('视频', 'videos'),
    getItem('课件', 'coursewares'),
  ]),
  getItem('课程中心', 'courses', <DesktopOutlined />, [
    getItem('线上课', 'online'),
  ]),
  getItem('学员管理', 'member-management', <TeamOutlined />, [
    getItem('学员', 'members'),
    getItem('部门', 'departments'),
  ]),
  getItem('系统设置', 'settings', <SettingOutlined />, [
    getItem('管理人员', 'administrator'),
    getItem('管理日志', 'logs'),
  ]),
];

const { Header, Content, Footer, Sider } = Layout;

const EduLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();

  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e.keyPath, [...e.keyPath].reverse().join('/'));
    // TODO: Remove "if" block after all pages being created.
    if (
      e.key === 'department' ||
      e.key === 'member' ||
      e.key === 'administrator' ||
      e.key === 'categories' ||
      e.keyPath.find(path => path === 'videos') ||
      e.keyPath.find(path => path === 'members') ||
      e.keyPath.find(path => path === 'departments') ||
      e.keyPath.find(path => path === 'home') ||
      e.keyPath.find(path => path === 'coursewares') ||
      e.keyPath.find(path => path === 'online')
    ) {
      router.push('/edu/' + e.keyPath.reverse().join('/'));
    }
  };

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        collapsed={collapsed}
        collapsible
        onCollapse={value => setCollapsed(value)}
      >
        {!collapsed && (
          <div className="flex">
            <Image
              className="m-auto"
              src="/logo.png"
              width={80}
              height={80}
              alt="logo"
              priority
            />
          </div>
        )}
        <Menu
          defaultSelectedKeys={['4']}
          items={items}
          mode="inline"
          onClick={onClick}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: '0.75rem',
              height: '100%',
              width: '100%',
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Starry Edu ©2023 Created by Lucas Ji
        </Footer>
      </Layout>
    </Layout>
  );
};

export default EduLayout;
