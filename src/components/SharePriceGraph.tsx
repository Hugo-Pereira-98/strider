import { LineChartUp4 } from '@/components/Icons/LineChartUp4';
import { MOCK_CHART_DATA } from '@/constants/mocks';
import { formatNumber } from '@/utils/functions';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { IFundingRoundDTO, IOrganizationDTO } from '../dtos';
import { fundingRoundOrder } from '../utils/constants';
import BlurBackground from './BlurBackground';
import { SelectDown } from './ui/SelectDown';
import { useTheme } from 'next-themes';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface SharePriceGraphProps {
  organization: IOrganizationDTO | any;
  selectedTimeFrame: 'fundingRound' | 'calendar';
  chartType: string;
  setSelectedTimeFrame(selectedTimeFrame: 'fundingRound' | 'calendar'): void;
  setChartType(chartType: string): void;
  handleRequest?(request: { body: string; company: string }): void;
}

export default function SharePriceGraph({
  organization,
  chartType,
  selectedTimeFrame,
  setChartType,
  setSelectedTimeFrame,
  handleRequest,
}: SharePriceGraphProps) {
  const menuItems = [{ text: 'Money Raised' }, { text: 'Cumulative Funding' }];
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      const newDisplayValue =
        chartType === 'Cumulative Funding'
          ? data.cumulativeMoneyRaised
          : data.moneyRaised;

      // Check if the hovered data has changed
      if (
        !hoveredData ||
        hoveredData.type !== data.type ||
        hoveredData.moneyRaised !== newDisplayValue
      ) {
        setHoveredData({ type: data.type, moneyRaised: newDisplayValue });
      } else {
      }
    }
    return null;
  };

  const [requestSent, setRequestSent] = useState(false);

  const formatSeriesType = (type?: string) => {
    if (type === 'SEED') {
      return 'Seed';
    } else if (type && type.toLowerCase().startsWith('series_')) {
      return `Series ${type.charAt(7).toUpperCase()}`;
    }
    return type;
  };

  const processFundingRounds = (fundingRounds: IFundingRoundDTO[]) => {
    // Parse moneyRaised as number and handle undefined values
    const mappedRounds = fundingRounds.map((round) => ({
      ...round,
      moneyRaised: round.moneyRaised ? Number(round.moneyRaised) : 0,
      order: fundingRoundOrder[round.type]?.order ?? 999,
    }));

    const sortedRounds = mappedRounds.sort((a, b) => a.order - b.order);

    return sortedRounds.length > 0
      ? [
          sortedRounds[0],
          ...sortedRounds,
          sortedRounds[sortedRounds.length - 1],
        ]
      : [];
  };

  const fundingRoundsExist = organization?.company?.fundingRounds?.length > 0;
  const processedRounds = processFundingRounds(
    organization?.company?.fundingRounds || []
  );

  const hideBlur = fundingRoundsExist;
  const newFundingRound = processedRounds.map((round) => ({
    type: round.type,
    moneyRaised: round.moneyRaised,
  }));
  const newCumulativeFundingRound = newFundingRound.reduce(
    (
      acc: { type: string; cumulativeMoneyRaised: number }[],
      round,
      index,
      array
    ) => {
      if (index === 0 || index === 1) {
        // Skip summing for the first two items
        acc.push({
          type: round.type,
          cumulativeMoneyRaised: round.moneyRaised,
        });
      } else if (index === array.length - 1) {
        // For the last item, replicate the previous value
        const last = acc[acc.length - 1];
        acc.push({
          type: round.type,
          cumulativeMoneyRaised: last.cumulativeMoneyRaised,
        });
      } else {
        // Sum for other items
        const last = acc[acc.length - 1];
        const cumulativeMoneyRaised =
          last.cumulativeMoneyRaised + round.moneyRaised;
        acc.push({ type: round.type, cumulativeMoneyRaised });
      }
      return acc;
    },
    []
  );
  const finalChartData = fundingRoundsExist
    ? chartType === 'Cumulative Funding'
      ? newCumulativeFundingRound
      : newFundingRound
    : (MOCK_CHART_DATA as any);

  const defaultHoverData = {
    type: (finalChartData[0] && finalChartData[0].type) || '',
    moneyRaised:
      (finalChartData[0] &&
        (chartType === 'Cumulative Funding'
          ? finalChartData[0].cumulativeMoneyRaised
          : finalChartData[0].moneyRaised)) ||
      0,
  };

  const [hoveredData, setHoveredData] = useState<{
    type: string;
    moneyRaised: number;
  } | null>(defaultHoverData);

  useEffect(() => {
    setHoveredData(defaultHoverData);
  }, [chartType]);

  return (
    <div className="lg:border border-gray-light-200 dark:border-gray-dark-800 shadow-xs rounded-xl mt-12 -mx-6 sm:-mx-8 lg:mx-0 overflow-x-hidden">
      <div className="border-b hidden sm:flex items-center gap-4 border-gray-light-200 dark:border-gray-dark-800 mx-6">
        {menuItems.map((menuItem) => (
          <div key={menuItem.text} className="relative">
            <button
              type="button"
              className={classNames(
                {
                  'after:content-[""] after:h-[2px] after:bg-primary-700 dark:after:bg-gray-dark-300 after:absolute after:-bottom-px after:left-0 after:w-full font-bold text-primary-700 dark:text-gray-dark-300 px-1':
                    chartType === menuItem.text,
                },
                {
                  'text-gray-light-500 dark:text-gray-dark-400 px-1':
                    chartType !== menuItem.text,
                },
                'block h-12 body-small-semibold'
              )}
              onClick={() => {
                setChartType(menuItem.text);
                setHoveredData(null);
              }}
            >
              {menuItem.text}
            </button>
          </div>
        ))}
      </div>

      <div className="sm:hidden px-6 sm:px-8 text-center mt-[3px]">
        <SelectDown
          isAnchor={false}
          menuItems={menuItems}
          selectedItem={chartType}
          setSelectedItem={setChartType}
          clear={() => setHoveredData(null)}
        />
      </div>

      <div className="relative pb-6 -ml-10 -mr-12 ">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center justify-between my-6 px-6">
          <div className="flex items-center gap-3 mt-4 pl-10 text-center">
            {hoveredData?.type && (
              <p className="body-large-regular sm:body-extra-large-regular text-gray-light-600 dark:text-gray-dark-400">
                {formatSeriesType(hoveredData.type)}
              </p>
            )}

            {hoveredData?.moneyRaised && (
              <p className="body-large-regular sm:body-extra-large-medium text-gray-light-950 dark:text-gray-dark-50">
                ${formatNumber(hoveredData.moneyRaised.toString())}
              </p>
            )}
          </div>

          <div className="sm:flex w-full sm:w-auto text-center justify-center sm:justify-end sm:mr-12">
            {/* <button
              className={`py-2 px-4 shadow-xs border border-gray-light-300 dark:border-gray-dark-700 body-small-semibold text-gray-light-700 dark:text-gray-dark-500 rounded-md flex items-center justify-center gap-2 mx-auto ${
                selectedTimeFrame === 'fundingRound'
                  ? 'bg-gray-light-50 dark:bg-gray-dark-950'
                  : 'bg-transparent'
              }`}
              onClick={() => setSelectedTimeFrame('fundingRound')}
            >
              {selectedTimeFrame === 'fundingRound' && (
                <Dot className="fill-success-500" />
              )}
              Funding round
            </button> */}

            {/* <button
							className={`py-2 px-4 shadow-xs border border-gray-light-300 body-small-semibold text-gray-light-700 border-l-0 rounded-r-lg flex items-center justify-center gap-2 ${
								selectedTimeFrame === 'calendar' ? 'bg-gray-light-50' : 'bg-transparent'
							}`}
							onClick={() => setSelectedTimeFrame('calendar')}
						>
							{selectedTimeFrame === 'calendar' && <Dot className="fill-success-500" />}
							Calendar
						</button> */}
          </div>
        </div>

        <BlurBackground
          hideBlur={hideBlur}
          // hideBlur={true}
          icon={
            <LineChartUp4 className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          }
          title="Price chart is coming soon"
          description="If you would like the chart for this company, please request access below."
          labelButton="Request chart"
          onClick={() => {
            handleRequest?.({
              company: router.query.slug as string,
              body: 'Request chart section',
            });
            setRequestSent(true);
          }}
          disabled={requestSent}
          lightBlur
        />

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            width={500}
            height={400}
            data={finalChartData.length ? finalChartData : MOCK_CHART_DATA}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="30%"
                  stopColor={theme === 'dark' ? '#F4EBFF' : '#7F56D9'}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={theme === 'dark' ? '#F4EBFF' : '#7F56D9'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="type"
              tickLine={false}
              axisLine={false}
              tick={{ fill: theme === 'dark' ? '#475467' : '#94969C' }}
              fontSize={12}
              tickFormatter={(value, index) => {
                if (value.toLowerCase().startsWith('series_')) {
                  return `Series ${value.charAt(7).toUpperCase()}`;
                }

                if (value === 'SEED') {
                  return 'Seed';
                }
                return value;
              }}
              horizOriginX={12}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={
                chartType === 'Cumulative Funding'
                  ? 'cumulativeMoneyRaised' // Use the correct field name
                  : 'moneyRaised'
              }
              strokeWidth={2}
              className="dark:hidden"
              stroke="#7F56D9"
              fill="url(#colorValue)"
            />

            <Area
              type="monotone"
              dataKey={
                chartType === 'Cumulative Funding'
                  ? 'cumulativeMoneyRaised' // Use the correct field name
                  : 'moneyRaised'
              }
              strokeWidth={2}
              stroke="#b692f6"
              className="hidden dark:block"
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
