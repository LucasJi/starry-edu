'use client';
import { CourseCompletedPrompt, LoadingOutlinedSpin } from '@component';
import { Course } from '@types';
import { Card, Col, Progress, Row, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const percent: number = 100;

const MemberCourseCardGrid: FC<{ courses: Course[]; loading?: boolean }> = ({
  courses,
  loading = false,
}) => {
  const router = useRouter();
  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          height: '24rem',
        }}
      >
        <LoadingOutlinedSpin />
      </div>
    );
  }

  return (
    <Row
      gutter={[48, 24]}
      style={{
        marginTop: '1.6rem',
      }}
    >
      {courses.map((course, index) => (
        <Col key={`col-${index}`} span={8}>
          <Card
            onClick={() => router.push(`/edu/member/course/${course.id}`)}
            hoverable
            title={course.name}
            extra={
              course.mandatory ? (
                <Tag color="red">必修课</Tag>
              ) : (
                <Tag color="orange">选修课</Tag>
              )
            }
            style={{
              width: '100%',
            }}
            bodyStyle={{
              display: 'flex',
              justifyContent: 'center',
              height: '20rem',
            }}
          >
            {percent === 100 ? (
              <CourseCompletedPrompt />
            ) : (
              <Progress className="mx-auto" type="circle" percent={percent} />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MemberCourseCardGrid;
