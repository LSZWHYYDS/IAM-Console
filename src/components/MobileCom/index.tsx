import React, { useState } from 'react';
import { Calendar, Cell } from '@nutui/nutui-react';
import '@nutui/nutui-react/dist/style.css';
import moment from 'moment';
const Index: React.FC<any> = (props) => {
  const [date1, setDate1] = useState([
    moment().subtract(6, 'day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ]);
  const [isVisible1, setIsVisible1] = useState(false);
  const openSwitch1 = () => {
    setIsVisible1(true);
  };

  const closeSwitch1 = () => {
    setIsVisible1(false);
  };

  const setChooseValue1 = (param: string) => {
    setDate1([...[param[0][3], param[1][3]]]);
    props.onMobileEvent([param[0][3], param[1][3]]);
  };

  return (
    <>
      <div>
        <Cell
          // title="选择日期区间"
          desc={date1 ? `${date1[0]}至${date1[1]}` : '请选择'}
          onClick={openSwitch1}
        />
        <Calendar
          visible={isVisible1}
          defaultValue={date1}
          type="range"
          startDate={moment().subtract(6, 'month').format('YYYY-MM-DD')}
          // endDate={moment().endOf('day').format('YYYY-MM-DD')}
          onClose={closeSwitch1}
          onChoose={setChooseValue1}
        />
      </div>
    </>
  );
};

export default Index;
