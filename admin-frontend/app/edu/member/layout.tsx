'use client';
import { Layout, Tag, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import LogoIcon from 'public/logo.png';
import React, { ReactNode } from 'react';

const { Header, Footer, Content } = Layout;

const MemberLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    /**
     * hasSider属性可以使 Content 自适应占满整个屏幕
     */
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex justify-between w-3/5 mx-auto">
            <div className="flex items-center">
              <Image
                src={LogoIcon}
                width={64}
                height={64}
                alt="logo"
                priority
              />
              <Link className="ml-8" href="/edu/member">
                首页
              </Link>
              <Link className="ml-8" href="/edu/member">
                最近学习
              </Link>
            </div>
            <div className="flex items-center">
              <Tag>测试部</Tag>
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
    </Layout>
  );
};

export default MemberLayout;
