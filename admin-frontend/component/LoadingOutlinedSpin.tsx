import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined spin style={{ fontSize: 24 }} />;

const LoadingOutlinedSpin: React.FC = () => (
  <Spin
    indicator={antIcon}
    style={{
      margin: 'auto',
    }}
  />
);

export default LoadingOutlinedSpin;
