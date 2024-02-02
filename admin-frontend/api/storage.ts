import {
  CreateUploadResp,
  FindStorageObjPageReq,
  Page,
  Pageable,
  Result,
  StorageObj,
} from '@types';
import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/storage`);

const createUpload = (obj: StorageObj) =>
  api.post<Result<CreateUploadResp>>('/createUpload', obj);

const getStorageObjTypeFromFileType = (fileType: string) =>
  api.get<string>('/getStorageObjTypeFromFileType', {
    params: {
      fileType,
    },
  });

const upload = (objId: number, file: Blob, partNumber: number) => {
  const formData = new FormData();
  formData.append('objId', objId.toString());
  formData.append('file', file);
  formData.append('partNumber', partNumber.toString());
  return api.postForm('/upload', formData);
};

const completeMultipartUpload = (objId: number) =>
  api.put('/completeMultipartUpload', null, {
    params: {
      objId,
    },
  });

const findPageByCategoryAndNameAndTypeIn = (
  body: FindStorageObjPageReq,
  pageable: Pageable
) =>
  api.post<Page<StorageObj>>('/findPageByCategoryAndNameAndTypeIn', body, {
    params: pageable,
  });

const deleteAllByIdInBatch = (ids: number[]) => {
  const urlSearchParams = new URLSearchParams();
  for (const id of ids) {
    urlSearchParams.append('ids', id.toString());
  }
  return api.delete<Result<string>>('/deleteAllByIdsInBatch', {
    params: urlSearchParams,
  });
};

const updateCategoryAndName = (obj: StorageObj) =>
  api.patch('/updateCategoryAndName', obj);

const getPreviewUrl = (objId: number) =>
  api.get<string>(`/getPreviewUrl/${objId}`);

const getDownloadUrl = (objId: number) =>
  `${process.env.NEXT_PUBLIC_EDU_ADMIN_URL}/storage/download/${objId}`;

const storageApis = {
  createUpload,
  upload,
  completeMultipartUpload,
  findPageByCategoryAndNameAndTypeIn,
  deleteAllByIdInBatch,
  updateCategoryAndName,
  getPreviewUrl,
  getStorageObjTypeFromFileType,
  getDownloadUrl,
};

export default storageApis;
