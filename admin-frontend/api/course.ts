import {
  AddCourseReq,
  Chapter,
  EditCourseReq,
  EditCoursewareReq,
  FindCoursePageReq,
  FindCourseResp,
  Page,
  Pageable,
  Result,
  StorageObj,
  UpdateChapterReq,
} from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/course`);

const add = (body: AddCourseReq) => api.post('/add', body);

const editCourse = (body: EditCourseReq) => api.patch('/editCourse', body);

const editChapters = (body: UpdateChapterReq) =>
  api.patch<Result<string>>('/editChapters', body);

const editCoursewares = (body: EditCoursewareReq) =>
  api.patch('/editCoursewares', body);

const findPage = (body: FindCoursePageReq, pageable: Pageable) => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageable.pageNumber.toString());
  params.append('pageSize', pageable.pageSize.toString());
  pageable.sort?.forEach(order => {
    params.append('sort', `${order.property},${order.direction}`);
  });
  return api.post<Page<FindCourseResp>>('/findPage', body, {
    params: params,
  });
};

const findChaptersById = (courseId: number) =>
  api.get<Chapter[]>(`/findChaptersById/${courseId}`);

const findCoursewaresById = (courseId: number) =>
  api.get<StorageObj[]>(`/findCoursewaresById/${courseId}`);

const deleteCourse = (courseId: number) => api.delete(`/delete/${courseId}`);

const fetcher = (url: string) => api.get(url).then(res => res.data);

const courseApis = {
  add,
  editCourse,
  editChapters,
  editCoursewares,
  findPage,
  findChaptersById,
  findCoursewaresById,
  deleteCourse,
  fetcher,
};

export default courseApis;
