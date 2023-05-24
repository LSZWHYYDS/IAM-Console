import { Tree } from 'antd';
import { menuList } from '@/../config/menuData';

interface PermTreeProp {
  permission_sets?: string[];
  readOnly: boolean;
  onCheck: (checkedKeyList: any, e: any) => void;
}

const PermSetTree: React.FC<PermTreeProp> = (props: any) => {
  const onCheck = (checkedKeyList: any, e: any) => {
    const checkedPermSets = e.checkedNodes
      .filter((node: any) => node.type === 'func')
      .map((node1: any) => node1.key);
    if (props.onCheck) {
      props.onCheck(checkedPermSets);
    }
  };

  const render = () => {
    return (
      <div className="scrollable-div">
        <Tree
          checkable
          disabled={props.readOnly}
          treeData={menuList}
          onCheck={onCheck}
          defaultCheckedKeys={props.permission_sets}
          defaultExpandedKeys={['/uc']}
        />
      </div>
    );
  };
  return render();
};

export default PermSetTree;
