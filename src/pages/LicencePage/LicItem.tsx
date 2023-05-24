import React, { Fragment } from 'react';
import { Col } from 'antd';

export type LicItemProps = {
  label: string;
  label1?: string;
  data?: {
    checked_value: boolean;
    dates: string[];
  };
};
const LicItem: React.FC<LicItemProps> = (props) => {
  const { label, label1, data = { checked_value: false, dates: [] } } = props;
  const { checked_value, dates } = data;
  if (label1) {
    return (
      <Fragment>
        <Col span={4} style={{ height: 40 }}>
          {label}
        </Col>
        <Col span={8}>{label1}</Col>
      </Fragment>
    );
  }
  if (!checked_value || dates.length !== 2) {
    return <Col span={12} />;
  }
  return (
    <Fragment>
      <Col span={4} style={{ height: 40 }}>
        {label}
      </Col>
      <Col span={8}>{`${dates[0]}-${dates[1]}`}</Col>
    </Fragment>
  );
};

export default LicItem;
