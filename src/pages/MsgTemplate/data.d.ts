export type ResProps = {
  title: string;
  content: string;
};

export type TmplProps = {
  data?: ResProps;
  type: string;
  title?: string;
  content?: string;
  isText?: boolean;
  hideToolbar?: boolean;
};

export type TmplDataProps = {
  resetpwd_email?: ResProps;
  welcome_email?: ResProps;
  verify_email?: ResProps;
  code_sms?: ResProps;
};
