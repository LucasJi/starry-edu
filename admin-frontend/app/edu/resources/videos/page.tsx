'use client';

import { DownOutlined, InboxOutlined } from '@ant-design/icons';
import { categoryApis, storageApis } from '@api';
import { LoadingOutlinedSpin, VerticalDivider, VideoPlayer } from '@component';
import { Constants, md5File } from '@lib';
import type { Category, Page, Pageable, StorageObj } from '@types';
import {
  Button,
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
  Upload,
  UploadFile,
} from 'antd';
import { TreeProps } from 'antd/es/tree';
import { RcFile } from 'antd/es/upload';
import { Fragment, Key, useEffect, useState } from 'react';
import useSWR from 'swr';

const { Dragger } = Upload;

type EditVideoFieldType = {
  categoryId?: number;
  name?: string;
};

const Video = () => {
  const { data = [], isLoading } = useSWR<Category[]>(
    '/tree',
    categoryApis.fetcher
  );
  const treeData = [
    {
      ...Constants.VIDEO_ROOT_CATEGORY,
      children: [Constants.UNCATEGORIZED, ...data],
    },
  ];
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Constants.VIDEO_ROOT_CATEGORY
  );
  const [uploadVideosModalOpen, setUploadVideosModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [videoPage, setVideoPage] = useState<Page<StorageObj>>();
  const [pageRequest, setPageRequest] = useState<Pageable>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [editVideoForm] = Form.useForm();
  const [editVideoModalOpen, setEditVideoModalOpen] = useState(false);
  const [editedVideo, setEditedVideo] = useState<StorageObj>();
  const [videoPlayerModalOpen, setVideoPlayerModalOpen] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoNameKeyWord, setVideoNameKeyWord] = useState('');

  useEffect(() => {
    let category: Category;
    if (currentCategory.id === Constants.VIDEO_ROOT_CATEGORY.id) {
      category = {};
    } else {
      category = { id: currentCategory.id };
    }
    storageApis
      .findPageByCategoryAndNameAndTypeIn(
        { category, name: videoNameKeyWord, types: Constants.VIDEO_TYPES },
        pageRequest
      )
      .then(resp => {
        setVideoPage({ ...resp.data });
      });
  }, [currentCategory, pageRequest]);

  useEffect(() => {
    if (editVideoModalOpen && editedVideo) {
      editVideoForm.setFieldsValue({
        categoryId: editedVideo.category?.id,
        name: editedVideo.name,
      });
    }
  }, [editedVideo, editVideoForm, editVideoModalOpen]);

  const onSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentCategory(node);
  };

  const handleUploadVideosModalCancel = () => {
    setUploadVideosModalOpen(false);
    setFileList([]);
  };

  const handleUploadVideosModalOk = () => {
    setUploadVideosModalOpen(false);
    setFileList([]);
  };

  const refresh = () => {
    setCurrentCategory({ ...currentCategory });
  };

  const handleEditVideoCancel = () => {
    editVideoForm.resetFields();
    setEditVideoModalOpen(false);
  };

  const handleEditVideoFormOk = () => {
    if (!editedVideo) {
      setEditVideoModalOpen(false);
      return;
    }

    editVideoForm.validateFields().then(values => {
      const { categoryId, name } = values;
      storageApis
        .updateCategoryAndName({
          ...editedVideo,
          name,
          category: categoryId ? { id: categoryId } : null,
        })
        .then(() => {
          refresh();
          message.success('更新成功');
          setEditVideoModalOpen(false);
        })
        .finally(() => {
          editVideoForm.resetFields();
        });
    });
  };

  const handleEditVideoFormCategoryChange = (categoryId: number) => {
    if (editedVideo) {
      setEditedVideo({ ...editedVideo, category: { id: categoryId } });
    }
  };

  const editVideo = (video: StorageObj) => {
    setEditedVideo(video);
    setEditVideoModalOpen(true);
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
          <VerticalDivider />
          <div className="ml-8 w-full">
            <div className="text-2xl mb-10">视频 | {currentCategory?.name}</div>
            <div className="mb-10 flex justify-between">
              <Space wrap>
                <Button
                  onClick={() => setUploadVideosModalOpen(true)}
                  type="primary"
                >
                  上传视频
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
                <Input
                  placeholder="请输入名称关键字"
                  onChange={e => {
                    setVideoNameKeyWord(e.target.value);
                  }}
                  value={videoNameKeyWord}
                />
                <Button
                  onClick={() => {
                    setVideoNameKeyWord('');
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
                  title: '视频名称',
                  dataIndex: 'name',
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
                      <Button
                        type="link"
                        onClick={() => {
                          storageApis
                            .getPreviewUrl(record.id!)
                            .then(({ data }) => {
                              setVideoPreviewUrl(data);
                              setVideoPlayerModalOpen(true);
                            });
                        }}
                      >
                        预览
                      </Button>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: (
                                <Button
                                  type="link"
                                  onClick={() => {
                                    editVideo(record);
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
              dataSource={videoPage?.content || []}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys: Key[]) => {
                  setSelectedRowKeys([...(selectedRowKeys as number[])]);
                },
              }}
              rowKey="id"
              pagination={{
                total: videoPage?.totalElements,
                pageSize: pageRequest.pageSize,
                showSizeChanger: false,
                showTotal: () =>
                  videoPage ? `总共${videoPage.totalElements}条` : '',
                onChange: (page, pageSize) => {
                  setPageRequest({
                    pageNumber: page,
                    pageSize,
                  });
                },
              }}
            />
            <Modal
              onCancel={handleUploadVideosModalCancel}
              onOk={handleUploadVideosModalOk}
              open={uploadVideosModalOpen}
              title="上传视频"
            >
              <Dragger
                accept=".mp4"
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
                      currentCategory.id === Constants.VIDEO_ROOT_CATEGORY.id
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
                    if (!part) {
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
                <p className="ant-upload-text">请将视频拖拽到此处上传</p>
                <p className="ant-upload-hint">
                  支持一次上传多个/支持 MP4 格式视频
                </p>
              </Dragger>
            </Modal>
            <Modal
              onCancel={handleEditVideoCancel}
              onOk={handleEditVideoFormOk}
              open={editVideoModalOpen}
              title="编辑视频"
            >
              <Form
                autoComplete="off"
                form={editVideoForm}
                labelCol={{ span: 8 }}
                name="编辑视频表单"
                style={{ maxWidth: '40rem' }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item<EditVideoFieldType>
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
                    onChange={handleEditVideoFormCategoryChange}
                    placeholder="请选择所属分类"
                    style={{ width: '100%' }}
                    treeData={data}
                    value={editedVideo?.category?.id}
                    treeDefaultExpandAll
                  />
                </Form.Item>
                <Form.Item<EditVideoFieldType>
                  label="视频名称"
                  name="name"
                  rules={[
                    { required: true, message: '请输入视频名称' },
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
            <Modal
              getContainer={false}
              open={videoPlayerModalOpen}
              destroyOnClose
              footer={null}
              maskClosable={false}
              onCancel={() => {
                setVideoPlayerModalOpen(false);
                setVideoPreviewUrl('');
              }}
              width="800px"
              styles={{
                body: { width: '800px' },
              }}
              wrapClassName="video-modal-wrapper"
            >
              <VideoPlayer url={videoPreviewUrl} />
            </Modal>
          </div>
        </Fragment>
      ) : (
        <Empty className="m-auto" />
      )}
    </div>
  );
};

export default Video;
