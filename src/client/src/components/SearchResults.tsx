import React from 'react';
import { Album, LibraryItem, SearchResults, SearchType, Track } from '../types';
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table';

interface SearchResultsProps {
    searchType: string;
    searchResults: SearchResults | undefined;
}

const getTracksTable = (data) => {
    const columnHelper = createColumnHelper<Track>();
    const columns = [
        columnHelper.accessor('id', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('track', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('artist', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('title', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('album', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('year', {
            cell: info => info.getValue()
        }),
    ]
    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });
}

const getAlbumsTable = (data) => {
    const columnHelper = createColumnHelper<Album>();
    const columns = [
        columnHelper.accessor('id', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('album', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('albumartist', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('year', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('genre', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('day', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('month', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('added', {
            cell: info => info.getValue()
        }),
    ];
    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
};


const SearchResultTable: React.FC<SearchResultsProps> = ({ searchType, searchResults }: SearchResultsProps) => {
    console.log("In searchResultTable");
    console.log("%o", searchResults);
    if (!searchResults) {
        return <></>
    }
    let table;
    if (searchType === 'tracks') {
        table = getTracksTable(searchResults.result);
    } else if (searchType === 'albums') {
        table=getAlbumsTable(searchResults.result);
    }
    return (
        <>
        <div className="p-2">
          <table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="h-4" />
        </div>
        </>
    );
};

//const AlbumsTable: React.FC<SearchResults> = ({ fields, results }: SearchResults) => {
//    return <></>
//};

export default SearchResultTable;
