'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation.js';
import { ReactNode } from 'react';

const StyledComponentsRegistry = ({ children }: { children: ReactNode }) => {
  useServerInsertedHTML(() => <style id="antd" />);
  return <StyleProvider>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
