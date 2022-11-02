import { extname } from 'path';
import { nanoid } from 'nanoid';

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${nanoid(64)}${fileExtName}`);
};
