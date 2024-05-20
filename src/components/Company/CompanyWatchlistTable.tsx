import { IOrganizationDTO } from '@/dtos';
import { itemsPerPage } from '@/pages/companies';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IoBusinessOutline } from 'react-icons/io5';
import { ArrowLeft } from '../Icons/ArrowLeft';
import { ArrowRight } from '../Icons/ArrowRight';
import { Dot } from '../Icons/Dot';
import { Search } from '../Icons/Search';
import Badge from '../ui/Badge';
import Button from '../Button';
import InputField from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { Table } from '../ui/Table';
import Pagination from '../ui/Table/Pagination';
import { TableData } from '../ui/Table/TableData';
import { TableHead } from '../ui/Table/TableHead';
import { ORGANIZATIONS_WATCHLISTED } from '@/utils/queries';
import { WATCHLIST_ORGANIZATION } from '@/utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import { Star } from '../Icons/Star';
import { useEffect, useState } from 'react';

interface CompanyWatchlistTableProps {
  currentItems: IOrganizationDTO[];
  formattedOrganizations?: IOrganizationDTO[];
  organizationsLoading: boolean;
  initialText: string;
  currentPage: number;
  setInitialText(initialText: string): void;
  handlePrevious(): void;
  handleNext(): void;
  handlePageChange(page: number): void;
  emptyMessage?: string;
}

