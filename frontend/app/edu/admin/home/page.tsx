'use client';
import { Button, Card, Col, Row } from 'antd';
import { FC } from 'react';

const { Meta } = Card;

const Home: FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card bordered={false}>
            <div>
              <div>
                <span>今日学习学员</span>
                <div>
                  <div>0</div>
                  <div>
                    较昨日
                    <span>
                      <i>▲</i>0
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span>总学员数</span>
                <div>
                  <div>0</div>
                  <div>
                    较昨日
                    <span>
                      <i>▲</i>0
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span>线上课数</span>
                <span>0</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <div>
              <div>
                <span>部门数</span>
                <span>0</span>
              </div>
              <div>
                <span>分类数</span>
                <span>0</span>
              </div>
              <div>
                <span>管理员</span>
                <span>0</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card bordered={false}>
            <Meta title="快捷操作" />
            <Button>添加学员</Button>
            <Button>上传视频</Button>
            <Button>线上课</Button>
            <Button>新建部门</Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Meta title="今日学习排行" />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Meta title="资源统计" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
