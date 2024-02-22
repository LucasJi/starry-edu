'use client';
import { CaretDownOutlined } from '@ant-design/icons';
import { categoryApis, courseApis } from '@api';
import { MemberCourseCardGrid } from '@component';
import { Category, Course, CourseOverview } from '@types';
import { Button, Card, Popover, Tabs, Tree } from 'antd';
import Image from 'next/image';
import MyLessonIcon from 'public/icon-mylesoon.png';
import StudyTimeIcon from 'public/icon-studytime.png';
import { FC, useEffect, useState } from 'react';

const { Meta } = Card;
const iconSize = 36;
const ALL_CATEGORY: Category = {
  id: -1,
  name: '全部分类',
};

const getMandatoryCourses = (courses: Course[]) =>
  courses.filter(c => c.mandatory);

const getOptionalCourses = (courses: Course[]) =>
  courses.filter(c => !c.mandatory);

const getCompletedCourse = (courses: Course[]) =>
  courses.filter(c => c.completedVideoCount === c.videoCount);

const getUnCompletedCourse = (courses: Course[]) =>
  courses.filter(c => c.completedVideoCount !== c.videoCount);

const Member: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(ALL_CATEGORY);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [courseOverview, setCourseOverview] = useState<CourseOverview>({
    completedCourseCount: 0,
    courseCount: 0,
    dailyStudyDuration: 0,
    studyDuration: 0,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setCategoriesLoaded(false);
    categoryApis.tree().then(resp => {
      setCategories([...resp.data]);
      setCategoriesLoaded(true);
    });

    courseApis.getOverview().then(({ data }) => {
      setCourseOverview(data);
    });
  }, []);

  useEffect(() => {
    setCoursesLoading(true);
    courseApis
      .findLoginMemberCoursesByCategoryId(selectedCategory.id!)
      .then(resp => {
        setCourses([...resp.data]);
        setCoursesLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="w-3/5 mx-auto h-full">
      <div className="flex justify-between pt-16">
        <Card className="shadow-lg w-[45%]">
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
              <strong className="text-black text-3xl">
                {courseOverview.completedCourseCount}
              </strong>{' '}
              / {courseOverview.courseCount}
            </span>
          </div>
        </Card>
        <Card className="shadow-lg w-[45%]">
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
            <span>
              今日：
              <strong className="text-black text-3xl">
                {Math.floor(courseOverview.dailyStudyDuration / 60)}
              </strong>{' '}
              分钟{' '}
              <strong className="text-black text-3xl">
                {courseOverview.dailyStudyDuration % 60}
              </strong>{' '}
              秒 累计：{' '}
              <strong className="text-black text-3xl">
                {Math.floor(courseOverview.studyDuration / 60)}
              </strong>{' '}
              分钟{' '}
              <strong className="text-black text-3xl">
                {courseOverview.studyDuration % 60}
              </strong>{' '}
              秒
            </span>
          </div>
        </Card>
      </div>
      <Tabs
        size="large"
        style={{
          marginTop: '4rem',
          marginBottom: '4rem',
        }}
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '全部',
            children: (
              <MemberCourseCardGrid
                courses={courses}
                loading={coursesLoading}
              />
            ),
          },
          {
            key: '2',
            label: '必修课',
            children: (
              <MemberCourseCardGrid courses={getMandatoryCourses(courses)} />
            ),
          },
          {
            key: '3',
            label: '选修课',
            children: (
              <MemberCourseCardGrid courses={getOptionalCourses(courses)} />
            ),
          },
          {
            key: '4',
            label: '已学完',
            children: (
              <MemberCourseCardGrid courses={getCompletedCourse(courses)} />
            ),
          },
          {
            key: '5',
            label: '未学完',
            children: (
              <MemberCourseCardGrid courses={getUnCompletedCourse(courses)} />
            ),
          },
        ]}
        tabBarExtraContent={
          <Popover
            content={
              categoriesLoaded && (
                <Tree
                  blockNode
                  defaultExpandAll
                  defaultExpandParent
                  fieldNames={{
                    title: 'name',
                    key: 'id',
                  }}
                  onSelect={(_, { node }) => {
                    setSelectedCategory(node as Category);
                  }}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  treeData={[ALL_CATEGORY, ...categories]}
                />
              )
            }
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            placement="bottomRight"
          >
            <Button loading={!categoriesLoaded} icon={<CaretDownOutlined />}>
              {selectedCategory.name}
            </Button>
          </Popover>
        }
      />
    </div>
  );
};

export default Member;
