import { Avatar, Card, Col, Row, Skeleton, Typography } from 'antd';
import myMap from '@/utils/pictureMap';
import styles from './index.less';
// import useControl from './control';
import { getAppInfo } from '../../server';
import { useRequest } from 'ahooks';

const { Meta } = Card;
const { Paragraph } = Typography;

type IndexProps = {
  client_id: string;
};

const Index = (props: IndexProps) => {
  // const { state } = useControl(props);
  const { data: content, loading } = useRequest(() => {
    return getAppInfo({
      client_id: props.client_id,
    });
  });

  const AvatarUser = () => {
    return (
      <>
        <Avatar
          size={150}
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
      </>
    );
  };
  const RightDescription = () => {
    return (
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
  };
  return (
    <>
      <Card style={{ width: '100%', marginTop: 16 }}>
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={<AvatarUser />}
            title={content?.client_name}
            description={<RightDescription />}
          />
        </Skeleton>
      </Card>
    </>
  );
};
export default Index;
