import { Department, DepartmentDeletable } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/department`);

const deletable = (departmentId: number) =>
  api.get<DepartmentDeletable>(`/${departmentId}/deletable`);

const isChild = (currentId: number, comparedId: number) =>
  api.get<boolean>('/isChild', {
    params: {
      currentId,
      comparedId,
    },
  });

const tree = () => api.get<Department[]>('/tree');

const add = (body: Department) => api.post<Department[]>('', body);

const updateParentId = (departmentDto: Department) =>
  api.patch('/parentId', departmentDto);

const update = (departmentDto: Department) => api.patch('', departmentDto);

const deleteDepartment = (departmentId: number) =>
  api.delete(`/${departmentId}`);

const fetcher = (url: string) => api.get(url).then(res => res.data);

const departmentApis = {
  deletable,
  isChild,
  tree,
  add,
  updateParentId,
  update,
  deleteDepartment,
  fetcher,
};

export default departmentApis;
