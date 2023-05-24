import { Input, Form } from 'antd';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const { Search } = Input;

export type SearchBoxProps = {
  showSearchButton?: boolean;
  minLength?: number;
  showClear?: boolean;
  placeholder?: string;
  defaultSearchKey?: string;
  onSearch?: (value?: string) => void;
};

const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const { onSearch, minLength, showClear = true, defaultSearchKey, placeholder } = props;
  const [form] = Form.useForm();
  const handleSearch = (value: string) => {
    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  };
  const render = () => {
    return (
      <InputGroup className="searchBox">
        <Form form={form}>
          <FormItem name="searchKey" initialValue={defaultSearchKey}>
            <Search
              placeholder={placeholder}
              allowClear={showClear}
              maxLength={50}
              minLength={minLength || 0}
              onSearch={handleSearch}
            />
          </FormItem>
        </Form>
      </InputGroup>
    );
  };
  return render();
};
export default SearchBox;
