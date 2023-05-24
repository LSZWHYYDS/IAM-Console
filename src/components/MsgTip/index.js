/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Tooltip } from 'antd';

class MsgTip extends Component {
  render() {
    return (
      <span className="msg-tip" style={this.props.style}>
        <Tooltip placement="top" title={this.props.msg || ''}>
          <i className="icon iconfont icon-msg-tip" />
        </Tooltip>
      </span>
    );
  }
}

export default MsgTip;
