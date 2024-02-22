'use client';

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { departmentApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import { Department, DepartmentDeletable } from '@types';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Space,
  Tree,
  TreeSelect,
} from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { Fragment, useCallback, useEffect, useState } from 'react';

type FieldType = {
  parentId?: number;
  name?: string;
};

export default function Departments() {
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [addDepartmentConfirmLoading, setAddDepartmentConfirmLoading] =
    useState(false);
  const [editDepartmentConfirmLoading, setEditDepartmentConfirmLoading] =
    useState(false);
  const [treeSelectDepartmentId, setTreeSelectDepartmentId] = useState<any>(-1);
  const [addDepartmentForm] = Form.useForm();
  const [editDepartmentForm] = Form.useForm();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [treeSelectDepartments, setTreeSelectDepartments] = useState<
    Department[]
  >([
    {
      id: -1,
      name: '作为最上级',
    },
  ]);
  const [editDepartment, setEditDepartment] = useState<Department>({});
  const [isDepartmentTreeDataLoading, setIsDepartmentTreeDataLoading] =
    useState<boolean>(true);

  const refresh = useCallback(() => {
    departmentApis
      .tree()
      .then(resp => {
        setDepartments([...resp.data]);
      })
      .finally(() => setIsDepartmentTreeDataLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setTreeSelectDepartments(pre => {
      pre[0].children = departments;
      return [...pre];
    });
  }, [departments]);

  useEffect(() => {
    if (editDepartmentModalOpen && editDepartment) {
      const { parentId = -1, name } = editDepartment;
      editDepartmentForm.setFieldsValue({
        parentId,
        name,
      });
    }
  }, [editDepartment, editDepartmentForm, editDepartmentModalOpen]);

  const onDrop: TreeProps['onDrop'] = info => {
    const { dragNode, node, dropToGap } = info;
    const departmentNode = node as Department;

    const department: Department = {
      id: dragNode.key as number,
      parentId: dropToGap ? departmentNode.parentId : departmentNode.id,
    };
    departmentApis.updateParentId(department).then(({ data }) => {
      setDepartments([...data]);
    });
  };

  const onDepartmentChange = (newValue: string) => {
    setTreeSelectDepartmentId(newValue);
  };

  const showDepartmentModal = () => {
    setAddDepartmentModalOpen(true);
  };

  const handleAddDepartment = () => {
    setAddDepartmentConfirmLoading(true);
    addDepartmentForm
      .validateFields()
      .then(values => {
        const { parentId, name } = values;
        departmentApis
          .add({
            parentId: parentId === -1 ? null : parentId,
            name,
          })
          .then(() => {
            setAddDepartmentModalOpen(false);
            refresh();
            message.success('保存成功');
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
      .finally(() => {
        addDepartmentForm.resetFields();
        setAddDepartmentConfirmLoading(false);
      });
  };

  const handleCancelAddDepartment = () => {
    addDepartmentForm.resetFields();
    setAddDepartmentModalOpen(false);
  };

  const handleCancelEditDepartment = () => {
    setEditDepartment({});
    editDepartmentForm.resetFields();
    setEditDepartmentModalOpen(false);
  };

  const handleEditDepartment = () => {
    setEditDepartmentConfirmLoading(false);
    editDepartmentForm.validateFields().then(values => {
      departmentApis
        .update({
          id: editDepartment?.id,
          parentId: values.parentId === -1 ? null : values.parentId,
          name: values.name,
        })
        .then(() => {
          refresh();
          setEditDepartmentModalOpen(false);
        })
        .catch(error => {
          message.error(error.message);
        })
        .finally(() => {
          setEditDepartmentConfirmLoading(false);
          setEditDepartment({});
          editDepartmentForm.resetFields();
        });
    });
  };

  const openEditDepartmentModal = (department: Department) => {
    setEditDepartment({ ...department });
    setEditDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = (departmentId: number) => {
    const warning = (departmentDeletableDto: DepartmentDeletable) => {
      Modal.warning({
        title: '操作确认',
        content: `此部门下包含（${departmentDeletableDto.subDepartmentCount}个子部门），请先解除关联再删除！`,
        okText: '知道了',
      });
    };

    const confirm = () => {
      Modal.confirm({
        title: '操作确认',
        icon: <ExclamationCircleFilled />,
        content: '确认删除此部门？',
        onOk() {
          departmentApis.deleteDepartment(departmentId).then(() => {
            message.success('删除成功');
            refresh();
          });
        },
      });
    };

    departmentApis
      .deletable(departmentId)
      .then(({ data: departmentDeletableDto }) => {
        const { deletable } = departmentDeletableDto;
        if (deletable) {
          confirm();
        } else {
          warning(departmentDeletableDto);
        }
      });
  };

  return (
    <Fragment>
      <Button
        icon={<PlusOutlined />}
        onClick={showDepartmentModal}
        type="primary"
      >
        新建部门
      </Button>
      <Modal
        confirmLoading={addDepartmentConfirmLoading}
        onCancel={handleCancelAddDepartment}
        onOk={handleAddDepartment}
        open={addDepartmentModalOpen}
        title="新建部门"
      >
        <Form
          autoComplete="off"
          form={addDepartmentForm}
          labelCol={{ span: 8 }}
          name="新建部门表单"
          style={{ maxWidth: '40rem' }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<FieldType>
            initialValue={-1}
            label="所属上级"
            name="parentId"
            rules={[{ required: true, message: '请选择所属上级' }]}
          >
            <TreeSelect
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
              onChange={onDepartmentChange}
              placeholder="请选择所属上级"
              style={{ width: '100%' }}
              treeData={treeSelectDepartments}
              treeDefaultExpandAll
              value={treeSelectDepartmentId}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="部门名称"
            name="name"
            rules={[
              { required: true, message: '请输入部门名称' },
              {
                validator: (_, value) => {
                  const reg = /(^\s+)|(\s+$)/;
                  if (reg.test(value)) {
                    return Promise.reject(new Error('名称前后不能有空格'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        confirmLoading={editDepartmentConfirmLoading}
        onCancel={handleCancelEditDepartment}
        onOk={handleEditDepartment}
        open={editDepartmentModalOpen}
        title="编辑部门"
      >
        <Form
          autoComplete="off"
          form={editDepartmentForm}
          labelCol={{ span: 8 }}
          name="编辑部门表单"
          style={{ maxWidth: '40rem' }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<FieldType>
            label="所属上级"
            name="parentId"
            rules={[
              { required: true, message: '请选择所属上级' },
              {
                validator: async (_, value) => {
                  if (editDepartment?.id === value) {
                    return Promise.reject('无法选择自己作为上级');
                  }

                  return departmentApis
                    .isChild(editDepartment!.id!, value)
                    .then(resp => {
                      if (resp.data) {
                        return Promise.reject('无法选择子级作为上级');
                      }
                    });
                },
              },
            ]}
          >
            <TreeSelect
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
              onChange={onDepartmentChange}
              placeholder="请选择所属上级"
              style={{ width: '100%' }}
              treeData={treeSelectDepartments}
              treeDefaultExpandAll
              value={treeSelectDepartmentId}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="部门名称"
            name="name"
            rules={[
              { required: true, message: '请输入部门名称' },
              {
                validator: (_, value) => {
                  const reg = /(^\s+)|(\s+$)/;
                  if (reg.test(value)) {
                    return Promise.reject(new Error('名称前后不能有空格'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
      <Divider />
      {!isDepartmentTreeDataLoading ? (
        departments.length > 0 ? (
          <Tree
            blockNode
            defaultExpandAll
            defaultExpandParent
            draggable
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
            onDrop={onDrop}
            style={{
              width: '30%',
              minWidth: '20%',
            }}
            titleRender={nodeData => {
              const { name, id } = nodeData as Department;
              return (
                name &&
                id && (
                  <div className="flex items-center justify-between">
                    <span>{name}</span>
                    <Space>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => openEditDepartmentModal(nodeData)}
                        type="link"
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteDepartment(id)}
                        type="link"
                      />
                    </Space>
                  </div>
                )
              );
            }}
            treeData={departments as []}
          />
        ) : (
          <Empty />
        )
      ) : (
        <div className="h-full w-full flex">
          <LoadingOutlinedSpin />
        </div>
      )}
    </Fragment>
  );
}
