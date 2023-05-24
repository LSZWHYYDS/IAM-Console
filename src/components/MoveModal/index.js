import { PureComponent } from 'react';
import { Modal } from 'antd';

class MoveModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      styleTop: 100,
      styleLeft: 0,
    };
  }

  // 计算是否超出屏幕;超出后停止移动监听
  inWindow = (left, top, startPosX, startPosY) => {
    const H = document.body.clientHeight;
    const W = document.body.clientWidth;
    if (
      (left < 20 && startPosX > left) ||
      (left > W - 20 && startPosX < left) ||
      (top < 20 && startPosY > top) ||
      (top > H - 20 && startPosY < top)
    ) {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      return false;
    }
    return true;
  };

  onMouseDown = (e1) => {
    e1.preventDefault(); // 记录初始移动的鼠标位置
    const startPosX = e1.clientX;
    const startPosY = e1.clientY;
    const { styleLeft, styleTop } = this.state; // 添加鼠标移动事件
    document.body.onmousemove = (e) => {
      const left = e.clientX - startPosX + styleLeft;
      const top = e.clientY - startPosY + styleTop;
      if (this.inWindow(e.clientX, e.clientY, startPosX, startPosY)) {
        this.setState({
          styleLeft: left,
          styleTop: top,
        });
      }
    }; // 鼠标放开时去掉移动事件
    document.body.onmouseup = function () {
      document.body.onmousemove = null;
    };
  };

  render() {
    const { styleLeft, styleTop } = this.state;
    const style = { left: styleLeft, top: styleTop };
    return (
      <Modal
        {...this.props}
        style={style}
        title={
          <div style={{ width: '100%', cursor: 'move' }} onMouseDown={this.onMouseDown}>
            标题
          </div>
        }
      >
        {this.props.children}
      </Modal>
    );
  }
}
export default MoveModal;
