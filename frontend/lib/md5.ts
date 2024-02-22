import { Chunk, MD5Info } from '@types'; // 1MB
import SparkMD5 from 'spark-md5';

// 5MB
export const CHUNK_SIZE = 5 * 1024 * 1024;
/**
 *
 * @param {*} file 文件信息
 * @param {*} size 文件分片大小
 * @returns
 * md5Key 文件加密后key值
 * fileInfo 分片文件信息
 */
export const md5File = (file: File, size: number = CHUNK_SIZE) => {
  const chunks: Chunk[] = [];
  // 文件分片长度
  const len = Math.ceil(file.size / size);
  const blobSlice = File.prototype.slice;
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  let current = 0;

  const loadNext = (size: number) => {
    // 切片主要方法
    const start = current * size;
    const end = start + size >= file.size ? file.size : start + size;
    const sliceFile = blobSlice.call(file, start, end);
    // 将切片文件保存
    chunks.push({
      key: current,
      file: sliceFile,
    });
    fileReader.readAsArrayBuffer(sliceFile);
  };

  return new Promise<MD5Info>((resolve, reject) => {
    try {
      loadNext(size);
    } catch (err) {
      reject(err);
    }
    // 文件读取完毕之后的处理
    fileReader.onload = e => {
      try {
        const result = e.target?.result as ArrayBuffer;
        if (!result) {
          reject('result is null');
        } else {
          spark.append(result);
          current += 1;
          if (current < len) {
            // 文件递归读取
            loadNext(size);
          } else {
            // 文件全部读取完, 返回对应信息;
            const res = {
              md5: spark.end(), // 文件加密key值
              fileInfo: {
                size: file.size, //文件总大小
                chunks, // 切片文件列表
              },
            };
            resolve(res);
          }
        }
      } catch (err) {
        reject(err);
      }
    };
  });
};
