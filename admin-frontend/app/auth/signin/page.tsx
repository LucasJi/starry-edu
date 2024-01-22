'use client';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation.js';
import { FC } from 'react';

const { Title } = Typography;

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const Login: FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSignIn = () => {
    // form.validateFields().then(values => {
    //   const { email, password } = values;
    // });

    const nonceId = searchParams.get('nonceId');

    console.log('nonceId', nonceId);

    axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_IDP_URL}/login`,
      headers: {
        nonceId,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        username: 'admin',
        password: '123123',
      },
    }).then(() => {
      const target = searchParams.get('target');
      if (target) {
        console.log(target);
        window.location.href = target;
      } else {
        console.log('search params does not contain target');
        router.push('/edu/home');
      }
    });
  };

  return (
    <div className="flex h-screen">
      <div className="flex rounded-3xl shadow-2xl w-[88rem] h-[56rem] m-auto px-10 py-20 items-center">
        <div className="w-1/2">Left Part(WIP)</div>
        <div className="w-1/2">
          <Title level={2} underline>
            后台登入
          </Title>
          <Form
            form={form}
            initialValues={{ remember: true }}
            name="normal_login"
            size={'large'}
            style={{
              maxWidth: '80%',
            }}
          >
            <Form.Item<FieldType>
              initialValue="admin@starry.edu.cn"
              name="email"
              rules={[
                { required: true, message: '请输入管理员邮箱！' },
                {
                  pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                  message: '请输入正确格式的邮箱',
                },
              ]}
            >
              <Input placeholder="请输入管理员邮箱" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item<FieldType>
              initialValue="123123"
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input
                placeholder="请输入密码"
                prefix={<LockOutlined />}
                type="password"
              />
            </Form.Item>
            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                onClick={handleSignIn}
                style={{
                  width: '100%',
                }}
                type="primary"
              >
                登入
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
