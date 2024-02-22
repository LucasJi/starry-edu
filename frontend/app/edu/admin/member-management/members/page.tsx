'use client';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { departmentApis, memberApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import type { Department, Member, Page, Pageable } from '@types';
import {
  Button,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tree,
  TreeSelect,
} from 'antd';
import { Rule } from 'antd/es/form/index.js';
import { TreeProps } from 'antd/es/tree';
import { Fragment, Key, useEffect, useState } from 'react';
import useSWR from 'swr';

interface MemberFieldType {
  username: string;
  email: string;
  password: string;
  departmentId: number;
}

const ROOT_DEPARTMENT: Department = {
  id: -1,
  name: '全部部门',
  children: [],
};

const EDIT_MEMBER_MODAL_TITLE = '编辑学员';

const Members = () => {
  const { data = [], isLoading } = useSWR<Department[]>(
    '/tree',
    departmentApis.fetcher
  );
  const treeData = [{ ...ROOT_DEPARTMENT, children: [...data] }];
  const [currentDepartment, setCurrentDepartment] =
    useState<Department>(ROOT_DEPARTMENT);
  const [memberPage, setMemberPage] = useState<Page<Member>>();
  const [pageRequest, setPageRequest] = useState<Pageable>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [memberForm] = Form.useForm<MemberFieldType>();
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalTitle, setMemberModalTitle] = useState('添加学员');
  const [editedMember, setEditedMember] = useState<Member>();
  const [memberNameKeyWord, setMemberNameKeyWord] = useState('');
  const [memberEmailKeyWord, setMemberEmailKeyWord] = useState('');
  const [membersLoading, setMembersLoading] = useState(true);

  const onSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentDepartment(node);
  };

  const refresh = () => {
    setCurrentDepartment({ ...currentDepartment });
  };

  const handleMemberModalCancel = () => {
    memberForm.resetFields();
    setMemberModalOpen(false);
  };

  const isEditMemberModal = memberModalTitle === EDIT_MEMBER_MODAL_TITLE;

  const getPasswordFieldRules = () => {
    const rules: Rule[] = [
      {
        pattern: /^\d{1,6}$/,
        message: '只能由数字组成, 1-6位',
      },
    ];

    if (!isEditMemberModal) {
      rules.push({ required: true, message: '请输入密码' });
    }

    return rules;
  };

  const handleMemberModalOk = () => {
    memberForm.validateFields().then(values => {
      if (isEditMemberModal) {
        memberApis
          .editMember({
            departmentId: values.departmentId,
            id: editedMember!.user.id!,
            username: values.username!,
            email: values.email,
          })
          .then(() => {
            memberForm.resetFields();
            setMemberModalOpen(false);
            refresh();
            message.success('编辑学员成功');
          });
      } else {
        memberApis
          .addMember({
            departmentId: values.departmentId,
            username: values.username,
            password: values.password,
            email: values.email,
          })
          .then(({ data }) => {
            if (data.success) {
              memberForm.resetFields();
              setMemberModalOpen(false);
              refresh();
              message.success('添加学员成功');
            } else {
              message.error(data.message);
            }
          });
      }
    });
  };

  const handleDeleteMember = (member: Member) => {
    Modal.warning({
      title: '操作确认',
      content: '确认删除此学员？',
      okText: '知道了',
      onOk: () =>
        memberApis.deleteMember(member.user.id!).then(({ data }) => {
          if (data.success) {
            refresh();
            message.success('删除学员成功');
          } else {
            message.error(data.message);
          }
        }),
    });
  };

  useEffect(() => {
    let department: Department;
    if (currentDepartment.id === ROOT_DEPARTMENT.id) {
      department = {};
    } else {
      department = { id: currentDepartment.id };
    }

    setMembersLoading(true);
    memberApis
      .findPage(
        {
          departmentId: department.id!,
          username: memberNameKeyWord,
          email: memberEmailKeyWord,
        },
        pageRequest
      )
      .then(resp => {
        setMemberPage({ ...resp.data });
      }).finally(() => {
        setMembersLoading(false);
    });
  }, [currentDepartment, pageRequest]);

  return (
    <div className="flex h-full">
      {isLoading ? (
        <LoadingOutlinedSpin />
      ) : data.length > 0 ? (
        <Fragment>
          <Tree
            blockNode
            defaultExpandAll
            defaultExpandParent
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
            onSelect={onSelect}
            rootStyle={{
              width: '20%',
              minWidth: '20%',
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            treeData={treeData}
          />
          <Divider className="h-full" type="vertical" />
          <div className="ml-8 w-full">
            <div className="text-2xl mb-10">
              学员 | {currentDepartment?.name}
            </div>
            <div className="mb-10 flex justify-between">
              <Space wrap>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => {
                    setMemberModalOpen(true);
                  }}
                >
                  添加学员
                </Button>
              </Space>

              <Space>
                <span>姓名:</span>
                <Input
                  placeholder="请输入姓名关键字"
                  onChange={e => {
                    setMemberNameKeyWord(e.target.value);
                  }}
                  value={memberNameKeyWord}
                />
                <span>邮箱:</span>
                <Input
                  placeholder="请输入邮箱关键字"
                  onChange={e => {
                    setMemberEmailKeyWord(e.target.value);
                  }}
                  value={memberEmailKeyWord}
                />
                <Button
                  onClick={() => {
                    setMemberEmailKeyWord('');
                    setMemberNameKeyWord('');
                    refresh();
                  }}
                >
                  重置
                </Button>
                <Button onClick={refresh} type={'primary'}>
                  查询
                </Button>
              </Space>
            </div>
            <Table
              columns={[
                {
                  title: '学员',
                  render: (_, record) => record.user.username,
                },
                {
                  title: '所属部门',
                  dataIndex: 'departmentName',
                },
                {
                  title: '登录邮箱',
                  render: (_, record) => record.user.email,
                },
                {
                  title: '加入时间',
                  render: (_, record) => record.user.creationTimestamp,
                },
                {
                  title: '操作',
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="link">学习</Button>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: (
                                <Button
                                  type="link"
                                  onClick={() => {
                                    setMemberModalOpen(true);
                                    setMemberModalTitle(
                                      EDIT_MEMBER_MODAL_TITLE
                                    );
                                    setEditedMember(record);
                                    memberForm.setFieldsValue({
                                      username: record.user.username,
                                      email: record.user.email,
                                      departmentId: record.departmentId,
                                    });
                                  }}
                                >
                                  编辑
                                </Button>
                              ),
                            },
                            {
                              key: '2',
                              label: (
                                <Button
                                  type="link"
                                  onClick={() => handleDeleteMember(record)}
                                >
                                  删除
                                </Button>
                              ),
                            },
                          ],
                        }}
                      >
                        <Button type="link">
                          <Space>
                            更多
                            <DownOutlined />
                          </Space>
                        </Button>
                      </Dropdown>
                    </Space>
                  ),
                },
              ]}
              dataSource={memberPage?.content || []}
              rowKey={record => record.user.id as Key}
              pagination={{
                total: memberPage?.totalElements,
                pageSize: pageRequest.pageSize,
                showSizeChanger: false,
                showTotal: () =>
                  memberPage ? `总共${memberPage.totalElements}条` : '',
                onChange: (page, pageSize) => {
                  setPageRequest({
                    pageNumber: page,
                    pageSize,
                  });
                },
              }}
              loading={membersLoading}
            />
            <Modal
              onCancel={handleMemberModalCancel}
              onOk={handleMemberModalOk}
              open={memberModalOpen}
              title={memberModalTitle}
            >
              <Form
                autoComplete="off"
                form={memberForm}
                labelCol={{ span: 8 }}
                name="添加学员表单"
                style={{ maxWidth: '40rem' }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item<MemberFieldType>
                  label="学员姓名"
                  name="username"
                  rules={[
                    { required: true, message: '请输入学员姓名' },
                    {
                      validator: (_, value) => {
                        const reg = /(^\s+)|(\s+$)/;
                        if (reg.test(value)) {
                          return Promise.reject(
                            new Error('姓名前后不能有空格')
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="请输入学员姓名" />
                </Form.Item>

                <Form.Item<MemberFieldType>
                  label="登录邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    {
                      type: 'email',
                      message: '请输入正确邮箱',
                    },
                  ]}
                >
                  <Input placeholder="请输入学员邮箱" />
                </Form.Item>

                {!isEditMemberModal && (
                  <Form.Item<MemberFieldType>
                    label="登录密码"
                    name="password"
                    rules={getPasswordFieldRules()}
                  >
                    <Input.Password placeholder="请输入学员密码" />
                  </Form.Item>
                )}

                <Form.Item<MemberFieldType>
                  label="所属部门"
                  name="departmentId"
                  required
                  rules={[{ required: true, message: '请选择学员所属部门' }]}
                >
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    fieldNames={{
                      value: 'id',
                      label: 'name',
                    }}
                    placeholder="请选择学员所属部门"
                    style={{ width: '100%' }}
                    treeData={data}
                    treeDefaultExpandAll
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Fragment>
      ) : (
        <Empty className="m-auto" />
      )}
    </div>
  );
};

export default Members;
