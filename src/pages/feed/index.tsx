import { HomeLine } from '../../components/Icons/HomeLine';
import { InstitutionalLayout } from '../../layouts/InstitutionalLayout';

const sessions = [
  {
    text: '',
    icon: (
      <HomeLine className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
    ),
  },
  {
    text: 'Feed',
  },
];

export default function Feed() {
  return (
    <InstitutionalLayout sessions={sessions}>
      <div>feed</div>
    </InstitutionalLayout>
  );
}
