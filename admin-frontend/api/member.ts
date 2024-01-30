import { FindMemberPageReq, Member, Page, Pageable, Result } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/member`);

const findPage = (findMemberPageReq: FindMemberPageReq, pageable: Pageable) =>
  api.post<Page<Member>>('/findPage', findMemberPageReq, {
    params: pageable,
  });

const addMember = (member: Member) => api.post<Result<string>>('', member);

const editMember = (member: Member) => api.patch('', member);

const deleteMember = (id: number) => api.delete(`/${id}`);

const memberApis = {
  findPage,
  addMember,
  editMember,
  deleteMember,
};

export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default memberApis;
