import React from 'react';
import styles from './NavLinkList.module.css';
import { Link } from '@tanstack/react-router';

export const NavLinkList: React.FC = () => {
  return (
    <ol>
      <NewAppointmentItem />
    </ol>
  );
};

const NewAppointmentItem: React.FC = () => {
  return (
    <li className={styles.listItem}>
      <Link to="/appointment/new" className={styles.listLink}>
        <span className={styles.listText}>새 약속 만들기</span>
      </Link>
    </li>
  );
};
