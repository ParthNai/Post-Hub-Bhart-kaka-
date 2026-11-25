export interface IAppHeaderData {
  title: string;
  link?: string;
  external?: boolean;
  isModal?: boolean;
  children?: IAppHeaderData[];
}
