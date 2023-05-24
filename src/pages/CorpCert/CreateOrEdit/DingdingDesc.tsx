import { Button, Card, Col, Row, Space, Tooltip, Image } from 'antd';
import React from 'react';

export type ItemProps = {
  certType?: string;
  height?: number;
  onTypeChange?: (type: string) => void;
};

const DingdingDesc: React.FC<ItemProps> = (props: any) => {
  const { certType, height, onTypeChange } = props;
  const render = () => {
    return (
      <Card
        className={'cert-type-card' + (certType === 'DINGDING' ? 'high-light' : '')}
        style={{ height: height || 240 }}
        bordered={!!certType}
        size={(height && 'small') || 'default'}
        onClick={() => onTypeChange && onTypeChange('DINGDING')}
      >
        <Row>
          <Col>
            <Tooltip title="钉钉">
              <Button type="link" style={{ height: '100%', paddingLeft: 'unset' }}>
                <Space>
                  <Image
                    preview={false}
                    rootClassName={'cert-type-box'}
                    src={require('@/../public/images/dingding_linker.png')}
                  />
                  <span>钉钉</span>
                </Space>
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ fontSize: 12, color: '#212639' }}>
              阿里巴巴出品，专为全球企业组织打造的智能移动办公平台，含PC版，IPad和手机版。远程视频会议，消息已读未读，DING消息任务管理，让沟通更高效；移动办公考勤，签到，审批，钉闪会，钉钉文档，钉钉教育解决方案，让工作学习更简单！
            </div>
          </Col>
        </Row>
      </Card>
    );
  };
  return render();
};
export default DingdingDesc;
