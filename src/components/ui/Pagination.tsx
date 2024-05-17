import React, { useEffect, useState } from 'react';
import { HiArrowLeft, HiArrowRight, HiDotsHorizontal } from 'react-icons/hi';

interface PaginationProps {
  size?: 'small' | 'medium' | 'large';
  corners?: 'smooth' | 'sharp' | 'pill';
  buttonType?: 'congestedButtons' | 'spacedButtons' | 'text';
  items: any[];
  itemsPerPage?: number;
  prevText?: string;
  nextText?: string;
  supportButton?: boolean;
  onChange: (items: any[]) => void;
}

export const Pagination = ({
  size = 'small',
  corners = 'smooth',
  buttonType = 'congestedButtons',
  items,
  itemsPerPage = 10,
  supportButton = true,
  prevText,
  nextText,
  onChange,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPage) return;

    setCurrentPage(page);
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const itemsToShow = items.slice(startIdx, endIdx);
    onChange(itemsToShow);
  };

  const buttonHeight = 'h-10';
  const prevBorderStyle = buttonType === 'congestedButtons' ? 'border-r-0' : '';
  const nextBorderStyle = buttonType === 'congestedButtons' ? 'border-l-0' : '';

  const allCornersStyles =
    corners === 'smooth'
      ? 'rounded-md'
      : corners === 'sharp'
      ? 'rounded-none'
      : 'rounded-full';

  const prevButtonStyles =
    buttonType !== 'congestedButtons'
      ? allCornersStyles
      : corners === 'smooth'
      ? 'rounded-l-md rounded-r-none'
      : corners === 'sharp'
      ? 'rounded-none'
      : 'rounded-l-full rounded-r-none';

  const nextButtonStyles =
    buttonType !== 'congestedButtons'
      ? allCornersStyles
      : corners === 'smooth'
      ? 'rounded-r-md rounded-l-none'
      : corners === 'sharp'
      ? 'rounded-none'
      : 'rounded-r-full rounded-l-none';

  const boxShadow =
    buttonType !== 'congestedButtons' ? 'shadow-medium border-none' : '';

  const renderPageNumbers = () => {
    let pages = [];

    let lowerLimit =
      currentPage === totalPage
        ? currentPage - 3
        : currentPage === totalPage - 1
        ? currentPage - 2
        : currentPage - 1;
    let upperLimit =
      currentPage === 1
        ? currentPage + 3
        : currentPage === 2
        ? currentPage + 2
        : currentPage + 1;

    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`flex justify-center items-center border border-gray-200 text-gray-600 ${buttonHeight} w-10 px-2 body-small-medium 
          ${
            1 === currentPage ? 'bg-neutral-600 text-white' : 'text-neutral-600'
          } 
          ${buttonType === 'spacedButtons' ? 'border-0' : 'border'} 
          border-r-0`}
      >
        {1}
      </button>
    );

    const ellipsisButtonStyles =
      buttonType !== 'congestedButtons'
        ? 'border-0'
        : 'border border-gray-200 border-r-0';

    if (lowerLimit > 2 && !(upperLimit < totalPage - 1)) {
      pages.push(
        <div
          key="lower-ellipsis"
          className={`flex justify-center items-end text-gray-600 ${buttonHeight} w-10 px-2 ${ellipsisButtonStyles}`}
        >
          <HiDotsHorizontal />
        </div>
      );
    }

    for (
      let i = Math.max(2, lowerLimit);
      i <= Math.min(upperLimit, totalPage - 1);
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex justify-center items-center border border-gray-200 text-gray-600 ${buttonHeight} w-10 px-2 
                ${
                  i === currentPage ? 'bg-neutral-600 text-white' : 'text-black'
                } 
                ${buttonType === 'spacedButtons' ? 'border-0' : 'border'} 
                ${buttonType !== 'spacedButtons' ? 'border' : allCornersStyles} 
                
                border-r-0`}
        >
          {i}
        </button>
      );
    }

    if (upperLimit < totalPage - 1) {
      pages.push(
        <div
          key="upper-ellipsis"
          className={`flex justify-center items-end text-gray-600 ${buttonHeight} w-10 px-2 ${ellipsisButtonStyles}`}
        >
          <HiDotsHorizontal />
        </div>
      );
    }

    pages.push(
      <button
        key={totalPage}
        onClick={() => handlePageChange(totalPage)}
        className={`flex justify-center items-center border border-gray-200 text-gray-600 ${buttonHeight} w-10 px-2 
              ${
                totalPage === currentPage
                  ? 'bg-neutral-600 text-white'
                  : 'text-black'
              } 
              ${buttonType === 'spacedButtons' ? 'border-0' : 'border'}`}
      >
        {totalPage}
      </button>
    );

    return pages;
  };

  return (
    <div className="flex justify-start items-center">
      {supportButton && (
        <button
          className={`
          flex justify-center items-center gap-2 bg-transparent border border-gray-200 ${buttonHeight} px-4 body-small-medium 
          ${size} ${prevButtonStyles} ${prevBorderStyle} ${boxShadow} 
          ${
            currentPage === 1
              ? 'text-gray-400 cursor-default pointer-events-none'
              : 'text-gray-600'
          }
          ${buttonType === 'spacedButtons' ? 'mr-10' : ''}
          hover:bg-gray-100
        `}
          onClick={() => {
            if (currentPage !== 1) handlePageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          <HiArrowLeft />
          {prevText}
        </button>
      )}

      {buttonType !== 'text' && renderPageNumbers()}

      {buttonType === 'text' && (
        <span className="mx-28 min-w-100 body-small-semibold text-gray-700">
          Page {currentPage} of {totalPage}
        </span>
      )}

      {supportButton && (
        <button
          className={`
          flex justify-center items-center gap-2 bg-transparent border border-gray-200 ${buttonHeight} px-4 body-small-medium 
          ${size} ${nextButtonStyles} ${nextBorderStyle} ${boxShadow} 
          ${
            currentPage === totalPage
              ? 'text-gray-400 cursor-default pointer-events-none'
              : 'text-gray-600'
          }
          ${buttonType === 'spacedButtons' ? 'ml-10' : ''}
          hover:bg-gray-100
        `}
          onClick={() => {
            if (currentPage !== totalPage) handlePageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPage}
        >
          {nextText}
          <HiArrowRight />
        </button>
      )}
    </div>
  );
};
