import { Button, Card, Space, Tooltip, Image } from 'antd';
import React from 'react';

export type ItemProps = {
  certType?: string;
  height?: number;
  onTypeChange?: (type: string) => void;
};

const WxDesc: React.FC<ItemProps> = (props: any) => {
  const { certType, height, onTypeChange } = props;
  const render = () => {
    return (
      <Card
        className={'cert-type-card' + (certType === 'WEWORK' ? ' high-light' : '')}
        style={{ height: height || 240 }}
        bordered={!!certType}
        onClick={() => onTypeChange && onTypeChange('WEWORK')}
      >
        <Tooltip title="企业微信">
          <Button type="link" style={{ height: '100%', paddingLeft: 'unset' }}>
            <Space>
              <Image
                preview={false}
                rootClassName={'cert-type-box'}
                src={require('@/../public/images/cert_wx.png')}
              />
              <span>企业微信</span>
            </Space>
          </Button>
        </Tooltip>
        <div style={{ fontSize: 12 }}>
          企业微信是腾讯微信团队打造的企业通讯与办公工具，具有与微信一致的沟通体验，丰富的OA应用，和连接微信生态的能力，可帮助企业连接内部、连接生态伙伴、连接消费者
        </div>
      </Card>
    );
  };
  return render();
};
export default WxDesc;
