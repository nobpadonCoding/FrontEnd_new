/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import MUIDataTable from "mui-datatables";
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from '../../Product/_redux/productRedux';
import EditButton from "../../../../Common/components/Buttons/EditButton";
import DeleteButton from "../../../../Common/components/Buttons/DeleteButton";
import ProductEdit from "../../Product/components/ProductEdit";
import ProductSearch from "../../Product/components/ProductSearch";
import ProductAdd from "../../Product/components/ProductAdd";
import { Grid, Chip, Typography, CircularProgress, Card, CardContent } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import * as swal from "../../../../Common/components/SweetAlert";
import AddButton from "../../../../Common/components/Buttons/AddButton";
import * as commonValidators from '../../../../Common/functions/CommonValidators';

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function ProductTable(props) {

    const dispatch = useDispatch()
    const productReducer = useSelector(({ product }) => product);
    const [dataFilter, setDataFilter] = React.useState({
        page: 1,
        recordsPerPage: 10,
        orderingField: "",
        ascendingOrder: true,
        searchValues: {
            productName: "",
            productGroupName: ""
        }
    });

    const [isLoading, setIsLoading] = React.useState(true);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        //load data from api
        loadData();
    }, [dataFilter]);

    const handleEditProduct = () => {
        setDataFilter({
            ...dataFilter,
            page: 1
        });
    }

    const handleAddProduct = () => {
        setDataFilter({
            ...dataFilter,
            page: 1
        });
    }

    const handleSearchProduct = (values) => {
        setDataFilter({
            ...dataFilter,
            page: 1,
            searchValues: values
        });
    }

    const handleOpen = (id) => {
        debugger
        if (id !== 0) {
            let objPayloadEdit = {
                ...productReducer.openModal,
                productId: id,
                modalOpen: true,
            };

            dispatch(productRedux.actions.setOpenModal(objPayloadEdit));

        } else {
            let objPayloadAdd = {
                ...productReducer.openModal,
                productId: 0,
                modalOpen: true,
            };

            dispatch(productRedux.actions.setOpenModal(objPayloadAdd));
        }

    };

    const handleDelete = (id) => {

        productAxios
            .getProduct(id)
            .then((res) => {
                if (res.data.isSuccess) {
                    swal.swalConfirm("Confirm delete?", `Confirm delete ${res.data.data.name}?`).then((res) => {
                        if (res.isConfirmed) {
                            //delete
                            productAxios
                                .deleteProduct(id)
                                .then((res) => {
                                    if (res.data.isSuccess) {
                                        //reload
                                        swal.swalSuccess("Success", `Delete ${res.data.data.name} success.`).then(() => {
                                            loadData();
                                        });
                                    } else {
                                        swal.swalError("Error", res.data.message);
                                    }
                                })
                                .catch((err) => {
                                    //network error
                                    swal.swalError("Error", err.message);
                                });
                        }
                    });

                } else {
                    loadData();
                    swal.swalError("Error", res.data.message);
                }
            })
            .catch((err) => {
                swal.swalError("Error", err.message);
            });
    };

    const loadData = () => {
        setIsLoading(true);
        productAxios
            .getProductsFilter(
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
            name: "name",
            label: "name",
            option: {
                sort: false,
            },
        },
        {
            name: "productGroup.name",
            label: "ProductGroup"
        },
        {
            name: "price",
            label: "price",
            options: {
                sort: false,
                customHeadLabelRender: (columnMeta, updateDirection) => (
                    <Grid style={{ cursor: 'pointer', textAlign: "center" }}>
                        {columnMeta.name}
                    </Grid>
                ),
                customBodyRender: (value) => (
                    <Grid style={{ cursor: 'pointer', textAlign: "right" }}>
                        {commonValidators.currencyFormat(value)}
                    </Grid>
                )
            }
        },
        {
            name: "stockCount",
            label: "stockCount",
            options: {
                sort: false,
                customHeadLabelRender: (columnMeta, updateDirection) => (
                    <Grid style={{ cursor: 'pointer', textAlign: "center" }}>
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
            name: "createdBy.username",
            label: "createdBy",
            options: {
                sort: false,
                customHeadLabelRender: (columnMeta, updateDirection) => (
                    <Grid style={{ cursor: 'pointer', textAlign: "center" }}>
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
            name: "Status",
            label: "Status",
            options: {
                sort: false,
                // setCellHeaderProps: () => ({ align: "center" }),
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <Grid
                            style={{ padding: 0, margin: 0 }}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
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
                                    handleOpen(data[dataIndex].id);
                                }}
                            >
                                Edit
                          </EditButton>
                            <DeleteButton
                                style={{ marginRight: 20 }}
                                disabled={data[dataIndex].status === true ? false : true}
                                onClick={() => {
                                    handleDelete(data[dataIndex].id);
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
            <Grid container
                direction="column"
                justify="center"
                alignItems="stretch">
                <Card elevation={3} style={{ marginBottom: 5 }}>
                    <CardContent>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <ProductSearch submit={handleSearchProduct.bind(this)}></ProductSearch>
                            <Grid item xs={12} lg={2}>
                                <AddButton
                                    fullWidth
                                    color="primary"
                                    // disabled={isSubmitting}
                                    onClick={() => {
                                        handleOpen(0);
                                    }}
                                >
                                    Add Product
                    		</AddButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

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
            </Grid>
            <ProductAdd submit={handleAddProduct.bind(this)}></ProductAdd>
            <ProductEdit submit={handleEditProduct.bind(this)}></ProductEdit>
        </div>
    )
}

export default ProductTable
