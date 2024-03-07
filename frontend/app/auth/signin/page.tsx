'use client';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Result } from '@types';
import { Button, Flex, Form, Input, message, Typography } from 'antd';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation.js';
import StarrySvg from 'public/starry.svg';
import { FC, useState } from 'react';

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  // remember?: string;
};

const Login: FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const nonceId = searchParams.get('nonceId');
  const [signInButtonLoading, setSignInButtonLoading] =
    useState<boolean>(false);

  const handleSignIn = () => {
    form.validateFields().then(values => {
      const { username, password } = values;
      setSignInButtonLoading(true);
      axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_IDP_URL}/login`,
        headers: {
          nonceId,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          username,
          password,
        },
      })
        .then(resp => {
          const data = resp.data as Result<void>;

          if (data.success) {
            message.success('登入成功');
            const target = searchParams.get('target');
            if (target) {
              window.location.href = target;
            }
          } else {
            message.error(data.message);
          }
        })
        .finally(() => setSignInButtonLoading(false));
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
          {nonceId ? (
            <Form
              form={form}
              initialValues={{ remember: true }}
              name="loginForm"
              size={'large'}
              style={{
                maxWidth: '80%',
              }}
            >
              <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                  type="password"
                />
              </Form.Item>
              {/*<Form.Item<FieldType> name="remember" valuePropName="checked">*/}
              {/*  <Checkbox>记住我</Checkbox>*/}
              {/*</Form.Item>*/}

              <Form.Item>
                <Button
                  htmlType="submit"
                  onClick={handleSignIn}
                  style={{
                    width: '100%',
                  }}
                  type="primary"
                  loading={signInButtonLoading}
                >
                  登入
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Flex vertical={false} align="center">
              <span>当前仅支持使用统一账号登入:</span>
              <Image
                className="rounded-[50%] hover:cursor-pointer"
                src={StarrySvg}
                alt="starry-logo"
                height={64}
                width={64}
                onClick={() => {
                  signIn('starry', {
                    callbackUrl: '/edu',
                  });
                }}
              />
            </Flex>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
