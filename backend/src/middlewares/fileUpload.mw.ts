import { extname } from "path";
import multer, { diskStorage } from "multer";
import { config } from "@/config";

const storage = diskStorage({
  destination: config.generalUploadPath,
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("");
    return cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

const upload = (mimetypes: string[], maxSize: number) => {
  return multer({
    storage,
    fileFilter(req, file, callback) {
      if (mimetypes.some((m) => file.mimetype.includes(m))) {
        callback(null, true);
      } else {
        callback(new Error(`File type is not matching: ${mimetypes.join(", ")}`));
      }
    },
    limits: { fileSize: maxSize },
  });
};

export const fileUploadMW = (props?: {
  fieldName?: string;
  mimetypes?: string[];
  maxSize?: number;
  isArray?: boolean;
  maxCount?: number;
}) => {
  const mimetypes = props?.mimetypes ?? ["image/jpeg", "image/png", "image/jpg"];
  const maxSize = props?.maxSize ?? 1024 * 1024 * 5;
  const fieldName = props?.fieldName ?? props?.isArray ? "files" : "file";
  const maxCount = props?.maxCount ?? 10;

  if (props?.isArray) {
    return upload(mimetypes, maxSize).array(fieldName, maxCount);
  } else {
    return upload(mimetypes, maxSize).single(fieldName);
  }
};
