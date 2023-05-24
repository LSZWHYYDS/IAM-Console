import React, { useState } from 'react';
import { Card, Row, Col, Image, Typography, Tooltip } from 'antd';

import styles from './index.less';
import { history } from 'umi';

const { Title, Paragraph } = Typography;
import { getAppInfo, requestApplicationDetails } from '../../servers';
import myMap from '../../../../../utils/pictureMap';
interface Iprops {
  key: number | string;
  mapIs: any;
  mapId: number;
  client_id: number | string;
  pageNumbers: string;
  pageCorate: string;
}
const Index: React.FC<Iprops> = (props) => {
  const [ellipsis] = useState(true);
  // const [content, setContent] = useState<any>();
  const { mapIs } = props;
  const handleAppDetails = () => {
    sessionStorage.setItem('pageNumber', props.pageNumbers);
    sessionStorage.setItem('pageCorate', props.pageCorate);
    requestApplicationDetails(props.client_id).then((rss) => {
      getAppInfo({ client_id: rss.client_id }).then((rs: any) => {
        if (rs?.link_client_id) {
          history.push({
            pathname: '/apps/TemplateConfig',
            query: {
              client_id: rs.client_id,
            },
          });
          return;
        } else {
          history.push({
            pathname: '/apps/applicMaket/applicDetails',
            query: {
              id: rs.client_id,
            },
          });
          return;
        }
      });
    });
  };
  const handleError = (event: any) => {
    event.target.src = '/uc/images/application.png';
  };
  return (
    <>
      <Card
        style={{ width: '100%', backgroundColor: '#F7F8FA', borderRadius: '10px', height: '100%' }}
        bodyStyle={{ paddingBottom: '10px', cursor: 'pointer' }}
        onClick={handleAppDetails}
        hoverable
      >
        <Row style={{ marginTop: '10px' }}>
          <Col xxl={7} xs={24} sm={24} md={24} lg={24}>
            <Image
              width={75}
              height={75}
              style={{ background: '#F7F8FA', borderRadius: '10px', marginRight: '10px' }}
              src={
                mapIs.logo_uri ? mapIs.logo_uri : `/uc/images/logo/${myMap.get(mapIs?.client_id)}`
              }
              preview={false}
              onError={handleError}
              className={styles.avatarBorder}
            />
          </Col>
          <Col xxl={17} xs={24} sm={24} md={24} lg={24}>
            <Title
              level={4}
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {mapIs.client_name}
            </Title>
            <Tooltip
              placement="topLeft"
              title={<div>{mapIs.description}</div>}
              overlayInnerStyle={{
                width: '100%',
                borderRadius: '3.5px',
                fontSize: '16px',
                background: '#272e3b',
                color: '#F4F4F5',
              }}
            >
              <Paragraph
                ellipsis={ellipsis ? { rows: 3 } : false}
                style={{ textAlign: 'justify', marginTop: '20px', paddingLeft: '5px' }}
              >
                {mapIs.description}
              </Paragraph>
            </Tooltip>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default Index;

// if (rs.link_client_id == 'K3Cloud') {
//    history.push({
//       pathname: '/apps/test',
//       query: {
//          client_id: rs.client_id,
//       },
//    });
//    return;
// }
