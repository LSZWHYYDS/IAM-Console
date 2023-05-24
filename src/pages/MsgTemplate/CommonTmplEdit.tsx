import React, { useState, useRef } from 'react';
import { Button, Card, Form, Input } from 'antd';
import { requestMsg } from '@/utils/common.utils';
import TextEditor from '@/components/TextEditor';
import { updateTemplate } from './service';
import type { TmplProps } from './data';

const { TextArea } = Input;
const FormItem = Form.Item;
const nameMap = ['', 'welcome_email', 'verify_email', 'resetpwd_email', 'code_sms'];
const commitTypeMap = ['', 'WELCOME', 'VERIFY', 'RESETPWD', 'CODE'];

const CommonTmplEdit: React.FC<TmplProps> = (props) => {
  const editorRef = useRef<TextEditor | null>(null);
  const [form] = Form.useForm();
  const { data = { title: '', content: '' } } = props;
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const changeBtnStatus = () => {
    if (props.data) {
      setBtnDisabled(title === props.data.title && content === props.data.content);
    } else {
      setBtnDisabled(!title || !content);
    }
  };

  const onChangeName = () => {
    setTitle(form.getFieldValue('title'));
    changeBtnStatus();
  };
  const onTextChange = (dataObj: any) => {
    if (typeof dataObj === 'object') {
      setContent(dataObj.target.value);
    } else {
      setContent(dataObj);
    }
    changeBtnStatus();
  };
  const onSubmit = () => {
    const values = form.getFieldsValue();
    if (content) {
      const emailObj = {
        channel: 'EMAIL',
        content,
        name: nameMap[props.type || ''],
        title: values.title,
        type: commitTypeMap[props.type || ''],
      };
      updateTemplate(nameMap[props.type || ''], emailObj).then((res) => {
        setBtnDisabled(true);
        setContent(emailObj.content);
        setTitle(emailObj.title);
        requestMsg(res);
      });
    }
  };
  const onReset = () => {
    form.setFieldsValue({
      title: data.title,
    });
    setTitle(data.title);
    setContent(data.content);

    if (props.isText) {
      form.setFieldsValue({
        content: data.content,
      });
    } else {
      if (editorRef.current) {
        editorRef.current.reset();
      }
    }
    changeBtnStatus();
  };

  const render = () => {
    if (!props.data) {
      return <div />;
    }
    console.log(props);
    return (
      <Card className="mb-20">
        <Form form={form} className="formPadding" layout="horizontal">
          <div className="fs-16">{props.title}</div>
          <div className="pd-5">
            <FormItem
              name="title"
              rules={[{ required: true, message: '请输入标题' }]}
              initialValue={props.data && props.data.title}
            >
              <Input type="text" maxLength={50} onChange={onChangeName} />
            </FormItem>
          </div>
          <div>
            <div className="mt-20 fs-16">{props.content}</div>
            {!props.isText ? (
              <TextEditor
                data={props.data && props.data.content}
                hideToolbar={props.hideToolbar}
                ref={editorRef}
                onChange={onTextChange}
              />
            ) : (
              <FormItem
                name="content"
                rules={[{ required: true, message: '请输入' }]}
                initialValue={props.data && props.data.content}
              >
                <TextArea
                  style={{ fontSize: '16px' }}
                  rows={4}
                  maxLength={250}
                  onChange={onTextChange}
                />
              </FormItem>
            )}
          </div>
          <div className="footerContainer" style={{ padding: '20px 0 0' }}>
            <Button type="primary" disabled={btnDisabled} onClick={onSubmit}>
              保存
            </Button>
            <Button disabled={btnDisabled} className="ml-10" onClick={onReset}>
              重置
            </Button>
          </div>
        </Form>
      </Card>
    );
  };
  return render();
};

export default CommonTmplEdit;
