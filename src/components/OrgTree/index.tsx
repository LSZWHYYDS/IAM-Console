import React, { useEffect, useState } from 'react';
import { Tree, Input, message } from 'antd';
import type { TreeProps } from 'antd';
import type { OrgType } from '@/pages/UserCenter/data';
import _, { xor } from 'lodash';
import OrgOpt from './orgOpt';
import { generateList, showSuccessMessage } from '@/utils/common.utils';
import styles from './style.less';
import { connect } from 'umi';
import { editOrg } from '@/pages/UserCenter/service';
import { LockOutlined } from '@ant-design/icons';
// import { getTreeTableData } from './servers'
const { Search } = Input;

export interface OrgTreeProps extends Omit<TreeProps, 'prefixCls' | 'showLine' | 'direction'> {
  orgs: any[];
  handleOnCheck?: (beforeKeys: any[], afterKeys: any[], newKey: any) => void;
  handleOnSelect?: (keys: any) => void;
  afterEdit?: () => void;
  isShow: boolean;
  logTree: boolean;
  start?: number;
  end?: string | number;
  principals?: string;
  modifyIDs?: (value: any) => void;
  modifyFatherData?: (value: any) => void;
}

interface treeNodeType {
  title: string;
  key: string;
  parent?: string;
  children?: treeNodeType[];
  entitled?: boolean;
  disableCheckbox?: boolean;
  readonly: boolean;
}

