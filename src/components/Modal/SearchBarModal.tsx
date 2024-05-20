import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IoBusinessOutline } from 'react-icons/io5';
import { Activity } from '../Icons/Activity';
import { ArrowDown } from '../Icons/ArrowDown';
import { CornerDownLeft } from '../Icons/CornerDownLeft';
import { Search } from '../Icons/Search';
import { UserPlus } from '../Icons/UserPlus';
import Button from '../Button';

interface IRecentCompany {
  name: string;
  slug: string;
  subtitle: string;
  organizationBranding: {
    symbolDark: string;
    symbolLight: string;
    icon: string;
  };
}

interface SearchBarModalProps {
  open: boolean;
  onClose(): void;
}

const ACTIONS = [
  {
    actionIndex: 0,
    title: 'Create new indication',
    pushTo: '/indication',
    icon: (
      <Activity
        width={20}
        height={20}
        className="stroke-gray-light-500 dark:stroke-gray-dark-400"
      />
    ),
  },
  {
    actionIndex: 1,
    title: 'Invite colleagues',
    pushTo: '/settings/team',
    icon: (
      <UserPlus className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
    ),
  },
];

export function SearchBarModal({ open, onClose }: SearchBarModalProps) {
  const router = useRouter();
  const [inputSearchText, setInputSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [loadedOrganizations, setLoadedOrganizations] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredRecentCompanies, setFilteredRecentCompanies] = useState<
    IRecentCompany[]
  >([]);
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [searchText, setSearchText] = useState('');
  const { resolvedTheme } = useTheme();

  const listItemRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>(
    []
  );

  const defaultCompanyNames = [
    'OpenAI',
    'Stripe',
    'SpaceX',
    'Airtable',
    'Rippling',
    'Anthropic',
    'Bytedance',
    'River',
  ];

  const organizations = [] as any;

  const [recentCompanies, setRecentCompanies] = useState<IRecentCompany[]>([]);

  const filteredActions = ACTIONS.filter((act) =>
    act.title.toLowerCase().includes(inputSearchText.toLowerCase())
  );

  const sortedOrganizations = useMemo(() => {
    if (!organizations) return [];
    let sorted = [...organizations].sort((a, b) => {
      const indexA = defaultCompanyNames.indexOf(a.name);
      const indexB = defaultCompanyNames.indexOf(b.name);
      if (indexA > -1 && indexB > -1) return indexA - indexB;
      if (indexA > -1) return -1;
      if (indexB > -1) return 1;
      return a.name.localeCompare(b.name);
    });

    if (inputSearchText.trim()) {
      sorted = sorted.filter((org) =>
        org.name.toLowerCase().includes(inputSearchText.toLowerCase())
      );
    }

    const recentCompanySlugs = filteredRecentCompanies.map(
      (company) => company.slug
    );
    sorted = sorted.filter(
      (organization) => !recentCompanySlugs.includes(organization?.slug)
    );

    return sorted;
  }, [organizations, inputSearchText, filteredRecentCompanies]);

  useEffect(() => {
    if (inputSearchText.trim()) {
      const filtered = recentCompanies.filter((company) =>
        company.name.toLowerCase().includes(inputSearchText.toLowerCase())
      );
      setFilteredRecentCompanies(filtered);
    } else {
      setFilteredRecentCompanies(recentCompanies);
    }
  }, [recentCompanies, inputSearchText]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const handleInputChange = useCallback((e: any) => {
    const value = e.target.value;
    if (value.length <= 25) {
      setInputSearchText(value);
      setSearchText(value);
    }
  }, []);

  useEffect(() => {
    const newTotalItems =
      filteredRecentCompanies.length +
      filteredActions.length +
      sortedOrganizations.length;
    setTotalItems(newTotalItems);
  }, [
    filteredRecentCompanies,
    filteredActions,
    sortedOrganizations,
    inputSearchText,
  ]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let newIndex = selectedIndex;
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowUp':
          newIndex = Math.max(0, selectedIndex - 1);
          break;
        case 'ArrowDown':
          event.preventDefault();

          setTotalItems(
            filteredRecentCompanies.length +
              filteredActions.length +
              sortedOrganizations.length
          );
          newIndex = Math.min(totalItems - 1, selectedIndex + 1);

          break;
        case 'Enter':
          event.preventDefault();
          const totalRecent = filteredRecentCompanies.length;
          const totalActions = filteredActions.length;

          const totalRecentAndActions = totalRecent + totalActions;

          if (selectedIndex < totalRecent) {
            const selectedCompany = filteredRecentCompanies[selectedIndex];
            router.push(`/company/${selectedCompany.slug}`);
          } else if (
            selectedIndex >= totalRecent &&
            selectedIndex < totalRecentAndActions
          ) {
            const actionIndex = selectedIndex - totalRecent;
            const selectedAction = filteredActions[actionIndex];
            router.push(selectedAction.pushTo);
          } else {
            const orgIndex = selectedIndex - totalRecentAndActions;
            const selectedOrganization = sortedOrganizations[orgIndex];
            router.push(`/company/${selectedOrganization.slug}`);
          }
          onClose();
          break;

        default:
          if (event.metaKey && event.key === 'k') {
            onClose();
          }
          break;
      }

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        const listItem = listItemRefs.current[newIndex];
        if (listItem) {
          listItem.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
          });
        }
      }

      if (open && event.metaKey && event.key === 'k') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    open,
    onClose,
    filteredActions,
    sortedOrganizations,
    recentCompanies,
    router,
    selectedIndex,
  ]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    if (open) {
      document.body.classList.add('overflow-hidden');

      const firstSelectableIndex =
        filteredActions.length > 0
          ? 0
          : recentCompanies.length > 0
          ? filteredActions.length
          : filteredActions.length + recentCompanies.length;
      setSelectedIndex(firstSelectableIndex);
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, filteredActions.length, recentCompanies.length]);

  useEffect(() => {
    setLoadedOrganizations(sortedOrganizations);
    setIsSearchEmpty(
      sortedOrganizations.length === 0 && inputSearchText.trim() !== ''
    );
  }, [sortedOrganizations, inputSearchText]);

  const renderLogoOrIcon = (organizationBranding: any) => {
    let imageToUse =
      resolvedTheme === 'dark'
        ? organizationBranding?.symbolLight || organizationBranding?.icon
        : organizationBranding?.symbolDark || organizationBranding?.icon;

    return (
      <div className="rounded-sm flex items-center justify-center w-[30px] h-[30px] p-1">
        {imageToUse ? (
          <Image
            src={imageToUse}
            width={30}
            height={30}
            alt="Organization Branding"
          />
        ) : (
          <IoBusinessOutline className="w-6 h-6 text-gray-600" />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-[999] px-4">
      <div className="max-w-2xl w-full z-[999] bg-white dark:bg-gray-dark-950 rounded-xl shadow-extra-large">
        <div className="flex items-center p-4 rounded-t-xl border-b border-gray-light-200 dark:border-gray-dark-800 text-gray-light-950 dark:text-gray-dark-50 gap-2">
          <div>
            <Search className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="placeholder:text-gray-light-500 outline-none body-medium-regular w-full dark:bg-gray-dark-950"
            placeholder="Search"
            value={inputSearchText}
            onChange={handleInputChange}
          />
        </div>

        <div className="overflow-y-auto scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2">
          {inputSearchText.trim() !== '' &&
            filteredActions.length === 0 &&
            sortedOrganizations.length === 0 &&
            filteredRecentCompanies.length === 0 && (
              <div className="flex justify-center flex-col items-center text-center p-12 pt-0">
                <div className="dark:hidden">
                  <Image
                    src="/assets/featured-indication-content.svg"
                    width={416}
                    height={416}
                    alt=""
                  />
                </div>
                <div className="hidden dark:block">
                  <Image
                    src="/assets/featured-indication-content-dark.svg"
                    width={416}
                    height={416}
                    alt=""
                  />
                </div>

                <div className="-mt-40 space-y-1">
                  <p className="text-gray-light-950 dark:text-gray-dark-50 body-medium-semibold">
                    No companies found
                  </p>

                  <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-[350px]">
                    {inputSearchText.trim() !== ''
                      ? `"${inputSearchText}" did not match any companies`
                      : 'Would you like to request a company?'}
                  </p>
                </div>
                <div className="mt-6 flex gap-3 w-2/3">
                  <Button
                    label="Request a company"
                    onClick={() => setModalOpen(true)}
                    buttonType="secondaryGray"
                  />
                  <Button
                    label="New Indication"
                    onClick={() => router.push('/indication')}
                  />
                </div>
              </div>
            )}
          <>
            {filteredRecentCompanies.length > 0 && (
              <div className="py-4 border-b border-gray-light-200 dark:border-gray-dark-800">
                <small className="pb-2 px-4 block body-small-medium text-gray-light-600 dark:text-gray-dark-400">
                  Recent
                </small>
                <div className="mt-3">
                  {filteredRecentCompanies.map((company, index) => (
                    <Link
                      key={company?.slug}
                      href={`/company/${company?.slug}`}
                      ref={(el) => (listItemRefs.current[index] = el)}
                      className={`block py-2 px-4 ${
                        selectedIndex === index
                          ? 'dark:bg-gray-dark-800 bg-gray-light-50'
                          : ''
                      } hover:bg-gray-light-50 dark:hover:bg-gray-dark-800`}
                    >
                      <div className="flex items-center gap-2">
                        {company?.organizationBranding ? (
                          <>{renderLogoOrIcon(company?.organizationBranding)}</>
                        ) : (
                          <div className="w-6 h-6 border border-gray-light-200 dark:border-gray-dark-800 rounded" />
                        )}
                        <div className="space-x-2">
                          <span className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
                            {company?.name}
                          </span>
                          <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                            {company?.subtitle}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredActions.length > 0 && (
              <div className="py-4">
                {filteredActions.map((action, index) => {
                  const currentIndex = index + filteredRecentCompanies.length;
                  const isActive = selectedIndex === currentIndex;
                  const isCreateIndication = action.actionIndex === 0;
                  const isInviteColleagues = action.actionIndex === 1;

                  return (
                    <button
                      key={action.actionIndex}
                      ref={(el) => (listItemRefs.current[currentIndex] = el)}
                      type="button"
                      onClick={() => {
                        router.push(action.pushTo);
                        setTimeout(() => {
                          onClose();
                        }, 0);
                      }}
                      className={`body-small-medium text-gray-light-950 dark:text-gray-dark-50 h-10 w-full text-left px-4 flex items-center justify-between ${
                        isActive ? 'dark:bg-gray-dark-800 bg-gray-light-50' : ''
                      } hover:bg-gray-light-50 dark:hover:bg-gray-dark-800`}
                    >
                      <div className="flex items-center gap-2">
                        {action.icon}
                        {action.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {sortedOrganizations.length > 0 && (
              <div className="border-t dark:border-gray-dark-800 py-4">
                <small className="pb-2 block body-small-medium text-gray-light-600 dark:text-gray-dark-400 ml-4">
                  Companies
                </small>
                <div ref={dropdownRef} className="max-h-32">
                  {sortedOrganizations.map((organization, index) => {
                    const currentIndex =
                      filteredActions.length +
                      filteredRecentCompanies.length +
                      index;
                    return (
                      <Link
                        ref={(el) => (listItemRefs.current[currentIndex] = el)}
                        key={organization?.company?.id}
                        href={`/company/${organization?.slug}`}
                        onClick={() => {
                          router.push(`/company/${organization?.slug}`);
                          setTimeout(() => {
                            onClose();
                          }, 0);
                        }}
                        className={`block py-2  pl-4 ${
                          currentIndex === selectedIndex
                            ? 'dark:bg-gray-dark-800 bg-gray-light-50'
                            : ''
                        } hover:bg-gray-light-50 dark:hover:bg-gray-dark-800`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {organization?.organizationBranding ? (
                            <>
                              {renderLogoOrIcon(
                                organization?.organizationBranding
                              )}
                            </>
                          ) : (
                            <div className="w-6 h-6 border border-gray-light-200 dark:border-gray-dark-800 rounded" />
                          )}
                          <div className="space-x-2">
                            <span className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
                              {organization?.name}
                            </span>
                            <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                              {organization?.company?.subtitle}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        </div>

        {!isSearchEmpty && loadedOrganizations.length > 0 && (
          <div className="border-t border-gray-light-200 dark:border-gray-dark-800 rounded-b-xl px-4 py-3 body-small-semibold text-gray-light-500 dark:text-gray-dark-400 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-[6px]">
                <div className="rounded-md p-1 border border-gray-light-200 dark:border-gray-dark-800 w-fit rotate-180">
                  <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                </div>
                <div className="rounded-md p-1 border border-gray-light-200 dark:border-gray-dark-800 w-fit">
                  <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                </div>
              </div>
              <span>to navigate</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-md p-[6px] border border-gray-light-200 dark:border-gray-dark-800 w-fit">
                <CornerDownLeft className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
              </div>
              <span>to select</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-md p-[6px] border border-gray-light-200 dark:border-gray-dark-800 w-fit leading-none">
                esc
              </div>
              <span>to close</span>
            </div>
          </div>
        )}
      </div>

      <div
        className="fixed inset-0 bg-gray-light-950/70 dark:bg-gray-dark-800/70 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}
