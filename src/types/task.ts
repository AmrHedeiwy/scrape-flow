export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
}

export enum TaskParamType {
  STRING = "STRING",
  BROSWER_INSTANCE = "BROSWER_INSTANCE",
}

export interface ITaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}

export interface IParamProps {
  param: ITaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
}
