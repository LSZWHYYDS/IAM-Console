import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import EditorEnter from '@/components/EditorEnter';
import { history } from 'umi';
import { getIntegrationList, getHaveIdIntegrationList } from '../service';
export type ItemProps = {
  attrValueTips: any;
  dataParamName: string;
  displayNameUtilPrefix?: string;
  basicAttrs: any;
  extendAttrs: any;
  noAdd?: boolean;
  leftReadOnly?: boolean;
  controlId?: boolean;
  rightData?: any;
  echoData?: any;
};
const { Option } = Select;

const EditorEnterStyleObject = {
  position: 'relative',
  width: '400px',
};

const LinkerMapAttrsComponent: React.FC<Partial<ItemProps>> = (props) => {
  const { dataParamName, noAdd, leftReadOnly, controlId, rightData, echoData } = props;

  const IdpType = history?.location?.query?.type;
  const id = history?.location?.query?.id;
  const NumberId = history?.location?.query?.NumberId;
  const form = Form.useFormInstance();

  // 存放左侧下拉数据
  const [leftSelectList, setLeftSelectList] = useState('');
  const [prefix, setPrefix] = useState();
  useEffect(() => {
    if (NumberId) {
      getHaveIdIntegrationList(NumberId, 'CONNECTOR').then((res) => {
        setPrefix(res?.data?.org_and_user_profile?.user_profile?.name);
        setLeftSelectList(res?.data?.org_and_user_profile?.user_profile?.sub_params || []);
      });
    } else {
      getIntegrationList(IdpType).then((res) => {
        setPrefix(res?.data?.org_and_user_profile?.user_profile?.name);
        setLeftSelectList(res?.data?.org_and_user_profile?.user_profile?.sub_params || []);
      });
    }
  }, []);
  useEffect(() => {
    if (id) {
      const echoList: any = [];
      echoData?.forEach?.((i) => {
        echoList.push({
          fieldValue: i?.source_exp,
          fieldName: i?.target_path,
        });
      });
      form.setFieldsValue({
        userFormMappedAttrMap: echoList?.length ? echoList : [{}],
      });
    } else {
      form.setFieldsValue({
        userFormMappedAttrMap: [{}],
      });
    }
  }, [echoData]);

  return (
    <Form.List name={dataParamName as string}>
      {(fields, { add, remove }) => (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {fields.map(({ key, name, ...restField }, mapIx) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'fieldValue']}
                  rules={[{ required: true, message: '请输入或选择你的字段' }]}
                >
                  <EditorEnter
                    dynamicId={controlId ? 'controlIdRef' + mapIx : 'ref' + mapIx}
                    type={IdpType}
                    styleObj={EditorEnterStyleObject}
                    componentData={{ editOrEnterData: leftSelectList, preFix: prefix }}
                  />
                </Form.Item>
                <div>
                  <img
                    src="/uc/images/arrow.png"
                    alt="箭头"
                    style={{
                      objectFit: 'scale-down',
                      width: 25,
                      height: 25,
                      margin: '0 5px',
                      marginTop: 3,
                    }}
                  />
                </div>
                <Form.Item
                  {...restField}
                  name={[name, 'fieldName']}
                  rules={[{ required: true, message: '请选择您的字段' }]}
                >
                  <Select
                    style={{ width: '400px', height: '32px', position: 'relative', top: 5 }}
                    allowClear={true}
                    placeholder="请选择"
                    disabled={
                      leftReadOnly || (props.dataParamName == 'orgFormMappedAttrMap' && key === 0)
                    }
                  >
                    {rightData?.map?.((extAttr) => {
                      return (
                        <Option
                          key={extAttr.name}
                          value={extAttr.name || ''}
                          title={extAttr.description}
                        >
                          {extAttr.description}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <MinusCircleOutlined
                  style={{
                    opacity: mapIx ? 1 : 0,
                    visibility: mapIx ? 'visible' : 'hidden',
                    position: 'relative',
                    top: 10,
                  }}
                  className="dynamic-delete-button"
                  onClick={() => remove(name)}
                />
              </Space>
            ))}
          </div>
          {!noAdd && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="dashed" onClick={add} style={{ width: '400px' }}>
                <PlusOutlined />
                增加
              </Button>
            </div>
          )}
        </>
      )}
    </Form.List>
  );
};
export default LinkerMapAttrsComponent;
