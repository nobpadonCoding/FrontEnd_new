import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import EditButton from "../../../../Common/components/Buttons/EditButton";
import DeleteButton from "../../../../Common/components/Buttons/DeleteButton";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
// import * as swal from "../../../../Common/components/SweetAlert";

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function ProductStockEdit() {

	const [isLoading, setIsLoading] = React.useState(true);
	const [data, setData] = React.useState([]);
	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			productName: ""
		}
	});

	React.useEffect(() => {
        //load data from api
        loadData();
    }, [dataFilter]);

	const [totalRecords, setTotalRecords] = React.useState(0);

	const loadData = () => {
		setIsLoading(true);
		productAxios
			.getStockFilter(
				dataFilter.orderingField,
				dataFilter.ascendingOrder,
				dataFilter.page,
				dataFilter.recordsPerPage,
				dataFilter.searchValues.productName,
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
			name: "productGroupName",
			label: "productGroupName",
		},
		"productName",
		"productStockCount",
		{
			name: "qty",
			label: "Edit"
		},
		{
			name:"stockAfter",
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
			name:"remark",
			label: "remark"
		},
		{
			name: "",
			options: {
				filter: false,
				sort: false,
				empty: true,
				hight: 2,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<EditButton
								style={{ marginRight: 20 }}
								onClick={() => {
									// handleOpen(data[dataIndex].id);
								}}
							>
								Edit
                          </EditButton>
							<DeleteButton
								style={{ marginRight: 20 }}
								disabled={data[dataIndex].status === true ? false : true}
								onClick={() => {
									// handleDelete(data[dataIndex].id);
								}}
							>
								Delete
                          </DeleteButton>
						</Grid>
					);
				},
			},
		},
	];
	return (
		<div>

			<MUIDataTable
				title={
					<Typography variant="h6">
						Product
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

export default ProductStockEdit
