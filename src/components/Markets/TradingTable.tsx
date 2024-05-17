import { IndicationDTO } from '@/dtos';
import useSize from '@/hooks/useSize';
import { itemsPerPage } from '@/pages/companies';
import { formatNumber } from '@/utils/functions';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dropdown } from '../Dropdown';
import { Archive } from '../Icons/Archive';
import { ArrowDown } from '../Icons/ArrowDown';
import { ArrowLeft } from '../Icons/ArrowLeft';
import { ArrowRight } from '../Icons/ArrowRight';
import { Building } from '../Icons/Building';
import { HelperCircle } from '../Icons/HelperCircle';
import { Search } from '../Icons/Search';
import { TriangleMedium } from '../Icons/TriangleMedium';
import { TriangleMediumDown } from '../Icons/TriangleMediumDown';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import InputField from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { Table } from '../ui/Table';
import Pagination from '../ui/Table/Pagination';
import { StickyTableData } from '../ui/Table/StickyTableData';
import { StickyTableHead } from '../ui/Table/StickyTableHead';
import { TableData } from '../ui/Table/TableData';
import { TableHead } from '../ui/Table/TableHead';

interface IndicationTableProps {
  tradings: IndicationDTO[] | any;
  currentItems: IndicationDTO[];
  tradingsLoading: boolean;
  initialText: string;
  currentPage: number;
  setInitialText(initialText: string): void;
  handlePrevious(): void;
  handleNext(): void;
  handlePageChange(page: number): void;
  handleSort(field: 'pricePerShare' | 'size'): void;
  formatStructure(indication: IndicationDTO): string;
  setArchiveIndicationId(value: number): void;
  openArchiveModal(value: boolean): void;
}

