import {
  AddMemberReq,
  EditMemberReq,
  FindMemberPageReq,
  Member,
  Page,
  Pageable,
  Result,
} from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/member`);

const findPage = (findMemberPageReq: FindMemberPageReq, pageable: Pageable) =>
  api.post<Page<Member>>('/findPage', findMemberPageReq, {
    params: pageable,
  });

const addMember = (body: AddMemberReq) => api.post<Result<string>>('', body);

const editMember = (body: EditMemberReq) => api.patch('', body);

const deleteMember = (id: number) => api.delete(`/${id}`);

const logged = () => api.get<Member>('/logged');

const memberApis = {
  findPage,
  addMember,
  editMember,
  deleteMember,
  logged,
};

export const fetcher = (url: string) => api.get(url).then(res => res.data);

export default memberApis;
