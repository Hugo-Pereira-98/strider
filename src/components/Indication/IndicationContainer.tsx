import { useRouter as useRouterNavigation } from 'next/navigation';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { ArrowLeft } from '../Icons/ArrowLeft';
import { Container } from '../ui/Container';
import { Close } from '../Icons/Close';
import { IndicationLeaveModal } from '../Modal/IndicationLeaveModal';
import { FeaturedIcon } from '../FeaturedIcon';
import { getLocalStorage, removeLocalStorage } from '../../utils/localStorage';

interface SvgProps {
  [x: string]: any;
}

interface IndicationContainerProps {
  title: string;
  subtitle: string;
  icon(props: SvgProps): ReactElement;
  children: React.ReactNode;
  redirect?: string;
}

export function IndicationContainer({
  children,
  icon: Icon,
  title,
  subtitle,
  redirect,
}: IndicationContainerProps) {
  const router = useRouterNavigation();
  const { pathname, query } = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const step = query.step;
  const currentStep = step?.includes('terms')
    ? 'terms'
    : step?.includes('structure')
    ? 'structure'
    : step;

  return (
    <div className="max-w-[632px] px-6 mx-auto bg-[url(/assets/auth-bg-pattern.svg)] dark:bg-[url(/assets/auth-bg-pattern-dark.svg)] bg-[center_top] bg-no-repeat pb-8">
      <div className="mt-6">
        <div className="flex items-center justify-between ">
          <button
            type="button"
            className="flex items-center gap-[6px] text-gray-light-600 dark:text-gray-dark-400 body-small-semibold hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 hover:text-gray-light-700 dark:hover:text-gray-dark-200 py-2 px-3 rounded-md"
            onClick={() => {
              if (redirect) {
                router.push(redirect);
              }
              if (pathname === '/indication') {
                removeLocalStorage('bid');
                removeLocalStorage('offer');
              }
              if (currentStep?.includes('terms')) {
                removeLocalStorage('bid-update');
                removeLocalStorage('offer-update');
              }
            }}
          >
            <ArrowLeft className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
            Back
          </button>

          <button
            type="button"
            className="flex lg:hidden items-center gap-[6px] text-gray-light-600 dark:text-gray-dark-400 body-small-semibold hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 hover:text-gray-light-700 dark:hover:text-gray-dark-200 p-3 rounded-md"
            onClick={() => setModalOpen(true)}
          >
            <Close />
          </button>
        </div>

        <header className="flex flex-col items-center">
          <FeaturedIcon>
            <Icon className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          </FeaturedIcon>
          <h1 className="heading-extra-small-semibold md:heading-small-semibold text-gray-light-950 dark:text-gray-dark-50 mb-3 mt-6">
            {title}
          </h1>
          <h2 className="body-medium-regular text-gray-light-600 dark:text-gray-dark-400 text-center max-w-[490px]">
            {subtitle}
          </h2>
        </header>
      </div>

      {children}

      {modalOpen && (
        <IndicationLeaveModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
