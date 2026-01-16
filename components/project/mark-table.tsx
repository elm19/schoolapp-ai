import { Mark } from '@/lib/scrapper';

export default function MarksTable({ grades }: { grades: Mark[] }) {
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Element
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exam
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MoySO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RAT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MoySR
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Final
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Decision
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grades.map((mark, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {mark.elementCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.academicYear}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.ccMark}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.examMark}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.tpMark}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.moySO}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.ratMark}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mark.moySR}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {mark.finalMark}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${mark.decision === 'VORD' ? 'bg-green-100 text-green-800' : 
                    mark.decision === 'VRAC' ? 'bg-yellow-100 text-yellow-800' : 
                    mark.decision === 'RAT' ? 'bg-orange-100 text-orange-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {mark.decision}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}