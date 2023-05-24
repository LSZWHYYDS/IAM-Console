import React, { useEffect, useRef, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Table } from 'antd';
import { history } from 'umi';

import type { ChildRef } from '@/components/ModalMappingList';
import ModalMappingList from '@/components/ModalMappingList';
import { getList } from './service';
import { AppstoreTwoTone } from '@ant-design/icons';
import { uniqBy } from 'lodash';
// import ProTable from '@ant-design/pro-table';
type MappingComponentParams = 'id' | 'type' | 'name' | 'logoType';

const ProfileConfig: React.FC = () => {
  const ChildRefs = useRef<ChildRef>(null);
  const [pageSize, setPageSize] = useState(10);
  const [dataList, setDataList] = useState<any>([]);
  const [mappingComponentParams, setMappingComponentParams] =
    useState<Record<MappingComponentParams, string>>();
  const ModalMappingListComponent = ModalMappingList<string | undefined>();
  // const tableRef = useRef<any>(null);

  useEffect(() => {
    getList({}).then((res) => {
      const temporaryArray: any = [...res?.data];
      temporaryArray?.unshift({
        id: null,
        name: 'Digitalsee',
        app_flag: 'DIGITALSEE',
        ref_id: '9999',
        ref_type: 'Digitalsee',
        org_and_user_profile: null,
        user_mapping: null,
        org_mapping: null,
      });
      const filterArr = uniqBy(temporaryArray, 'ref_id');
      setDataList(filterArr);
    });
  }, []);

  useEffect(() => {
    if (Object.values(mappingComponentParams || {}).length) {
      ChildRefs.current?.showModal();
    }
  }, [mappingComponentParams]);
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };

  const imgType = {
    DINGDING: '/uc/images/linker/dingding.png',
    LDAP: '/uc/images/linker/ldap.png',
    FEISHU: '/uc/images/linker/feishu.png',
    AZUREAD: '/uc/images/linker/azuread.png',
    OIDC: '/uc/images/linker/oidc.png',
    AD: '/uc/images/linker/ad.png',
    ETL: '/uc/images/linker/etl.png',
    DIGITALSEE: '/uc/images/favicon.png',
  };

  // 列表
  const cols = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => [
        <Button
          key={record.ref_type}
          type="link"
          onClick={() => {
            if (record.ref_type === 'Digitalsee') {
              history.push(`/users/userExtendAttr`);
            } else {
              history.push(
                `/users/profileConfig/detail?id=${record.ref_id}&type=${record.ref_type}&name=${record.name}&logoType=${record?.app_flag}`,
              );
            }
          }}
        >
          <Avatar
            src={imgType[record?.app_flag]}
            icon={<AppstoreTwoTone />}
            style={{ backgroundColor: '#fff', marginRight: 10 }}
          />
          {value}
        </Button>,
      ],
    },
    {
      title: '类型',
      dataIndex: 'ref_type',
      hideInSearch: true,
      width: '15%',
      key: 'ref_type',
      render: (value) => {
        const list = {
          IDP: '企业认证源',
          CONNECTOR: '通讯录集成',
        };
        return list[value] || value;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record: any) => [
        <Button
          key={record.name}
          type="link"
          onClick={() => {
            if (record.ref_type === 'Digitalsee') {
              history.push(`/users/userExtendAttr`);
            } else {
              history.push(
                `/users/profileConfig/detail?id=${record.ref_id}&type=${record.ref_type}&name=${record.name}&logoType=${record?.app_flag}`,
              );
            }
          }}
        >
          编辑
        </Button>,
        <Button
          key={record.name}
          type="link"
          style={{
            opacity: record.ref_type == 'Digitalsee' ? 0 : 1,
            visibility: record.ref_type == 'Digitalsee' ? 'hidden' : 'visible',
          }}
          onClick={() => {
            setMappingComponentParams({
              id: record?.ref_id,
              type: record?.ref_type,
              name: record?.name,
              logoType: record?.app_flag,
            });
          }}
        >
          映射
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer title={false}>
      <Table
        className="minHeight"
        rowKey="ref_id"
        dataSource={dataList}
        columns={cols}
        pagination={{
          total: dataList.length,
          showTotal: (total) => {
            return `总数 ${total}`;
          },
          defaultPageSize: 10,
          defaultCurrent: 1,
          showSizeChanger: true,
          pageSize,
          onChange: onPageSize,
        }}
      />
      <ModalMappingListComponent
        id={mappingComponentParams?.id}
        type={mappingComponentParams?.type}
        name={mappingComponentParams?.name}
        ref={ChildRefs}
        logoType={mappingComponentParams?.logoType}
      />
    </PageContainer>
  );
};
export default ProfileConfig;
