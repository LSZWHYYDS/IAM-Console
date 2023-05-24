import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Image, Typography, Space, Button, Spin, Checkbox } from 'antd';
import styles from './index.less';
import { history, useLocation } from 'umi';

const { Text, Paragraph, Link } = Typography;
const bodyStyle = { paddingBottom: '55px', cursor: 'pointer' };
import { requestApplicationDetails } from './servers';
import myMap from '@/utils/pictureMap';

const Index: React.FC = () => {
  const [content, setContent] = useState<any>();
  const [loading, setLoading] = useState(true);
  const location: any = useLocation();
  const handleAppConfigFunc = () => {
    if (location.query.id.replaceAll('"', '') == 'K3Cloud') {
      history.push({
        pathname: '/apps/cloundandsky',
        state: {
          items: JSON.stringify(content),
          link_id: JSON.stringify(location.query.id),
        },
      });
      return;
    }

    if (location.query.id.replaceAll('"', '') == 'NCC') {
      history.push({
        pathname: '/apps/applicMaket/applicConfig',
        state: {
          items: JSON.stringify(content),
          link_id: JSON.stringify(location.query.id),
        },
      });
    } else {
      history.push(
        `/apps/list/appEdit?id=${location.query.id.replaceAll(
          '"',
          '',
        )}&custom_class=${'undefined'}&marketIdent=${true}`,
      );
    }
  };
  const handleImg = (event: any) => {
    event.target.src = '/uc/images/application.png';
  };
  useEffect(() => {
    const IDparams = JSON.parse(location.query.id);
    requestApplicationDetails(IDparams).then((rs) => {
      setContent(rs);
      setLoading(false);
    });
  }, []);

  const renderAppClassBtn = (values: any) => {
    const renderArr: any = [];
    switch (values) {
      case ' ':
        renderArr.push('其他');
        break;
      case 'office':
        renderArr.push('协同办公');
        break;
      case 'finance':
        renderArr.push('营销管理');
        break;
      case 'produce':
        renderArr.push('项目管理');
        break;
      case 'manpower':
        renderArr.push('人力资源');
        break;
      case 'tools':
        renderArr.push('开发工具');
        break;
    }
    return renderArr;
  };

  /**
   * 渲染分类按钮
   */
  const renderBtn = content?.inner_category?.map((mapIs: string) => {
    return (
      <>
        <Button size="small" type={'primary'}>
          {renderAppClassBtn(mapIs)}
        </Button>
      </>
    );
  });
  /**
   * 渲染集成协议
   */
  // const integrationHttp = content?.support_protocol?.map((mapIs: string) => {
  //   return (
  //     <Radio value={true} key={mapIs} disabled>
  //       {mapIs}
  //     </Radio>
  //   );
  // });

  const integrationHttp = (
    <>
      <Checkbox.Group value={content?.support_protocol}>
        <Row>
          <Col>
            <Checkbox value={'SAML'} disabled>
              SAML
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox value={'OIDC'} disabled>
              OIDC
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox value={'OAUTH'} disabled>
              Oauth2.0
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox value={'CAS'} disabled>
              CAS
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Checkbox value={'APPSTORE'} disabled>
              非标协议
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    </>
  );

  return (
    <PageContainer>
      <Spin spinning={loading} style={{ backgroundColor: '#fff', opacity: 1 }}>
        <Card style={{ width: '100%' }} bodyStyle={bodyStyle}>
          <Row align="top" justify="center">
            <Col flex="auto" span={4}>
              <Space direction="vertical">
                <Image
                  width={140}
                  // src={content?.logo_uri}
                  src={
                    content?.logo_uri
                      ? content?.logo_uri
                      : `/uc/images/logo/${myMap.get(content?.client_id)}`
                  }
                  preview={false}
                  className={styles.imageStyle}
                  onError={handleImg}
                />
                <Text className={styles.appClass}>应用分类:</Text>
                <Space direction="horizontal" className={styles.fontSizeStyle} wrap={true}>
                  {renderBtn}
                </Space>
                <Text className={styles.develop}>开发者:</Text>
                <Text className={styles.fontSizeStyle}>{'数犀科技有限公司'}</Text>
                <Text className={styles.integration}>集成协议:</Text>
                {/* <Radio.Group defaultValue={0}> */}
                <Space direction="vertical" className={styles.fontSizeStyle} wrap={true}>
                  {integrationHttp}
                </Space>
                {/* </Radio.Group> */}
              </Space>
            </Col>
            <Col span={17}>
              <Row justify="space-between">
                <Col>
                  <Text
                    className={styles.textStyles}
                    style={{ fontSize: '28px', fontWeight: '500' }}
                  >
                    {content?.client_name}
                  </Text>
                </Col>
                <Col>
                  <Button type="primary" onClick={handleAppConfigFunc}>
                    添加应用
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <pre>{content?.description}</pre>
                  </Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text
                    className={`${styles.textStyles} ${styles.Appaddres}`}
                    style={{ fontWeight: '500' }}
                  >
                    应用地址
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link href={content?.client_uri} target="_blank">
                    {content?.client_uri}
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text
                    className={`${styles.textStyles} ${styles.AppPreview}`}
                    style={{ fontWeight: '500' }}
                  >
                    应用预览
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Image
                    width="100%"
                    // src={content?.preview_uri}
                    src={
                      content?.preview_uri
                        ? content?.preview_uri
                        : `/uc/images/Preview/${myMap.get(content?.client_id)}`
                    }
                    preview={false}
                    className={styles.imageStyleBg}
                    onError={handleImg}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default Index;
