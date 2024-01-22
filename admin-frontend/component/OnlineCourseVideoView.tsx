'use client';

import { storageApis } from '@api';
import { VerticalDivider } from '@component';
import { Constants } from '@lib';
import type { Category, Page, Pageable, StorageObj } from '@types';
import { Button, Input, Modal, ModalProps, Space, Table, Tree } from 'antd';
import { TreeProps } from 'antd/es/tree';
import { FC, useEffect, useState } from 'react';

interface OnlineCourseVideoViewProps {
  categories: Category[];
  selectedVideos?: StorageObj[];
  onConfirm?: (keys: StorageObj[]) => void;
}

const OnlineCourseVideoView: FC<
  OnlineCourseVideoViewProps & Omit<ModalProps, 'onOk'>
> = props => {
  const {
    categories,
    onConfirm = () => {},
    selectedVideos,
    ...modalProps
  } = props;
  const treeData = [
    {
      ...Constants.VIDEO_ROOT_CATEGORY,
      children: [Constants.UNCATEGORIZED, ...categories],
    },
  ];
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Constants.VIDEO_ROOT_CATEGORY
  );
  const [videoPage, setVideoPage] = useState<Page<StorageObj>>();
  const [pageRequest, setPageRequest] = useState<Pageable>({
    pageNumber: 1,
    pageSize: 5,
  });
  const [selectedRows, setSelectedRows] = useState<StorageObj[]>([]);
  const [videoNameKeyWord, setVideoNameKeyWord] = useState('');
  const [isVideoTableLoading, setVideoTableLoading] = useState(true);

  const onSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentCategory(node);
  };

  const refresh = () => {
    setCurrentCategory({ ...currentCategory });
  };

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
        setVideoTableLoading(false);
      });
  }, [currentCategory, pageRequest]);

  const handleOk = () => {
    onConfirm([...selectedRows]);
  };

  useEffect(() => {
    setSelectedRows([...(selectedVideos || [])]);
  }, [selectedVideos]);

  return (
    <Modal {...modalProps} onOk={handleOk}>
      <div className="flex">
        <Tree
          blockNode
          defaultExpandAll
          fieldNames={{
            title: 'name',
            key: 'id',
          }}
          onSelect={onSelect}
          rootStyle={{
            width: '25%',
            minWidth: '25%',
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          treeData={treeData}
        />
        <VerticalDivider />
        <div className="ml-8 w-full">
          <div className="text-2xl mb-10">视频 | {currentCategory?.name}</div>
          <div className="mb-10">
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
            loading={isVideoTableLoading}
            columns={[
              {
                title: '视频名称',
                dataIndex: 'name',
              },
            ]}
            dataSource={videoPage?.content || []}
            rowSelection={{
              type: 'checkbox',
              onChange: (_, selectedRows: StorageObj[]) => {
                setSelectedRows([...selectedRows]);
              },
              getCheckboxProps: record => ({
                name: record.name,
                disabled: selectedVideos?.some(v => v.id === record.id),
              }),
              selectedRowKeys: selectedRows.map(v => v.id!),
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
        </div>
      </div>
    </Modal>
  );
};

export default OnlineCourseVideoView;
