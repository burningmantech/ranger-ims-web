const BottomToolBar = ({ table, incidents }) => {
  return "";
  // return (
  //   <Row>
  //     <Col>
  //       <div>
  //         <button
  //           onClick={() => table.gotoPage(0)}
  //           disabled={!table.canPreviousPage}
  //         >
  //           {"<<"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.previousPage()}
  //           disabled={!table.canPreviousPage}
  //         >
  //           {"<"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.nextPage()}
  //           disabled={!table.canNextPage}
  //         >
  //           {">"}
  //         </button>{" "}
  //         <button
  //           onClick={() => table.gotoPage(table.pageCount - 1)}
  //           disabled={!table.canNextPage}
  //         >
  //           {">>"}
  //         </button>{" "}
  //         <span>
  //           Page{" "}
  //           <strong>
  //             {table.state.pageIndex + 1} of {table.pageOptions.length}
  //           </strong>{" "}
  //         </span>
  //         <span>
  //           | Go to page:{" "}
  //           <input
  //             type="number"
  //             defaultValue={table.state.pageIndex + 1}
  //             onChange={(e) => {
  //               const page = e.target.value ? Number(e.target.value) - 1 : 0;
  //               table.gotoPage(page);
  //             }}
  //             style={{ width: "100px" }}
  //           />
  //         </span>{" "}
  //         <select
  //           value={table.state.pageSize}
  //           onChange={(e) => {
  //             table.setPageSize(Number(e.target.value));
  //           }}
  //         >
  //           {[25, 50, 100].map((pageSize) => (
  //             <option key={pageSize} value={pageSize}>
  //               Show {pageSize}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //     </Col>
  //   </Row>
  // );
};

export default BottomToolBar;
