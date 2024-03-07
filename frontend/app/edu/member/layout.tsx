'use client';
import { LogoutOutlined } from '@ant-design/icons';
import { memberApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import { Member } from '@types';
import { Button, Dropdown, Layout, Tag } from 'antd';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import LogoIcon from 'public/logo.png';
import React, { ReactNode, useEffect, useState } from 'react';

const { Header, Footer, Content } = Layout;

const MemberLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorBgContainer = 'white';
  const [member, setMember] = useState<Member>();

  useEffect(() => {
    memberApis.current().then(resp => setMember(resp.data));
  }, []);

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
              <Link className="ml-8 text-black text-2xl" href="/edu/member">
                首页
              </Link>
              {/*<Link className="ml-8 text-black text-2xl" href="/edu/member">*/}
              {/*  最近学习*/}
              {/*</Link>*/}
            </div>
            <div className="flex items-center">
              {member ? (
                <>
                  <Tag>{member?.departmentName}</Tag>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <Button
                              icon={<LogoutOutlined />}
                              type="text"
                              size="small"
                              onClick={() => signOut()}
                            >
                              退出登录
                            </Button>
                          ),
                        },
                      ],
                    }}
                    placement="bottomRight"
                  >
                    <Button type="text" className="mr-4">
                      {member?.user?.username}
                    </Button>
                  </Dropdown>
                </>
              ) : (
                <LoadingOutlinedSpin />
              )}
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
              minHeight: 500,
              background: colorBgContainer,
              borderRadius: '0.75rem',
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Starry Edu ©2023 Created by Lucas Ji</span>
          <a href="https://beian.miit.gov.cn/" target="_blank">
            苏ICP备2023055488号
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MemberLayout;
