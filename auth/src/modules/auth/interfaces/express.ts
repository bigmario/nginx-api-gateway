import { Request } from 'express';

export interface IRequest extends Request {
  user: {
    id: number;
    typeId: number;
    rolId: number;
  };
}
