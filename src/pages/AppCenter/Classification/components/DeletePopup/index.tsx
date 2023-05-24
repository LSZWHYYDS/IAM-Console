import React from 'react';
import styles from './index.less';
import { Radio, Spin, Empty } from 'antd';
import { getUserClassification } from './serves';
export default class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      classList: [],
      loading: false,
    };
    this.renderUlList = this.renderUlList.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }
  componentDidMount() {
    getUserClassification().then((rs) => {
      this.setState(
        {
          classList: rs.data,
        },
        () => {
          this.setState({
            loading: true,
          });
        },
      );
    });
  }
  renderUlList() {
    return this.state.classList.map((mapIs: any, mapInx: number) => {
      return this.handleClickEdit(mapIs, mapInx);
    });
  }
  handleClickEdit(mapIs: any, mapInx: number) {
    return (
      <li className={styles.li} key={mapInx}>
        <div className={styles.li} style={{ display: 'flex', alignItems: 'center' }}>
          <Radio value={mapIs.id} className={styles.li}>
            {mapIs.category_name}
          </Radio>
        </div>
      </li>
    );
  }
  onRadioChange(e: any) {
    this.props.fatherDeleteHandleRadio(e.target.value);
  }
  render(): React.ReactNode {
    return this.state.loading ? (
      <Radio.Group className={styles.ul} onChange={this.onRadioChange}>
        <ul className={styles.ul} style={{ marginTop: '0' }}>
          {this.state.classList.length ? this.renderUlList() : <Empty></Empty>}
        </ul>
      </Radio.Group>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spin></Spin>
      </div>
    );
  }
}
