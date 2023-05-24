import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql'; // sql模式的包
import 'ace-builds/src-noconflict/mode-mysql'; // mysql模式的包
import 'ace-builds/src-noconflict/theme-xcode'; // xcode,(亮白)的主题样式
import 'ace-builds/src-noconflict/theme-twilight'; // twilight,(暗黑)的主题样式
//以下import的是风格，还有好多种，可以根据自己需求导入
// github、tomorrow、kuioir、twilight、xcode、textmeta、terminal、solarized-light、solarized-dark
import 'ace-builds/src-noconflict/ext-language_tools'; //（编译代码的文件）

const AceEditorComp: React.FC = (props: any) => {
  const [codeValue, setCodeValue] = useState(props.value || '');
  useEffect(() => {
    setCodeValue(props.value);
  }, [props.value]);
  const onChange = (value: string) => {
    setCodeValue(value);
    props.onChange(value);
  };
  const renderEditor = () => {
    // 增加需要自定义的代码提示
    const completers = [];
    const complete = (editor: any) => {
      editor.completers.push({
        getCompletions: function (editors, session, pos, prefix, callback) {
          callback(null, completers);
        },
      });
    };

    return (
      <div>
        <Alert
          message="下面表达式要求使用JavaScript 语法，点击左侧字段添加到编辑框"
          type="success"
        />
        <AceEditor
          mode="javascript" // 设置编辑语言
          theme="cobalt" // 设置主题  cobalt monokai，twilight,(暗黑)，xcode,(亮白)
          name="app_code_editor"
          fontSize={20} // 设置字号
          onChange={onChange} // 获取输入框的 代码
          value={codeValue} //
          style={{ width: '100%', height: 500 }}
          setOptions={{
            enableBasicAutocompletion: true, //启用基本自动完成功能 不推荐使用
            enableLiveAutocompletion: true, //启用实时自动完成功能 （比如：智能代码提示）
            enableSnippets: true, //启用代码段
            showLineNumbers: false,
            tabSize: 2,
            wrap: true, // 换行
            autoScrollEditorIntoView: true, // 自动滚动编辑器视图
          }}
          onLoad={complete}
        />
      </div>
    );
  };

  return renderEditor();
};

export default AceEditorComp;
