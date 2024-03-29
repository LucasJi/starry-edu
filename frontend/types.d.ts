import { Profile, Session } from 'next-auth';

type Chunk = {
  key: number;
  file: Blob;
};

type FileInfo = {
  size: number;
  chunks: Chunk[];
};

type MD5Info = {
  md5: string;
  fileInfo: FileInfo;
};

interface StorageObj extends BaseEntity {
  name: string;
  md5: string;
  type?: string;
  uploadId?: string;
  isUploaded?: boolean;
  category: Category | null;
  creatorName?: string;
  fileType?: string;
  size?: number;
}

type CreateUploadResp = {
  objId: number;
  uploaded: boolean;
  partList: Part[];
};

interface BaseEntity {
  id?: number;
  updateTimestamp?: string;
  creationTimestamp?: string;
}

interface User extends BaseEntity {
  username: string;
  email: string;
  password?: string;
}

interface Member {
  departmentId: number;
  departmentName?: string;
  user: User;
}

interface Category extends BaseEntity {
  parentId?: number | null;
  name?: string;
  children?: Category[];
}

interface Department extends BaseEntity {
  parentId?: number | null;
  name?: string;
  children?: Category[];
}

interface Course extends BaseEntity {
  name?: string;
  mandatory?: boolean;
  category?: Category;
  assignToAllDepartments?: boolean;
  description?: string;
  hasChapters?: boolean;
  videoCount?: number;
  completedVideoCount?: number;
}

interface EditChaptersCourse {
  id: number;
  hasChapters: boolean;
}

interface Chapter extends BaseEntity {
  name?: string;
  order?: number;
  course?: Course;
  chapterVideos?: ChapterVideo[];
}

interface DepartmentDeletable {
  deletable: boolean;
  subDepartmentCount: number;
}

interface CustomSession extends Session {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

interface CustomProfile extends Profile {
  role: string;
}

interface Page<T> extends Pageable {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface Pageable {
  pageSize: number;
  pageNumber: number;
  sort?: Order[];
}

interface Order {
  direction: string;
  property: string;
}

interface Result<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

interface Part {
  partNumber: number;
  etag: string;
  size: number;
}

interface FindStorageObjPageReq {
  category: Category;
  name?: string;
  types: string[];
}

interface FindCoursePageReq {
  name: string;
  categoryId: number | null;
  departmentId: number | null;
}

interface UpdateChapterReq {
  chapters: Chapter[];
}

interface ChapterVideo {
  chapterId?: number;
  id?: number;
  video?: StorageObj;
  order?: number;
  completed?: boolean;
}

interface AddCourseReq {
  course: Course;
  chapters: Chapter[];
  departmentIds: number[];
  coursewareIds: number[];
}

interface EditCourseReq {
  id: number;

  name: string;

  category: Category;

  mandatory: boolean;

  description: string;

  departmentIds: number[];

  assignToAllDepartments: boolean;
}

interface FindCourseResp {
  course: Course;
  departments: Department[];
}

interface EditCoursewareReq {
  courseId: number;
  coursewareIds: number[];
}

interface FindMemberPageReq {
  departmentId: number;
  username?: string;
  email?: string;
}

interface AddMemberReq {
  departmentId: number;
  username: string;
  email: string;
  password: string;
}

interface EditMemberReq {
  id: number;
  username: string;
  email: string;
  departmentId: number;
}

interface UpdateStudyRecordReq {
  videoId: number;
  chapterId: number;
  completed: boolean;
  duration: number;
}

interface MemberOverview {
  courseCount: number;
  completedCourseCount: number;
  dailyStudyDuration: number;
  studyDuration: number;
}

interface AdminOverview {
  todayMemberCount: number;
  tmcCompareToYesterday: number;
  memberCount: number;
  mcCompareToYesterday: number;
  courseCount: number;
  departmentCount: number;
  categoryCount: number;
  adminCount: number;
  videoCount: number;
  coursewareCount: number;
  rank: string[];
}
