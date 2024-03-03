import { AdminOverview, MemberOverview } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/overview`);

const getMemberOverview = () => api.get<MemberOverview>('/member');
const getAdminOverview = () => api.get<AdminOverview>('/admin');

const fetcher = (url: string) => api.get(url).then(res => res.data);

const overviewApis = {
  getMemberOverview,
  getAdminOverview,
  fetcher,
};

export default overviewApis;
