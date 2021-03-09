/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as orderAxios from "../../Order/_redux/orderAxios";
import OrderDataTable from "mui-datatables";
import { Grid, Typography, CircularProgress, Chip } from "@material-ui/core";
import * as CommonValidators from '../../../../Common/functions/CommonValidators'

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function OrderTable() {

	const [isLoading, setIsLoading] = React.useState(true);
	const orderReducer = useSelector(({ order }) => order);
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

	const options = {
		filterType: "checkbox",
		print: false,
		download: false,
		filter: false,
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
			label: "Code",
			options: {
				// sort: false,
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
			name: "discount",
			label: "discount",
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
			name: "createdBy",
			label: "createdBy",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.name}
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
							style={{ padding: 0, margin: 0,textAlign: "left" }}
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
		}
	];
	return (
		<div>
			<OrderDataTable
				title={
					<Typography variant="h6">
						Stock
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
		</div>
	)
}

export default OrderTable
