import { Category } from '@types';

export const VIDEO_TYPES = ['VIDEO'];

export const VIDEO_ROOT_CATEGORY: Category = {
  id: -1,
  name: '全部视频',
  children: [],
};

export const UNCATEGORIZED: Category = { id: -2, name: '未分类' };

export const COURSEWARE_ROOT_CATEGORY: Category = {
  id: -1,
  name: '全部课件',
  children: [],
};

export const COURSEWARE_TYPES = [
  'WORD',
  'EXCEL',
  'PPT',
  'PDF',
  'ZIP',
  'TXT',
  'RAR',
];
