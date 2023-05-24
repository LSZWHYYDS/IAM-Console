import React, { useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Col, message, Row, Space } from 'antd';
import { history } from 'umi';
import { formatDateTime } from '@/utils/common.utils';
import InfoItem from '@/components/InfoItem';
import CreateOrEdit from '@/pages/UserCenter/UserManagement/CreateOrEdit/index';
import type { UserAnotherType } from '../../data';
import { getUserInfo, getAttrList } from '../../service';
import { currentUser } from '@/services/digitalsee/api';
import styles from './style.less';
import moment from 'moment';

const genderMap = {
  MALE: '男性',
  FEMALE: '女性',
  SECRET: '保密',
};

const statusMap = {
  ACTIVE: '正常',
  // INACTIVE: '已禁用',
  INACTIVE: '未生效',
  SUSPENDED: '已禁用',
  OVERDUE: '已过期',
};

const UserInfo: React.FC<any> = (props) => {
  const { location } = props;
  const isSelf = location.pathname === '/uc/selfInfo';
  const { username } = location.query;
  const [userinfo, setUserinfo] = useState<UserAnotherType>();
  const [loading, setloading] = useState<boolean>(false);
  const [extendAttrList, setExtendAttrList] = useState<any[]>([]);
  const [isEdit, setEdit] = useState(false);

  const handleGetUserExtendInfo = async () => {
    try {
      const attr = await getAttrList({ basic: false });
      if (attr.error === '0') {
        setExtendAttrList(attr.data.items);
      }
    } catch (error) {
      message.error(`服务器或网络错误，获取用户信息失败。错误信息: ${error}`);
    }
  };

  const handleGetUserInfo = async () => {
    setloading(true);
    try {
      const userInfo = isSelf ? await currentUser() : await getUserInfo({ username });
      if (userInfo.error === '0') {
        setUserinfo(userInfo.data);
      }
    } catch (error) {
      message.error(`服务器或网络错误，获取用户信息失败。错误信息: ${error}`);
    } finally {
      setloading(false);
    }
  };
  const createAttrs = () => {
    if (!extendAttrList) {
      return null;
    }
    return extendAttrList.map((item) => (
      <InfoItem
        key={'attrs_' + item.id}
        titleStr={item.display_name}
        isNormal={true}
        contentObj={(userinfo && userinfo[item.domain_name]) || '--'}
      />
    ));
  };
  const onEdit = () => {
    if (isSelf) {
      setEdit(true);
    } else {
      history.push(`/users/edit?username=${username}`);
    }
  };
  const onCloseEdit = () => {
    setEdit(false);
  };
  useEffect(() => {
    handleGetUserInfo();
    handleGetUserExtendInfo();
  }, []);
  if (isEdit) {
    return <CreateOrEdit isSelf={isSelf} onBack={onCloseEdit} />;
  }
  const formatUserSource = (come_from) => {
    if (come_from == '0') {
      return '-';
    }
    if (['BY_IMPORT_CSV', 'BY_ADMIN'].includes(come_from)) {
      return '自建';
    }
    return come_from;
  };
  return (
    <PageContainer
      extra={
        <Space>
          {!isSelf && ['BY_SYNC_DS'].includes(userinfo?.created_mode) ? null : (
            <Button type="primary" onClick={onEdit}>
              <EditOutlined />
              编辑
            </Button>
          )}
          {(!isSelf && (
            <Button type="default" onClick={() => history.goBack()}>
              返回
            </Button>
          )) ||
            null}
        </Space>
      }
    >
      {!loading ? (
        <>
          <Card className={styles.userInfo} title="基本属性" style={{ marginBottom: '24px' }}>
            <Row>
              <Col span={10}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>用户名</div>
                  <div className={styles.infoContent}>{userinfo?.username || '未设置'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>姓名</div>
                  <div className={styles.infoContent}>{userinfo?.name || '未设置'}</div>
                </div>
                {/* todo */}
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>昵称</div>
                  <div className={styles.infoContent}>{userinfo?.nickname || '未设置'}</div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>手机号</div>
                  <div className={styles.infoContent}>{userinfo?.phone_number || '未设置'}</div>
                </div>

                {/* todo */}
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>座机号</div>
                  <div className={styles.infoContent}>{userinfo?.telephone_number || '未设置'}</div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>邮箱</div>
                  <div className={styles.infoContent}>{userinfo?.email || '-'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>性别</div>
                  <div className={styles.infoContent}>
                    {userinfo?.gender ? genderMap[userinfo?.gender] : '-'}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>组织机构</div>
                  <div className={styles.infoContent}>
                    {userinfo?.orgs && userinfo.orgs.length > 0
                      ? userinfo?.orgs.map(
                          (org, n) => `${n !== 0 ? ', ' : ''}${org.name || org.org_name}`,
                        )
                      : '-'}
                  </div>
                </div>

                {/* todo */}
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>工号</div>
                  <div className={styles.infoContent}>{userinfo?.user_job_number || '-'}</div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>用户来源</div>
                  <div className={styles.infoContent}>{formatUserSource(userinfo?.come_from)}</div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>用户状态</div>
                  <div className={styles.infoContent}>
                    {userinfo?.status ? statusMap[userinfo?.status] : '-'}
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>创建时间</div>
                  <div className={styles.infoContent}>
                    {formatDateTime(userinfo?.create_time) || '--'}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>开始时间</div>
                  <div className={styles.infoContent}>
                    {userinfo?.start_date
                      ? formatDateTime(moment(userinfo?.start_date).valueOf())
                      : '--'}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>结束时间</div>
                  <div className={styles.infoContent}>
                    {userinfo?.start_date
                      ? formatDateTime(moment(userinfo?.end_date).valueOf())
                      : '--'}
                  </div>
                </div>
              </Col>
              <Col span={10}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>头像</div>
                  <div className={styles.infoContent}>
                    {userinfo?.picture ? (
                      <Avatar
                        src={userinfo.picture}
                        size={80}
                        shape="square"
                        alt={userinfo?.username}
                      />
                    ) : (
                      <Avatar
                        src={require('@/../public/images/default-avatar.png')}
                        size={80}
                        shape="square"
                        alt={userinfo?.username}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          <Card className={styles.userInfo} title="扩展属性" style={{ marginBottom: '24px' }}>
            <Row>
              <Col span={10}>{createAttrs()}</Col>
            </Row>
          </Card>
        </>
      ) : (
        <PageLoading />
      )}
    </PageContainer>
  );
};
export default UserInfo;
