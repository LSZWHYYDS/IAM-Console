/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

let timerHandler: any;
const TextTimer: React.FC<any> = (props) => {
  const { initTime } = props;
  const [timer, setTimer] = useState(initTime || 60);
  const clearTimer = () => {
    clearInterval(timerHandler);
  };
  const start = () => {
    setTimer(initTime);
    clearInterval(timerHandler);
    timerHandler = setInterval(() => {
      if (timer <= 1) {
        clearInterval(timerHandler);
      }
      // eslint-disable-next-line no-param-reassign
      setTimer((t: any) => --t);
    }, 1000);
  };
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);
  useEffect(() => {
    start();
  }, [initTime]);

  useEffect(() => {
    if (timer > 0 && timer <= (initTime || 60)) {
    } else {
      clearInterval(timerHandler);
    }
  }, [timer]);

  const onClickText = () => {
    props.onClickText();
    start();
  };
  const render = () => {
    let textObj;
    if (timer === 0) {
      textObj = (
        <a href="javascript:void(0);" onClick={onClickText} className="forgetPwd-send-email">
          {props.text}
        </a>
      );
    } else {
      textObj = <span className="forgetPwd-send-email-gray">{props.text}</span>;
    }
    return (
      <span>
        <span className={timer === 0 ? 'hidden' : 'forgetPwd-timer'}>{timer}s后</span>
        {textObj}
      </span>
    );
  };
  return render();
};

export default TextTimer;
