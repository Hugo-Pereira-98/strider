import { countriesList } from '@/data';
import {
  differenceInDays,
  format,
  formatDistanceToNow,
  parse,
  parseISO,
} from 'date-fns';

export const findCountryLabel = (code: string): string => {
  const country = countriesList.find((c) => c.value === code);
  return country ? country.label : 'Unknown Country';
};

export const formatBadgeStatus = (status: string | undefined) => {
  const successStatuses = ['match', 'success', 'passed', 'true'];
  const errorStatuses = [
    'no_match',
    'no_data',
    'no_input',
    'false',
    'failed',
    'manually_rejected',
    'admin_rejected',
  ];
  const defaultStatuses = [
    'waiting_for_perequisite',
    'not_applicable',
    'skipped',
    'expired',
    'canceled',
    'pending',
  ];

  if (successStatuses.includes(status!)) {
    return 'success';
  } else if (errorStatuses.includes(status!)) {
    return 'error';
  } else if (defaultStatuses.includes(status!)) {
    return 'primary';
  }
};

export const getFormType = (pathname: string) =>
  pathname?.includes('bid') ? 'bid' : 'offer';

export function formatNumber(
  value?: number | string,
  isDollar: boolean = false
) {
  if (value === undefined || value === null || value === '') return 'NaN';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'NaN';

  let result;
  if (numValue >= 1_000_000_000) {
    result = `${(numValue / 1_000_000_000).toFixed(1)}B`;
  } else if (numValue >= 1_000_000) {
    result = `${(numValue / 1_000_000).toFixed(1)}M`;
  } else if (numValue >= 1_000) {
    result = `${(numValue / 1_000).toFixed(1)}K`;
  } else {
    result = `${numValue}`;
  }

  return isDollar ? `$${result}` : result;
}

export function formatAmericanThousands(
  value?: number | string,
  isDollar: boolean = false
) {
  if (value === undefined || value === null || value === '') return 'NaN';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'NaN';

  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);

  return isDollar ? `$${formattedValue}` : formattedValue;
}

export function formatThousands(
  value?: number | string,
  isDollar: boolean = false
): string {
  if (value === undefined || value === null || value === '') return 'NaN';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'NaN';

  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(numValue);

  return isDollar ? `$${formattedValue}` : formattedValue;
}

export const isMoreThan10DaysAgo = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return differenceInDays(new Date(), date) > 10;
};

export const formatDateToRelative = (dateStr: string): string => {
  const date = new Date(dateStr);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDateToCustom = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'MMMM d, yyyy');
};

export const formatDateToMonthAndYear = (dateString: any) => {
  if (!dateString) return '-';

  const options: any = { year: 'numeric', month: 'long' };
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', options);
};
