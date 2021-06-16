/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from '../../Product/_redux/productRedux';
import AddButton from "../../../../Common/components/Buttons/AddButton";
import { Grid, Typography, CircularProgress, Card, CardContent } from "@material-ui/core";
import StockDataTable from "mui-datatables";
import { useSelector, useDispatch } from "react-redux";
import ProductStockAdd from '../../Product/components/ProductStockAdd';
import ProductStockSearch from '../../Product/components/ProductStockSearch'
// import * as swal from "../../../../Common/components/SweetAlert";

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function ProductStockTable(props) {

	const dispatch = useDispatch()
	const productReducer = useSelector(({ product }) => product);
	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState([]);
	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			StoreType: 3
		}
	});

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const [totalRecords, setTotalRecords] = React.useState(0);

	const handleAddStockProduct = () => {
		setDataFilter({
			...dataFilter,
			page: 1
		});
	}

	const handleSearchProduct = (values) => {
		// alert(values.storeType);
		setDataFilter({
			...dataFilter,
			page: 1,
			searchValues: values.storeType
		});
	}

	const handleOpen = (id) => {
		debugger
		if (id !== 0) {
			let objPayloadEdit = {
				...productReducer.openModalStock,
				stockId: id,
				stockModalOpen: true,
			};
			dispatch(productRedux.actions.setOpenModalStock(objPayloadEdit));
		} else {
			let objPayloadAdd = {
				...productReducer.openModalStock,
				stockId: 0,
				stockModalOpen: true,
			};
			dispatch(productRedux.actions.setOpenModalStock(objPayloadAdd));
		}

	};

	const loadData = () => {
		debugger
		setIsLoading(true);
		productAxios
			.getStockFilter(
				dataFilter.orderingField,
				dataFilter.ascendingOrder,
				dataFilter.page,
				dataFilter.recordsPerPage,
				dataFilter.searchValues,
			)
			.then((res) => {
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
		},
		{
			name: "createdDate",
			options: {
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
			name: "product.productGroup.name",
			label: "GroupName",
		},
		{
			name: "product.name",
			label: "ProductName"
		},
		{
			name: "productStockCount",
			label: "StockCount"
		},
		{
			name: "",
			label: "Edit",
			options: {
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid>
							{data[dataIndex].storeType === "2" ? (
								<Grid>-{data[dataIndex].qty}</Grid>
							) : (
								<Grid>+{data[dataIndex].qty}</Grid>
							)}
						</Grid>
					);
				},
			},
		},
		{
			name: "stockAfter",
			label: "StockAfter"
		},
		{
			name: "createdBy",
			options: {
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid>
							{data[dataIndex].createdByUsername}
						</Grid>
					);
				},
			},
		},
		{
			name: "remark",
			label: "remark"
		}
	];
	return (
		<div>
			<Grid container
				direction="column"
				justify="center"
				alignItems="stretch">
				<Card elevation={3} style={{ marginBottom: 5 }}>
					<CardContent>
						<Grid container
							direction="row"
							justify="flex-start"
							alignItems="stretch"
							spacing={3}>
							<Grid item xs={12} lg={6}>
								<AddButton
									fullWidth
									color="primary"
									// disabled={isSubmitting}
									onClick={() => {
										handleOpen(0);
									}}
								>
									New RECORD
								</AddButton>
							</Grid>
							<Grid item xs={12} lg={6}>
								<ProductStockSearch submit={handleSearchProduct.bind(this)}></ProductStockSearch>
							</Grid>
							<Grid item xs={12} lg={6}>
								<ProductStockAdd submit={handleAddStockProduct.bind(this)}></ProductStockAdd>
							</Grid>
						</Grid>
					</CardContent>
				</Card>

				<StockDataTable
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
			</Grid>
		</div>
	)
}

export default ProductStockTable
