/*jshint esversion: 6 */
import PagerTable from '@/components/PagerTable';
import SearchBox from '@/components/SearchBox';
import { dingAuth } from '@/pages/Account/service.ts';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import {
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  RightSquareOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Modal, Row, Space, Menu, Dropdown } from 'antd';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import tagAPI from '../tagAPI';
import DingdingGroup from './DingdingGroup';

class TagList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      attrs: [],
      clearSearchValue: false,
      delBtnEnable: false,
      showDelModal: false,
      deletingItem: null,
      isLoading: false,
      groupVisible: false,
      currentGroup: null,
    };
    this.searchParams = this.props.searchParams || {};
  }
  onRenderAttrName(text, record) {
    return (
      <Link
        to={{
          pathname: '/users/userTag/edit' + ((record.type === 'DYNAMIC' && 'Dynamic') || ''),
          search: `?name=` + record.name,
        }}
      >
        {text}
      </Link>
    );
  }
  onRenderAction(text, record) {
    return (
      <div>
        <Link
          to={{
            pathname: '/users/userTag/edit' + ((record.type === 'DYNAMIC' && 'Dynamic') || ''),
            search: `?name=` + record.name,
          }}
        >
          <Button type="link" title="编辑">
            编辑
          </Button>
        </Link>
        <Button type="link" title="删除" onClick={this.switchDelModal.bind(this, true, record)}>
          删除
        </Button>
      </div>
    );
  }
  switchDelModal(show, entry) {
    this.setState({
      showDelModal: show,
      deletingItem: entry,
    });
  }
  handleDel() {
    const { deletingItem } = this.state;
    this.switchDelModal(false);
    this.setState({
      isLoading: true,
    });
    tagAPI.deleteTag(deletingItem.name).then(
      () => {
        this.setState({
          isLoading: false,
        });
        showSuccessMessage();
        this.attrTable.refresh();
      },
      (error) => {
        this.setState({
          isLoading: false,
        });
        showErrorMessage(error);
      },
    );
  }
  initAttrTable() {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: this.onRenderAttrName.bind(this),
      },
      {
        title: '创建人',
        dataIndex: 'create_by',
        key: 'create_by',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
      },
      {
        title: '标签类型',
        dataIndex: 'type',
        key: 'type',
        render: (text) => {
          return (text === 'STATIC' && '静态标签') || '动态标签';
        },
      },
      {
        title: '标签用户数',
        dataIndex: 'user_counts',
        key: 'user_counts',
      },
      {
        title: '操作',
        dataIndex: 'name',
        key: 'action',
        render: this.onRenderAction.bind(this),
      },
    ];
  }

  searchChange = () => {
    if (this.state.clearSearchValue) {
      this.setState({ clearSearchValue: false });
    }
  };
  handleSearch = (searchKey) => {
    this.searchParams.q = searchKey;
    this.attrTable.refresh(this.searchParams);
  };
  handleShowNew = () => {
    this.props.history.push('/users/userTag/edit');
  };
  handleShowNewDynamic = () => {
    this.props.history.push('/users/userTag/editDynamic');
  };
  handleShowNewGroup = () => {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys) {
      showErrorMessage('请选中一个标签。');
      return;
    }
    this.setState({
      groupVisible: true,
      currentGroup: null,
    });
  };
  onCloseGroup = () => {
    this.setState({
      groupVisible: false,
    });
  };
  onSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys[0],
      selectedRows,
    });
  };
  handleTag = (keys) => {
    switch (keys.key) {
      case '0':
        this.handleShowNew();
        break;
      case '1':
        this.handleShowNewDynamic();
        break;
      case '2':
        this.handleShowNewGroup();
        break;
    }
  };

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const isStatic = selectedRows && selectedRows.length && selectedRows[0].type === 'STATIC';
    // const items = (
    //     <Menu
    //         onClick={this.handleTag.bind(this)}
    //         items={[
    //             {
    //                 label: (
    //                     <div>
    //                         <MenuUnfoldOutlined style={{ marginRight: '5px' }} />
    //                         创建静态标签
    //                     </div>
    //                 ),
    //                 key: '0',
    //             },
    //             {
    //                 label: (
    //                     <div>
    //                         <RightSquareOutlined style={{ marginRight: '5px' }} />
    //                         创建动态标签
    //                     </div>
    //                 ),
    //                 key: '1',
    //             },
    //             {
    //                 key: '2',
    //                 disabled: !isStatic,
    //                 label: (
    //                     <div>
    //                         <CheckSquareOutlined style={{ marginRight: '5px' }} />
    //                         创建群聊
    //                     </div>
    //                 ),
    //             },
    //         ]}
    //     />
    // );

    const items = [
      {
        label: (
          <div>
            <MenuUnfoldOutlined style={{ marginRight: '5px' }} />
            创建静态标签
          </div>
        ),
        key: '0',
      },
      {
        label: (
          <div>
            <RightSquareOutlined style={{ marginRight: '5px' }} />
            创建动态标签
          </div>
        ),
        key: '1',
      },
      {
        key: '2',
        disabled: !isStatic,
        label: (
          <div>
            <CheckSquareOutlined style={{ marginRight: '5px' }} />
            创建群聊
          </div>
        ),
      },
    ];
    return (
      <PageContainer title={false}>
        <Card>
          <div className="searchRow">
            <Row>
              <Col span={5}>
                <Dropdown menu={{ items, onClick: this.handleTag.bind(this) }} arrow>
                  <Button type="primary">
                    <div>
                      <EditOutlined />
                      编辑标签
                      <DownOutlined />
                    </div>
                  </Button>
                </Dropdown>
              </Col>
              <Col offset={12} span={6}>
                <div className="ant-search-input-wrapper">
                  <SearchBox
                    clearValue={this.state.clearSearchValue}
                    placeholder="请输入名称/描述"
                    defaultSearchKey={this.searchParams && this.searchParams.q}
                    onSearch={this.handleSearch}
                    onChange={this.searchChange}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {/* //todo 改为proTable */}
          <PagerTable
            rowKey="name"
            className="minHeight"
            api={tagAPI.getTagList}
            params={{}}
            columns={this.initAttrTable()}
            showSelect={true}
            selectType="radio"
            defaultSearchParams={this.searchParams}
            ref={(input) => {
              this.attrTable = input;
            }}
            onSelect={this.onSelect}
          />

          <Modal
            title="删除提示"
            closable={false}
            open={this.state.showDelModal}
            footer={[
              <Button key="cancel" size="large" onClick={this.switchDelModal.bind(this, false)}>
                取消
              </Button>,
              <Button key="del" size="large" type="primary" onClick={this.handleDel.bind(this)}>
                确定
              </Button>,
            ]}
          >
            <div style={{ lineHeight: '60px' }}>
              <p style={{ height: '60px', fontSize: '14px' }}>
                如果删除标签，相关的应用和应用角色授权将会被删除，是否继续？
              </p>
            </div>
          </Modal>
          <Modal
            title="群聊信息"
            closable={false}
            open={this.state.groupVisible}
            footer={null}
            width={600}
            destroyOnClose
          >
            <DingdingGroup tagId={selectedRowKeys} onClose={this.onCloseGroup} />
          </Modal>
        </Card>
      </PageContainer>
    );
  }
}

export default TagList;
