import PrecedentRow from './PrecedentRow';
import LogoSpinner from '@/components/ui/LogoSpinner';

const PrecedentsTable = ({ precedents, onDownload, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <LogoSpinner size={48} />
          </div>
          <p 
            className="text-gray-600"
            style={{ fontFamily: 'Noto Sans' }}
          >
            Loading precedents...
          </p>
        </div>
      </div>
    );
  }

  if (precedents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 50 50"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M33.3332 16.6666C33.3332 10.3384 29.6022 4.16663 24.9998 4.16663C20.3974 4.16663 16.6665 10.3384 16.6665 16.6666"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.37516 16.6666H40.6252L41.6668 29.1666H28.1252V26.0416H21.8752V29.1666H8.3335L9.37516 16.6666Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 
            className="text-xl lg:text-2xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'Ropa Sans' }}
          >
            No Precedents Found
          </h2>
          <p 
            className="text-gray-600 text-sm lg:text-base"
            style={{ fontFamily:  'Noto Sans' }}
          >
            Try searching with different keywords
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto px-4 lg:px-10 py-6 lg:py-8">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-gray-300 min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th 
                className="text-left py-3 lg:py-4 px-3 lg:px-4 font-bold text-lg lg:text-xl text-gray-900 w-16 lg:w-20"
                style={{ fontFamily:  'Ropa Sans' }}
              >
                Sr no. 
              </th>
              <th 
                className="text-left py-3 lg:py-4 px-3 lg:px-4 font-bold text-lg lg:text-xl text-gray-900"
                style={{ fontFamily: 'Ropa Sans' }}
              >
                Case no.
              </th>
              <th 
                className="text-left py-3 lg: py-4 px-3 lg:px-4 font-bold text-lg lg:text-xl text-gray-900"
                style={{ fontFamily: 'Ropa Sans' }}
              >
                Title
              </th>
              <th 
                className="text-left py-3 lg:py-4 px-3 lg:px-4 font-bold text-lg lg:text-xl text-gray-900"
                style={{ fontFamily: 'Ropa Sans' }}
              >
                Judge
              </th>
              <th 
                className="text-center py-3 lg:py-4 px-3 lg: px-4 font-bold text-lg lg:text-xl text-gray-900 w-24 lg:w-32"
                style={{ fontFamily: 'Ropa Sans' }}
              >
                Judgment
              </th>
            </tr>
          </thead>
          <tbody>
            {precedents.map((precedent) => (
              <PrecedentRow
                key={precedent. id}
                precedent={precedent}
                onDownload={onDownload}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrecedentsTable;