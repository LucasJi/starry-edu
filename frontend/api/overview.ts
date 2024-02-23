import { MemberOverview } from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/overview`);

const getMemberOverview = () => api.get<MemberOverview>('/overview');

const fetcher = (url: string) => api.get(url).then(res => res.data);

const overviewApis = {
  getMemberOverview,
  fetcher,
};

export default overviewApis;
