"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';

export default function Table({ 
  columns, 
  data = [], 
  searchPlaceholder = "Filter records..." 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 1. Filter data based on global search across row fields
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 2. Pagination computation bounds
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm font-sans antialiased text-slate-900">
      
      {/* 1. Global Search Utilities Row */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all w-64"
          />
        </div>
      </div>

      {/* 2. Structured Data Grid View */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 select-none">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-5 py-3 text-[11px] font-bolder uppercase tracking-wider text-black whitespace-nowrap"
                  style={{ width: col.width || "auto", textAlign: col.align || "left" }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
         {/* Change the previous <tbody> section inside SystemTable.jsx to this: */}
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
        {currentRows.length === 0 ? (
            <tr>
            <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                No matching system records located in database.
            </td>
            </tr>
        ) : (
            currentRows.map((row, rowIndex) => {
            // Calculate the true serial index sequence number relative to current page bounds
            const absoluteRowNumber = indexOfFirstRow + rowIndex + 1;

            return (
                <tr key={rowIndex} className="hover:bg-slate-50/40 transition-colors">
                {columns.map((col, colIndex) => (
                    <td 
                    key={colIndex} 
                    className="px-5 py-3 whitespace-nowrap text-slate-600 font-medium"
                    style={{ textAlign: col.align || "left" }}
                    >
                    {/* Pass the absolute calculated number directly to the cell callback if requested */}
                    {col.cell ? col.cell(row, absoluteRowNumber) : row[col.accessor]}
                    </td>
                ))}
                </tr>
            );
            })
        )}
        </tbody>
        </table>
      </div>

      {/* 3. Formal System Pagination Controls */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs font-medium text-slate-500 select-none">
        <div>
          Showing <span className="font-semibold text-slate-800">{filteredData.length === 0 ? 0 : indexOfFirstRow + 1}</span> to{" "}
          <span className="font-semibold text-slate-800">{Math.min(indexOfLastRow, filteredData.length)}</span> of{" "}
          <span className="font-semibold text-slate-800">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded py-0.5 px-1 outline-none font-semibold text-slate-700 text-xs cursor-pointer focus:border-slate-400"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronsLeft size={13} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <div className="text-slate-600 px-1 font-semibold">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronRight size={13} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              <ChevronsRight size={13} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}