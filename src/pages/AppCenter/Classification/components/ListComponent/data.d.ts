export type Iprops = {
  clearHandle: () => void;
  againRequestClassList: () => void;
};

export type IState = {
  classList: any[];
  completeValue?: string;
  radioValue?: string;
  tempValue: string;
  newClassList: any[];
  loading: boolean;
};
