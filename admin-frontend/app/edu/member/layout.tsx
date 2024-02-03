'use client';
import { Layout, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const { Header, Footer, Content } = Layout;

const MemberLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <div className="flex justify-between w-3/5 mx-auto">
          <div className="flex items-center">
            <Image src="/logo.png" width={64} height={64} alt="logo" priority />
            <Link className="ml-8" href="/edu/member">
              首页
            </Link>
            <Link className="ml-8" href="/edu/member">
              最近学习
            </Link>
          </div>
          <div className="flex items-center">
            <span>xx部门</span>
            <span>xx部门学员一号</span>
          </div>
        </div>
      </Header>
      <Content
        style={{
          margin: '16px 0',
        }}
      >
        <div
          style={{
            padding: 24,
            height: '100%',
            width: '100%',
            background: colorBgContainer,
            borderRadius: '0.75rem',
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Starry Edu ©2023 Created by Lucas Ji
      </Footer>
    </Layout>
  );
};

export default MemberLayout;
