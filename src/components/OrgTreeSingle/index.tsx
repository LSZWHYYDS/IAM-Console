import { Tree } from 'antd';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { getOrgsList } from '@/pages/UserCenter/service';

const OrgTreeSingle: React.FC<any> = (props: any, ref) => {
  const [orgTree, setOrgTree] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([props.checkedKeys]);
  const generateTreeNode = async (orgsItems: any[], parent?: string) => {
    const trees: any[] = [];
    const { onShowNode } = props;
    orgsItems.forEach(async (org: any) => {
      let tree: any = {
        title: org.name,
        key: org.id,
        entitled: org.entitled,
        readonly: org.readonly,
      };
      let isAdd = true;
      if (typeof onShowNode === 'function') {
        isAdd = onShowNode(tree);
      }
      if (isAdd) {
        if (org.children) {
          const children = await generateTreeNode(org.children, org.id);
          tree = { ...tree, children };
        }
        if (parent) {
          tree = { ...tree, parent };
        }
        trees.push(tree);
      }
    });
    return trees;
  };
  const handleGetOrgsList = async () => {
    await getOrgsList({ depth: 0, attrs: 'id,name,description,readonly' }).then(async (res) => {
      if (res.error === '0' && res.data && res.data.length > 0) {
        const treeNodes = await generateTreeNode(res.data);
        const rootNodes: any = [
          {
            title: '组织架构',
            key: '_root',
            children: treeNodes,
          },
        ];
        setOrgTree(rootNodes);
      }
    });
  };

  useEffect(() => {
    handleGetOrgsList();
  }, []);
  useEffect(() => {
    setCheckedKeys([props.checkedKeys]);
  }, [props.checkedKeys]);
  const onCheck = (_checkedKeys, e) => {
    let can = true;
    if (e.checked) {
      if (typeof props.onCanCheck === 'function') {
        can = props.onCanCheck(e.node.key);
      }
      if (can) {
        setCheckedKeys([e.node.key]);
        props.onCheck(e.node.key);
      }
    } else {
      setCheckedKeys([]);
      props.onCheck(null);
    }
  };
  useImperativeHandle(ref, () => ({
    setCheckGroupId: (key) => {
      setCheckedKeys([key]);
    },
  }));
  const render = () => {
    return (
      <div className="scrollable-div">
        <Tree
          rootStyle={{ background: '#f4f4f4' }}
          checkable
          treeData={orgTree}
          onCheck={onCheck}
          checkStrictly={true}
          defaultExpandedKeys={['_root']}
          checkedKeys={checkedKeys}
        />
      </div>
    );
  };
  return render();
};
export default forwardRef(OrgTreeSingle);
