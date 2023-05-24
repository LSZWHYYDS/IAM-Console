import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Form, Input, Modal, message } from 'antd';
import { isGroupName } from '@/utils/validator';
import { getOrgInfo, editOrg, addOrg } from '@/pages/UserCenter/service';
import { showSuccessMessage } from '@/utils/common.utils';
import OrgTreeSingle from '@/components/OrgTreeSingle';
import { DeliveredProcedureOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import _ from 'lodash';
import { convertToFlat } from '@/utils/common.utils';

const FormItem = Form.Item;
export interface OrgProps {
  visible: boolean;
  parentRefId: string;
  orgId: string;
  flatOrgTree: any;
  onClose: () => void;
  afterSave: () => void;
  useSelectKey?: any;
  editTree?: any;
  handleGenerateOrgTree?: any;
  useSelectValue: string;
}
type OrgInfo = {
  orgId?: string;
  name?: string;
  typeModel?: string; //add addSon
  description?: '';
  parentRefId: '';
  readonly?: boolean;
  [prop: string]: any;
};

const OrgDetail: React.FC<OrgProps> = (props) => {
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tempArrayRef = useRef<any>([]);
  // 存放选中的key数组
  const [selectKeyArray, setSelectKeyArray] = useState([props?.parentRefId]);
  const [data, setData] = useState<OrgInfo>({
    orgId: '',
    name: '',
    description: '',
    parentRefId: '',
    readonly: true,
  });
  const { visible, orgId, flatOrgTree, onClose, afterSave } = props;
  const org = _.find(flatOrgTree, {
    key: orgId,
  });
  const childrenOrgs = (org && convertToFlat(org.children)) || [];

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
  };
  const onGetOrgInfo = async (id: string) => {
    if (!id) {
      setData({});
      return;
    }
    const result = await getOrgInfo(id, {
      attrs: 'id,name,description,readonly,num_of_users,num_of_children, parentRefId',
    });
    if (result.error === '0') {
      setData(result.data);
      formRef.setFieldsValue(result.data);
    }
  };
  const onSave = async (value: any) => {
    if (selectKeyArray && selectKeyArray.length == 0) {
      message.warning('至少要添加一个上级组!');
      return;
    }
    const newObj = { ...value };
    delete newObj.parentRefId;
    const result =
      (orgId && (await editOrg(orgId, { ...newObj, parent_id: value.parentRefId }))) ||
      (await addOrg({ ...newObj, parent_id: selectKeyArray[0] }));
    if (result.error === '0') {
      showSuccessMessage();
      afterSave();
      onClose();
    }
  };
  // 树图点击确定后事件
  const handleOk = () => {
    if (selectKeyArray && selectKeyArray.length > 1) {
      message.warning('一次只能勾选一个部门!');
    } else if (selectKeyArray.length == 0) {
      message.warning('至少要勾选一个部门!');
    } else {
      formRef.validateFields().then(async (values) => {
        let orgIdMapping: any = [];
        orgIdMapping = props?.useSelectKey.join()
          ? props?.useSelectKey.join()
          : selectKeyArray.join('');

        delete values.parentRefId;
        delete values.adds;
        // filterCancle(props?.editTree, orgIdMapping.split());
        if (tempArrayRef?.current[0]?.readonly) {
          message.warning('同步的部门组不能进行修改!');
        } else {
          // const results = (await editOrg(orgIdMapping, { ...values, parent_id: selectKeyArray.join('') }));
          const results =
            (orgId &&
              (await editOrg(orgIdMapping, { ...values, parent_id: selectKeyArray.join('') }))) ||
            (await addOrg({ ...values, parent_id: selectKeyArray.join('') }));

          if (results?.error == '0') {
            props.afterSave();
            message.success('编辑成功!');
          }
        }
      });
      onClose();
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    onGetOrgInfo(orgId);
  }, [orgId, visible]);
  const { readonly } = data;

  // 将选择的key保存下来
  const onCheck = (checkedKeysPara) => {
    setSelectKeyArray([checkedKeysPara]);
  };
  const onCanCheck = (checkedKeysPara) => {
    //判断当前选中的是否为 用户组的下级 todo
    if (props.typeModel === 'edit') {
      const child = _.find(childrenOrgs, {
        key: checkedKeysPara,
      });
      if (child || checkedKeysPara === orgId) {
        const msg =
          (child && '不能选择当前节点的子节点：' + child.title + '。') ||
          '不能与当前节点【' + data.name + '】相同。';
        message.error(msg);
        return false;
      }
    }
    return true;
  };
  const getNameById = (key) => {
    const pObj = _.find(props.flatOrgTree, {
      key,
    });
    return pObj?.title;
  };
  const handleOpenTree = () => {
    if (formRef.getFieldValue('name').trim()) {
      setIsModalOpen(true);
    } else {
      message.warning('请先输入用户组名称!');
    }
  };
  const onShowNode = (node) => {
    return (
      !node.readonly &&
      !_.find(childrenOrgs, {
        key: node.key,
      }) &&
      orgId !== node.key &&
      node.key !== '-2'
    );
  };
  const key = selectKeyArray && selectKeyArray.length && selectKeyArray[0];
  const pName = key === '_root' ? '组织机构' : getNameById(key);
  const titles = {
    add: '添加同级用户组',
    addSon: '添加下级用户组',
    edit: '编辑用户组',
  };
  return (
    <>
      <Modal
        width={800}
        open={visible}
        title={(orgId && readonly && '查看用户组（同步用户组只读）') || titles[props?.typeModel]}
        footer={null}
        destroyOnClose
        onCancel={onClose}
      >
        <Form form={formRef} onFinish={onSave}>
          <Row>
            <Col span={24} style={{ display: 'none' }}>
              <FormItem
                label="parentRefId"
                name="parentRefId"
                {...formItemLayout}
                initialValue={(data && data.parentRefId) || ''}
              >
                <Input disabled={readonly} />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label="用户组名称"
                name="name"
                {...formItemLayout}
                rules={[{ required: true, message: '请输入用户名' }, { validator: isGroupName }]}
                initialValue={(data && data.name) || ''}
              >
                <Input maxLength={50} disabled={readonly} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                label="描述"
                name="description"
                {...formItemLayout}
                initialValue={(data && data.description) || ''}
              >
                <Input.TextArea maxLength={250} disabled={readonly} />
              </FormItem>
            </Col>
            {!readonly ? (
              <Col span={24}>
                <FormItem
                  label="上级组"
                  name="adds"
                  {...formItemLayout}
                  initialValue={(data && data.description) || ''}
                >
                  <div style={{ display: 'flex' }}>
                    {pName ? (
                      <span style={{ margin: '0 5px', lineHeight: '30px' }}>{pName}</span>
                    ) : (
                      ''
                    )}
                    <Button
                      type="primary"
                      onClick={() => handleOpenTree()}
                      icon={<DeliveredProcedureOutlined />}
                    >
                      上级组
                    </Button>
                  </div>
                </FormItem>
              </Col>
            ) : (
              ''
            )}
          </Row>
          <div style={{ textAlign: 'right' }}>
            <Button type="ghost" className="ml-10 fs-16" onClick={onClose}>
              取消
            </Button>
            {!readonly && (
              <Button type="primary" className="ml-10 fs-16" htmlType="submit">
                保存
              </Button>
            )}
          </div>
        </Form>
      </Modal>
      <Modal title="选择上级组" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <OrgTreeSingle
          checkedKeys={selectKeyArray[0]}
          onCanCheck={onCanCheck}
          onShowNode={onShowNode}
          onCheck={onCheck}
          onOk={handleOk}
        />
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    useSelectKey: state.component_configs.useSelectKey,
    editTree: state.component_configs.editTree,
    useSelectValue: state.OrgTree.selectTreeValue,
  };
};
export default connect(mapStateToProps)(OrgDetail);
