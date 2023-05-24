import { Col, Form, Row, Tabs, Card, Checkbox } from 'antd';
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import _ from 'lodash';
import EventDetailParam from '@/pages/Link/Manage/Components/EventDetailParam';
import ParamMapping from '@/pages/Link/Manage/Components/ParamMapping';
import { editAction, getAction } from '@/pages/Link/Manage/service';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';

const ActionIn: React.FC = (props: any, ref) => {
  const { query } = props;

  const [formIn] = Form.useForm();
  const refApiInHeader = useRef();
  const refApiInBody = useRef();
  const refApiInPath = useRef();
  const refApiInQuery = useRef();

  const refMappingIn = useRef();
  const refInActionHeader = useRef();
  const refInActionBody = useRef();
  const refInActionPath = useRef();
  const refInActionQuery = useRef();

  const [data, setData] = useState<any>({});
  const [actionId, setAcationId] = useState(query.actionId);

  const in_mapping = Form.useWatch('in_mapping', formIn);

  const loadData = () => {
    if (actionId) {
      getAction(actionId).then((resp: any) => {
        const obj = resp.data;
        setData(obj);
        const input_schema = _.get(obj, 'config.input_schema');
        formIn.setFieldsValue({
          in_mapping: !!input_schema,
        });
      });
    }
  };
  useEffect(() => {
    setAcationId(query.actionId);
  }, [props]);

  useEffect(() => {
    loadData();
  }, [actionId]);

  const onSubmit = (callback) => {
    const dataObj = _.cloneDeep(data);
    function setParamsValue({ isMapping, refTable, fieldName, title }) {
      let schema = _.get(dataObj, 'config.' + fieldName);
      if (isMapping && refTable && refTable.current) {
        schema = refTable.current.getData();
        if (typeof schema === 'boolean') {
          showErrorMessage('请先填写参数名:' + title);
          return false;
        }
      } else if (!isMapping) {
        schema = null;
      }
      _.set(dataObj, 'config.' + fieldName, schema);
      return true;
    }
    //api入参数
    if (refApiInHeader && refApiInHeader.current) {
      const fieldList = refApiInHeader.current.getData();
      if (typeof fieldList === 'boolean') {
        showErrorMessage('请先填写：API入参-请求头-参数名。');
        return;
      }
      _.set(dataObj, 'config.api_schema.input_schema.header_schema', fieldList);
    }
    if (refApiInBody && refApiInBody.current) {
      const fieldList = refApiInBody.current.getData();
      if (typeof fieldList === 'boolean') {
        showErrorMessage('请先填写：API入参-请求体-参数名。');
        return;
      }
      _.set(dataObj, 'config.api_schema.input_schema.body_schema', fieldList);
    }
    if (refApiInPath && refApiInPath.current) {
      const fieldList = refApiInPath.current.getData();
      if (typeof fieldList === 'boolean') {
        showErrorMessage('请先填写：API入参-URL查询参数-参数名。');
        return;
      }
      _.set(dataObj, 'config.api_schema.input_schema.path_schema', fieldList);
    }
    if (refApiInQuery && refApiInQuery.current) {
      const fieldList = refApiInQuery.current.getData();
      if (typeof fieldList === 'boolean') {
        showErrorMessage('请先填写：API入参-URL路径参数-参数名。');
        return;
      }
      _.set(dataObj, 'config.api_schema.input_schema.query_schema', fieldList);
    }
    if (in_mapping) {
      //执行动作入参数
      let valid = setParamsValue({
        isMapping: in_mapping,
        refTable: refInActionHeader,
        fieldName: 'input_schema.header_schema',
        title: '执行动作入参-请求头',
      });
      if (!valid) {
        return;
      }
      valid = setParamsValue({
        isMapping: in_mapping,
        refTable: refInActionBody,
        fieldName: 'input_schema.body_schema',
        title: '执行动作入参-请求体',
      });
      if (!valid) {
        return;
      }
      valid = setParamsValue({
        isMapping: in_mapping,
        refTable: refInActionQuery,
        fieldName: 'input_schema.query_schema',
        title: '执行动作入参-URL查询参数',
      });
      if (!valid) {
        return;
      }
      valid = setParamsValue({
        isMapping: in_mapping,
        refTable: refInActionPath,
        fieldName: 'input_schema.path_schema',
        title: '执行动作入参-URL路径参数',
      });
      if (!valid) {
        return;
      }
    } else {
      dataObj.config.input_schema = null;
    }

    const p = editAction(actionId, dataObj);
    p.then(() => {
      showSuccessMessage();
      if (typeof callback === 'function') {
        callback();
      }
    }).catch((error) => {
      showErrorMessage(error);
    });
  };
  useImperativeHandle(ref, () => ({
    onSave: async (callback) => {
      onSubmit(callback);
    },
  }));

  const onChangeParams = (list, field) => {
    const newData = _.cloneDeep(data);
    const newValue = _.cloneDeep(list[0]);
    newValue.name = 'root';
    _.set(newData, 'config.' + field, newValue);
    setData(newData);
  };
  const onChangeParamsRows = (list: any) => {
    const newData = _.cloneDeep(data);
    list.forEach((row) => {
      const { rootName } = row;
      const newRow = _.cloneDeep(row);
      newRow.name = 'root';
      delete newRow.rootName;
      _.set(newData, rootName, newRow);
    });
    setData(newData);
  };
  const renderInActionTabs = () => {
    if (!data.id) {
      return null;
    }
    const header_schema = _.get(data, 'config.input_schema.header_schema');
    const body_schema = _.get(data, 'config.input_schema.body_schema');
    const path_schema = _.get(data, 'config.input_schema.path_schema');
    const query_schema = _.get(data, 'config.input_schema.query_schema');
    return (
      <Tabs
        defaultActiveKey="header"
        items={[
          {
            key: 'header',
            label: '请求头',
            children: (
              <EventDetailParam
                list={(header_schema && [header_schema]) || []}
                ref={refInActionHeader}
                onChange={(list: any) => {
                  onChangeParams(list, 'input_schema.header_schema');
                }}
              />
            ),
          },
          {
            key: 'body',
            label: '请求体',
            children: (
              <EventDetailParam
                list={(body_schema && [body_schema]) || []}
                ref={refInActionBody}
                onChange={(list: any) => {
                  onChangeParams(list, 'input_schema.body_schema');
                }}
              />
            ),
          },
          {
            key: 'query',
            label: 'URL查询参数',
            children: (
              <EventDetailParam
                list={(query_schema && [query_schema]) || []}
                ref={refInActionQuery}
                onChange={(list: any) => {
                  onChangeParams(list, 'input_schema.query_schema');
                }}
              />
            ),
          },
          {
            key: 'path',
            label: 'URL路径参数',
            children: (
              <EventDetailParam
                list={(path_schema && [path_schema]) || []}
                ref={refInActionPath}
                onChange={(list: any) => {
                  onChangeParams(list, 'input_schema.path_schema');
                }}
              />
            ),
          },
        ]}
      />
    );
  };
  const getArrayFromObject = (fields: any, titles: any) => {
    const list: any[] = [];
    const newData = _.cloneDeep(data);
    fields.forEach((field: string, index: number) => {
      const value = _.get(newData, field);
      if (value) {
        const newValue = _.cloneDeep(value);
        newValue.rootName = field;
        const fieldList1 = field.split('.');
        const fieldList2 = _.last(fieldList1)?.split('_');
        newValue.name = _.first(fieldList2);
        newValue.description = titles[index];
        newValue.paraLevel = newValue.name;
        list.push(newValue);
      }
    });
    return list;
  };
  const renderInMapping = () => {
    if (!data.id) {
      return null;
    }
    const rightFields = [
      'config.api_schema.input_schema.header_schema',
      'config.api_schema.input_schema.body_schema',
      'config.api_schema.input_schema.query_schema',
      'config.api_schema.input_schema.path_schema',
    ];
    const rightLabel = ['请求头', '请求体', 'URL查询参数', 'URL路径参数'];
    const rightList = getArrayFromObject(rightFields, rightLabel);

    const leftFields = [
      'config.input_schema.header_schema',
      'config.input_schema.body_schema',
      'config.input_schema.query_schema',
      'config.input_schema.path_schema',
    ];
    const leftLabel = ['请求头', '请求体', 'URL查询参数', 'URL路径参数'];
    const leftList = getArrayFromObject(leftFields, leftLabel);
    return (
      <ParamMapping
        list={rightList}
        ref={refMappingIn}
        leftTableDataList={leftList}
        leftTitle="执行动作入参"
        rightTitle="API入参"
        onChange={(list: any) => {
          onChangeParamsRows(list);
        }}
      />
    );
  };
  const renderModelFormInAction = () => {
    if (!data.id) {
      return null;
    }
    return (
      <Card
        size="small"
        title={
          <>
            执行动作入参
            <Form form={formIn}>
              <Form.Item label="启用入参映射" name="in_mapping" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Form>
          </>
        }
      >
        {(in_mapping && (
          <Row>
            <Col span={24}>{renderInActionTabs()}</Col>
            <Col span={24}>{renderInMapping()}</Col>
          </Row>
        )) ||
          null}
      </Card>
    );
  };
  const renderModelFormIn = () => {
    if (!data.id) {
      return '加载中';
    }
    const api_schema_in_header_schema = _.get(data, 'config.api_schema.input_schema.header_schema');
    const api_schema_in_body_schema = _.get(data, 'config.api_schema.input_schema.body_schema');
    const api_schema_in_path_schema = _.get(data, 'config.api_schema.input_schema.path_schema');
    const api_schema_in_query_schema = _.get(data, 'config.api_schema.input_schema.query_schema');
    return (
      <Card bordered={false}>
        <Card size="small" title="API入参">
          <Tabs
            defaultActiveKey="header"
            items={[
              {
                key: 'header',
                label: '请求头',
                children: (
                  <EventDetailParam
                    list={(api_schema_in_header_schema && [api_schema_in_header_schema]) || []}
                    ref={refApiInHeader}
                    // hasMapping={in_mapping}
                    onChange={(list: any) =>
                      onChangeParams(list, 'api_schema.input_schema.header_schema')
                    }
                  />
                ),
              },
              {
                key: 'body',
                label: '请求体',
                children: (
                  <EventDetailParam
                    list={(api_schema_in_body_schema && [api_schema_in_body_schema]) || []}
                    ref={refApiInBody}
                    onChange={(list: any) =>
                      onChangeParams(list, 'api_schema.input_schema.body_schema')
                    }
                  />
                ),
              },
              {
                key: 'query',
                label: 'URL查询参数',
                children: (
                  <EventDetailParam
                    list={(api_schema_in_query_schema && [api_schema_in_query_schema]) || []}
                    ref={refApiInQuery}
                    onChange={(list: any) =>
                      onChangeParams(list, 'api_schema.input_schema.query_schema')
                    }
                  />
                ),
              },
              {
                key: 'path',
                label: 'URL路径参数',
                children: (
                  <EventDetailParam
                    list={(api_schema_in_path_schema && [api_schema_in_path_schema]) || []}
                    ref={refApiInPath}
                    onChange={(list: any) =>
                      onChangeParams(list, 'api_schema.input_schema.path_schema')
                    }
                  />
                ),
              },
            ]}
          />
        </Card>
        {renderModelFormInAction()}
      </Card>
    );
  };
  return renderModelFormIn();
};

export default forwardRef(ActionIn);
