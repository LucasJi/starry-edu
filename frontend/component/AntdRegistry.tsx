'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation.js';
import { ReactNode } from 'react';

const StyledComponentsRegistry = ({ children }: { children: ReactNode }) => {
  const cache = createCache();
  useServerInsertedHTML(() => (
    <style
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      id="antd"
    />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
