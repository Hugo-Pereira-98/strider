import { IndicationDTO } from '@/dtos';
import { itemsPerPage } from '@/pages/companies';
import { formatNumber } from '@/utils/functions';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IoBusinessOutline } from 'react-icons/io5';
import { Dropdown } from '../Dropdown';
import { Archive } from '../Icons/Archive';
import { ArrowDown } from '../Icons/ArrowDown';
import { ArrowLeft } from '../Icons/ArrowLeft';
import { ArrowRight } from '../Icons/ArrowRight';
import { Building } from '../Icons/Building';
import { Dot } from '../Icons/Dot';
import { Edit } from '../Icons/Edit';
import { Search } from '../Icons/Search';
import { TriangleMedium } from '../Icons/TriangleMedium';
import { TriangleMediumDown } from '../Icons/TriangleMediumDown';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import InputField from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { Table } from '../ui/Table';
import Pagination from '../ui/Table/Pagination';
import { TableData } from '../ui/Table/TableData';
import { TableHead } from '../ui/Table/TableHead';
import { ARCHIVE_INDICATION } from '@/utils/mutations';
import { useMutation, useQuery } from '@apollo/client';

import { FIND_INDICATIONS_QUERY } from '@/utils/queries';
interface IndicationTableProps {
  indications: IndicationDTO[] | null;
  currentItems: IndicationDTO[];
  indicationsLoading: boolean;
  initialText: string;
  currentPage: number;
  setInitialText(initialText: string): void;
  handlePrevious(): void;
  handleNext(): void;
  handlePageChange(page: number): void;
  handleSort(field: 'pricePerShare' | 'size' | 'valuation'): void;
  formatStructure(indication: IndicationDTO): string;
  setArchiveIndicationId(value: number): void;
  openArchiveModal(value: boolean): void;
}

