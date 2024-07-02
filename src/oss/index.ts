/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../tools/logger";
import { SignedUrlInfo } from "../types/oss";

/* eslint-disable @typescript-eslint/no-var-requires */
const ObsClient = require("esdk-obs-nodejs");

class OSSManager {
  obsClient: any;
  Bucket = process.env.BUCKET_NAME;
  isInit: boolean = false;
  signedExpires = parseInt(process.env.SIGNED_EXPIRES as string);
  constructor() {
    this.obsClient = new ObsClient({
      access_key_id: process.env.HW_ACCESS_KEY,
      secret_access_key: process.env.HW_SECRET_ACCESS_KEY,
      server: process.env.HW_SERVER,
    });
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      this.obsClient.headBucket(
        { Bucket: this.Bucket },
        (err: any, result: any) => {
          if (err) {
            logger.error("初始化OSS失败：" + err);
            reject(err);
          } else {
            if (result.CommonMsg.Status < 300) {
              logger.info("初始化OSS成功");
            } else if (result.CommonMsg.Status === 404) {
              logger.error("桶不存在：", this.Bucket);
            }
            this.isInit = true;
            resolve();
          }
        }
      );
    });
  }

  createFolder(folderName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.obsClient.putObject(
        { Bucket: this.Bucket, Key: `${folderName}/` },
        function (err: any, result: any) {
          if (err) {
            logger.error("创建文件夹失败：" + err);
            reject(false);
          } else {
            logger.info("创建文件夹成功：" + result);
            resolve(true);
          }
        }
      );
    });
  }

  getSignedUrl(key: string, type: string) {
    const res: SignedUrlInfo = this.obsClient.createSignedUrlSync({
      Method: type,
      Bucket: this.Bucket,
      Key: key,
      Expires: this.signedExpires,
    });
    return res.SignedUrl;
  }

  getSignedUploadUrl(key: string) {
    return this.getSignedUrl(key, "PUT");
  }

  getSignedDownloadUrl(key: string) {
    return this.getSignedUrl(key, "GET");
  }

  getSignedDeleteUrl(key: string) {
    return this.getSignedUrl(key, "DELETE");
  }
}

const ossManager = new OSSManager();

export default ossManager;
