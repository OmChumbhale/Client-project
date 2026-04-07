function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="table-wrap overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-warm">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border transition hover:bg-cream/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-top text-sm text-ink">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-muted">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
