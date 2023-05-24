import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Collapse, Table, Select, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { t } from '@/utils/common.utils';
import BaseInfo from './BaseInfo';
import {
  getMessagesUsers,
  getMessagesSendingUsers,
  getMessagesInfo,
  getMessagesSendingInfo,
} from '../service';

const FormItem = Form.Item,
  Panel = Collapse.Panel,
  { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const NewsDetail: React.FC<any> = (props) => {
  const { query: parseHref } = props.location;
  const { id } = props.location.query;
  const [info, setInfo] = useState({});
  const [nType, setNType] = useState(null);
  const [messageData, setMessageData] = useState([]);

  const resultText = (text: string) => {
    const map = {
      SUCCESS: '发送成功',
      INVALID: '无效用户',
      FORBIDDEN: '禁止发送',
      FAILURE: '失败',
      SENDING: '发送中',
    };
    return map[text];
  };
  const newsType = (text: string) => {
    const map = {
      0: '文本',
      1: '链接',
      2: '图片',
      3: '语音',
      4: '文件',
      5: '卡片',
      100: '待办任务',
    };
    return map[text];
  };
  const noticeType = (text: string) => {
    const map = {
      0: '工作台通知',
      1: '待办',
    };
    return map[text];
  };
  const newsStatus = (text: string) => {
    const map = {
      0: '未处理',
      1: '处理中',
      2: '处理完毕',
      3: '发送失败',
    };
    return map[text];
  };

  const getMessagesInfoFunc = async (newsId: string) => {
    const res = await getMessagesInfo(newsId);
    const result = res.data;
    result.content = JSON.parse(result.content);
    const { content, media } = result;
    if (media && media.title) {
      media.mediaTitle = media.title;
    }
    const infoData = Object.assign({}, media, result, content);
    infoData.type = newsType(infoData.type);
    infoData.bizTypeName = noticeType(infoData.bizType);
    infoData.status = newsStatus(infoData.status);
    setInfo(infoData);
    setNType(result.type);
  };
  const getMessagesUsersFunc = (params: string | undefined) => {
    getMessagesUsers(id, params).then((res) => {
      setMessageData(res.data.items);
    });
  };
  const getMessagesSendingUsersFunc = (params: any) => {
    getMessagesSendingUsers(id, params).then((res) => {
      setMessageData(res.data.items);
    });
  };

  useEffect(() => {
    if (parseHref && parseHref.t === '1') {
      getMessagesInfoFunc(id);
      getMessagesUsersFunc(undefined);
    } else if (parseHref && parseHref.t === '2') {
      getMessagesSendingInfo(id).then((res) => {
        const data = res.data;
        data.content = JSON.parse(data.content);
        const { content, media } = data;
        if (media && media.title) {
          media.mediaTitle = media.title;
        }
        const infoData = Object.assign({}, media, data, content);
        infoData.type = newsType(infoData.type);
        infoData.bizTypeName = noticeType(infoData.bizType);
        infoData.status = newsStatus(infoData.status);
        setInfo(infoData);
        setNType(data.type);
      });
      getMessagesSendingUsersFunc(undefined);
    }
  }, []);
  const handleSelectChange = (value: string) => {
    if (parseHref && parseHref.t === '1') {
      getMessagesUsersFunc(value);
    } else if (parseHref && parseHref.t === '2') {
      getMessagesSendingUsersFunc(value);
    }
  };
  const onRenderResult = (text: string) => {
    const map = {
      0: t('news.sending'),
      1: t('news.success'),
      2: t('news.invalid'),
      3: t('news.forbidden'),
      4: t('news.fail'),
    };
    return map[text];
  };
  const initTable = () => {
    const cols = [
      {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '组织机构',
        dataIndex: 'orgNames',
        key: 'orgNames',
      },
      {
        title: '结果',
        dataIndex: 'result',
        key: 'result',
        render: onRenderResult,
      },
    ];
    return cols;
  };
  const render = () => {
    const resultList = ['SUCCESS', 'INVALID', 'FORBIDDEN', 'FAILURE'];
    if (parseHref && parseHref.t === '2') {
      resultList.push('SENDING');
    }
    return (
      <PageContainer title={false}>
        <Card>
          <Collapse defaultActiveKey={['base', 'pushDetails']} bordered={false}>
            <Panel header="基本信息" key="base">
              <BaseInfo info={info} nType={nType} />
            </Panel>
            <Panel header={t('news.pushDetails')} key="pushDetails">
              <Row>
                <Col span="12">
                  <Form>
                    <FormItem
                      name="result"
                      label={t('news.choose')}
                      {...formItemLayout}
                      initialValue={''}
                    >
                      <Select onChange={handleSelectChange}>
                        {resultList.map((item) => {
                          return (
                            <Option key={item} value={item}>
                              {resultText(item)}
                            </Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Form>
                </Col>
              </Row>
              <div className="news-table">
                <Table rowKey="id" columns={initTable()} dataSource={messageData} />
              </div>
            </Panel>
          </Collapse>
        </Card>
      </PageContainer>
    );
  };
  return render();
};

export default NewsDetail;
