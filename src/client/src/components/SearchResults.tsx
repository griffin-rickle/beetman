import React from 'react';
import { Album, LibraryItem, SearchResults, SearchType, Track } from '../types';
import {createColumnHelper, flexRender, getCoreRowModel, Table, useReactTable} from '@tanstack/react-table';

interface SearchResultsProps {
    searchType: SearchType;
    searchResults: SearchResults | undefined;
}

const getTable = (data: LibraryItem[], searchType: SearchType) => {
    const columnHelper = createColumnHelper<LibraryItem>();
    const columns = [
        columnHelper.accessor('id', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('artist', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('title', {
            cell: info => <a href={`/${searchType}/${info.row.original.id}`}>{info.getValue()}</a>
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

interface LibraryItemProps {
    row_id: number;
    id: number;
    artist: string;
    title: string;
    year: number;
    itemType: SearchType
}

const LibraryItemRow: React.FC<LibraryItemProps> = (item: LibraryItemProps) => {
    const { row_id, id, artist, title, year } = item;
    return (
        <tr key={row_id}>
            <td>{id}</td>
            <td>{artist}</td>
            <td><a href={`/album/${id}`}>{title}</a></td>
            <td>{year}</td>
        </tr>
    )
}

const SearchResultTable: React.FC<SearchResultsProps> = ({ searchType, searchResults }: SearchResultsProps) => {
    if (!searchResults) {
        return <></>
    }
    const table: Table<LibraryItem> = getTable(searchResults.result, searchType)
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
                  <td>
                    <button>Save</button>
                  </td>
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

export default SearchResultTable;
