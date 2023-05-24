import { Row, Col } from 'antd';
export type InfoItemProps = {
  titleStr: string;
  contentObj: string;
  tip?: string;
  isNormal?: boolean;
  titleSpan?: string;
  contentSpan?: string | undefined | number;
};

const InfoItem: React.FC<InfoItemProps> = (props) => {
  return (
    <Row className="fs-14 ant-form-item">
      <Col
        span={props.titleSpan || '6'}
        className="ant-form-item-label"
        style={{ textAlign: 'right', fontWeight: props.isNormal ? 'normal' : 'bold' }}
      >
        <label title={props.tip || props.titleStr}>{props.titleStr}</label>
      </Col>
      <Col span={props.contentSpan || '18'} style={{ paddingLeft: '10px' }}>
        <div className="ant-form-item-control" style={{ wordWrap: 'break-word' }}>
          {props.contentObj}
        </div>
      </Col>
    </Row>
  );
};

export default InfoItem;
