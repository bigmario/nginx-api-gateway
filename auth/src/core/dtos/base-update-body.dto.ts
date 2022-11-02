export class BaseUpdateBodyDto<T> {
  id: number;
  body: T;
  resourceUrl: boolean;
}