export function IndicationTable({
  indications,
  indicationsLoading,
  currentItems,
  initialText,
  setInitialText,
  handlePrevious,
  currentPage,
  handleNext,
  handlePageChange,
  handleSort,
  formatStructure,
}: IndicationTableProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [archiveIndication] = useMutation(ARCHIVE_INDICATION);

  const { refetch } = useQuery(FIND_INDICATIONS_QUERY, {
    skip: true,
    fetchPolicy: 'network-only',
  });

  const renderLogoOrIcon = (indication: IndicationDTO) => {
    let imageToUse =
      resolvedTheme === 'dark'
        ? indication.symbolLight || indication.icon
        : indication.symbolDark || indication.icon;

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

  async function handleArchiveIndication(uid: string) {
    try {
      await archiveIndication({
        variables: { uid },
      });

      await refetch();
    } catch (error) {
      console.error('Error archiving indication:', error);
    }
  }

  const activeIndications =
    indications?.filter((indication) => indication.state === 'INITIATED') || [];

  return (
    <div className="lg:border border-gray-light-200 dark:border-gray-dark-800 rounded-xl lg:shadow-extra-small">
      <div className="lg:px-6 py-8 border-b border-gray-light-200 dark:border-gray-dark-800 space-y-[18px] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            Active Indications
          </p>
          {indications && indications.length > 0 && (
            <Badge
              label={`${activeIndications.length} indication${
                activeIndications.length > 1 ? 's' : ''
              }`}
              color="primary"
              size="md"
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
              placeholder="Search indications"
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
            />
          </div>

          {/* <div className="w-fit">
						<Button label="Filters" buttonType="secondaryGray" leftIcon={<FilterLines />} />
					</div> */}
        </div>
      </div>

      {indicationsLoading ? (
        <div className="flex justify-center py-4">
          <Spinner color="black" />
        </div>
      ) : indications && indications.length > 0 ? (
        <>
          <Table>
            <thead className="border-b border-gray-light-200 dark:border-gray-dark-800">
              <tr>
                <TableHead verticalPaddingClass="small">Company</TableHead>
                <TableHead verticalPaddingClass="small">Direction</TableHead>
                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('pricePerShare')}
                  >
                    Price per share
                    <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>
                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('valuation')}
                  >
                    Valuation
                    <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>

                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('size')}
                  >
                    Size
                    <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>
                <TableHead verticalPaddingClass="small">Instrument</TableHead>
                <TableHead verticalPaddingClass="small">Status</TableHead>
                <TableHead verticalPaddingClass="small"></TableHead>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((indication) => (
                <tr
                  key={indication?.uid}
                  className="hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 cursor-pointer"
                  onClick={() => router.push(`/indications/${indication?.uid}`)}
                >
                  <TableData verticalPaddingClass="small">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md flex items-center justify-center w-[30px] h-[30px]">
                        {renderLogoOrIcon(indication)}
                      </div>
                      <p className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
                        {indication.organizationName}
                      </p>
                    </div>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <div className="w-fit">
                      <Badge
                        badgeType="outlined"
                        color="tertiary"
                        label={
                          <div className="flex items-center gap-1">
                            {indication.direction === 'BUY' ? (
                              <>
                                <TriangleMedium />
                                Bid
                              </>
                            ) : (
                              <>
                                <TriangleMediumDown />
                                Offer
                              </>
                            )}
                          </div>
                        }
                      />
                    </div>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <p className="body-small-regular text-gray-light-950 dark:text-gray-dark-50">
                      {+indication?.targetSharePrice === 0
                        ? '-'
                        : `$${Number(indication.targetSharePrice).toFixed(2)}`}
                    </p>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <p className="text-gray-light-600 dark:text-gray-dark-400 body-small-regular">
                      {+indication?.targetValuation === 0
                        ? '-'
                        : `$${formatNumber(+indication?.targetValuation)}`}
                    </p>
                  </TableData>

                  <TableData verticalPaddingClass="small">
                    <p className="body-small-regular text-gray-light-950 dark:text-gray-dark-50">
                      {+indication?.targetSizeShareCount
                        ? `${formatNumber(
                            +indication.targetSizeShareCount
                          )} shares`
                        : +indication?.targetSizeNotional ||
                          +indication?.targetSizeNotional > 0
                        ? `$${formatNumber(+indication.targetSizeNotional)}`
                        : ''}
                    </p>
                    <p className="text-gray-light-600 dark:text-gray-dark-400 body-small-regular">
                      {(+indication?.minSizeNotional ||
                        +indication?.minSizeNotional > 0) &&
                      (+indication?.maxSizeNotional ||
                        +indication?.maxSizeNotional > 0)
                        ? `$${formatNumber(
                            +indication.minSizeNotional
                          )} - $${formatNumber(+indication.maxSizeNotional)}`
                        : (+indication?.minSizeShareCount ||
                            +indication?.minSizeShareCount > 0) &&
                          (+indication?.maxSizeShareCount ||
                            +indication?.maxSizeShareCount > 0)
                        ? `${formatNumber(
                            +indication.minSizeShareCount
                          )} - ${formatNumber(
                            +indication.maxSizeShareCount
                          )} shares`
                        : ''}
                    </p>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 capitalize">
                      {formatStructure(indication)}
                      {indication.maxSPVLayers > 0
                        ? `, SPV (${indication.spvMaxManagement}/${indication.spvMaxCarry})`
                        : ''}
                    </p>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <div className="w-fit">
                      <Badge
                        badgeType="outlined"
                        color="tertiary"
                        label={
                          indication?.state === 'INITIATED' ? (
                            <div className="flex items-center gap-1 ">
                              <Dot className="fill-success-500" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 ">
                              <Dot className="fill-neutral-500" />
                              Archive
                            </div>
                          )
                        }
                      />
                    </div>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <Dropdown>
                      <div className="px-4 py-3">
                        <p className="body-small-semibold text-gray-light-700 dark:text-gray-dark-300">
                          {indication.organizationName}
                        </p>
                        <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                          #{indication?.uid.toUpperCase()}
                        </span>
                      </div>

                      <DropdownMenu.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/indications/${indication?.uid}`);
                        }}
                        className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer outline-none"
                      >
                        <Building
                          width={16}
                          height={16}
                          className="stroke-gray-light-500 dark:stroke-gray-dark-400"
                        />
                        Indication profile
                      </DropdownMenu.Item>

                      {/* <DropdownMenu.Item className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer">
												<Star width={16} height={16} className="stroke-gray-light-500" />
												Remove from watchlist
											</DropdownMenu.Item> */}
                      <DropdownMenu.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            indication.direction === 'BUY'
                              ? `/indication/update/bid/terms=${indication.uid}`
                              : `/indication/update/offer/terms=${indication.uid}`
                          );
                        }}
                        className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Edit />
                        Modify indication
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={`w-full text-left px-4 py-3 body-small-medium hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer outline-none ${
                          indication.state === 'INITIATED'
                            ? 'text-error-600 dark:text-error-400'
                            : 'text-gray-light-700 dark:text-gray-dark-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveIndication(indication.uid);
                        }}
                      >
                        <Archive
                          className={`${
                            indication.state === 'INITIATED'
                              ? 'stroke-error-600 dark:stroke-error-400'
                              : 'stroke-gray-light-500 dark:stroke-gray-dark-400'
                          }`}
                        />
                        {indication.state === 'INITIATED'
                          ? 'Archive Indication'
                          : 'Activate Indication'}
                      </DropdownMenu.Item>
                    </Dropdown>
                  </TableData>
                </tr>
              ))}
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
              totalItems={indications?.length || 0}
              onPageChange={handlePageChange}
            />

            <div className="body-small-regular md:hidden">
              Page {currentPage} of {indications?.length}
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
                  Math.ceil((indications?.length || 0) / itemsPerPage)
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
                  Math.ceil((indications?.length || 0) / itemsPerPage)
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
            <p className="text-gray-light-950 dark:text-gray-dark-50 body-medium-semibold">
              You don&apos;t have any active indications
            </p>
            <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-[350px]">
              Get started with the private markets by posting a bid or offer
              indication
            </p>
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
