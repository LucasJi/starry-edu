'use client';

import { DownOutlined, InboxOutlined } from '@ant-design/icons';
import { categoryApis, storageApis } from '@api';
import { LoadingOutlinedSpin } from '@component';
import { Constants, md5File } from '@lib';
import type { Category, Page, Pageable, StorageObj } from '@types';
import {
  Button,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tree,
  TreeSelect,
  Upload,
  UploadFile,
  message,
} from 'antd';
import { TreeProps } from 'antd/es/tree';
import { RcFile } from 'antd/es/upload';
import { Fragment, Key, useEffect, useState } from 'react';
import useSWR from 'swr';

const { Dragger } = Upload;

type EditCoursewareFieldType = {
  categoryId?: number;
  name?: string;
};

const Coursewares = () => {
  const { data = [], isLoading } = useSWR<Category[]>(
    '/tree',
    categoryApis.fetcher
  );
  const treeData = [
    {
      ...Constants.COURSEWARE_ROOT_CATEGORY,
      children: [Constants.UNCATEGORIZED, ...data],
    },
  ];
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Constants.COURSEWARE_ROOT_CATEGORY
  );
  const [coursewareType, setCoursewareType] = useState(
    Constants.COURSEWARE_TYPES
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coursewarePage, setCoursewarePage] = useState<Page<StorageObj>>();
  const [pageRequest, setPageRequest] = useState<Pageable>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [editCoursewareForm] = Form.useForm();
  const [editCoursewareModalOpen, setEditCoursewareModalOpen] = useState(false);
  const [editedCourseware, setEditedCourseware] = useState<StorageObj>();
  const [coursewareNameKeyWord, setCoursewareNameKeyWord] = useState('');
  const [uploadCoursewareModalOpen, setUploadCoursewareModalOpen] =
    useState(false);

  useEffect(() => {
    let category: Category;
    if (Constants.COURSEWARE_ROOT_CATEGORY.id === currentCategory.id) {
      category = {};
    } else {
      category = { id: currentCategory.id };
    }
    storageApis
      .findPageByCategoryAndNameAndTypeIn(
        { category, name: coursewareNameKeyWord, types: coursewareType },
        pageRequest
      )
      .then(resp => {
        setCoursewarePage({ ...resp.data });
      });
  }, [currentCategory, pageRequest]);

  useEffect(() => {
    if (editCoursewareModalOpen && editedCourseware) {
      editCoursewareForm.setFieldsValue({
        categoryId: editedCourseware.category?.id,
        name: editedCourseware.name,
      });
    }
  }, [editedCourseware, editCoursewareForm, editCoursewareModalOpen]);

  const onSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentCategory(node);
  };

  const handleUploadCoursewareModalCancel = () => {
    setUploadCoursewareModalOpen(false);
    setFileList([]);
  };

  const handleUploadCoursewareModalOk = () => {
    setUploadCoursewareModalOpen(false);
    setFileList([]);
  };

  const refresh = () => {
    setCurrentCategory({ ...currentCategory });
  };

  const handleEditCoursewareCancel = () => {
    editCoursewareForm.resetFields();
    setEditCoursewareModalOpen(false);
  };

  const handleEditCoursewareFormOk = () => {
    if (!editedCourseware) {
      setEditCoursewareModalOpen(false);
      return;
    }

    editCoursewareForm
      .validateFields()
      .then(values => {
        const { categoryId, name } = values;
        storageApis
          .updateCategoryAndName({
            ...editedCourseware,
            name,
            category: categoryId ? { id: categoryId } : null,
          })
          .then(() => {
            refresh();
            message.success('更新成功');
            setEditCoursewareModalOpen(false);
          });
      })
      .finally(() => {
        editCoursewareForm.resetFields();
      });
  };

  const handleEditCoursewareFormCategoryChange = (categoryId: number) => {
    if (editedCourseware) {
      setEditedCourseware({
        ...editedCourseware,
        category: { id: categoryId },
      });
    }
  };

  const editCourseware = (courseware: StorageObj) => {
    setEditedCourseware(courseware);
    setEditCoursewareModalOpen(true);
  };

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
            <div className="text-2xl mb-10">课件 | {currentCategory?.name}</div>
            <div className="mb-10 flex justify-between">
              <Space wrap>
                <Button
                  onClick={() => setUploadCoursewareModalOpen(true)}
                  type="primary"
                >
                  上传课件
                </Button>
                <Button
                  disabled={selectedRowKeys.length <= 0}
                  onClick={() =>
                    storageApis
                      .deleteAllByIdInBatch(selectedRowKeys)
                      // refresh table
                      .then(() => refresh())
                  }
                >
                  删除
                </Button>
              </Space>

              <Space>
                <span>名称:</span>
                <Input
                  placeholder="请输入名称关键字"
                  onChange={e => {
                    setCoursewareNameKeyWord(e.target.value);
                  }}
                  value={coursewareNameKeyWord}
                />
                <span className="w-16">格式:</span>
                <Select
                  defaultValue="全部"
                  value={
                    coursewareType.length !== Constants.COURSEWARE_TYPES.length
                      ? coursewareType[0]
                      : 'all'
                  }
                  style={{ width: 120 }}
                  onChange={value => {
                    if (value === 'all') {
                      setCoursewareType([...Constants.COURSEWARE_TYPES]);
                    } else {
                      setCoursewareType([value]);
                    }
                  }}
                  options={[
                    { value: 'all', label: '全部' },
                    ...Constants.COURSEWARE_TYPES.map(type => ({
                      label: type,
                      value: type,
                    })),
                  ]}
                />
                <Button
                  onClick={() => {
                    setCoursewareNameKeyWord('');
                    setCoursewareType([...Constants.COURSEWARE_TYPES]);
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
                  title: '课件名称',
                  dataIndex: 'name',
                },
                {
                  title: '课件格式',
                  dataIndex: 'type',
                },
                {
                  title: '课件大小',
                  dataIndex: 'size',
                  render: size => (
                    <>{`${((size as number) / (1024 * 1024)).toFixed(2)}MB`}</>
                  ),
                },
                {
                  title: '创建人',
                  dataIndex: 'creatorName',
                },
                {
                  title: '创建时间',
                  dataIndex: 'creationTimestamp',
                },
                {
                  title: '操作',
                  render: (_, record) => (
                    <Space size="middle">
                      <a
                        type="link"
                        href={storageApis.getDownloadUrl(record.id!)}
                        download
                      >
                        下载
                      </a>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: (
                                <Button
                                  type="link"
                                  onClick={() => {
                                    editCourseware(record);
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
                                  onClick={() => {
                                    storageApis
                                      .deleteAllByIdInBatch([record.id!])
                                      // refresh table
                                      .then(() => refresh());
                                  }}
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
              dataSource={coursewarePage?.content || []}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys: Key[]) => {
                  setSelectedRowKeys([...(selectedRowKeys as number[])]);
                },
              }}
              rowKey="id"
              pagination={{
                total: coursewarePage?.totalElements,
                pageSize: pageRequest.pageSize,
                showSizeChanger: false,
                showTotal: () =>
                  coursewarePage ? `总共${coursewarePage.totalElements}条` : '',
                onChange: (page, pageSize) => {
                  setPageRequest({
                    pageNumber: page,
                    pageSize,
                  });
                },
              }}
            />
            <Modal
              onCancel={handleUploadCoursewareModalCancel}
              onOk={handleUploadCoursewareModalOk}
              open={uploadCoursewareModalOpen}
              title="上传课件"
            >
              <Dragger
                fileList={fileList}
                multiple
                onChange={info => {
                  const { status } = info.file;
                  if (status === 'done') {
                    message.success(`${info.file.name}上传成功`);
                    refresh();
                  } else if (status === 'error') {
                    message.error(`${info.file.name}上传失败`);
                  }
                  setFileList([...info.fileList]);
                }}
                beforeUpload={async file => {
                  const { name, type } = file;
                  const { data: storageObjType } =
                    await storageApis.getStorageObjTypeFromFileType(type);
                  const isValidFileType =
                    Constants.COURSEWARE_TYPES.includes(storageObjType);
                  if (!isValidFileType) {
                    message.error(`${name} 并不是可上传文件`);
                  }
                  return Promise.resolve(isValidFileType || Upload.LIST_IGNORE);
                }}
                customRequest={async ({ onSuccess, onProgress, file }) => {
                  const rcFile = file as RcFile;
                  const { name } = rcFile;
                  const { md5, fileInfo } = await md5File(rcFile);

                  const { data: storageObjType } =
                    await storageApis.getStorageObjTypeFromFileType(
                      rcFile.type
                    );

                  // Check if video is already uploaded or how many chunks were uploaded
                  const {
                    data: { data: createUploadResp },
                  } = await storageApis.createUpload({
                    size: rcFile.size,
                    type: storageObjType,
                    md5,
                    name,
                    category:
                      currentCategory.id === Constants.UNCATEGORIZED.id ||
                      currentCategory.id ===
                        Constants.COURSEWARE_ROOT_CATEGORY.id
                        ? null
                        : currentCategory,
                  });

                  if (createUploadResp.uploaded) {
                    onSuccess!(file);
                    return;
                  }

                  const { chunks } = fileInfo;
                  const { partList } = createUploadResp;
                  for (let i = 0; i < chunks.length; i++) {
                    const part = partList.find(
                      part => part.partNumber === i + 1
                    );
                    const partNumber = i + 1;
                    if (part) {
                      console.log('Part already uploads, skip', part);
                    } else {
                      await storageApis.upload(
                        createUploadResp.objId,
                        chunks[i].file,
                        partNumber
                      );
                    }
                    onProgress!({
                      percent: (partNumber / chunks.length) * 100,
                    });
                  }

                  await storageApis.completeMultipartUpload(
                    createUploadResp.objId
                  );

                  onSuccess!(file);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">请将文件拖拽到此处上传</p>
                <p className="ant-upload-hint">
                  支持一次上传多个 /
                  支持word、excel、ppt、pdf、zip、rar、txt格式文件
                </p>
              </Dragger>
            </Modal>
            <Modal
              onCancel={handleEditCoursewareCancel}
              onOk={handleEditCoursewareFormOk}
              open={editCoursewareModalOpen}
              title="编辑课件"
            >
              <Form
                autoComplete="off"
                form={editCoursewareForm}
                labelCol={{ span: 8 }}
                name="编辑视频表单"
                style={{ maxWidth: '40rem' }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item<EditCoursewareFieldType>
                  label="所属分类"
                  name="categoryId"
                >
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    fieldNames={{
                      value: 'id',
                      label: 'name',
                    }}
                    onChange={handleEditCoursewareFormCategoryChange}
                    placeholder="请选择所属分类"
                    style={{ width: '100%' }}
                    treeData={data}
                    value={editedCourseware?.category?.id}
                    treeDefaultExpandAll
                  />
                </Form.Item>

                <Form.Item<EditCoursewareFieldType>
                  label="课件名称"
                  name="name"
                  rules={[
                    { required: true, message: '请输入课件名称' },
                    {
                      validator: (_, value) => {
                        const reg = /(^\s+)|(\s+$)/;
                        if (reg.test(value)) {
                          return Promise.reject(
                            new Error('名称前后不能有空格')
                          );
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
          </div>
        </Fragment>
      ) : (
        <Empty className="m-auto" />
      )}
    </div>
  );
};

export default Coursewares;
