/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as orderAxios from "../../Order/_redux/orderAxios";
import * as orderRedux from "../../Order/_redux/orderRedux";
import OrderDataTable from "mui-datatables";
import { Grid, Typography, CircularProgress, Chip, TableRow, TableCell } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import * as CommonValidators from '../../../../Common/functions/CommonValidators'
import ViewButton from '../../../../Common/components/Buttons/ViewButton'
import * as swal from "../../../../Common/components/SweetAlert";

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function OrderTable() {

	const [isLoading, setIsLoading] = React.useState(true);
	const orderReducer = useSelector(({ order }) => order);
	const dispatch = useDispatch();
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [data, setData] = React.useState([]);
	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			OrderNumber: ""
		}
	});

	const handleOpen = (id) => {
		orderAxios
			.getOrder(id)
			.then((res) => {
				if (res.data.isSuccess) {
					console.log(res.data)

					//ประกาศ obj orderHeader
					let orderHeader = {
						...orderReducer.orderHeader,
						total: res.data.data.total,
						discount: res.data.data.discount,
						totalAmount: res.data.data.totalAmount,
						openDialogOrderDetail: true,
						productQuantity: res.data.data.productQuantity,

						//ยัด array orderDetail เข้าไป orderHeader
						orderDetail: res.data.data.orders,
					};
					dispatch(orderRedux.actions.getOrderDetail(orderHeader));
					console.log("orderHeader", orderHeader)

				} else {
					loadData();
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				swal.swalError("Error", err.message);
			});

	}

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const loadData = () => {
		debugger
		setIsLoading(true);
		orderAxios
			.getOrderFilter(
				dataFilter.orderingField,
				dataFilter.ascendingOrder,
				dataFilter.page,
				dataFilter.recordsPerPage,
				dataFilter.searchValues.OrderNumber,
			)
			.then((res) => {
				console.log(res)
				if (res.data.isSuccess) {
					//flatten data
					if (res.data.totalAmountRecords > 0) {
						let flatData = [];
						res.data.data.forEach((element) => {
							flatData.push(flatten(element));
						});
						setData(flatData);
					}
					setTotalRecords(res.data.totalAmountRecords);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const theme = createMuiTheme({
		overrides: {
			MUIDataTableSelectCell: {
				expandDisabled: {
					// Soft hide the button.
					visibility: 'hidden',
				},
			},
		},
	});

	const options = {
		// expandableRows: true,
		// expandableRowsHeader: false,
		// expandableRowsOnClick: true,
		// isRowExpandable: (dataIndex, expandedRows) => {
		// 	if (dataIndex === 0 || dataIndex === 5) return false;

		// 	// ไม่ให้ขยาย หากมีการขยาย 4 แถวแล้ว แต่ยุบแถวที่ขยายได้
		// 	if (expandedRows.data.length > 4 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
		// 	return true;
		// },
		// rowsExpanded: [1],
		// renderExpandableRow: (rowData, rowMeta) => {
		// 	const colSpan = rowData.length + 1;
		// 	return (
		// 		<TableRow>
		// 			<TableCell colSpan={colSpan}>
		// 				{/* {rowData} */}
		// 			</TableCell>
		// 		</TableRow>
		// 	);
		// },
		// // onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => console.log("curExpanded", curExpanded, "allExpanded", allExpanded, "rowsExpanded", rowsExpanded),
		// onRowExpansionChange: (rowData) => {
		// 	console.log((rowData));
		// },
		filter: false,
		print: false,
		download: false,
		search: false,
		selectableRows: "none",
		serverSide: true,
		// resizableColumns: true,
		count: totalRecords,
		page: dataFilter.page - 1,
		rowsPerPage: dataFilter.recordsPerPage,
		onTableChange: (action, tableState) => {
			switch (action) {
				case "changePage":
					setDataFilter({ ...dataFilter, page: tableState.page + 1 });
					break;
				case "sort":
					setDataFilter({
						...dataFilter,
						orderingField: `${tableState.sortOrder.name}`,
						ascendingOrder:
							tableState.sortOrder.direction === "asc" ? true : false,
					});
					break;
				case "changeRowsPerPage":
					setDataFilter({
						...dataFilter,
						recordsPerPage: tableState.rowsPerPage,
					});
					break;
				default:
				//  console.log(`action not handled. [${action}]`);
			}
		},
	};

	const columns = [
		{
			name: "id",
			label: "Bill Number",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center", cursor: 'pointer' }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "createdDate",
			options: {
				sort: false,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							style={{ padding: 0, margin: 0 }}
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
						>
							{dayjs(data[dataIndex].createdDate).format("DD/MM/YYYY")}
						</Grid>
					);
				},
			},
		},
		{
			name: "productQuantity",
			label: "Quantity",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "total",
			label: "total",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "right" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "right" }}>
						{CommonValidators.currencyFormat(value)}
					</Grid>
				)
			}
		},
		{
			name: "discount",
			label: "discount",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "right" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "right" }}>
						{CommonValidators.currencyFormat(value)}
					</Grid>
				)
			}
		},
		{
			name: "totalAmount",
			label: "Net",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "right" }}>
						{columnMeta.name}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "right" }}>
						{CommonValidators.currencyFormat(value)}
					</Grid>
				)
			}
		},
		{
			name: "createdBy.username",
			label: "createdBy",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			}
		},
		{
			name: "status",
			label: "status",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.name}
					</Grid>
				),
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							style={{ padding: 0, margin: 0, textAlign: "left" }}
						>
							{data[dataIndex].status === true ? (
								<Chip
									label="Active"
									variant="outlined"
									color="primary"
								/>
							) : (
								<Chip
									label="Delete"
									variant="outlined"
									color="default"
								/>
							)}
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			options: {
				filter: false,
				sort: false,
				empty: true,
				viewColumns: false,
				hight: 2,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<ViewButton
								style={{ marginLeft: 0 }}
								disabled={data[dataIndex].status === true ? false : true}
								onClick={() => {
									handleOpen(data[dataIndex].id);
								}}
							>
								View
                          </ViewButton>
						</Grid>
					);
				},
			},
		},
	];
	return (
		<div>
			<MuiThemeProvider theme={theme}>
				<OrderDataTable
					title={
						<Typography variant="h6">
							Order
                                {isLoading && (
								<CircularProgress
									size={24}
									style={{ marginLeft: 15, position: "relative", top: 4 }}
								/>
							)}
						</Typography>
					}
					data={data}
					columns={columns}
					options={options}
				/>
			</MuiThemeProvider>
		</div>
	)
}

export default OrderTable
