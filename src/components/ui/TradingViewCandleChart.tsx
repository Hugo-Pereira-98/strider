import { Check } from '@/components/Icons/Check';
import { ChevronDown } from '@/components/Icons/ChevronDown';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { DummieTradingChart } from '@/utils/dummie';
import classNames from 'classnames';
import { ColorType, createChart } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';

const marketOptions = [
  { indexName: 'ApeVue 50', indexId: 'apevue-50' },
  { indexName: 'Nasdaq Private Markets', indexId: 'nasdaq-private' },
  { indexName: 'Another Index', indexId: 'another-index' },
];

export default function TradingViewCandleChart() {
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [selectedMarketOptions, setSelectedMarketOptions] = useState<string[]>(
    []
  );
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const toggleMarketDropdown = () =>
    setIsMarketDropdownOpen(!isMarketDropdownOpen);
  const dropdownRef = useRef(null);
  const marketDropdownRef = useRef(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMarketSelection = (indexId: string) => {
    setSelectedMarketOptions((prevSelections) => {
      const isSelected = prevSelections.includes(indexId);

      const newSelections = isSelected
        ? prevSelections.filter((id) => id !== indexId)
        : [...prevSelections, indexId];

      console.log(`New selections: ${newSelections}`);
      return newSelections;
    });
  };

  const menuItems = [
    { url: '/markets', text: 'Overview' },
    { url: '/markets/trading-floor', text: 'Trading Floor' },
    { url: '/markets/recently-added', text: 'Recently Added' },
    { url: '/markets/my-watchlist', text: 'My watchlist' },
  ];

  useEffect(() => {
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';

      const lightThemeColors = {
        textColor: '#475467',
        vertLinesColor: 'rgba(242, 244, 247, 1)',
        horzLinesColor: 'rgba(242, 244, 247, 1)',
        upColor: '#17B26A',
        borderUpColor: '#17B26A',
        wickUpColor: '#17B26A',
        downColor: '#F04438',
        borderDownColor: '#F04438',
        wickDownColor: '#F04438',
      };

      const darkThemeColors = {
        textColor: '#94969C',
        vertLinesColor: 'rgba(31, 36, 47, 1)',
        horzLinesColor: 'rgba(31, 36, 47, 1)',
        upColor: '#47CD89',
        borderUpColor: '#47CD89',
        wickUpColor: '#47CD89',
        downColor: '#F97066',
        borderDownColor: '#F97066',
        wickDownColor: '#838ca1',
      };

      const colors = theme === 'light' ? lightThemeColors : darkThemeColors;

      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: colors.textColor,
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { color: colors.vertLinesColor },
          horzLines: { color: colors.horzLinesColor },
        },
        timeScale: {
          borderColor: colors.vertLinesColor,
        },
        rightPriceScale: {
          borderColor: colors.vertLinesColor,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: colors.upColor,
        downColor: colors.downColor,
        borderDownColor: colors.borderDownColor,
        borderUpColor: colors.borderUpColor,
        wickDownColor: colors.wickDownColor,
        wickUpColor: colors.wickUpColor,
      });

      candleSeries.setData(DummieTradingChart);
    }
  }, [theme, windowWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef as any).current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      } else if (
        marketDropdownRef.current &&
        !(marketDropdownRef as any).current.contains(event.target as Node)
      ) {
        setIsMarketDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DefaultLayout title="Trading Floor">
      <div className="h-full w-full pt-[26px]">
        <div
          className={classNames('hidden h-8 sm:flex items-center gap-2', {
            'border-b border-gray-light-200 dark:border-gray-dark-800 mb-2':
              true,
          })}
        >
          {menuItems.map((menuItem) => (
            <div key={menuItem.url} className="relative pt-1">
              <Link
                href={menuItem.url}
                className={classNames(
                  'font-bold',
                  {
                    'text-primary-700 dark:text-gray-dark-300':
                      router.asPath === menuItem.url,
                    'text-gray-light-500 dark:text-gray-dark-400':
                      router.asPath !== menuItem.url,
                    'border-b-2 border-primary-700 dark:border-gray-dark-300':
                      router.asPath === menuItem.url && true,
                    'bg-[#F9F5FF] dark:bg-gray-dark-800 rounded-sm':
                      router.asPath === menuItem.url && !true,
                  },
                  'body-small-semibold',
                  { 'block h-8 border-spacing-1 px-1': true },
                  { 'flex items-center px-3 h-10': !true }
                )}
              >
                {menuItem.text}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 py-6 w-full h-full overflow-auto scrollbar-none">
          <div className="flex flex-col gap-6 flex-grow h-[1180px]">
            <div className="bg-white dark:bg-gray-dark-900 h-[394px] w-full rounded-md shadow-extra-small border border-gray-light-200 dark:border-gray-dark-800">
              <div className="flex items-center justify-between rounded-t-xl py-[6px] px-[8px] mb-2">
                <div className="relative" ref={marketDropdownRef}>
                  <div
                    className="flex items-center hover:bg-gray-light-50 dark:hover:bg-gray-dark-700 rounded-md py-[8px] px-[18px] transition-colors duration-200 ease-linear cursor-pointer"
                    onClick={toggleMarketDropdown}
                  >
                    <span className="mr-2 w-[120px] body-medium-semibold text-gray-light-900 dark:text-gray-light-50">
                      Market Indices
                    </span>
                    <ChevronDown className="w-4 h-4 stroke-gray-light-500 dark:stroke-gray-dark-400" />
                  </div>
                  {isMarketDropdownOpen && (
                    <div className="p-1 absolute mt-1 w-[320px] bg-white dark:bg-gray-dark-900 rounded-md shadow-extra-small border border-gray-light-200 dark:border-gray-dark-800 z-10">
                      {marketOptions.map((option) => (
                        <div
                          key={option.indexId}
                          className="flex items-center justify-between hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 transition-colors duration-100 rounded-md py-2 pl-2 pr-3 cursor-pointer body-small-medium text-gray-light-900 dark:text-gray-dark-50"
                          onClick={() => handleMarketSelection(option.indexId)}
                        >
                          {option.indexName}
                          {selectedMarketOptions.includes(option.indexId) && (
                            <Check className="w-4 h-4 stroke-primary-600 dark:stroke-primary-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="mr-2 body-small-semibold text-gray-light-600 dark:text-gray-dark-400">
                  View All
                </span>
              </div>
              <div className="h-[334px] w-full" ref={chartContainerRef}>
                <div ref={chartContainerRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
