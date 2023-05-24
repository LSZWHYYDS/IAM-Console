/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import type { TreeProps } from 'antd';
import type { OrgType } from '@/pages/UserCenter/data';
import { generateList } from '@/utils/common.utils';
import styles from './style.less';
import { find } from 'lodash';

export interface OrgTreeProps extends Omit<TreeProps, 'prefixCls' | 'showLine' | 'direction'> {
  checkedKeys: string[];
  orgs: any[];
  handleOnCheck?: (newKey: any) => void;
  handleOnSelect?: (keys: any) => void;
  afterEdit?: () => void;
}

interface treeNodeType {
  title: string;
  value: string;
  parent?: string;
  children?: treeNodeType[];
  entitled?: boolean;
  disableCheckbox?: boolean;
}

const SelectOrgs: React.FC<OrgTreeProps> = (props) => {
  const { disabled, orgs, checkedKeys, handleOnCheck } = props;
  const [orgTree, setOrgTree] = useState<treeNodeType[]>([]);
  const [flatOrgTree, setFlatOrgTree] = useState<treeNodeType[]>([]);
  const [orgKeyword, setOrgKeyword] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['_root']);
  const [defaultCheckedKeys, setCheckedKeys] = useState<any[]>(checkedKeys || []);

  const onCheck = (newCheckedKeys: any) => {
    setCheckedKeys(newCheckedKeys);
    if (handleOnCheck) {
      const nodeWithNameList = newCheckedKeys.map((org: any) => {
        const orgObj = find(flatOrgTree, {
          value: org?.value,
        });
        return {
          org_id: org?.value,
          org_name: orgObj && orgObj?.title,
        };
      });
      handleOnCheck({ checkedKeys: newCheckedKeys, checkedNodeList: nodeWithNameList });
    }
  };

  const onExpand = (keys: any) => {
    setExpandedKeys(keys);
  };

  const generateTreeNode = async (orgsItems: OrgType[], parent?: string) => {
    const trees: treeNodeType[] = [];
    orgsItems.map(async (org: OrgType) => {
      let tree: treeNodeType = { title: org.name, value: org.id, entitled: org.entitled };
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

  const generateExpandedKeys = async (value: string) => {
    const keys = expandedKeys;
    for (let i = 1; i < flatOrgTree.length; i += 1) {
      const node = flatOrgTree[i];
      if (node.value === value) {
        if (keys.indexOf(node.value) < 0) {
          keys.push(node.value);
        }
        if (node.parent) {
          generateExpandedKeys(node.parent);
        }
      }
    }
    return keys;
  };

  const generateDefaultCheckedKeys = (values: treeNodeType[]) => {
    const newValues: any = [];
    for (let i = 0; i < values.length; i += 1) {
      const oItem = values[i];
      if (oItem.entitled) {
        newValues.push(oItem.value);
      }
    }
    return newValues;
  };

  const handleGenerateOrgTree = async () => {
    const treeNodes = await generateTreeNode(orgs, '_root');
    const flatTreeNodes = generateList(treeNodes, []);
    const defaultCKeys = generateDefaultCheckedKeys(flatTreeNodes);
    const rootNodes = [
      {
        title: '组织架构',
        value: '_root',
        children: treeNodes,
        disableCheckbox: true,
      },
    ];
    setOrgTree(rootNodes);
    setFlatOrgTree(flatTreeNodes);
    setExpandedKeys(['_root']);
  };

  // 处理搜索时树形数据高亮
  const loop: any = (data: treeNodeType[]) =>
    data.map((item: treeNodeType) => {
      const index = orgKeyword && item.title.indexOf(orgKeyword);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + orgKeyword.length);
      const title: any =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={styles.highlighted}>{orgKeyword}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {
          title,
          value: item.value,
          children: loop(item.children),
          disableCheckbox: item.disableCheckbox,
        };
      }

      return {
        title,
        value: item.value,
        disableCheckbox: item.disableCheckbox,
      };
    });
  useEffect(() => {
    handleGenerateOrgTree();
  }, [orgs]);
  useEffect(() => {
    setCheckedKeys(checkedKeys);
  }, [orgs, checkedKeys]);
  return (
    <>
      {orgTree ? (
        <>
          <TreeSelect
            multiple
            allowClear
            treeCheckable
            treeCheckStrictly
            disabled={disabled}
            defaultValue={defaultCheckedKeys}
            value={defaultCheckedKeys}
            treeDefaultExpandedKeys={['_root']}
            treeExpandedKeys={expandedKeys}
            treeData={loop(orgTree)}
            onChange={onCheck}
            onTreeExpand={onExpand}
            // {...rest}
          />
        </>
      ) : null}
    </>
  );
};

export default SelectOrgs;
