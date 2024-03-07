'use client';

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { categoryApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import type { Category } from '@types';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Tree,
  TreeSelect,
  message,
} from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { Fragment, useCallback, useEffect, useState } from 'react';

type FieldType = {
  parentId?: number;
  name?: string;
};

export default function Categories() {
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [addCategoryConfirmLoading, setAddCategoryConfirmLoading] =
    useState(false);
  const [editCategoryConfirmLoading, setEditCategoryConfirmLoading] =
    useState(false);
  const [treeSelectCategoryId, setTreeSelectCategoryId] = useState<any>(-1);
  const [addCategoryForm] = Form.useForm();
  const [editCategoryForm] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [treeSelectCategories, setTreeSelectCategories] = useState<Category[]>([
    {
      id: -1,
      name: '作为最上级',
    },
  ]);
  const [editCategory, setEditCategory] = useState<Category>({});
  const [isCategoryTreeDataLoading, setIsCategoryTreeDataLoading] =
    useState<boolean>(true);

  const refresh = useCallback(() => {
    categoryApis
      .tree()
      .then(resp => {
        setCategories([...resp.data]);
      })
      .finally(() => setIsCategoryTreeDataLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setTreeSelectCategories(pre => {
      pre[0].children = categories;
      return [...pre];
    });
  }, [categories]);

  useEffect(() => {
    if (editCategoryModalOpen && editCategory) {
      const { parentId = -1, name } = editCategory;
      editCategoryForm.setFieldsValue({
        parentId,
        name,
      });
    }
  }, [editCategory, editCategoryForm, editCategoryModalOpen]);

  const onDrop: TreeProps['onDrop'] = info => {
    const { dragNode, node, dropToGap } = info;
    const categoryNode = node as Category;

    const category: Category = {
      id: dragNode.key as number,
      parentId: dropToGap ? categoryNode.parentId : categoryNode.id,
    };
    categoryApis.updateParentId(category).then(({ data }) => {
      setCategories([...data]);
    });
  };

  const onCategoryChange = (newValue: string) => {
    setTreeSelectCategoryId(newValue);
  };

  const showCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  const handleAddCategory = () => {
    setAddCategoryConfirmLoading(true);
    addCategoryForm
      .validateFields()
      .then(values => {
        const { parentId, name } = values;
        categoryApis
          .add({
            parentId: parentId === -1 ? null : parentId,
            name,
          })
          .then(() => {
            setAddCategoryModalOpen(false);
            refresh();
            message.success('保存成功');
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
      .finally(() => {
        addCategoryForm.resetFields();
        setAddCategoryConfirmLoading(false);
      });
  };

  const handleCancelAddCategory = () => {
    addCategoryForm.resetFields();
    setAddCategoryModalOpen(false);
  };

  const handleCancelEditCategory = () => {
    setEditCategory({});
    editCategoryForm.resetFields();
    setEditCategoryModalOpen(false);
  };

  const handleEditCategory = () => {
    setEditCategoryConfirmLoading(false);
    editCategoryForm.validateFields().then(values => {
      categoryApis
        .update({
          id: editCategory?.id,
          parentId: values.parentId === -1 ? null : values.parentId,
          name: values.name,
        })
        .then(() => {
          refresh();
          setEditCategoryModalOpen(false);
        })
        .catch(error => {
          message.error(error.message);
        })
        .finally(() => {
          setEditCategoryConfirmLoading(false);
          setEditCategory({});
          editCategoryForm.resetFields();
        });
    });
  };

  const openEditCategoryModal = (category: Category) => {
    setEditCategory({ ...category });
    setEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const warning = (subCategoryCount: number) => {
      Modal.warning({
        title: '操作确认',
        content: `此分类下包含（${subCategoryCount}个子分类），请先解除关联再删除！`,
        okText: '知道了',
      });
    };

    const confirm = () => {
      Modal.confirm({
        title: '操作确认',
        icon: <ExclamationCircleFilled />,
        content: '确认删除此分类？',
        onOk() {
          categoryApis.deleteCategory(categoryId).then(() => {
            message.success('删除成功');
            refresh();
          });
        },
      });
    };

    categoryApis.deletable(categoryId).then(({ data: subCategoryCount }) => {
      if (subCategoryCount <= 0) {
        confirm();
      } else {
        warning(subCategoryCount);
      }
    });
  };

  return (
    <Fragment>
      <Button
        icon={<PlusOutlined />}
        onClick={showCategoryModal}
        type="primary"
      >
        新建分类
      </Button>
      <Modal
        confirmLoading={addCategoryConfirmLoading}
        onCancel={handleCancelAddCategory}
        onOk={handleAddCategory}
        open={addCategoryModalOpen}
        title="新建分类"
      >
        <Form
          autoComplete="off"
          form={addCategoryForm}
          labelCol={{ span: 8 }}
          name="新建分类表单"
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
              onChange={onCategoryChange}
              placeholder="请选择所属上级"
              style={{ width: '100%' }}
              treeData={treeSelectCategories}
              treeDefaultExpandAll
              value={treeSelectCategoryId}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="分类名称"
            name="name"
            rules={[
              { required: true, message: '请输入分类名称' },
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
        confirmLoading={editCategoryConfirmLoading}
        onCancel={handleCancelEditCategory}
        onOk={handleEditCategory}
        open={editCategoryModalOpen}
        title="编辑分类"
      >
        <Form
          autoComplete="off"
          form={editCategoryForm}
          labelCol={{ span: 8 }}
          name="编辑分类表单"
          style={{ maxWidth: '40rem' }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<FieldType>
            label="所属上级"
            name="parentId"
            required
            rules={[
              { required: true, message: '请选择所属上级' },
              {
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  if (editCategory?.id === value) {
                    return Promise.reject('无法选择自己作为上级');
                  }

                  return categoryApis
                    .isChild(editCategory!.id!, value)
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
              onChange={onCategoryChange}
              placeholder="请选择所属上级"
              style={{ width: '100%' }}
              treeData={treeSelectCategories}
              treeDefaultExpandAll
              value={treeSelectCategoryId}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="分类名称"
            name="name"
            rules={[
              { required: true, message: '请输入分类名称' },
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
      {!isCategoryTreeDataLoading ? (
        categories.length > 0 ? (
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
              const { name, id } = nodeData as Category;
              return (
                name &&
                id && (
                  <div className="flex items-center justify-between">
                    <span>{name}</span>
                    <Space>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => openEditCategoryModal(nodeData)}
                        type="link"
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCategory(id)}
                        type="link"
                      />
                    </Space>
                  </div>
                )
              );
            }}
            treeData={categories as []}
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
