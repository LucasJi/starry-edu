'use client';

import { storageApis } from '@api';
import { Constants } from '@lib';
import type { Category, Page, Pageable, StorageObj } from '@types';
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalProps,
  Select,
  Space,
  Table,
  Tree,
} from 'antd';
import { TreeProps } from 'antd/es/tree';
import { FC, useEffect, useState } from 'react';

interface CoursewareViewProps {
  categories: Category[];
  selectedObjs?: StorageObj[];
  onConfirm?: (keys: StorageObj[]) => void;
}

const CoursewareView: FC<
  CoursewareViewProps & Omit<ModalProps, 'onOk'>
> = props => {
  const {
    categories,
    onConfirm = () => {},
    selectedObjs,
    ...modalProps
  } = props;

  const treeData = [
    {
      ...Constants.COURSEWARE_ROOT_CATEGORY,
      children: [Constants.UNCATEGORIZED, ...categories],
    },
  ];
  const [currentCategory, setCurrentCategory] = useState<Category>(
    Constants.COURSEWARE_ROOT_CATEGORY
  );
  const [coursewarePage, setCoursewarePage] = useState<Page<StorageObj>>();
  const [pageRequest, setPageRequest] = useState<Pageable>({
    pageNumber: 1,
    pageSize: 5,
  });
  const [selectedRows, setSelectedRows] = useState<StorageObj[]>([]);
  const [coursewareNameKeyWord, setCoursewareNameKeyWord] = useState('');
  const [coursewareType, setCoursewareType] = useState(
    Constants.COURSEWARE_TYPES
  );

  useEffect(() => {
    let category: Category;
    if (currentCategory.id === Constants.COURSEWARE_ROOT_CATEGORY.id) {
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

  const onSelect: TreeProps['onSelect'] = (_, { node }) => {
    setCurrentCategory(node);
  };

  const refresh = () => {
    setCurrentCategory({ ...currentCategory });
  };

  const handleOk = () => {
    onConfirm([...selectedRows]);
  };

  useEffect(() => {
    setSelectedRows([...(selectedObjs || [])]);
  }, [selectedObjs]);

  return (
    <Modal {...modalProps} onOk={handleOk}>
      <div className="flex">
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
                  coursewareType.length === Constants.COURSEWARE_TYPES.length
                    ? 'all'
                    : coursewareType[0]
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
                    value: type,
                    label: type,
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
                dataIndex: 'format',
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
            ]}
            dataSource={coursewarePage?.content || []}
            rowSelection={{
              type: 'checkbox',
              onChange: (_, selectedRows) => {
                setSelectedRows([...selectedRows]);
              },
              selectedRowKeys: selectedRows.map(v => v.id!),
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
        </div>
      </div>
    </Modal>
  );
};

export default CoursewareView;
