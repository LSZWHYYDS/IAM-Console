import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
const { Title, Paragraph } = Typography;
export type ItemProps = {
  title: string;
  desc: string;
  typeCode: string;
  certType?: string;
  height?: number;
  toDev?: boolean;
  onTypeChange?: (type: string) => void;
};

const OneTypeDesc: React.FC<ItemProps> = (props: any) => {
  const { title, desc, typeCode, onTypeChange } = props;
  const onTypeChangeFunc = () => {
    // if (toDev) {
    //    message.info('待开发，请稍后...');
    //    return;
    // }
    if (onTypeChange) {
      onTypeChange(typeCode);
    }
  };
  const render = () => {
    return (
      <Card
        style={{
          backgroundColor: 'rgb(247, 248, 250)',
          borderRadius: 10,
        }}
        hoverable
        onClick={onTypeChangeFunc}
      >
        <Row align="middle">
          <Col xxl={7} xs={24} sm={24} md={24} lg={24}>
            <img
              className={'sync-type-box'}
              src={require('@/../public/images/syncgene/' + typeCode.toLowerCase() + '.png')}
            />
          </Col>
          <Col xxl={17} xs={24} sm={24} md={24} lg={24}>
            <div style={{ marginTop: 5, marginLeft: 20 }}>
              <Title
                level={4}
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {title}
              </Title>
              <Paragraph
                style={{
                  textAlign: 'justify',
                  marginTop: '20px',
                  paddingLeft: '5px',
                  color: 'rgba(0, 0, 0, .85)',
                }}
              >
                {desc}
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };
  return render();
};
export default OneTypeDesc;
