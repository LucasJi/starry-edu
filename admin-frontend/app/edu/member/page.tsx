'use client';
import { DownOutlined } from '@ant-design/icons';
import { categoryApis } from '@api';
import { DropdownCategory } from '@types';
import { Card, Dropdown, Space, Tabs, Typography } from 'antd';
import Image from 'next/image';
import MyLessonIcon from 'public/icon-mylesoon.png';
import StudyTimeIcon from 'public/icon-studytime.png';
import { FC, useEffect, useState } from 'react';

const { Meta } = Card;
const iconSize = 36;
const allCourses = 10;
const learnedCourses = 2;
const ALL_CATEGORY: DropdownCategory = {
  key: -1,
  label: '全部分类',
};

const Member: FC = () => {
  const [categories, setCategories] = useState<DropdownCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<DropdownCategory>(ALL_CATEGORY);

  useEffect(() => {
    categoryApis.dropdownCategoryTree().then(resp => {
      setCategories([...resp.data]);
    });
  }, []);

  return (
    <div className="w-3/5 mx-auto">
      <div className="flex justify-between pt-16">
        <Card style={{ width: '45%' }}>
          <Meta
            avatar={
              <Image
                src={MyLessonIcon}
                alt="my-lesson-icon"
                width={iconSize}
                height={iconSize}
              />
            }
            title="课程进度"
          />
          <div className="mt-10 text-gray-500 font-semibold">
            <span>必修课：已学完课程</span>
            <span className="ml-2">
              <strong className="text-black text-3xl">{learnedCourses}</strong>{' '}
              / {allCourses}
            </span>
          </div>
        </Card>
        <Card style={{ width: '45%' }}>
          <Meta
            avatar={
              <Image
                src={StudyTimeIcon}
                alt="study-time-icon"
                width={iconSize}
                height={iconSize}
              />
            }
            title="学习时长"
          />
          <div className="mt-10 text-gray-500 font-semibold">
            <p>今日： 0 分钟 0 秒 累计： 0 分钟 20 秒</p>
          </div>
        </Card>
      </div>
      <Tabs
        style={{
          marginTop: '4rem',
        }}
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '全部',
            children: 'Content of Tab Pane 1',
          },
          {
            key: '2',
            label: '必修课',
            children: 'Content of Tab Pane 2',
          },
          {
            key: '3',
            label: '选修课',
            children: 'Content of Tab Pane 3',
          },
          {
            key: '4',
            label: '已学完',
            children: 'Content of Tab Pane 3',
          },
          {
            key: '5',
            label: '未学完',
            children: 'Content of Tab Pane 3',
          },
        ]}
        onChange={(key: string) => {
          console.log(key);
        }}
        tabBarExtraContent={
          <Dropdown
            trigger={['click']}
            menu={{
              items: [ALL_CATEGORY, ...categories],
              selectable: true,
              defaultSelectedKeys: ['3'],
              onClick: ({ key, keyPath, domEvent }) => {
                console.log(domEvent.target.innerText, key, keyPath);
              },
            }}
          >
            <Typography.Link>
              <Space>
                {selectedCategory.label}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        }
      />
    </div>
  );
};

export default Member;
