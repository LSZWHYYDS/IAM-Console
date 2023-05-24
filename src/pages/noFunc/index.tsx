import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Row } from 'antd';
import styles from './index.less';
import React from 'react';
const NoFunc: React.FC = () => {
  const row1 = () => {
    return (
      <div>
        <Row className={styles.padding1} justify="center">
          <h1 className={styles.title}>身份连接器</h1>
        </Row>
        <Row>
          <Col span={8}>
            <Row justify="center" align="middle">
              <img className={styles.funcimg} src="/uc/images/noFunc/1_1.png" height={242} />
            </Row>
            <Row justify="center" align="middle" className={styles.padding}>
              <h2>数字化用户必在云端</h2>
            </Row>
            <Row>
              <Col offset={3} span={17} className={styles.tip}>
                从AD同步AD Azure?
                No,很多云原生数字化的企业根本就不关心活动目录，我们提供云原生的用户目录，
                让它帮您加速企业数字化的步伐，不再SaaS应用上继续构建烟囱
              </Col>
              <Divider type="vertical" className={styles.lineimg} />
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="center" align="middle">
              <img className={styles.funcimg} src="/uc/images/noFunc/1_2.png" height={242} />
            </Row>
            <Row justify="center" align="middle" className={styles.padding}>
              <h2>同步稳定可靠</h2>
            </Row>
            <Row>
              <Col offset={3} span={17} className={styles.tip}>
                让您在云端一站式的管理用户及登录凭证，不管是内部的IDP、用户数据库、还是SaaS云端的用户源灵活同步，实时增量、容错机制、误操作回滚
              </Col>
              <Divider type="vertical" className={styles.lineimg} />
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="center" align="middle">
              <img className={styles.funcimg} src="/uc/images/noFunc/1_3.png" height={242} />
            </Row>
            <Row justify="center" align="middle" className={styles.padding}>
              <h2>开箱就用够认真</h2>
            </Row>
            <Row>
              <Col offset={3} span={17} className={styles.tip}>
                上数犀讲工作台应用快速集成到专有钉钉、专属钉钉、专业版钉钉，之前您使用Microsoft365、G
                Suite、Zoho、Slack、AWSCognito我们也一样有解决方案
              </Col>
              <Divider type="vertical" className={styles.lineimg} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  };
  const row2 = () => {
    return (
      <div style={{ marginTop: 70, width: '70%' }}>
        <Row justify="space-around">
          <Col flex="220px">
            <div style={{ textAlign: 'center' }}>
              <img className={styles.lineimgs} src="/uc/images/noFunc/2.png" />
            </div>
          </Col>
          <Col span={12} className={styles.tip} style={{ lineHeight: '30px' }}>
            <div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block' }} className={styles.title}>
                  企业专属应用分发
                </h1>
              </div>
              <div style={{ width: '150%', marginTop: 50, marginLeft: '-14%' }}>
                支持iOS、Android多平台客户端的分发能力，简化分发安装流程和复杂度
                支持苹果企业自定义应用方式分发客户端。没有企业开发者证书下依旧可以在企业内部分发iOS应用
                无需再担心企业应用被恶意散播，保障企业员工便捷获取专属应用客户端安装文件
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const openWebPage = () => {
    window.open('https://digitalsee.cn/pricing', 'newW');
  };
  const row3 = () => {
    return (
      <div style={{ marginTop: '60px', width: '70%' }}>
        <Row justify="space-around">
          <Col flex="220px">
            <div style={{ textAlign: 'center' }}>
              <img className={styles.funcimgBig} src="/uc/images/noFunc/3.png" />
            </div>
          </Col>
          <Col span={12} className={styles.tip} style={{ lineHeight: '30px' }}>
            <div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block' }} className={styles.title}>
                  单点集成
                </h1>
              </div>
              <div style={{ width: '150%', marginTop: 50, marginLeft: '-14%' }}>
                预置多种认证源，实现和企业AD/LDAP系统的安全联结，支持OAuth2.0、OIDC、CAS、
                SAML等多种认证协议，支持多因子认证、按用户维度授权，全面提高系统访问安全，同时也
                能兼顾用户使用体验。
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  const row4 = () => {
    return (
      <div style={{ marginTop: '100px', width: '70%' }}>
        <Row className={styles.padding1} justify="space-around">
          <Col flex="220px">
            <div style={{ textAlign: 'center' }}>
              <img className={styles.funcimgBig_circle} src="/uc/images/noFunc/4.png" />
            </div>
          </Col>
          <Col span={12} className={styles.tip} style={{ lineHeight: '30px' }}>
            <div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block' }} className={styles.title}>
                  零信任检测及可信准入
                </h1>
              </div>
              <div style={{ width: '150%', marginTop: 50, marginLeft: '-14%' }}>
                设备终端的环境威胁、行为、网络等全方位检测，对系统威胁进行系统评分，支持灵活的设备准入
                策略控制。让设备安全风险无所遁形，严格限制风险终端使用企业应用，保障企业数据安全
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  const row5 = () => {
    return (
      <div style={{ marginTop: '100px', width: '70%' }}>
        <Row className={styles.padding1} justify="space-around">
          <Col flex="220px">
            <div style={{ textAlign: 'center' }}>
              <img className={styles.funcimgBig_ls} src="/uc/images/noFunc/5.png" />
            </div>
          </Col>
          <Col span={12} className={styles.tip} style={{ lineHeight: '30px' }}>
            <div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block' }} className={styles.title}>
                  安全沙箱数据防泄漏
                </h1>
              </div>
              <div style={{ width: '150%', marginTop: 50, marginLeft: '-14%' }}>
                业务应用预先集成沙箱SDK，稳定性高，用户无感知
                基于用户、角色、组织架构颗粒度的安全策略，不同人员配置不同策略，在满足安全要求的基础上，提供灵活的管理能力策略下发实时生效。
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  const row6 = () => {
    return (
      <div style={{ width: '70%', marginTop: 60 }}>
        <Row justify="space-around">
          <Col flex="220px">
            <div style={{ textAlign: 'center' }}>
              <img className={styles.funcimgBig} src="/uc/images/noFunc/6.png" />
            </div>
          </Col>
          <Col span={12} className={styles.tip} style={{ lineHeight: '30px' }}>
            <div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ display: 'inline-block' }} className={styles.title}>
                  文件审计
                </h1>
              </div>
              <div style={{ width: '150%', marginTop: 50, marginLeft: '-14%' }}>
                记录组织内员工对组织资产文件的操作记录，防止公司核心数据的外泄造成信息资产的损失。因需自定义“异常规则”，围绕公司资产文件做进一步的行为分析、安全分析、资源变更行为追踪和行为合规审记，支持对异常操作行为主动触发告警通知
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <PageContainer title={false}>
      {row1()}
      {row2()}
      {row3()}
      {row4()}
      {row5()}
      {row6()}
      <Row>
        <Col
          offset={1}
          span={4}
          className={styles.tip}
          style={{ opacity: '1', boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)' }}
        >
          <Card style={{ position: 'fixed', top: '70%', left: '85%', zIndex: '10' }}>
            <Row justify="center">
              <div style={{ padding: '0 10px', fontSize: '20px', textAlign: 'justify' }}>
                当前企业无权限使用 此模块，你可以联系 我们咨询功能详情
              </div>
            </Row>
            <Row justify="center">
              <Button type="primary" className={styles.linkUs} onClick={openWebPage}>
                联系我们
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default NoFunc;
