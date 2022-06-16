import multer from "multer";
import multerS3, { AUTO_CONTENT_TYPE } from "multer-s3";
import { S3 } from "aws-sdk";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  accessKeyId: accessKeyId, // 액세스 키 입력
  secretAccessKey: secretAccessKey, // 비밀 액세스 키 입력
  region: region, // 사용자 사용 지역 (서울의 경우 ap-northeast-2)
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName, // 버킷 이름 입력
    contentType: AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}_${file.fieldname}`);
    },
  }),
});

export { upload, s3 };
