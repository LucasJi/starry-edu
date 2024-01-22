'use client';

import { courseApis } from '@api';
import { CoursewareView, SortableList } from '@component';
import type { Category, StorageObj } from '@types';
import { Button, Drawer, Form, Space, message } from 'antd';
import { useEffect, useState } from 'react';
const CoursewaresDrawer = ({
  drawerOpen,
  onDrawerClose,
  categories,
  courseId,
}: {
  drawerOpen: boolean;
  onDrawerClose: () => void;
  categories: Category[];
  courseId: number | undefined;
}) => {
  const [coursewaresDrawerForm] = Form.useForm();
  const [coursewareModalOpen, setCoursewareModalOpen] = useState(false);
  const [selectedCoursewares, setSelectedCoursewares] = useState<StorageObj[]>(
    []
  );

  const handleClose = () => {
    onDrawerClose();
  };

  const handleEditCoursewares = () => {
    if (courseId) {
      courseApis
        .editCoursewares({
          courseId,
          coursewareIds: selectedCoursewares.map(c => c.id!),
        })
        .then(() => {
          message.success('更新课件成功');
          handleClose();
        })
        .catch(() => {
          message.error('更新课件失败');
        });
    } else {
      handleClose();
    }
  };

  const handleCoursewareSortableListChange = (list: StorageObj[]) => {
    setSelectedCoursewares([...list]);
  };

  useEffect(() => {
    if (courseId && drawerOpen) {
      courseApis.findCoursewaresById(courseId).then(({ data }) => {
        setSelectedCoursewares([...data]);
      });
    }
  }, [courseId, drawerOpen]);

  return (
    <Drawer
      title="课件管理"
      size="large"
      placement="right"
      open={drawerOpen}
      maskClosable={false}
      onClose={handleClose}
      afterOpenChange={open => {
        if (!open) {
          console.log('afterClose');
        }
      }}
      footer={
        <Space size="large" style={{ justifyContent: 'end', width: '100%' }}>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleEditCoursewares}>
            确认
          </Button>
        </Space>
      }
    >
      <Form
        form={coursewaresDrawerForm}
        labelCol={{ style: { width: '12rem' } }}
        wrapperCol={{ style: { width: 'calc(100%-12rem)' } }}
      >
        <Form.Item label="课程附件">
          <Button type="primary" onClick={() => setCoursewareModalOpen(true)}>
            添加课件
          </Button>
        </Form.Item>
        <Form.Item>
          <div
            style={{
              marginLeft: '12rem',
            }}
          >
            <SortableList
              list={selectedCoursewares}
              onChange={handleCoursewareSortableListChange}
              emptyText="请点击上方按钮添加课件"
            />
          </div>
        </Form.Item>
      </Form>

      <CoursewareView
        title="课件素材"
        open={coursewareModalOpen}
        onCancel={() => setCoursewareModalOpen(false)}
        centered
        width={1000}
        categories={categories}
        selectedObjs={selectedCoursewares}
        onConfirm={rows => {
          setCoursewareModalOpen(false);
          setSelectedCoursewares([...rows]);
        }}
      />
    </Drawer>
  );
};

export default CoursewaresDrawer;
