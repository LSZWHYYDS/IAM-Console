import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '数犀科技出品',
  });
  const handleClick = () => {
    window.open(`https://digitalsee.cn`);
  };
  return (
    <div>
      <div
        style={{ width: '300px', height: '60px', margin: '0 auto', cursor: 'pointer' }}
        onClick={handleClick}
      >
        <DefaultFooter
          copyright={`${new Date().getFullYear() + ' ' + defaultMessage}`}
          links={[
            {
              key: 'github',
              title: <GithubOutlined />,
              href: 'https://digitalsee.cn',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </div>
  );
};
