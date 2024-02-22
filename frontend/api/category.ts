import { Category } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/category`);

const deletable = (categoryId: number) =>
  api.get<number>(`/deletable/${categoryId}`);

const isChild = (currentId: number, comparedId: number) =>
  api.get<boolean>('/isChild', {
    params: {
      currentId,
      comparedId,
    },
  });

const tree = () => api.get<Category[]>('/tree');

const add = (body: Category) => api.post<Category[]>('', body);

const updateParentId = (categoryDto: Category) =>
  api.patch('/parentId', categoryDto);

const update = (categoryDto: Category) => api.patch('', categoryDto);

const deleteCategory = (categoryId: number) => api.delete(`/${categoryId}`);

const fetcher = (url: string) => api.get(url).then(res => res.data);

const categoryApis = {
  deletable,
  isChild,
  tree,
  add,
  updateParentId,
  update,
  deleteCategory,
  fetcher,
};

export default categoryApis;
