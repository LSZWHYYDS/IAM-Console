import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import { Popover } from 'antd';
import { useEffect } from 'react';

interface PreviewPhoneProps {
  initValue: string;
  onClose: (color: string) => void;
}

const ColorPicker: React.FC<PreviewPhoneProps> = (props) => {
  const { initValue, onClose: handleColorPicked } = props;
  const [color, setColor] = useState<string>('#1890ff');

  useEffect(() => {
    if (initValue !== undefined) {
      setColor(initValue);
    }
  }, [initValue]);

  const handleChange = (pickedColor: any) => {
    setColor(pickedColor.hex);
    handleColorPicked(pickedColor.hex);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '24px',
        borderRadius: '2px',
        background: color,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      body: {
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      },
    },
  });

  const colorPicker = <ChromePicker color={color} onChange={handleChange} />;

  return (
    <Popover content={colorPicker} trigger="click">
      <div style={styles.swatch}>
        <div style={styles.color} />
      </div>
    </Popover>
  );
};

export default ColorPicker;
