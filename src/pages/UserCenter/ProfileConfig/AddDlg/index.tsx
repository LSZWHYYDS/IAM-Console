import { Card, Form } from 'antd';
import React from 'react';

const AddDialog: React.FC = () => {
  const render = () => {
    return (
      <Card title={'创建Profile'}>
        <Form>
          <div
            style={{
              width: '90%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'start',
              flexWrap: 'wrap',
            }}
          >
            profile
          </div>
        </Form>
      </Card>
    );
  };
  return render();
};
export default AddDialog;
