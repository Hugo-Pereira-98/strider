import { Building } from '@/components/Icons/Building';
import { CheckCircle } from '@/components/Icons/CheckCircle';
import { Cube } from '@/components/Icons/Cube';
import { Sliders } from '@/components/Icons/Sliders';
import { IndicationLeaveModal } from '@/components/Modal/IndicationLeaveModal';
import Button from '@/components/Button';
import { getFormType } from '@/utils/functions';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SideItem from './SideItem';

export default function IndicationSideNavigation() {
  const { pathname, asPath } = useRouter();
  const formType = getFormType(pathname);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    history.pushState(null, '', location.href);

    function handleBackButton() {
      setModalOpen(true);
      history.go(1);
    }

    window.addEventListener('popstate', handleBackButton);
    () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  return (
    <>
      <div className="bg-gray-light-50 dark:bg-gray-dark-900 min-w-[320px] w-[440px] md:flex flex-col sticky bottom-0 top-0 h-screen hidden">
        <div className="bg-[url(/assets/featured-header-content.svg)] dark:bg-[url(/assets/featured-header-content-dark.svg)] h-[224px] w-[223px]" />

        <div className="mt-8 md:-mt-12 px-6 lg:px-8 flex-1">
          <SideItem
            title="Company"
            description="Select a company"
            icon={Building}
            isCurrentItem={pathname === '/indication'}
          />

          <SideItem
            title="Price & Volume"
            description="Set price and volume"
            icon={Sliders}
            isCurrentItem={asPath === `/indication/${formType}/terms`}
          />

          <SideItem
            title="Structure"
            description="Select investment instrument"
            icon={Cube}
            isCurrentItem={asPath === `/indication/${formType}/structure`}
          />

          <SideItem
            title="Review & Submit"
            description="Review and confirm your indication"
            icon={CheckCircle}
            isCurrentItem={asPath === `/indication/${formType}/review`}
            border={false}
          />
        </div>

        <div className="p-8">
          <div className="w-fit">
            <Button
              label="Exit"
              buttonType="secondaryGray"
              onClick={() => setModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {modalOpen && (
        <IndicationLeaveModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
