import {
  AddCourseReq,
  Chapter,
  Course,
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

const add = (body: AddCourseReq) => api.post('', body);

const editCourse = (body: EditCourseReq) => api.patch('', body);

const editChapters = (body: UpdateChapterReq) =>
  api.patch<Result<string>>('/chapters', body);

const editCoursewares = (body: EditCoursewareReq) =>
  api.patch('/coursewares', body);

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
  api.get<Chapter[]>(`/${courseId}/chapters`);

const findCoursewaresById = (courseId: number) =>
  api.get<StorageObj[]>(`/${courseId}/coursewares`);

const deleteCourse = (courseId: number) => api.delete(`/${courseId}`);

const findLoginMemberCoursesByCategoryId = (categoryId: number) =>
  api.get<Course[]>(`/loginMember/category/${categoryId}`);

const findById = (courseId: number) => api.get<Course>(`/${courseId}`);

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
  findLoginMemberCoursesByCategoryId,
  findById,
  fetcher,
};

export default courseApis;
