export interface FormStatus {
  message: string;
  type: string;
}

export interface FormStatusProps {
  [key: string]: FormStatus;
}