/*jshint esversion: 6 */
import React, { Component, Fragment } from 'react';
import { Upload, Form, Button, Card, Input, Col, Row, message, Space, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { filterDangerousChars, showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined } from '@ant-design/icons';
import tagAPI from '../tagAPI';
// import validator from '../../common/validator';
import TagUserList from './TagUserList';
import ImportFile from './ImportFile';
const FormItem = Form.Item;

class EditTag extends Component {
  constructor(...args) {
    super(...args);
    const { query = {} } = this.props.location;
    const { name } = query;
    this.isAdd = !name;
    this.state = {
      data: {},
      file: null,
      allValues: {},
      tagName: name,
      importVisible: false,
    };
    this.import = query.import;
    this.requiredFields = ['name'];
    this.formRef = React.createRef();
  }

  componentDidMount() {
    filterDangerousChars();
    this.getTagInfo();
  }
  getTagInfo = () => {
    const { tagName } = this.state;
    if (tagName) {
      tagAPI.getTag(tagName).then((response) => {
        if (response) {
          const tagInfo = response.data;
          this.setState({
            data: tagInfo,
            allValues: tagInfo,
          });
          this.formRef.current.setFieldsValue(tagInfo);
        }
      });
    }
  };
  onGotoList = () => {
    this.props.history.push({
      pathname: '/users/userTag',
      state: {
        attrs: [],
      },
    });
  };
  onEditTag = (tagName, values, file) => {
    tagAPI.editTag(tagName, values, file).then(
      () => {
        showSuccessMessage();
        if (file) {
          this.setState({
            file: null,
          });
          this.onGotoDetail(values);
        } else {
          this.onGotoList();
        }
      },
      (error) => {
        showErrorMessage(error);
      },
    );
  };
  onGotoDetail = (values) => {
    this.props.history.push('/users/userTag/edit?name=' + values.name);
    this.setState(
      {
        tagName: values.name,
      },
      () => {
        this.getTagInfo();
        this.refTagUserList.refreshTable();
      },
    );
  };
  onSave = (values) => {
    const { tagName, file } = this.state;
    if (tagName) {
      this.onEditTag(tagName, values, file);
    } else {
      tagAPI.addTag({ ...values, type: 'STATIC' }).then(
        () => {
          if (file) {
            this.onEditTag(values.name, values, file);
            return;
          }
          showSuccessMessage();
          this.onGotoDetail(values);
        },
        (error) => {
          showErrorMessage(error);
        },
      );
    }
  };
  onSubmit = (values) => {
    this.onSave(values);
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
    this.setState(
      {
        file,
      },
      () => {
        const values = this.formRef.current.getFieldsValue();
        this.onSave(values);
      },
    );
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
  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const { allValues, tagName, importVisible } = this.state;
    return (
      <PageContainer title={false}>
        <Card>
          {allValues && (
            <ImportFile
              // isAdd={this.isAdd}
              visible={importVisible}
              allValues={allValues}
              onPostFile={this.onPostFile}
              onClose={this.onCloseImportFile}
            />
          )}
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
                <TagUserList
                  name={tagName}
                  selUserTitle={
                    <Space>
                      选择用户<a onClick={this.onShowImportFile}>用户数太多？试试批量导入功能</a>
                    </Space>
                  }
                  onRef={this.onRefTagUserList}
                />
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
                    <Button type="primary" onClick={this.onSubmit}>
                      {(tagName && '保存') || '下一步'}
                    </Button>
                    {!tagName && (
                      <a onClick={this.onShowImportFileNewTag}>用户数太多？试试批量导入功能</a>
                    )}
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
