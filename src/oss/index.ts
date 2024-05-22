/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const ObsClient = require("esdk-obs-nodejs");

class OSSManager {
  obsClient: any;
  Bucket = process.env.BUCKET_NAME;
  isInit: boolean = false;
  constructor() {
    this.obsClient = new ObsClient({
      access_key_id: process.env.HW_ACCESS_KEY,
      secret_access_key: process.env.HW_SECRET_ACCESS_KEY,
      server: process.env.HW_SERVER,
    });
    this.init();
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      this.obsClient.headBucket(
        { Bucket: this.Bucket },
        (err: any, result: any) => {
          if (err) {
            console.error("初始化OSS失败：" + err);
            reject(err);
          } else {
            if (result.CommonMsg.Status < 300) {
              console.log("初始化OSS成功");
            } else if (result.CommonMsg.Status === 404) {
              console.log("桶不存在：", this.Bucket);
            }
            this.isInit = true;
            resolve();
          }
        }
      );
    });
  }

  createFolder(folderName: string) {
    this.obsClient.putObject(
      { Bucket: this.Bucket, Key: `${folderName}/` },
      function (err: any, result: any) {
        if (err) {
          console.error("Error-->" + err);
        } else {
          console.log("Status-->" + result.CommonMsg.Status);
        }
      }
    );
  }
}

const ossManager = new OSSManager();

export default ossManager;
