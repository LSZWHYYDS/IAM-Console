import React, { useState, useEffect } from 'react';
import { Button, Row, Col, message, Modal } from 'antd';
import {
  UsergroupAddOutlined,
  UserAddOutlined,
  EditOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import OrgDetail from './orgDetail';
import { showSuccessMessage } from '@/utils/common.utils';
import { deleteOrg } from '@/pages/UserCenter/service';

export interface OrgOptProps {
  orgId: string;
  parentRefId: string;
  treeNodeSelect: any;
  flatOrgTree: any;
  userTotal: number;
  afterSave: () => void;
  afterDelete: (orgId: string) => void;
  handleGenerateOrgTree?: any;
}

const OrgOpt: React.FC<OrgOptProps> = (props) => {
  const { orgId, parentRefId, treeNodeSelect, flatOrgTree, afterSave, afterDelete } = props;
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [curParentRefId, setCurParentRefId] = useState('');
  const [typeModel, setTypeModel] = useState('');

  const onAdd = () => {
    setCurrentId('');
    setCurParentRefId(parentRefId);
    setVisible(true);
    setTypeModel('add');
  };
  const onEdit = () => {
    setCurrentId(orgId);
    setCurParentRefId(parentRefId);
    setVisible(true);
    setTypeModel('edit');
  };
  const onAddSub = () => {
    setCurrentId('');
    setCurParentRefId(orgId);
    setVisible(true);
    setTypeModel('addSon');
  };
  const onDelete = async () => {
    if (props.userTotal || treeNodeSelect?.children?.length) {
      message.error('不能删除用户组,因为该用户组存在子组或者用户');
      return;
    }
    if (treeNodeSelect.readonly) {
      message.error('当前用户组为同步的，不能删除。');
      return;
    }
    Modal.confirm({
      title: '确定要删除此用户组吗？',
      onOk: async () => {
        setTypeModel('delete');
        const result = await deleteOrg(orgId);
        if (result.error === '0') {
          showSuccessMessage();
          afterSave();
          afterDelete(parentRefId);
        }
      },
    });
  };
  const onCloseDlg = () => {
    setVisible(false);
  };
  useEffect(() => {
    setCurrentId(orgId);
    setCurParentRefId(parentRefId);
  }, [orgId, parentRefId]);
  const isRoot = currentId === '_root';
  const canEdit = orgId && orgId !== '-2';
  const disabled = treeNodeSelect?.readonly || !canEdit;
  if (!orgId) {
    return null;
  }

  const pObj = _.find(flatOrgTree, {
    key: parentRefId,
  });
  return (
    <>
      {visible && (
        <OrgDetail
          typeModel={typeModel}
          visible={visible}
          orgId={currentId}
          parentRefId={curParentRefId}
          flatOrgTree={props.flatOrgTree}
          onClose={onCloseDlg}
          afterSave={afterSave}
          handleGenerateOrgTree={props?.handleGenerateOrgTree}
        />
      )}
      <Row
      // style={{ position: 'fixed', top: 140, right: 50, backgroundColor: '#f5f5f5', zIndex: 1000 }}
      >
        <Col>
          <Button
            shape="circle"
            title="添加同级用户组"
            icon={<UsergroupAddOutlined />}
            disabled={isRoot || pObj?.readonly}
            onClick={() => onAdd()}
          />
        </Col>
        <Col>
          <Button
            shape="circle"
            title="添加下级用户组"
            icon={<UserAddOutlined />}
            disabled={disabled}
            onClick={() => onAddSub()}
          />
        </Col>

        <Col>
          <Button
            shape="circle"
            title="修改用户组"
            icon={<EditOutlined />}
            disabled={!canEdit || isRoot}
            onClick={onEdit}
          />
        </Col>
        <Col>
          <Button
            shape="circle"
            title="删除用户组"
            icon={<UsergroupDeleteOutlined />}
            disabled={disabled || !canEdit || isRoot}
            onClick={onDelete}
          />
        </Col>
      </Row>
    </>
  );
};

export default OrgOpt;
