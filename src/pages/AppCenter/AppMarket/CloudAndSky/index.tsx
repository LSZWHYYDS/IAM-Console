// import React, { useState, useEffect } from 'react';
// import { Avatar, Card, Skeleton, Typography, Col, Row } from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';

// import styles from './index.less';
// import StepsOptions from './components/index';
// import { useLocation } from 'umi';
// import myMap from '../../../../utils/pictureMap';

// const { Meta } = Card;
// const { Paragraph } = Typography;

// const Index: React.FC = () => {
//    const location: any = useLocation();
//    const [loading] = useState(false);
//    const [content, setContent] = useState<any>();
//    // 保存link——uri 变量
//    const [link_Url, setLink_Url] = useState('');
//    useEffect(() => {
//       if (location.state) {
//          const IDparams = JSON.parse(location.state.items);
//          setContent(IDparams);
//          if (location.state.link_id) {
//             setLink_Url(JSON.parse(location.state.link_id));
//          }
//          sessionStorage.setItem('stateRefresh', JSON.stringify(IDparams));
//          sessionStorage.setItem('locationSstateLlink_id', location.state.link_id);
//       } else {
//          const IDparams = sessionStorage.getItem('stateRefresh');
//          setContent(JSON.parse(IDparams || '{}'));
//          if (sessionStorage.getItem('locationSstateLlink_id') || JSON.parse(IDparams || '{}').link_client_id) {
//             setLink_Url(JSON.parse(JSON.stringify(sessionStorage.getItem('locationSstateLlink_id'))) || JSON.parse(IDparams || '{}').link_client_id);
//          }
//       }
//    }, []);

//    const AvatarUser = (
//       <Avatar.Group size={150}>
//          <Avatar
//             src={
//                content?.logo_uri
//                   ? content?.logo_uri
//                   : content?.link_client_id
//                      ? `/uc/images/logo/${myMap.get(content?.link_client_id)}`
//                      : content?.client_id
//                         ? `/uc/images/logo/${myMap.get(content?.client_id)}`
//                         : '/uc/images/application.png'
//             }
//          />
//       </Avatar.Group>
//    );
//    const RightDescription = (
//       <>
//          <Row>
//             <Col className={styles.introducation} span={24}>
//                <span>简介</span>
//             </Col>
//             <Col className={styles.introducation}>
//                <Paragraph>{content?.description}</Paragraph>
//             </Col>
//          </Row>
//       </>
//    );
//    return (
//       <PageContainer className={styles.wrapper}>
//          <Card style={{ width: '100%', marginTop: 16 }}>
//             <Skeleton loading={loading} avatar active>
//                <Meta avatar={AvatarUser} title={content?.client_name} description={RightDescription} />
//             </Skeleton>
//          </Card>
//          {content?.client_name ? (
//             <StepsOptions
//                values={content?.client_name}
//                logo_uri={content?.logo_uri}
//                descript={content?.description}
//                client_id={content?.client_id}
//                link_Url={link_Url ? link_Url : content?.link_client_id}
//                enable_apply={content?.enable_apply}
//                contents={content}
//             ></StepsOptions>
//          ) : (
//             ''
//          )}
//       </PageContainer>
//    );
// };
// export default Index;
import React, { useState, useEffect } from 'react';
import { Avatar, Card, Skeleton, Typography, Col, Row } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import styles from './index.less';
import StepsOptions from './components/index';
import { useLocation } from 'umi';
import myMap from '../../../../utils/pictureMap';

const { Meta } = Card;
const { Paragraph } = Typography;

const Index: React.FC = () => {
  const location: any = useLocation();
  const [loading] = useState(false);
  const [content, setContent] = useState<any>();
  // 保存link——uri 变量
  const [link_Url, setLink_Url] = useState('');
  useEffect(() => {
    if (location?.state) {
      const IDparams = JSON.parse(location?.state?.items);
      setContent(IDparams);
      // 有link_id
      if (location.state.link_id) {
        setLink_Url(location.state.link_id);
        sessionStorage.setItem('locationSstateLlink_id', JSON.stringify(location.state.link_id));
      } else {
        // 没有link_id 取itmes对象中的
        setLink_Url(location.state.link_id);
        sessionStorage.setItem('locationSstateLlink_id', JSON.stringify(location.state.link_id));
      }
      sessionStorage.setItem('stateRefresh', JSON.stringify(IDparams));
    } else {
      const IDparams = JSON.parse(sessionStorage.getItem('stateRefresh') || '{}');
      setContent(IDparams);

      if (sessionStorage.getItem('locationSstateLlink_id') != 'undefined') {
        setLink_Url(JSON.parse(sessionStorage.getItem('locationSstateLlink_id') || '{}'));
      }
    }
  }, []);
  const AvatarUser = (
    <Avatar.Group size={150}>
      <Avatar
        src={
          content?.logo_uri
            ? content?.logo_uri
            : content?.link_client_id
            ? `/uc/images/logo/${myMap.get(content?.link_client_id)}`
            : content?.client_id
            ? `/uc/images/logo/${myMap.get(content?.client_id)}`
            : '/uc/images/application.png'
        }
      />
    </Avatar.Group>
  );
  const RightDescription = (
    <>
      <Row>
        <Col className={styles.introducation} span={24}>
          <span>简介</span>
        </Col>
        <Col className={styles.introducation}>
          <Paragraph>{content?.description}</Paragraph>
        </Col>
      </Row>
    </>
  );
  return (
    <PageContainer className={styles.wrapper}>
      <Card style={{ width: '100%', marginTop: 16 }}>
        <Skeleton loading={loading} avatar active>
          <Meta avatar={AvatarUser} title={content?.client_name} description={RightDescription} />
        </Skeleton>
      </Card>
      {content?.client_name ? (
        <StepsOptions
          values={content?.client_name}
          logo_uri={content?.logo_uri}
          descript={content?.description}
          client_id={content?.client_id}
          link_Url={link_Url ? link_Url : content?.link_client_id}
          enable_apply={content?.enable_apply}
          contents={content}
        ></StepsOptions>
      ) : (
        ''
      )}
    </PageContainer>
  );
};
export default Index;
