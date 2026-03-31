import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchBomData } from './laserData.js'

const columnHelper = createColumnHelper()

function useBomTableData() {
    const [bomHeaders, setBomHeaders] = useState([])
    const [csvData, setCsvData] = useState([])

    useEffect(() => {
        let isCurrent = true

        async function loadBomData() {
            try {
                const { headers, data } = await fetchBomData()
                if (!isCurrent) return
                setBomHeaders(headers)
                setCsvData(data)
            } catch (error) {
                if (!isCurrent) return
                setBomHeaders([])
                setCsvData([])
                console.error('Error fetching laser BOM:', error)
            }
        }

        loadBomData()
        return () => { isCurrent = false }
    }, [])

    return { bomHeaders, csvData }
}

function useBomColumns(bomHeaders) {
    return useMemo(() => {
        return bomHeaders.map((header) => (
            columnHelper.accessor(header, {
                id: header,
                cell: (info) => info.getValue(),
                header,
            })
        ))
    }, [bomHeaders])
}

function LaserBomTable({ table }) {
    return <table className="bomTable">
        <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                            {header.isPlaceholder ? null : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
}

function LaserSectionRow({ row, table, hasBomData }) {
    return <li>
        {row[1] ? <h1 className='sectionTitle' style={{ marginTop: '30px' }}>{row[1]}</h1> : null}
        {row[2]}
        {row[3] ? <img src={row[3]} className="sectionImage" /> : null}
        {row[4] ? <a href={row[4]} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
            <button className="btn" style={{ display: 'block', margin: '30px auto 0', textDecoration: 'none' }}>
                {row[5]}
            </button>
        </a> : null}
        {row[6] ? <iframe src={row[6]} className="iFrame" name="myiFrame" allowFullScreen></iframe> : null}
        {row[7] && hasBomData ? <LaserBomTable table={table} /> : null}
    </li>
}

export default function LaserText({ sectionRows }) {
    const { bomHeaders, csvData } = useBomTableData()
    const columns = useBomColumns(bomHeaders)
    const table = useReactTable({
        data: csvData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return <>
        <div className="sectionLaser">
            <ul>
                {sectionRows.map((row, index) => (
                    <LaserSectionRow
                        key={`${row[0] || 'section'}-${index}`}
                        row={row}
                        table={table}
                        hasBomData={csvData.length > 0}
                    />
                ))}
            </ul>
        </div>
    </>
}