export function CompanyWatchlistTable({
  organizationsLoading,
  currentItems,
  formattedOrganizations,
  initialText,
  setInitialText,
  handlePrevious,
  currentPage,
  handleNext,
  handlePageChange,
  emptyMessage,
}: CompanyWatchlistTableProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { data: watchlistedData } = useQuery(ORGANIZATIONS_WATCHLISTED);

  const isWatchlisted = (slug: string) => localWatchlistedSlugs.has(slug);

  const [localWatchlistedSlugs, setLocalWatchlistedSlugs] = useState(new Set());

  useEffect(() => {
    const initialWatchlistedSlugs = new Set(
      watchlistedData?.organizationsWatchListed.map((org: any) => org.slug)
    );
    setLocalWatchlistedSlugs(initialWatchlistedSlugs);
  }, [watchlistedData]);

  const [watchListOrganization] = useMutation(WATCHLIST_ORGANIZATION, {
    onCompleted: () => {
      refetchWatchlistedOrganizations();
    },
    update: (cache, { data: { watchListOrganization } }) => {},
    optimisticResponse: (variables) => ({
      watchListOrganization: !isWatchlisted(variables.slug),
    }),
  });

  const toggleWatchlist = async (slug: string) => {
    setLocalWatchlistedSlugs((prevState) => {
      const updatedState = new Set(prevState);
      if (updatedState.has(slug)) {
        updatedState.delete(slug);
      } else {
        updatedState.add(slug);
      }
      return updatedState;
    });

    await watchListOrganization({
      variables: { slug },
    }).catch((error) => {
      console.error('Error updating watchlist status:', error);
    });
  };
  const { refetch: refetchWatchlistedOrganizations } = useQuery(
    ORGANIZATIONS_WATCHLISTED,
    { skip: true }
  );

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
    <div className="lg:border border-gray-light-200 dark:border-gray-dark-800 rounded-xl lg:shadow-extra-small">
      <div className="lg:px-6 py-8 border-b border-gray-light-200 dark:border-gray-dark-800 space-y-[18px] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            All Companies
          </p>
          {formattedOrganizations && formattedOrganizations.length > 0 && (
            <Badge
              label={
                formattedOrganizations.length === 1
                  ? `${formattedOrganizations.length} company`
                  : `${formattedOrganizations.length} companies`
              }
              color="primary"
              badgeType="outlined"
              corners="pill"
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="max-w-[400px] w-full">
            <InputField
              leadIcon={
                <Search className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
              }
              placeholder="Search companies"
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
            />
          </div>

          {/* <div className="w-fit">
						<Button label="Filters" buttonType="secondaryGray" leftIcon={<FilterLines />} />
					</div> */}
        </div>
      </div>

      {organizationsLoading ? (
        <div className="flex justify-center py-4">
          <Spinner color="black" />
        </div>
      ) : currentItems.length > 0 ? (
        <>
          <Table>
            <thead className="border-b border-gray-light-200 dark:border-gray-dark-800">
              <tr>
                <TableHead />
                <TableHead className="!px-0">
                  <div className="w-full border-b border-gray-light-400 dark:border-gray-dark-800" />
                </TableHead>
                <TableHead className="label-small-medium text-gray-light-600 !px-0">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-b border-gray-light-400 dark:border-gray-dark-800" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-gray-dark-950 px-4 w-48 text-center">
                        Secondary Market
                      </span>
                    </div>
                  </div>
                </TableHead>
                <TableHead className="!px-0">
                  <div className="w-full border-b border-gray-light-400 dark:border-gray-dark-800" />
                </TableHead>
                <TableHead className="!px-0">
                  <div className="sm:w-10 lg:w-20 border-b border-gray-light-400 dark:border-gray-dark-800" />
                </TableHead>
                <TableHead className="label-small-medium text-gray-light-600 !px-1 w-12">
                  <div className="flex items-center gap-4">
                    <div className="w-full border-b border-gray-light-400 dark:border-gray-dark-800" />
                    <span className="pl-2">Last</span>
                  </div>
                </TableHead>
                <TableHead className="label-small-medium text-gray-light-600 !px-0">
                  <div className="flex items-center">
                    <span className="pr-6">Round</span>
                    <div className="w-full border-b border-gray-light-400 dark:border-gray-dark-800" />
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </tr>

              <tr>
                <TableHead>Company</TableHead>
                <TableHead>Market Depth</TableHead>
                <TableHead>Price Per Share</TableHead>
                <TableHead>Valuation</TableHead>
                {/* <TableHead>Premium</TableHead> */}
                <TableHead>Price Per Share</TableHead>
                <TableHead>Valuation</TableHead>
                <TableHead></TableHead>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((organization) => {
                const company = organization?.company;

                return (
                  <tr
                    key={organization?.slug}
                    className="group hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/company/${encodeURIComponent(
                          organization?.slug.toLowerCase().replace(/\s+/g, '-')
                        )}`
                      )
                    }
                  >
                    <TableData className="min-w-[250px]">
                      <div className="flex gap-3">
                        <Star
                          filled={isWatchlisted(organization.slug)}
                          className={`stroke-current ${
                            isWatchlisted(organization.slug)
                              ? resolvedTheme === 'dark'
                                ? 'fill-[#61646c]'
                                : 'fill-[#98a2b3]'
                              : 'fill-none opacity-0 group-hover:opacity-100'
                          } ${
                            resolvedTheme === 'dark'
                              ? 'text-[#61646c]'
                              : 'text-[#98a2b3]'
                          } transition-opacity duration-150`}
                          width={24}
                          height={24}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(organization.slug);
                          }}
                        />

                        <div className="flex items-center gap-2">
                          {renderLogoOrIcon(organization?.organizationBranding)}
                          {organization?.name}
                        </div>
                      </div>
                    </TableData>

                    <TableData className="min-w-[180px]">
                      <div className="w-fit">
                        <Badge
                          badgeType="outlined"
                          color="tertiary"
                          label={
                            <div className="flex items-center gap-1">
                              <Dot className="fill-success-500" />
                              Strong
                            </div>
                          }
                        />
                      </div>
                    </TableData>
                    <TableData>
                      {isNaN(
                        parseFloat(
                          company?.shareClasses?.[0]?.issuedPrice as string
                        )
                      )
                        ? '-'
                        : `$${parseFloat(
                            company?.shareClasses?.[0]?.issuedPrice as string
                          ).toFixed(2)}`}
                    </TableData>
                    <TableData>
                      {company?._formattedPostMoneyValuation === 'NaN'
                        ? '-'
                        : `$${company?._formattedPostMoneyValuation}`}
                    </TableData>
                    {/* <TableData className="min-w-[130px]">
                      <div className="w-fit">
                        <Badge
                          badgeType="outlined"
                          size="md"
                          corners="pill"
                          color="success"
                          label="20%"
                        />
                      </div>
                    </TableData> */}
                    <TableData className="min-w-[150px]">
                      {isNaN(
                        parseFloat(
                          company?.shareClasses?.[0]?.issuedPrice as string
                        )
                      )
                        ? '-'
                        : `$${parseFloat(
                            company?.shareClasses?.[0]?.issuedPrice as string
                          ).toFixed(2)}`}
                    </TableData>
                    <TableData className="min-w-[140px] 4xl:min-w-[120px] 5xl:min-w-[150px]">
                      {company?._formattedPostMoneyValuation === 'NaN'
                        ? '-'
                        : `$${company?._formattedPostMoneyValuation}`}
                    </TableData>
                    <TableData
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/indication?id=${company?.id}&title=${organization?.name}&logo=${organization?.organizationBranding?.symbol}&subtitle=${company?.subtitle}`
                        );
                      }}
                    >
                      {company && (
                        <span className="text-primary-700 body-small-semibold dark:text-gray-dark-300 hover:text-primary-800 dark:hover:text-gray-dark-100">
                          Trade
                        </span>
                      )}
                    </TableData>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="flex items-center justify-between px-6 pb-4 pt-3 border-t border-gray-light-200 dark:border-gray-dark-800">
            <div>
              <Button
                leftIcon={
                  <ArrowLeft className="stroke-gray-light-700 dark:stroke-gray-dark-500 group-disabled:stroke-gray-light-700/40 dark:group-disabled:stroke-gray-dark-500" />
                }
                className="hidden md:flex"
                label="Previous"
                buttonType="secondaryGray"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              />
              <Button
                leftIcon={
                  <ArrowLeft className="stroke-gray-light-700 dark:stroke-gray-dark-500 group-disabled:stroke-gray-light-700/40 dark:group-disabled:stroke-gray-dark-500" />
                }
                className="!px-2 !py-2 !gap-0 md:hidden"
                label=""
                buttonType="secondaryGray"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              />
            </div>

            <Pagination
              className="hidden md:block"
              currentPage={currentPage}
              perPage={itemsPerPage}
              totalItems={
                watchlistedData?.organizationsWatchListed?.length || 0
              }
              onPageChange={handlePageChange}
            />

            <div className="body-small-regular md:hidden">
              Page {currentPage} of{' '}
              {watchlistedData?.organizationsWatchListed?.length}
            </div>

            <div>
              <Button
                rightIcon={
                  <ArrowRight className="stroke-gray-light-700 dark:stroke-gray-dark-300 group-disabled:stroke-gray-light-700/40 dark:group-disabled:stroke-gray-dark-500" />
                }
                className="hidden md:flex"
                label="Next"
                buttonType="secondaryGray"
                onClick={handleNext}
                disabled={
                  currentPage ===
                  Math.ceil(
                    (watchlistedData?.organizationsWatchListed?.length || 0) /
                      itemsPerPage
                  )
                }
              />
              <Button
                rightIcon={
                  <ArrowRight className="stroke-gray-light-700 dark:stroke-gray-dark-300 group-disabled:stroke-gray-light-700/40 dark:group-disabled:stroke-gray-dark-500" />
                }
                className="!px-2 !py-2 !gap-0 md:hidden"
                label=""
                buttonType="secondaryGray"
                onClick={handleNext}
                disabled={
                  currentPage ===
                  Math.ceil(
                    (watchlistedData?.organizationsWatchListed?.length || 0) /
                      itemsPerPage
                  )
                }
              />
            </div>
          </div>
        </>
      ) : (
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
            {emptyMessage ? (
              <p className="text-gray-light-950 dark:text-gray-dark-50 body-medium-semibold">
                {emptyMessage}
              </p>
            ) : (
              <p className="text-gray-light-950 dark:text-gray-dark-50 body-medium-semibold">
                We don&apos;t have any company
              </p>
            )}
            {/* <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-[350px]">
              We are still working on it.
            </p> */}
          </div>
          <div className="mt-6">
            <Button
              label="New indication"
              onClick={() => router.push('/indication')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
