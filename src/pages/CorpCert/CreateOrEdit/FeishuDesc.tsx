import { Button, Card, Space, Tooltip, Image } from 'antd';
import React from 'react';

export type ItemProps = {
  certType?: string;
  height?: number;
  onTypeChange?: (type: string) => void;
};

const FsDesc: React.FC<ItemProps> = (props: any) => {
  const { certType, height, onTypeChange } = props;
  const render = () => {
    return (
      <Card
        className={'cert-type-card' + (certType === 'FEISHU' ? ' high-light' : '')}
        style={{ height: height || 240 }}
        bordered={!!certType}
        onClick={() => onTypeChange && onTypeChange('FEISHU')}
      >
        <Tooltip title="飞书">
          <Button type="link" style={{ height: '100%', paddingLeft: 'unset' }}>
            <Space>
              <Image
                preview={false}
                rootClassName={'cert-type-box'}
                src={require('@/../public//images/logo/FEISHU.png')}
              />
              <span>飞书</span>
            </Space>
          </Button>
        </Tooltip>
        <div style={{ fontSize: 12 }}>
          字节跳动旗下先进协作与管理平台。不仅一站式整合即时沟通、音视频会议、飞书文档、智能日历、云盘等办公协作套件，更提供飞书OKR、飞书合同、飞书绩效等组织管理产品，让目标更清晰…….
        </div>
      </Card>
    );
  };
  return render();
};
export default FsDesc;
