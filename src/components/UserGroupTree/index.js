/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Tree, Row, Affix } from 'antd';
import _ from 'lodash';
import { showErrorMessage } from '@/utils/common.utils.ts';
import { getOrgTree } from '@/services/orgAPI';
import { getUserCount } from '@/services/userMgrAPI';

let selectChked = [];
class UserGroupTree extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      data: [],
      expandedKeys: [],
      expandedLevel: this.props.defaultExpandAll ? 100 : 2,
      selectedKey: null,
      selectedNode: null,
      keyword: '',
      autoExpandParent: true,
      checkedKeys: null,
      checkedParrentKeys: [],
      groupUserCount: {}, // 每个组的人数对象
    };
    this.parentKeysArray = [];
    this.allCheckedParent = {};
    this.trueCheckedParent = {};
  }
  onSetCheckedKeys = (checkedKeys) => {
    this.setState({
      checkedKeys,
    });
  };
  async componentDidMount() {
    this._isMounted = true;
    await this.getOrgTreeData();
    this.setState({
      checkedKeys: this.props.defaultCheckedKeys,
    });
    const { defaultCheckedKeys } = this.props;
    if (defaultCheckedKeys && defaultCheckedKeys.length > 0) {
      // const {defaultCheckedKeys} = this.props;
      defaultCheckedKeys.forEach((item) => {
        let parentKeyArr = [];
        parentKeyArr = this.getParentKeyAll(item);
        this.allCheckedParent[item] = parentKeyArr;
        this.trueCheckedParent[item] = parentKeyArr;
      });
    }
  }
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    // if (nextProps.defaultCheckedKeys) {
    //    this.setState({
    //       checkedKeys: nextProps.defaultCheckedKeys,
    //    });
    // }
  }
  getOneGroupUserCount = (group) => {
    const { expandedKeys, groupUserCount } = this.state;
    const id = group.id || group.key || group.props.eventKey;
    id &&
      !groupUserCount[id] &&
      getUserCount({ org_id: id }).then((res) => {
        groupUserCount[id] = {
          total: res.data.total,
          userIds: _.map(res.data.items, 'sub'),
        };
        this.setState({ groupUserCount });
      });
    const children = group.children || group.props.children;
    if (children && expandedKeys.includes(id)) {
      children.forEach((child) => {
        this.getOneGroupUserCount(child);
      });
    }
  };
  // nodes 节点数组
  getUserCount = (nodes) => {
    nodes.forEach((group) => {
      this.getOneGroupUserCount(group);
    });
  };
  formatterNodeData = (nodeData) => {
    if (nodeData.children.length) {
      // eslint-disable-next-line no-param-reassign
      nodeData.children = nodeData.children.map((node) => {
        this.formatterNodeData(node);
        return { ...node, title: node.name, key: node.id };
      });
    }
    return { ...nodeData, title: nodeData.name, key: nodeData.id };
  };
  getOrgTreeData = () => {
    getOrgTree().then(
      (response) => {
        let expandedList = [];
        const level = 1;
        const getExpandedKeys = (nodeData, level1) => {
          if (level1 < this.state.expandedLevel && nodeData.children) {
            expandedList.push(nodeData.id);
            nodeData.children.forEach((subNodeData) => {
              getExpandedKeys(subNodeData, level1 + 1);
            });
          }
        };
        const root = {
          id: '_root',
          key: '-1',
          name: '组织机构',
          children: [],
        };

        if (response.data && response.data && response.data.length > 0) {
          const childrenNodes = response.data.map((node) => {
            return this.formatterNodeData(node);
          });
          root.children = root.children.concat(childrenNodes);
          // root.children = response.data;
        }
        getExpandedKeys(root, level);
        if (this?.props?.defaultCheckedKeys) {
          expandedList = expandedList?.concat(this?.props?.defaultCheckedKeys);
        }
        if (this._isMounted) {
          this.setState(
            {
              data: [root],
              expandedKeys: expandedList,
            },
            () => {
              // 查询每个组的人数
              this.props.showUserCount && this.getUserCount([root], 2);
            },
          );
        }
        this.onClickTreeNode([this.props.defaultSelectedKey || '_root']);
        // 回显设置调用递归函数
        this.props?.defaultCheckedKeys?.forEach((forIs) => {
          this.filterCancle([root], forIs, true);
        });
        this.setState((preState) => {
          return {
            checkedKeys: [...new Set(preState?.checkedKeys?.concat(selectChked))],
            expandedKeys: [...new Set(preState?.expandedKeys?.concat(selectChked))],
          };
        });
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  getCheckedKeys = () => {
    return this.state.checkedKeys;
  };
  getCheckedParentKeys = () => {
    const { checkedKeys, checkedParrentKeys } = this.state;
    return {
      checkedKeys,
      checkedParrentKeys,
    };
  };
  onExpand = (expandedKeys, { expanded, node }) => {
    this.setState(
      {
        expandedKeys,
        autoExpandParent: false,
      },
      () => {
        expanded && this.getUserCount([node]);
      },
    );
  };
  getParentKeyAll = (key) => {
    const parentKey = this.getParentKey(key, this.state.data);
    if (parentKey && parentKey !== '_root') {
      this.parentKeysArray.push(parentKey);
      this.getParentKeyAll(parentKey, this.state.data);
    } else {
      this.parentKeysArray.push('_root');
    }
    return this.parentKeysArray;
  };
  // groupIds 数组
  getUserTotalByGroup = (groupIds) => {
    let userIds = [];
    const { groupUserCount } = this.state;
    if (groupIds.length === 1 && groupIds[0] === '-1') {
      const allCount = groupUserCount._root;
      return allCount.total || 0;
    }
    groupIds.forEach((groupId) => {
      userIds = _.uniq(
        _.concat(userIds, (groupUserCount[groupId] && groupUserCount[groupId].userIds) || []),
      );
    });
    return userIds.length;
  };

  modifyItemChildDisabled = (array, bol) => {
    if (Array.isArray(array)) {
      array.forEach((forIs, forIx) => {
        selectChked.push(forIs?.key);
        forIs.disableCheckbox = bol;
        if (forIs.children?.length) {
          this.modifyItemChildDisabled(forIs.children, bol);
        }
      });
    }
  };
  /**
   * @param { datas } 树结构的treeData
   * @param { arr }  选中的key数组
   */
  filterCancle = (datas, arr, bol) => {
    if (!datas) return;
    _.forEach(datas, (forIs) => {
      if (arr.includes(forIs['key'])) {
        if (forIs.children?.length) {
          this.modifyItemChildDisabled(forIs.children, bol);
        }
        return false;
      }
      if (Array.isArray(forIs.children)) {
        this.filterCancle(forIs.children, arr, bol);
      }
    });
  };

  onCheckNode = (checkedKeysPara, e) => {
    selectChked = [];
    this.parentKeysArray = [];
    let parentKeyArr = [];
    const checkedKeys = checkedKeysPara.checked || checkedKeysPara;
    if (!checkedKeys) {
      return;
    }
    parentKeyArr = this.getParentKeyAll(checkedKeys[checkedKeys.length - 1]);
    this.allCheckedParent[checkedKeys[checkedKeys.length - 1]] = parentKeyArr;
    this.trueCheckedParent = {};
    checkedKeys.forEach((item) => {
      this.trueCheckedParent[item] = this.allCheckedParent[item];
    });
    const nodeArr = [];
    for (const k in this.trueCheckedParent) {
      if (this.trueCheckedParent[k]) {
        nodeArr.push(...this.trueCheckedParent[k]);
      }
    }
    const checkedParrentKeys = {};
    const parentPos = [];
    const { checkedNodesPositions } = e;
    if (checkedNodesPositions && checkedNodesPositions.length) {
      const sorted = checkedNodesPositions; // _.sortBy(checkedNodesPositions, ["pos"]);
      sorted.forEach((item) => {
        const { pos } = item;
        // 检查对象中是否有此节点的上级，如果有，则不追加
        const parents = _.filter(parentPos, (item1) => {
          return _.startsWith(pos, item1);
        });
        if (!parents || !parents.length) {
          checkedParrentKeys[pos] = item.node.key;
          parentPos.push(pos);
        }
        // 检查对象中是否有此节点的下级，如果有删除，
        const children = _.filter(parentPos, (item1) => {
          return _.startsWith(item1, pos) && pos !== item1;
        });
        children.forEach((item1) => {
          delete checkedParrentKeys[item1];
        });
      });
    }
    const keys = _.values(checkedParrentKeys);
    this.setState({
      checkedKeys,
      checkedParrentKeys: keys,
    });

    // if (typeof this.props.onCheckNode === 'function') {
    //    this.props.onCheckNode(checkedKeys, keys);
    // }
    // sessionStorage.setItem('checkedKeys', checkedKeys.join());

    // todo 此功能根据选中的key 过滤出当前的item 在判断当前item是否有childrne属性 如有则遍历禁止
    if (e.checked) {
      let tempArr = [];
      this.filterCancle(this.state.data, [e?.node?.key], true);
      this.setState(
        (preState) => {
          tempArr = [...new Set(preState.checkedKeys.concat(selectChked))];
          return {
            checkedKeys: [...new Set(preState.checkedKeys.concat(selectChked))],
          };
        },
        () => {
          if (typeof this.props.onCheckNode === 'function') {
            this.props.onCheckNode(tempArr, keys);
          }
          sessionStorage.setItem('checkedKeys', tempArr.join());
        },
      );
    } else {
      this.filterCancle(this.state.data, [e?.node?.key], false);
      const filterArr = this.state.checkedKeys.filter((forIs) => {
        return !selectChked.includes(forIs);
      });
      this.setState({
        checkedKeys: filterArr.filter((item) => !(item == e?.node?.key)),
      });
      if (typeof this.props.onCheckNode === 'function') {
        this.props.onCheckNode(
          filterArr.filter((item) => !(item == e?.node?.key)),
          keys,
        );
      }
      sessionStorage.setItem(
        'checkedKeys',
        filterArr.filter((item) => !(item == e?.node?.key)).join(),
      );
    }
  };
  onClickTreeNode = (selectedKeys, e) => {
    if (this.props.linkerGroup) return;
    this.setState({
      selectedKey: selectedKeys[0],
      selectedNode: e ? e.node : null,
    });
    this.props.onClickTreeNode(selectedKeys[0], e);
  };
  onSearch = (keyword) => {
    const matches = [];
    const { data } = this.state;

    this.searchByOrgName(keyword, data, matches);
    const expandedKeys = matches.map((item) => {
      return this.getParentKey(item.id, data);
    });

    this.setState({
      expandedKeys,
      keyword,
      autoExpandParent: true,
    });
  };
  renderOrgName = (item) => {
    return item.id === '_null' ? '默认组' : item.name;
  };
  searchByOrgName = (value, tree, matches) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const name = this.renderOrgName(node);

      if (name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        matches.push(node);
      }

      if (node.children) {
        this.searchByOrgName(value, node.children, matches);
      }
    }

    return matches;
  };
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.id === key)) {
          parentKey = node.id;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  getCheckedTip = () => {
    if (!this.props.showCheckedTip) {
      return;
    }
    const userTotal = this.getUserTotalByGroup(this.state.checkedParrentKeys);
    return (
      <Row>
        <Affix offsetTop={50}>
          <div
            style={{
              height: '20px',
              textAlign: 'left',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          >
            已选择 <span style={{ color: '#308AF3' }}>{this.state.checkedParrentKeys.length}</span>{' '}
            {`个部门(含人员${userTotal}位)`}
            {this.state.checkedParrentKeys.length > 300 && ',部门超出限制(300个)'}
          </div>
        </Affix>
      </Row>
    );
  };
  titleRender = (nodeData) => {
    const { keyword, groupUserCount } = this.state;
    const { showUserCount } = this.props;
    const obj = groupUserCount[nodeData.id];
    const num = obj && obj.total;
    const count = (showUserCount && (num || num === 0) && `(${num})`) || '';
    const name = this.renderOrgName(nodeData);
    const index = name.toLowerCase().indexOf(keyword.toLowerCase());
    const beforeStr = name.substr(0, index);
    const matchStr = name.substr(index, keyword.length);
    const afterStr = name.substr(index + keyword.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{matchStr}</span>
          {afterStr + count}
        </span>
      ) : (
        <span>{name + count}</span>
      );
    return title;
  };
  render() {
    const { showCheckedTip, maxHeight, setTreeData } = this.props;
    const { keyword, autoExpandParent, checkedKeys, data } = this.state;
    // 只有首页用户右侧树 才执行这一步
    if (setTreeData) {
      setTreeData(data);
    }
    const tree = (
      <Tree
        checkable={this.props.linkerGroup ? this.props.linkerGroup : false}
        expandedKeys={this.state.expandedKeys}
        selectedKeys={[this.props.selectedKey]}
        showLine
        showIcon
        defaultSelectedKeys={[this.props.defaultSelectedKey || '_root']}
        onSelect={this.onClickTreeNode}
        onExpand={this.onExpand}
        onCheck={this.onCheckNode}
        checkedKeys={checkedKeys}
        autoExpandParent={autoExpandParent}
        checkStrictly={this.props.checkStrictly ? this.props.checkStrictly : false}
        // todo
        // autoExpandParent={true}
        // checkStrictly={false}
        treeData={data}
        titleRender={this.titleRender}
      />
    );
    if (showCheckedTip) {
      return (
        <div>
          {this.getCheckedTip()}
          <Row style={{ overflow: 'auto', maxHeight: maxHeight || 'initial' }}>{tree}</Row>
        </div>
      );
    }
    return <div>{tree}</div>;
  }
}

export default UserGroupTree;
