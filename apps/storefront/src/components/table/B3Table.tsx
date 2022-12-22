import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Grid,
  Card,
  Box,
} from '@mui/material'
import {
  ReactNode,
  ChangeEvent,
  MouseEvent,
  ReactElement,
} from 'react'

import {
  B3NoData,
} from './B3NoData'

export interface Pagination {
  offset: number,
  first: number,
  count: number,
}

export interface TableColumnItem<T> {
  key: string,
  title: string,
  width?: string,
  render?: (item: T, index: number) => ReactNode,
}

interface TableProps<T> {
  tableFixed?: boolean,
  tableHeaderHide?: boolean,
  columnItems: TableColumnItem<T>[],
  listItems: Array<any>,
  itemSpacing?: number,
  itemIsMobileSpacing?: number,
  itemXs?: number,
  onPaginationChange?: (pagination: Pagination)=>void,
  pagination?: Pagination,
  rowsPerPageOptions?: number[],
  showPagination?: boolean,
  renderItem?: (row:T, index?: number, checkBox?: () => ReactElement) => ReactElement,
  isCustomRender?: boolean,
  isInfiniteScroll?: boolean,
  isLoading?: boolean,
  infiniteScrollThreshold?: number,
  infiniteScrollNode?: HTMLElement,
  infiniteScrollLoader?: ReactElement,
  infiniteScrollHeight?: string,
  noDataText?: string,
  tableKey?: string,
  showCheckbox?: boolean,
  setNeedUpdate?: (boolean: boolean) => void,
  handleSelectAllItems?: () => void,
  handleSelectOneItem?: (id: number | string) => void,
  hover?: boolean,
  showBorder?: boolean,
  selectedSymbol?: string,
  selectCheckbox?: Array<number | string>,
  labelRowsPerPage?: string,
}

export const B3Table:<T>(props: TableProps<T>) => ReactElement = ({
  tableFixed = true,
  columnItems,
  listItems = [],
  pagination = {
    offset: 0,
    count: 0,
    first: 10,
  },
  onPaginationChange = () => {},
  rowsPerPageOptions = [10, 20, 50],
  showPagination = true,
  renderItem,
  isCustomRender = false,
  isInfiniteScroll = false,
  isLoading = false,
  itemSpacing = 2,
  itemIsMobileSpacing = 2,
  itemXs = 4,
  noDataText,
  tableHeaderHide = false,
  tableKey,
  showCheckbox = false,
  setNeedUpdate = () => {},
  handleSelectAllItems,
  handleSelectOneItem,
  hover = false,
  showBorder = true,
  selectedSymbol = 'id',
  selectCheckbox = [],
  labelRowsPerPage = '',
}) => {
  const {
    offset,
    count,
    first,
  } = pagination

  const handlePaginationChange = (pagination: Pagination) => {
    if (!isLoading) {
      onPaginationChange(pagination)
    }
  }

  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    handlePaginationChange({
      ...pagination,
      offset: (page * first),
    })

    setNeedUpdate(true)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    handlePaginationChange({
      ...pagination,
      offset: 0,
      first: parseInt(event.target.value, 10) || first,
    })
  }

  return listItems.length > 0 ? (
    <>
      {
        isInfiniteScroll && (
          <>
            {
              showCheckbox && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Checkbox
                  checked={selectCheckbox.length === listItems.length}
                  onChange={handleSelectAllItems}
                />
                Select all
              </Box>
              )
            }
            <Grid
              container
              spacing={itemIsMobileSpacing}
            >
              {
                listItems.map((row, index) => {
                  const node = row.node || row || {}
                  const checkBox = () => (
                    <Checkbox
                      checked={selectCheckbox.includes(row.node[selectedSymbol])}
                      onChange={() => {
                        if (handleSelectOneItem) handleSelectOneItem(row.node[selectedSymbol])
                      }}
                    />
                  )
                  return (
                    <Grid
                      item
                      xs={12}
                      key={node[tableKey || 'id']}
                    >
                      <>
                        {row?.node && renderItem && renderItem(row.node, index, checkBox)}
                      </>
                    </Grid>
                  )
                })
              }
            </Grid>

            {
              showPagination && (
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  labelRowsPerPage={labelRowsPerPage || 'per page:'}
                  component="div"
                  count={count}
                  rowsPerPage={first}
                  page={first === 0 ? 0 : offset / first}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )
            }
          </>
        )
      }
      {
        !isInfiniteScroll && isCustomRender && (
          <>
            <Grid
              container
              spacing={itemSpacing}
            >
              {
                listItems.map((row, index) => {
                  const node = row.node || row || {}
                  return (
                    <Grid
                      item
                      xs={itemXs}
                      key={node[tableKey || 'id']}
                    >
                      <>
                        {row?.node && renderItem && renderItem(row.node, index)}
                      </>
                    </Grid>
                  )
                })
              }
            </Grid>
            {
              showPagination && (
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  labelRowsPerPage={labelRowsPerPage || 'Cards per page:'}
                  component="div"
                  count={count}
                  rowsPerPage={first}
                  page={first === 0 ? 0 : offset / first}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )
            }
          </>
        )
      }
      { !isInfiniteScroll && !isCustomRender && (
        <Card
          sx={{
            height: '100%',
            boxShadow: showBorder ? '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)' : 'none',
          }}
        >
          <TableContainer>
            <Table
              sx={{
                tableLayout: tableFixed ? 'fixed' : 'initial',
              }}
            >
              {
                !tableHeaderHide && (
                <TableHead>
                  <TableRow>
                    {
                      showCheckbox && (
                        <TableCell
                          key="showCheckbox"
                        >
                          <Checkbox
                            checked={selectCheckbox.length === listItems.length}
                            onChange={handleSelectAllItems}
                          />
                        </TableCell>
                      )
                    }
                    {
                      columnItems.map((column) => (
                        <TableCell
                          key={column.title}
                          width={column.width}
                        >
                          {column.title}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                )
              }

              <TableBody>
                {listItems.map((row, index) => {
                  const node = row.node || row || {}

                  const lastItemBorderBottom = (index === listItems.length - 1) ? '1px solid rgba(224, 224, 224, 1)' : 'none'
                  return (
                    <TableRow
                      key={node[tableKey || 'id']}
                      hover={hover}
                    >
                      {
                        showCheckbox && (
                          <TableCell
                            key={`showItemCheckbox-${node.id}`}
                            sx={{
                              borderBottom: showBorder ? '1px solid rgba(224, 224, 224, 1)' : lastItemBorderBottom,
                            }}
                          >
                            <Checkbox
                              checked={selectCheckbox.includes(node[selectedSymbol])}
                              onChange={() => {
                                if (handleSelectOneItem) handleSelectOneItem(node[selectedSymbol])
                              }}
                            />
                          </TableCell>
                        )
                      }
                      {
                        columnItems.map((column) => (
                          <TableCell
                            key={column.title}
                            sx={{
                              borderBottom: showBorder ? '1px solid rgba(224, 224, 224, 1)' : lastItemBorderBottom,
                            }}
                          >
                            {column.render ? column.render(node, index) : node[column.key]}
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {
            showPagination && (
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage={labelRowsPerPage || 'Rows per page:'}
                component="div"
                count={count}
                rowsPerPage={first}
                page={first === 0 ? 0 : offset / first}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )
          }
        </Card>
      )}
    </>
  ) : <B3NoData text={noDataText} />
}
