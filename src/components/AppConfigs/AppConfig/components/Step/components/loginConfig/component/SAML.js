import React, { Component } from 'react';
import AppInfoSSOLoginSaml from '../../authorScope/component/components/AppInfo/AppInfoSSOLoginSaml';

export default class SAML extends Component {
  constructor(...args) {
    super(...args);
    this.formRefs = React.createRef(null);
  }
  fetchFormRefObj() {
    return this.formRefs.current?.validateFields().then((value) => {
      for (const item in value) {
        if (!value[item]) {
          value[item] = '';
        }
      }
      return {
        ...value,
        assertion_attributes: this.AppInfoSSOLoginSamlRef.onGetSaveValue(),
      };
    });
  }

  getSAMLData() {
    return this.AppInfoSSOLoginSamlRef.onGetSaveValue();
  }
  renderSAML() {
    return (
      <AppInfoSSOLoginSaml
        form={this.formRef}
        id_client={this.props.client_id}
        appDetail={this.props.appDetail}
        fetchData={this.fetchFormRefObj.bind(this)}
        ref={(ref) => {
          this.AppInfoSSOLoginSamlRef = ref;
        }}
      />
    );
  }
  render() {
    return this.renderSAML();
  }
}
