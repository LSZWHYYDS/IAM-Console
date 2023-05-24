import { showErrorMessage, showSuccessMessage, useStateCallback } from '@/utils/common.utils';
import { LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Form, Row, Modal, Radio, Input, Drawer, Select, Popover } from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import _ from 'lodash';
import { getData as getDataApi, getDataConnector, getDataIdp, edit } from '../service';
import FieldForm from './fieldForm';
import type { ChildRef } from '@/components/ModalMappingList';
import ModalMappingList from '@/components/ModalMappingList';
import ProTable from '@ant-design/pro-table';
const FormItem = Form.Item;

const ProfileConfigDetail: React.FC<any> = (props: any) => {
  const { location } = props;
  const { query } = location;
  const tableRef = useRef<any>(null);

  const ChildRefDetails = useRef<ChildRef>(null);

  const [profileData, setProfileData] = useState(null);
  const [fieldList, setFieldList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldData, setFieldData] = useState(null);
  const [baseData, setBaseData] = useState(null);
  const [range, setRange] = useState('all');
  const [changed, setChanged] = useState(false);
  const [isVisiblePopup, setIsVisiblePopup] = useStateCallback(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterFieldType, setFilterFieldType] = useState('all');

  const [dataSource, setDataSource] = useState<any>([]);

  const [formBasic] = Form.useForm();
  const [formFilter] = Form.useForm();

  const ModalMappingListComponent = ModalMappingList<string | undefined>();

  const resetScreenCondition = () => {
    setRange('all');
    setDataSource(fieldList);
  };

  const text = (
    <div style={{ display: 'flex' }}>
      <h3>筛选</h3>
      <Button size="small" style={{ marginLeft: 10, marginTop: 2 }} onClick={resetScreenCondition}>
        重置
      </Button>
    </div>
  );
  const onRangeChanges = ({ target: { value } }: RadioChangeEvent) => {
    setRange(value);
    switch (value) {
      case 'base':
        setDataSource(baseData);
        break;
      case 'custom':
        setDataSource(_.differenceBy(fieldList, baseData, 'name'));
        break;
      default:
        setDataSource(fieldList);
        break;
    }
    if (filterFieldType !== 'all') {
      setDataSource(
        _.filter(dataSource, {
          type: filterFieldType,
        }),
      );
    }
  };
  const content = (
    <div>
      <Radio.Group
        options={[
          {
            label: '所有',
            value: 'all',
          },
          {
            label: '基础属性',
            value: 'base',
          },
          {
            label: '扩展属性',
            value: 'custom',
          },
        ]}
        value={range}
        onChange={onRangeChanges}
      />
    </div>
  );
  const loadData = () => {
    if (query.id) {
      formBasic.setFieldsValue(query);
      const fnGetBase = (query.type === 'IDP' && getDataIdp) || getDataConnector;
      fnGetBase(query.logoType).then((res) => {
        if (res.error === '0') {
          setBaseData(res?.data?.org_and_user_profile.user_profile.sub_params || []);
          getDataApi(query.id, query.type).then((res1) => {
            if (res.error === '0') {
              setProfileData(res1?.data || {});
              setFieldList(res1?.data?.org_and_user_profile?.user_profile?.sub_params || []);
              switch (range) {
                case 'base':
                  setDataSource(res?.data?.org_and_user_profile.user_profile.sub_params);
                  break;
                case 'custom':
                  setDataSource(
                    _.differenceBy(
                      res1?.data?.org_and_user_profile?.user_profile?.sub_params,
                      res?.data?.org_and_user_profile.user_profile.sub_params,
                      'name',
                    ),
                  );
                  break;
                default:
                  setDataSource(res1?.data?.org_and_user_profile?.user_profile?.sub_params);
                  break;
              }
            } else {
              showErrorMessage(res1);
            }
          });
        } else {
          showErrorMessage(res);
        }
      });
    }
  };

  const updateProfileData = (updateData: any) => {
    setProfileData(updateData);
  };

  useEffect(() => {
    loadData();
  }, []);
  const onCancel = () => {
    history.goBack();
  };

  const onAddField = () => {
    setModalOpen(true);
    setFieldData(null);
  };
  const onEditField = (row) => {
    setModalOpen(true);
    setFieldData(row);
  };
  const onDeleteField = (row) => {
    Modal.confirm({
      title: '确定要删除此字段吗？',
      onOk: () => {
        const newList = _.cloneDeep(fieldList);
        _.remove(newList, {
          ui_id: row.ui_id,
        });
        setFieldList(newList);
        setChanged(true);
      },
    });
  };

  const onSubmitField = (values) => {
    const newList = _.cloneDeep(fieldList);

    if (fieldData) {
      const index = _.findIndex(fieldList, {
        ui_id: fieldData.ui_id,
      });
      newList[index] = values;
    } else {
      newList.push(values);
    }
    setFieldList(newList);
    setModalOpen(false);
    setFieldData(values);
    setRange('all');
    setFilterFieldType('all');
    setChanged(true);
  };
  const onSave = (callback) => {
    const profileDataObj = _.cloneDeep(profileData || {});
    profileDataObj.org_and_user_profile.user_profile.sub_params = fieldList;
    edit(query.id, query.type, profileDataObj).then((res) => {
      if (res.error === '0') {
        setChanged(false);
        if (typeof callback === 'function') {
          callback();
        } else {
          showSuccessMessage();
          history.goBack();
        }
      } else {
        showErrorMessage(res);
      }
    });
  };
  const showMappingPopup = () => {
    if (changed) {
      Modal.confirm({
        title: '打开映射将会自动保存字段数据，需要继续吗？',
        onOk: () => {
          onSave(() => {
            ChildRefDetails.current?.showModal();
          });
        },
      });
    } else {
      setIsVisiblePopup(true, () => {
        ChildRefDetails.current?.showModal();
      });
    }
  };
  const closePopup = () => {
    setIsVisiblePopup(false);
  };
  const onSerchValue = (searchValue) => {
    if (searchValue) {
      const filterArr = dataSource?.filter((is) => {
        if (is?.name?.indexOf(searchValue) !== -1 || is?.description?.indexOf(searchValue) !== -1) {
          return true;
        } else {
          return false;
        }
      });
      setDataSource(filterArr);
    } else {
      if (range == 'base') {
        setDataSource(baseData);
      } else if (range == 'custom') {
        setDataSource(_.differenceBy(fieldList, baseData, 'name'));
      } else {
        setDataSource(fieldList);
      }
    }
  };
  const header = (
    <div>
      <span>用户属性列表</span>
      {/* <span style={{ fontSize: 14, color: 'rgb(185 185 185)', marginLeft: 10 }}>({`${new URL(window.location.href)?.searchParams.get('name')}`})</span> */}
    </div>
  );
  const renderFields = () => {
    const cols = [
      {
        title: '属性名称',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '全局名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '别名',
        dataIndex: 'alias',
        key: 'alias',
        render: (value) => {
          return (value && value?.join?.(',')) || '--';
        },
      },
      {
        title: '数据类型',
        dataIndex: 'type',
        key: 'type',
        render: (value) => {
          const list = [
            {
              label: '字符串',
              value: 'STRING',
            },
            {
              label: '布尔型',
              value: 'BOOLEAN',
            },
            {
              label: '数字',
              value: 'NUMBER',
            },
            {
              label: '对象',
              value: 'OBJECT',
            },
          ];
          const type = _.find(list, {
            value,
          });
          return (type && type.label) || '--';
        },
      },
      {
        title: '属性类型',
        dataIndex: 'type',
        key: 'type',
        render: (value, record) => {
          const obj = {
            name: record.name,
          };
          const baseObj = _.find(baseData, obj);
          return (baseObj && '基础属性') || '扩展属性';
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        key: 'option',
        render: (_value, record: any) => {
          const obj = {
            name: record.name,
          };
          const baseObj = _.find(baseData, obj);
          let delBtn, detailBtn;
          if (baseObj) {
            delBtn = null;
            detailBtn = (
              <Button key={'view'} type="link" onClick={() => onEditField(record)}>
                编辑
              </Button>
            );
          } else {
            detailBtn = (
              <Button key={'edit'} type="link" onClick={() => onEditField(record)}>
                编辑
              </Button>
            );
            delBtn = (
              <Button key={'del'} type="link" onClick={() => onDeleteField(record)}>
                删除
              </Button>
            );
          }
          return (
            <div>
              {detailBtn}
              {delBtn}
            </div>
          );
        },
      },
    ];
    return (
      <>
        <ProTable
          headerTitle={header}
          rowKey="ui_id"
          actionRef={tableRef}
          columns={cols}
          dataSource={dataSource}
          search={false}
          options={false}
          toolBarRender={() => [
            <Popover placement="bottom" title={text} content={content} trigger="click">
              <Button style={{ padding: '5px 8px' }}>
                <img
                  src="/uc/images/shaixuan.png"
                  style={{ width: 15, height: 15, marginTop: -2 }}
                />
              </Button>
            </Popover>,
            <Input.Search
              placeholder="请输字段的属性名称、全局名称"
              onSearch={onSerchValue}
              allowClear
              style={{ width: '300px' }}
            />,
            <Button type="primary" onClick={onAddField}>
              <PlusOutlined />
              新增属性
            </Button>,
            <Button type="primary" onClick={showMappingPopup}>
              <LinkOutlined />
              映射
            </Button>,
          ]}
        />
      </>
    );
  };
  const onCloseFilter = () => {
    setFilterVisible(false);
  };
  const onFilter = () => {};
  const onFilterFieldType = (value) => {
    setFilterFieldType(value);
  };
  const renderFilter = () => {
    const formItemLayout1 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Drawer title="筛选" width={400} open={filterVisible} onClose={onCloseFilter}>
        <Form form={formFilter} onFinish={onFilter}>
          <Row>
            <Col span="24">
              <FormItem name="type" label="字段类型" {...formItemLayout1} initialValue={'all'}>
                <Select
                  options={[
                    {
                      label: '所有',
                      value: 'all',
                    },
                    {
                      label: '字符串',
                      value: 'STRING',
                    },
                    {
                      label: '布尔型',
                      value: 'BOOLEAN',
                    },
                    {
                      label: '数字',
                      value: 'NUMBER',
                    },
                    {
                      label: '对象',
                      value: 'OBJECT',
                    },
                  ]}
                  onChange={onFilterFieldType}
                />
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem
                name="description"
                label="字段属性"
                {...formItemLayout1}
                initialValue={'all'}
              >
                <Radio.Group
                  options={[
                    {
                      label: '所有',
                      value: 'all',
                    },
                    {
                      label: '基本属性',
                      value: 'base',
                    },
                    {
                      label: '自定义属性',
                      value: 'custom',
                    },
                  ]}
                  value={range}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Drawer>
    );
  };
  const render = () => {
    return (
      <PageContainer title={false}>
        {renderFilter()}
        {renderFields()}
        <FieldForm
          open={modalOpen}
          data={fieldData}
          fieldList={fieldList}
          baseData={baseData}
          onSubmit={onSubmitField}
          onCancel={() => {
            setModalOpen(false);
          }}
        />
        <div className="footerContainer">
          <Button type="ghost" className="ml-10" onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" className="ml-10" onClick={onSave}>
            保存
          </Button>
        </div>
        {isVisiblePopup ? (
          <ModalMappingListComponent
            id={query?.id}
            type={query?.type}
            name={query?.name}
            ref={ChildRefDetails}
            logoType={query?.logoType}
            closePopup={closePopup}
            updateProfileData={updateProfileData}
          />
        ) : null}
      </PageContainer>
    );
  };
  return render();
};

export default ProfileConfigDetail;
