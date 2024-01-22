import { Department, Member, Page, Pageable, Result } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/member`);

const findPageByDepartment = (department: Department, pageable: Pageable) =>
  api.post<Page<Member>>('/findPageByDepartment', department, {
    params: pageable,
  });

const addMember = (member: Member) =>
  api.post<Result<string>>('/addMember', member);

const editMember = (member: Member) => api.post('/editMember', member);

const deleteMember = (id: number) => api.delete(`/deleteMember/${id}`);

const memberApis = {
  findPageByDepartment,
  addMember,
  editMember,
  deleteMember,
};

export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default memberApis;
