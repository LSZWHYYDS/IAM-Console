import { getOrgsList } from '@/pages/UserCenter/service';
export const generateTreeNode = async (orgsItems: any[], parent?: string) => {
  const trees: any[] = [];
  orgsItems.map(async (org: any) => {
    let tree: any = {
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
export const handleGetOrgsList = async () => {
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
      // setOrgTree(rootNodes);
      return rootNodes;
    }
  });
};
