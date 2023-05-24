import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
const { Title, Paragraph } = Typography;
export type ItemProps = {
  title: string;
  desc: string;
  typeCode: string;
  certType?: string;
  imgName?: string;
  height?: number;
  onTypeChange?: (type: string) => void;
};

const OneTypeDesc: React.FC<ItemProps> = (props: any) => {
  const { title, desc, typeCode, imgName, onTypeChange } = props;
  const render = () => {
    return (
      <Card
        style={{
          backgroundColor: 'rgb(247, 248, 250)',
          borderRadius: 10,
        }}
        hoverable
        onClick={() => onTypeChange && onTypeChange(typeCode)}
      >
        <Row align="middle">
          <Col xxl={7} xs={24} sm={24} md={24} lg={24}>
            {imgName == 'cas.png' ? (
              <div
                style={{
                  background: '#fff',
                  textAlign: 'center',
                  marginRight: 5,
                  borderRadius: 5,
                }}
              >
                <img
                  style={{ width: 60 }}
                  className={'sync-type-box'}
                  src={require('@/../public/images/linker/' +
                    (imgName || typeCode.toLowerCase() + '.svg'))}
                />
              </div>
            ) : (
              <img
                className={'sync-type-box'}
                src={require('@/../public/images/linker/' +
                  (imgName || typeCode.toLowerCase() + '.svg'))}
              />
            )}
          </Col>
          <Col xxl={17} xs={24} sm={24} md={24} lg={24}>
            <Title
              level={4}
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {title}
            </Title>

            <Paragraph
              style={{
                textAlign: 'justify',
                paddingLeft: '5px',
                color: 'rgba(0, 0, 0, .85)',
              }}
            >
              {desc}
            </Paragraph>
          </Col>
        </Row>
      </Card>
    );
  };
  return render();
};
export default OneTypeDesc;
