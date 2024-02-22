'use client';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Layout,
  Space,
  Table,
  theme,
  Tree,
  TreeProps,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useState } from 'react';

const { Search } = Input;
const { Header, Content, Footer, Sider } = Layout;

const treeData: DataNode[] = [
  {
    title: '全部管理员',
    key: '全部管理员',
    children: [
      {
        title: '超级管理员',
        key: '超级管理员',
      },
      {
        title: '普通管理员',
        key: '普通管理员',
      },
    ],
  },
];

interface DataType {
  key: string;
  name: string;
  role: string;
  email: string;
  ip: string;
  updateTimestamp: string;
  ableToLogin: boolean;
}

const columns: ColumnsType<DataType> = [
  {
    title: '管理员',
    dataIndex: 'name',
  },
  {
    title: '角色',
    dataIndex: 'role',
  },
  {
    title: '登录邮箱',
    dataIndex: 'email',
  },
  {
    title: '登录IP',
    dataIndex: 'ip',
  },
  {
    title: '上次登录时间',
    dataIndex: 'updateTimestamp',
  },
  {
    title: '禁止登录',
    dataIndex: 'ableToLogin',
    render: (_, record) => (record.ableToLogin ? '否' : '是'),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>编辑</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    role: '普通管理员',
    email: '124@test.com',
    ip: '127.0.0.1',
    updateTimestamp: '123',
    ableToLogin: true,
  },
  {
    key: '2',
    name: 'Jim Green',
    role: '普通管理员',
    email: '124@test.com',
    ip: '127.0.0.1',
    updateTimestamp: '123',
    ableToLogin: true,
  },
  {
    key: '3',
    name: 'Joe Black',
    role: '普通管理员',
    email: '124@test.com',
    ip: '127.0.0.1',
    updateTimestamp: '123',
    ableToLogin: true,
  },
];

export default function Administrator() {
  const [selectedRole, setSelectedRole] = useState('全部管理员');
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    setSelectedRole(selectedKeys[0] as string);
  };

  const onSearch = (value: string) => console.log(value);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        padding: '24px 0',
        background: colorBgContainer,
        borderRadius: '0.75rem',
      }}
    >
      <Sider style={{ background: colorBgContainer }} width={200}>
        <Tree defaultExpandAll onSelect={onSelect} treeData={treeData} />
      </Sider>
      <Divider
        style={{
          height: '100vh',
        }}
        type="vertical"
      />
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <div className="flex flex-col">
          <div className="text-2xl font-medium">{selectedRole}</div>
          <div className="flex justify-between mt-12">
            <Space>
              <Button
                icon={<PlusOutlined />}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                type="primary"
              >
                添加管理员
              </Button>
              <Button>新建角色</Button>
            </Space>
            <div className="flex items-center">
              <span>管理员姓名：</span>
              <Search
                allowClear
                onSearch={onSearch}
                placeholder="请输入管理员姓名"
                style={{ width: '20rem' }}
              />
            </div>
          </div>
          <div className="mt-12">
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
