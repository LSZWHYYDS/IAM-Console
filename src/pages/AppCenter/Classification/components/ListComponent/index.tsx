import React from 'react';
import styles from './index.less';
import { Iprops, IState } from './data';
import { Input, Row, Col, Button, message, Empty, Spin } from 'antd';
import {
  EditOutlined,
  CloseSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import {
  createMeClassification,
  getUserClassification,
  deleteClassification,
  modifyInfo,
  sortFunc,
} from './server';
export default class Index extends React.Component<Iprops, IState> {
  listRef: React.RefObject<unknown>;
  constructor(props: any) {
    super(props);
    this.state = {
      classList: [],
      completeValue: '',

      newClassList: [],
      tempValue: '',
      loading: true,
    };
    this.renderUlList = this.renderUlList.bind(this);
    this.updateClassList = this.updateClassList.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.handleCompleteEvent = this.handleCompleteEvent.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.listRef = React.createRef();
  }
  componentDidMount() {
    getUserClassification().then((rs: any) => {
      this.setState({
        classList: rs.data,
        newClassList: rs.data,
        loading: false,
      });
    });
  }
  getSnapshotBeforeUpdate(prevProps: any, prevState: any) {
    if (prevState.classList.length < this.state.classList.length) {
      const list: any = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    if (snapshot !== null) {
      const list: any = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
  againRequest() {
    getUserClassification().then((rs: any) => {
      this.setState({
        classList: rs.data,
      });
    });
  }
  renderUlList() {
    return this.state.classList.map((mapIs: any, mapInx: number) => {
      return this.handleClickEdit(mapIs, mapInx);
    });
  }
  UpTheSorting(mapIs: any, mapInx: any) {
    if (mapInx + 1 == this.state.classList.length) {
      message.error('已经在最底部');
      return;
    }
    const b = this.state.classList[mapInx];
    this.setState(
      (state) => {
        const a = state.classList;
        a[mapInx] = { ...a[mapInx + 1] };
        a[mapInx + 1] = { ...b };
        a.forEach((is: any, inx: any) => {
          is.sort_num = inx;
        });
        return {
          classList: a,
        };
      },
      () => {
        sortFunc(this.state.classList).then((rs) => {
          if (!Number(rs.error)) {
            message.success('排序成功');
          }
        });
      },
    );
  }
  downSorting(mapInx: any) {
    if (mapInx - 1 < 0) {
      message.error('已经在最顶部');
      return;
    }
    const b = this.state.classList[mapInx - 1];
    this.setState(
      (state) => {
        const a = state.classList;
        a[mapInx - 1] = { ...a[mapInx] };
        a[mapInx] = { ...b };
        a.forEach((is: any, inx: any) => {
          is.sort_num = inx;
        });
        return {
          classList: a,
        };
      },
      () => {
        sortFunc(this.state.classList).then((rs) => {
          if (!Number(rs.error)) {
            message.success('排序成功');
          }
        });
      },
    );
  }
  // 点击取消的相关逻辑
  handleCancleEvent(mapInx: any) {
    // 每次点击需要把所有的编辑框置空
    const tempArr_comps = this.state.classList.slice();
    tempArr_comps.forEach((is) => (is.isEdit = false));
    tempArr_comps[mapInx].category_name = this.state.tempValue;
    this.setState(() => {
      return {
        classList: tempArr_comps,
      };
    });
  }

  handleClickEdit(mapIs: any, mapInx: number) {
    if (mapIs.isEdit) {
      return (
        <Row className={styles.rowStyle}>
          <Col span={16}>
            <Input
              placeholder="请输入信息"
              onChange={() => this.handleChangeEvent(event, mapIs, mapInx)}
              value={mapIs.category_name}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Button
              type="primary"
              size="middle"
              onClick={() => this.handleCompleteEvent(mapInx, mapIs)}
            >
              完&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成
            </Button>

            <Button
              type="dashed"
              size="middle"
              onClick={() => this.handleCancleEvent(mapInx)}
              style={{ marginLeft: '25px' }}
            >
              取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消
            </Button>
          </Col>
        </Row>
      );
    } else {
      return (
        <li className={styles.li} key={mapInx}>
          <span>{mapIs.category_name}</span>
          <div className={styles.operationIcon}>
            <EditOutlined
              className={styles.iconSize}
              onClick={() => this.handleClickEvent(mapInx)}
            />
            <CloseSquareOutlined
              className={styles.iconSize}
              onClick={() => this.deleteClass(mapInx, mapIs)}
            />
            <SortAscendingOutlined
              className={styles.iconSize}
              onClick={() => this.UpTheSorting(mapIs, mapInx)}
            />
            <SortDescendingOutlined
              className={styles.iconSize}
              onClick={() => this.downSorting(mapInx)}
            />
          </div>
        </li>
      );
    }
  }
  handleClickEvent(mapInx: number) {
    for (let i = 0; i < this.state.classList.length; i++) {
      if (this.state.classList[i].isEdit) {
        message.error('请先取消上次操作');
        return;
      }
    }
    // 每次点击需要把所有的编辑框置空
    const tempArr_comps = [...this.state.classList];
    tempArr_comps.forEach((is: any) => (is.isEdit = false));
    this.setState(() => {
      tempArr_comps[mapInx].isEdit = true;
      return {
        classList: tempArr_comps,
        tempValue: tempArr_comps[mapInx].category_name,
      };
    });
  }
  updateClassList(inputValue: any) {
    interface ObjInterface {
      [key: string]: any;
    }
    const obj: ObjInterface = {
      category_name: inputValue,
      sort_num: 0,
    };
    createMeClassification(obj).then((rs) => {
      if (!Number(rs.error)) {
        obj.id = rs.data;
        message.success('新建成功');
      }
    });
    // 清除输入框内容
    this.props.clearHandle();
    this.setState((state: any) => {
      return {
        classList: state.classList.slice().concat(obj),
      };
    });
  }
  handleCompleteEvent(mapInx: number, mapIs: any) {
    if (this.state.completeValue) {
      modifyInfo(mapIs.id, {
        category_name: this.state.completeValue,
        sort_num: mapInx,
      }).then((rs: any) => {
        if (!Number(rs.error)) {
          message.success('编辑成功了');
        }
      });
    }
    this.setState((state) => {
      const tempArr_comp = state.classList.slice();
      tempArr_comp[mapInx].value = this.state.completeValue;
      tempArr_comp.forEach((is) => (is.isEdit = false));
      return {
        classList: tempArr_comp,
      };
    });
  }
  handleChangeEvent(e: any, mapIs: any, mapInx: any) {
    const Rn = this.state.classList;
    Rn[mapInx].category_name = e.target.value;
    this.setState({
      completeValue: e.target.value,
      classList: Rn,
    });
  }
  deleteClass(mapInx: number, mapIs: any) {
    for (let i = 0; i < this.state.classList.length; i++) {
      if (this.state.classList[i].isEdit) {
        message.error('请先取消上次操作');
        return;
      }
    }

    deleteClassification(mapIs.id).then((rs) => {
      if (!Number(rs.error)) message.success('删除成功');
      this.props.againRequestClassList();
    });
    this.setState((state) => {
      const tempArr_delete = state.classList.slice();
      // 对返回索引进行删除
      tempArr_delete.splice(mapInx, 1);
      return {
        classList: tempArr_delete,
      };
    });
  }
  render(): React.ReactNode {
    return (
      <Spin size="large" spinning={this.state.loading}>
        <ul className={styles.ul} ref={this.listRef}>
          {this.state.classList.length ? this.renderUlList() : <Empty></Empty>}
        </ul>
      </Spin>
    );
  }
}
