/* jshint esversion: 6 */
import React, { Component } from 'react';
import RichTextEditor from 'react-rte';

class TextEditor extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      value: this.props.data
        ? RichTextEditor.createValueFromString(this.props.data, 'html')
        : RichTextEditor.createEmptyValue(),
    };
  }
  onChange(value) {
    this.setState({ value });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(value.toString('html'));
    }
  }
  reset() {
    this.setState({
      value: this.props.data
        ? RichTextEditor.createValueFromString(this.props.data, 'html')
        : RichTextEditor.createEmptyValue(),
    });
  }
  render() {
    return (
      <RichTextEditor
        value={this.state.value}
        toolbarConfig={
          this.props.hideToolbar
            ? { display: ['HISTORY_BUTTONS'], HISTORY_BUTTONS: [{ label: '实施', style: '' }] }
            : null
        }
        onChange={this.onChange.bind(this)}
      />
    );
  }
}

export default TextEditor;
