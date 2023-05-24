import React, { Component } from 'react';
import { Button } from 'antd';
import util from '../../common/util';
import ModalDialog from '../../common/modalDialog';
import BindingScopeOrgTree from './BindingScopeOrgTree';

class RoleBindingScopeDialog extends Component {
  componentDidMount() {
    util.filterDangerousChars();
  }

  onClose() {
    this.props.onClose();
  }

  getSelections() {
    return this.scopeOrgTree.getSelections();
  }

  render() {
    const title = this.props.data
      ? `${util.t('app.perm.binding.scope.title')} : ${this.props.target}`
      : util.t('app.perm.binding.scope.title');
    return (
      <ModalDialog
        show={this.props.show}
        title={title}
        height="auto"
        width="800px"
        style={{ textAlign: 'left' }}
      >
        {this.props.clientId && this.props.role && this.props.data && (
          <div>
            {this.props.targetType === 'USER' && (
              <div className="align-left mb-10">{util.t('app.perm.binding.tip.scope')}</div>
            )}
            <BindingScopeOrgTree
              clientId={this.props.clientId}
              role={this.props.role}
              data={this.props.data}
              target={this.props.target}
              targetType={this.props.targetType}
            />
          </div>
        )}

        <div className="mt-30" style={{ textAlign: 'right' }}>
          <Button type="ghost" className="ml-10 fs-16" onClick={this.onClose.bind(this)}>
            {util.t('common.close')}
          </Button>
        </div>
      </ModalDialog>
    );
  }
}

export default RoleBindingScopeDialog;