const OrgTree: React.FC<any> = (props) => {
  const { orgs, handleOnCheck, handleOnSelect, afterEdit, ...rest } = props;
  const [orgTree, setOrgTree] = useState<treeNodeType[]>([]);
  const [flatOrgTree, setFlatOrgTree] = useState<treeNodeType[]>([]);
  const [orgKeyword, setOrgKeyword] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['_root']);
  const [defaultCheckedKeys, setCheckedKeys] = useState<any[]>([]);
  const [parentRefId, setParentRefId] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [treeNodeSelect, setTreeNodeSelect] = useState<any>();

  const getParentId = (orgId: string) => {
    const obj = _.find(flatOrgTree, {
      key: orgId,
    });
    setTreeNodeSelect(obj);
    setParentRefId((obj && obj.parent) || '');
  };
  const onSelect = (selectedKeysList: any, e?: any) => {
    if (selectedKeysList.length) {
      props?.dispatch({
        type: 'OrgTree/modifySelectTreeValue',
        payload: e?.node?.title?.props?.children[2],
      });
    } else {
      props?.dispatch({
        type: 'OrgTree/modifySelectTreeValue',
        payload: '',
      });
    }
    props?.dispatch({
      type: 'component_configs/modifUseSelectKey',
      payload: selectedKeysList,
    });
    // props?.modifyIDs?.(selectedKeysList);
    if (props.logTree) {
      // getTreeTableData(selectedKeysList[0], props.start, props.end, props.principals).then((rs) => {
      //   props?.modifyFatherData?.();
      // });
      props?.modifyFatherData?.(selectedKeysList);
      setSelectedKeys(selectedKeysList);
      return;
    }
    setSelectedKeys(selectedKeysList);
    getParentId(selectedKeysList[0]);
    if (handleOnSelect) {
      handleOnSelect(selectedKeysList);
    }
  };

  const onCheck = (checkedKeys: any) => {
    const oldCheckedKeys = defaultCheckedKeys;
    // 当 Tree 组件的 checkStrictly 为 true 时，设置 checkedKeys.checked, 其它时候设置和提交 checkedKeys
    const newCheckedKeys = checkedKeys.checked ? checkedKeys.checked : checkedKeys;
    setCheckedKeys(newCheckedKeys);
    if (handleOnCheck) {
      // 勾选的触发提交三个值：旧的勾选 keys 数组， 新的勾选keys数组 和 新旧两个keys的补集，由引用方视情况使用
      handleOnCheck(oldCheckedKeys, newCheckedKeys, xor(newCheckedKeys, oldCheckedKeys));
    }
  };

  const onExpand = (keys: any) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  const generateTreeNode = async (orgsItems: OrgType[], parent?: string) => {
    const trees: treeNodeType[] = [];
    orgsItems.map(async (org: OrgType) => {
      let tree: treeNodeType = {
        title: org.name,
        key: org.id,
        entitled: org.entitled,
        readonly: org.readonly,
      };
      if (org.children) {
        const children = await generateTreeNode(org.children, org.id);
        tree = { ...tree, children };
      }
      if (parent) {
        tree = { ...tree, parent };
      }
      trees.push(tree);
    });
    return trees;
  };

  const generateExpandedKeys = async (key: string) => {
    const keys = expandedKeys;
    for (let i = 1; i < flatOrgTree.length; i += 1) {
      const node = flatOrgTree[i];
      if (node.key === key) {
        if (keys.indexOf(node.key) < 0) {
          keys.push(node.key);
        }
        if (node.parent) {
          generateExpandedKeys(node.parent);
        }
      }
    }
    return keys;
  };

  const onOrgSearch = async (value: string) => {
    setExpandedKeys(['_root']);
    setOrgKeyword(value);
    if (value && orgs && orgs.length > 0) {
      setTimeout(() => {
        flatOrgTree
          .map(async (item: treeNodeType) => {
            if (item.title.indexOf(value) > -1) {
              const finalKeys = await generateExpandedKeys(item.key);
              setExpandedKeys(finalKeys);
              setAutoExpandParent(true);
            }
          })
          .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
      }, 100);
    }
  };

  const generateDefaultCheckedKeys = (values: treeNodeType[]) => {
    const newValues: any = [];
    for (let i = 0; i < values.length; i += 1) {
      const oItem = values[i];
      if (oItem.entitled) {
        newValues.push(oItem.key);
      }
    }
    return newValues;
  };

  const handleGenerateOrgTree = async () => {
    const treeNodes = await generateTreeNode(orgs, '_root');
    const flatTreeNodes = generateList(treeNodes, []);
    const defaultCKeys = generateDefaultCheckedKeys(flatTreeNodes);
    const rootNodes: any = [
      {
        title: '组织架构',
        key: '_root',
        children: treeNodes,
        disableCheckbox: true,
      },
    ];
    setOrgTree(rootNodes);
    setFlatOrgTree(flatTreeNodes);
    setCheckedKeys(defaultCKeys);
    setExpandedKeys(['_root']);
    setAutoExpandParent(true);
  };

  const canDraggable = (node) => {
    const flatNode = _.find(flatOrgTree, {
      key: node.key,
    }) || {
      readonly: true,
    };
    const canDrag = node.key !== '-2' && node.key !== '_root' && !flatNode.readonly;
    return canDrag;
  };
  // 处理搜索时树形数据高亮
  const loop: any = (data: treeNodeType[]) =>
    data.map((item: treeNodeType) => {
      const index = item.title.indexOf(orgKeyword);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + orgKeyword.length);
      const can = canDraggable({
        key: item.key,
      });
      const title: any =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={styles.highlighted}>{orgKeyword}</span>
            {afterStr}
            {(!can && <LockOutlined style={{ fontSize: 10 }} />) || null}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {
          title,
          key: item.key,
          children: loop(item.children),
          disableCheckbox: item.disableCheckbox,
        };
      }

      return {
        title,
        key: item.key,
        disableCheckbox: item.disableCheckbox,
      };
    });

  useEffect(() => {
    handleGenerateOrgTree();
  }, [orgs]);
  const afterDelete = (orgId: string) => {
    onSelect([orgId]);
    setExpandedKeys([orgId]);
  };
  const onSaveParent = async (nodeKey, value) => {
    const newObj = { ...value };
    delete newObj.parent;
    const result = await editOrg(nodeKey, { ...newObj, parent_id: value.parent });
    if (result.error === '0') {
      showSuccessMessage();
    }
  };
  const onDropStart = (info) => {
    console.log(info);
    const can = canDraggable(info.node);
    if (!can) {
      message.error('此组织机构不能移动。');
      return false;
    }
  };
  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const can = canDraggable(info.node);
    if (!can) {
      message.error('此组织机构不能移动。');
      return;
    }
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loopOnDrop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loopOnDrop(data[i].children, key, callback);
        }
      }
    };
    const data = [...orgTree];

    // Find dragObject
    let dragObj: any;
    loopOnDrop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!info.dropToGap) {
      // Drop on the content
      loopOnDrop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      // Has children
      info.node.props.expanded &&
      // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loopOnDrop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar = [];
      let i;
      loopOnDrop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setOrgTree(data);
    const dragNode =
      _.find(flatOrgTree, {
        key: dragKey,
      }) || {};
    const dropNode = _.find(flatOrgTree, {
      key: dropKey,
    });
    console.log(dragNode, dropNode);
    onSaveParent(dragNode.key, { name: dragNode.title, parent: dropNode?.key });
  };
  const onDragEnter = (info) => {
    console.log('onDragEnter', info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
    return false;
  };
  return (
    <>
      {orgTree ? (
        <>
          {props.isShow ? (
            <OrgOpt
              orgId={(selectedKeys.length && selectedKeys[0]) || '_root'}
              parentRefId={parentRefId}
              userTotal={props.userTotal}
              treeNodeSelect={treeNodeSelect}
              flatOrgTree={flatOrgTree}
              afterSave={afterEdit}
              afterDelete={afterDelete}
              handleGenerateOrgTree={handleGenerateOrgTree}
            />
          ) : (
            ''
          )}
          {props.isShow ? (
            <Search
              style={{ marginBottom: 8, marginTop: 10, marginLeft: 8 }}
              placeholder="输入组织架构名称搜索"
              onSearch={onOrgSearch}
            />
          ) : (
            ''
          )}
          <Tree
            className="draggable-tree"
            showIcon
            draggable={{
              icon: false,
              nodeDraggable: canDraggable,
            }}
            checkable
            showLine={{ showLeafIcon: false }}
            defaultExpandedKeys={['_root']}
            autoExpandParent={autoExpandParent}
            onSelect={onSelect}
            onCheck={onCheck}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkedKeys={defaultCheckedKeys}
            defaultCheckedKeys={defaultCheckedKeys}
            selectedKeys={selectedKeys}
            treeData={loop(orgTree)}
            onDragEnter={onDragEnter}
            onDropStart={onDropStart}
            onDrop={onDrop}
            {...rest}
          />
        </>
      ) : null}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    useSelectKey: state.component_configs.useSelectKey,
  };
};
export default connect(mapStateToProps)(OrgTree);
