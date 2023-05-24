import React from 'react';
import { DatePicker, Input, InputNumber } from 'antd';
import moment from 'moment';
interface Iprops {
  page_control: string;
}
const CreateComponent: React.FC<Iprops> = ({ page_control }) => {
  const renderConponent = (type) => {
    switch (type) {
      case 'STRING':
        return <Input />;
      case 'INT':
        return <InputNumber controls={false} style={{ width: '100%' }} />;
      case 'DATATIME':
        return (
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{
              defaultValue: moment('00:00:00', 'HH:mm:ss'),
            }}
            style={{ width: '100%' }}
          />
        );
      default:
        return '';
    }
  };
  return <>{renderConponent(page_control)}</>;
};
export default CreateComponent;