export function TradingTable({
  tradings,
  tradingsLoading,
  currentItems,
  initialText,
  setInitialText,
  handlePrevious,
  currentPage,
  handleNext,
  handlePageChange,
  handleSort,
  formatStructure,
  setArchiveIndicationId,
  openArchiveModal,
}: IndicationTableProps) {
  const router = useRouter();

  const [width] = useSize();

  const isDesktop = width > 1024;

  return (
    <div className="lg:border border-gray-light-200 dark:border-gray-dark-800 rounded-xl lg:shadow-extra-small">
      <div className="lg:px-6 py-8 border-b border-gray-light-200 dark:border-gray-dark-800 space-y-[18px] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            Active Deals
          </p>
          {tradings && tradings.length > 0 && (
            <Badge
              label={
                tradings.length === 1
                  ? `${tradings.length} trading`
                  : `${tradings.length} tradings`
              }
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

      {tradingsLoading ? (
        <div className="flex justify-center py-4">
          <Spinner color="black" />
        </div>
      ) : tradings && tradings.length > 0 ? (
        <>
          <Table>
            <thead className="border-b border-gray-light-200 dark:border-gray-dark-800">
              <tr>
                {isDesktop ? (
                  <StickyTableHead stickyPosition="left">
                    Company
                  </StickyTableHead>
                ) : (
                  <TableHead verticalPaddingClass="small">Company</TableHead>
                )}
                <TableHead verticalPaddingClass="small">Direction</TableHead>
                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('pricePerShare')}
                  >
                    Price
                    <HelperCircle className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>
                <TableHead
                  className="flex items-center gap-1"
                  verticalPaddingClass="small"
                >
                  vs. Last Round
                  <HelperCircle className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                </TableHead>
                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('size')}
                  >
                    Size
                    <HelperCircle className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>
                <TableHead verticalPaddingClass="small">Instrument</TableHead>
                <TableHead verticalPaddingClass="small">Share Class</TableHead>
                <TableHead verticalPaddingClass="small">
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() => handleSort('pricePerShare')}
                  >
                    Updated
                    <ArrowDown className="stroke-gray-light-600 dark:stroke-gray-dark-400" />
                  </button>
                </TableHead>
                <TableHead verticalPaddingClass="small"></TableHead>
                {isDesktop ? (
                  <StickyTableHead stickyPosition="right"></StickyTableHead>
                ) : (
                  <TableHead verticalPaddingClass="small"></TableHead>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((indication, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 cursor-pointer"
                  onClick={() => router.push(`/markets/${indication.id}`)}
                >
                  {isDesktop ? (
                    <StickyTableData stickyPosition="left">
                      <div className="flex items-center gap-2">
                        <div className="bg-white rounded-md flex items-center justify-center w-[30px] h-[30px]">
                          <Image
                            src={
                              indication.symbolDark || '/placeholder-logo.png'
                            }
                            width={30}
                            height={30}
                            alt="Company logo"
                          />
                        </div>
                        <p className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
                          {indication.organizationName}
                        </p>
                      </div>
                    </StickyTableData>
                  ) : (
                    <TableData verticalPaddingClass="small">
                      <div className="flex items-center gap-2">
                        <div className="bg-white rounded-md flex items-center justify-center w-[30px] h-[30px]">
                          <Image
                            src={
                              indication.symbolDark || '/placeholder-logo.png'
                            }
                            width={30}
                            height={30}
                            alt="Company logo"
                          />
                        </div>
                        <p className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
                          {indication.organizationName}
                        </p>
                      </div>
                    </TableData>
                  )}

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
                    <p className="text-gray-light-600 dark:text-gray-dark-400 body-small-regular">
                      {+indication?.targetValuation === 0
                        ? '-'
                        : `$${formatNumber(+indication?.targetValuation)}`}
                    </p>
                  </TableData>
                  <TableData verticalPaddingClass="small">
                    <div className="w-fit">
                      <Badge
                        badgeType="outlined"
                        size="md"
                        corners="pill"
                        color="success"
                        label="20%"
                      />
                    </div>
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
                  <TableData verticalPaddingClass="small">Any</TableData>
                  <TableData verticalPaddingClass="small">
                    an hour ago
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
                          router.push(
                            `/company/${indication.organizationName
                              ?.toLowerCase()
                              .replace(/\s/, '')}`
                          );
                        }}
                        className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer outline-none"
                      >
                        <Building
                          width={16}
                          height={16}
                          className="stroke-gray-light-500 dark:stroke-gray-dark-400"
                        />
                        Company profile
                      </DropdownMenu.Item>

                      {/* <DropdownMenu.Item className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer">
												<Star width={16} height={16} className="stroke-gray-light-500" />
												Remove from watchlist
											</DropdownMenu.Item>
											<DropdownMenu.Item className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 cursor-pointer">
												<Edit />
												Modify indication
											</DropdownMenu.Item> */}
                      <DropdownMenu.Item
                        className="w-full text-left px-4 py-3 body-small-medium hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t dark:border-gray-dark-800 flex items-center gap-2 text-error-600 dark:text-error-400 cursor-pointer outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          openArchiveModal(true);
                        }}
                      >
                        <Archive className="stroke-error-600 dark:stroke-error-400" />
                        Archive indication
                      </DropdownMenu.Item>
                    </Dropdown>
                  </TableData>
                  {isDesktop ? (
                    <StickyTableData stickyPosition="right">
                      <Button
                        className="text-neutral-600 dark:text-gray-dark-300 shadow-none bg-transparent border-none"
                        label="View"
                        rightIcon={
                          <ArrowRight className="stroke-gray-light-700 dark:stroke-gray-dark-300 " />
                        }
                      />
                    </StickyTableData>
                  ) : (
                    <TableData verticalPaddingClass="small">
                      <Button
                        className="text-neutral-600 dark:text-gray-dark-300 shadow-none bg-transparent border-none"
                        label="View"
                        rightIcon={
                          <ArrowRight className="stroke-gray-light-700 dark:stroke-gray-dark-300 " />
                        }
                      />
                    </TableData>
                  )}
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
              totalItems={tradings?.length || 0}
              onPageChange={handlePageChange}
            />

            <div className="body-small-regular md:hidden">
              Page {currentPage} of {tradings?.length}
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
                  Math.ceil((tradings?.length || 0) / itemsPerPage)
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
                  Math.ceil((tradings?.length || 0) / itemsPerPage)
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
              You don&apos;t have any active tradings
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
