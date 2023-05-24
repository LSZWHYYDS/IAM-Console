import { Form } from 'antd';

export type FormTextProps = {
  label: string;
  name?: string;
  value?: string;
};

const FormText: React.FC<FormTextProps> = (props) => {
  const { label, name, value } = props;
  return (
    <Form.Item label={label} name={name}>
      {value}
    </Form.Item>
  );
};
export default FormText;
