import Logo from '@/assets/logo.svg';
import MessageBox from '@/components/MessageBox';
import { GlobalContext } from '@/context';
import defaultLocale from '@/locale';
import { GlobalState } from '@/store';
import storage from '@/utils/storage';
import useLocale from '@/utils/useLocale';
import {
  Avatar, Divider, Dropdown, Input, Menu, Message, Select, Tooltip
} from '@arco-design/web-react';
import {
  IconDashboard, IconExperiment, IconInteraction, IconLanguage, IconMoonFill, IconNotification, IconPoweroff, IconSettings, IconSunFill, IconUser
} from '@arco-design/web-react/icon';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Settings from '../Settings';
import IconButton from './IconButton';
import styles from './style/index.module.less';

function Navbar() {
  const t = useLocale();
  const theme = useSelector((state: GlobalState) => state.theme);
  const userInfo = useSelector((state: GlobalState) => state.userInfo);
  const dispatch = useDispatch();

  const { setLang } = useContext(GlobalContext);

  function logout() {
    storage.setItem('userStatus', 'logout');
    window.location.href = '/login';
  }

  function onMenuItemClick(key) {
    if (key === 'logout') {
      logout();
    } else {
      Message.info(`You clicked ${key}`);
    }
  }

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.Item key="user info">
        <IconUser className={styles['dropdown-icon']} />
        {t['menu.user.info']}
      </Menu.Item>
      <Menu.Item key="setting">
        <IconSettings className={styles['dropdown-icon']} />
        {t['menu.user.setting']}
      </Menu.Item>
      <Menu.SubMenu
        key="more"
        title={
          <div style={{ width: 80 }}>
            <IconExperiment className={styles['dropdown-icon']} />
            {t['message.seeMore']}
          </div>
        }
      >
        <Menu.Item key="workplace">
          <IconDashboard className={styles['dropdown-icon']} />
          {t['menu.dashboard.workplace']}
        </Menu.Item>
        <Menu.Item key="card list">
          <IconInteraction className={styles['dropdown-icon']} />
          {t['menu.list.cardList']}
        </Menu.Item>
      </Menu.SubMenu>
      <Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="logout">
        <IconPoweroff className={styles['dropdown-icon']} />
        {t['navbar.logout']}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Logo />
          <div className={styles['logo-name']}>Blog Backend</div>
        </div>
      </div>
      <ul className={styles.right}>
        <li>
          <Input.Search className={styles.round} placeholder="Please search" />
        </li>
        <li>
          <Select
            triggerElement={<IconButton icon={<IconLanguage />} />}
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'English', value: 'en-US' },
            ]}
            value={storage.getItem('arco-lang')}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'br',
            }}
            trigger="hover"
            onChange={(value) => {
              storage.setItem('arco-lang', value);
              setLang(value);
              const nextLang = defaultLocale[value];
              Message.info(`${nextLang['message.lang.tips']}${value}`);
            }}
          />
        </li>
        <li>
          <MessageBox>
            <IconButton icon={<IconNotification />} />
          </MessageBox>
        </li>
        <li>
          <Tooltip
            content={
              theme === 'light'
                ? t['settings.navbar.theme.toDark']
                : t['settings.navbar.theme.toLight']
            }
          >
            <IconButton
              icon={theme === 'light' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() =>
                dispatch({
                  type: 'toggle-theme',
                  payload: { theme: theme === 'light' ? 'dark' : 'light' },
                })
              }
            />
          </Tooltip>
        </li>
        <Settings />
        {userInfo && (
          <li>
            <Dropdown droplist={droplist} position="br">
              <Avatar size={32} style={{ cursor: 'pointer' }}>
                <img alt="avatar" src={userInfo.avatar} />
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
