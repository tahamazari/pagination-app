import React from 'react';

interface PaginationControlsProps {
  getUsers: (action: string, pageNumber?: number) => void;
  currentPage: number;
  pageNumbers: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ getUsers, currentPage, pageNumbers }) => {
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageNumbers.length; i++) {
      pages.push(
        <button
          key={pageNumbers[i]}
          onClick={() => getUsers("direct", pageNumbers[i])}
          className={`px-3 py-1 mx-1 rounded bg-white text-blue-500 ${currentPage === pageNumbers[i] ? 'bg-blue-500 text-white' : ''}`}
        >
          {pageNumbers[i]}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="w-full flex justify-center items-center mt-4">
      <button
        onClick={() => getUsers('prev')}
        className={`px-3 py-1 mr-1 rounded bg-white text-blue-500 ${currentPage === 1 ? 'disabled:opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === 1}
      >
        &laquo; Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => getUsers('next')}
        className="px-3 py-1 ml-1 rounded bg-white text-blue-500"
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default PaginationControls;
