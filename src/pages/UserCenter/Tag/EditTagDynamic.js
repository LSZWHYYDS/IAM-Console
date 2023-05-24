/*jshint esversion: 6 */
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, message, Modal, Row, Space } from 'antd';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import tagAPI from '../tagAPI';
import IncsearchUser from '@/components/IncsearchUser';
// import UserGroupTree from '@/components/UserGroupTree';
import UserGroupTree from './UserTagTree';
import EditTagDynamicField from './EditTagDynamicField';
const FormItem = Form.Item;

class EditTag extends Component {
  constructor(...args) {
    super(...args);
    const { query = {} } = this.props.location;
    const { name } = query;
    this.isAdd = !name;
    this.state = {
      data: {},
      allValues: {},
      tagName: name,
      importVisible: false,
      orgs: [],
      black_list: [],
    };
    this.import = query.import;

    this.requiredFields = ['name'];
    this.formRef = React.createRef();
    this.fieldRef = React.createRef();
  }

  async componentDidMount() {
    await filterDangerousChars();
    await this.getTagInfo();
  }
  getTagInfo = () => {
    const { tagName } = this.state;
    if (tagName) {
      tagAPI.getTag(tagName).then((response) => {
        if (response) {
          const tagInfo = response.data;
          const { expression = {} } = tagInfo || {};
          this.setState({
            data: tagInfo,
            allValues: tagInfo,
            expression,
            black_list: (expression && expression.black_list.filter((item) => item)) || [],
          });
          this.formRef.current.setFieldsValue(tagInfo);
          const ids = (expression && _.map(expression.orgs || [], 'id')) || [];
          this.groupTree && this.groupTree.onSetCheckedKeys(ids);
          this.incsearchUser.setSelections(
            (expression && expression.black_list.filter((item) => item)) || [],
          );
        }
      });
    }
  };
  onGotoList = () => {
    this.props.history.push({
      pathname: '/users/userTag/',
      state: {
        attrs: [],
      },
    });
  };
  onEditTag = (tagName, values) => {
    tagAPI.editTagNoFile(tagName, values).then(
      () => {
        showSuccessMessage();
        this.onGotoList();
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  };
  onGotoDetail = (values) => {
    this.props.history.push('/users/userTag/editDynamic?name=' + values.name);
    this.setState(
      {
        tagName: values.name,
      },
      () => {
        this.getTagInfo();
      },
    );
  };
  onSubmit = (values) => {
    const { tagName, black_list } = this.state;
    const fields =
      (this.fieldRef && this.fieldRef.current && this.fieldRef.current.getFields()) || undefined;
    const orgObj = (this.groupTree && this.groupTree.getCheckedParentKeys()) || undefined;
    const fetSubId = (item) => black_list.includes(item?.username);
    const accordingLabelFilterObjectArr = this.incsearchUser?.state?.data?.filter?.((item) =>
      fetSubId(item),
    );
    const accordingLabelFilterSubId = accordingLabelFilterObjectArr?.map?.((is) => is?.sub);
    const expression = {
      fields,
      orgs:
        (orgObj &&
          orgObj.checkedKeys.map((id) => {
            return {
              id,
              child: true,
            };
          })) ||
        undefined,
      black_list: accordingLabelFilterSubId,
    };
    if (tagName) {
      this.onEditTag(tagName, { ...values, expression });
    } else {
      tagAPI.addTag({ ...values, type: 'DYNAMIC', expression }).then(
        () => {
          showSuccessMessage();
          this.onGotoDetail(values);
        },
        (error) => {
          showErrorMessage(error);
        },
      );
    }
  };
  onValuesChange = (changedValues, allValues) => {
    this.setState({
      allValues,
    });
  };
  onShowImportFile = () => {
    this.setState({
      importVisible: true,
    });
    if (this.refTagUserList) {
      this.refTagUserList.onCloseUserDlg();
    }
  };
  onCloseImportFile = () => {
    this.setState({
      importVisible: false,
    });
  };
  onPostFile = (file) => {
    this.setState({
      file,
    });
    this.onCloseImportFile();
  };
  onShowImportFileNewTag = () => {
    const { allValues } = this.state;
    if (!allValues.name) {
      message.error('请输入标签名称。');
      return;
    }
    this.setState({
      importVisible: true,
    });
  };
  onRefTagUserList = (ref) => {
    this.refTagUserList = ref;
  };
  onNewUserSelected = (value) => {
    this.setState({
      black_list: value,
    });
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const { allValues, tagName, importVisible, orgs } = this.state;
    const { expression } = allValues;
    const tagInfo = expression || {};
    return (
      <PageContainer title={false}>
        <Card>
          <Form
            className="formPadding"
            layout="horizontal"
            ref={this.formRef}
            onFinish={this.onSubmit}
            onValuesChange={this.onValuesChange}
          >
            <Card title="基本信息" className="mt-20">
              <div className="new-attr-item">
                <Row>
                  <Col span={23}>
                    <FormItem
                      label="标签名称"
                      {...formItemLayout}
                      name="name"
                      initialValue={this.state.data.name ? this.state.data.name : ''}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input type="text" disabled={!!this.state.data.name} />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={23}>
                    <FormItem
                      label="描述"
                      name="description"
                      {...formItemLayout}
                      initialValue={this.state.data.description ? this.state.data.description : ''}
                    >
                      <Input type="text" />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Card>
            {tagName && (
              <Card title="用户信息" className="mt-20">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <FormItem label="" name="org_ids" shouldUpdate>
                      <div
                        style={{
                          borderRight: '1px solid #F1F0EE',
                        }}
                      >
                        <UserGroupTree
                          defaultGroup
                          linkerGroup={true}
                          showCheckedTip={true}
                          showUserCount={true}
                          maxHeight={'390px'}
                          ref={(input) => {
                            this.groupTree = input;
                          }}
                          selectedKey={this.state.selectedKey}
                          defaultSelectedKey={
                            this.state.selectedKey || this.props.defaultSelectedKey
                          }
                          // onClickTreeNode={this.onClickTreeNode.bind(this)}
                          // onCheckNode={this.onCheckNode.bind(this)}
                          defaultCheckedKeys={
                            this.state.checkedGroups || this.props.defaultCheckedKeys
                          }
                          checkStrictly={this.props.checkStrictly}
                        />
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={18}>
                    <EditTagDynamicField dataList={tagInfo.fields || []} ref={this.fieldRef} />
                    <Row style={{ paddingTop: '10px' }}>
                      <Col span={24}>黑名单</Col>
                      <Col span={24}>
                        <IncsearchUser
                          optionKey="username"
                          labelInValue={false}
                          onChange={this.onNewUserSelected}
                          ref={(input) => {
                            this.incsearchUser = input;
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            )}
            <div className="footerContainer">
              <Space>
                <Link to={{ pathname: '/users/userTag' }}>
                  <Button type="ghost" className="ml-10">
                    取消
                  </Button>
                </Link>
                {!this.import && (
                  <Fragment>
                    <Button type="primary" htmlType="submit">
                      {(tagName && '保存') || '下一步'}
                    </Button>
                  </Fragment>
                )}
              </Space>
            </div>
          </Form>
        </Card>
      </PageContainer>
    );
  }
}

export default EditTag;
