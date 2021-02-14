import React from 'react';
import MUIDataTable from "mui-datatables";
import * as productgrouptAxios from "../../ProductGroup/_redux/productgroupAxios";
import * as productgroupRedux from "../../ProductGroup/_redux/productgroupRedux";
import { Grid, Chip, Typography, CircularProgress, Card, CardContent } from "@material-ui/core";
import AddButton from "../../../../Common/components/Buttons/AddButton";
import EditButton from "../../../../Common/components/Buttons/EditButton";
import DeleteButton from "../../../../Common/components/Buttons/DeleteButton";
import { useSelector, useDispatch } from "react-redux";
import ProductGroupEdit from "../../ProductGroup/components/ProductGroupEdit";
import ProductGroupAdd from "../../ProductGroup/components/ProductGroupAdd";
import * as swal from "../../../../Common/components/SweetAlert";


var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function ProductGroupTable() {
    const dispatch = useDispatch()
    const productGroupReducer = useSelector(({ productGroup }) => productGroup);
    const [dataFilter, setDataFilter] = React.useState({
        page: 1,
        recordsPerPage: 10,
        orderingField: "",
        ascendingOrder: true,
        searchValues: {
            productGroupName: ""
        }
    });

    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);

    React.useEffect(() => {
        //load data from api
        loadData();
    }, [dataFilter]);

    const handleEditProductGroup = () => {
        setDataFilter({
            ...dataFilter,
            page: 1
        });
    }

    const handleAddProductGroup = () => {
        setDataFilter({
            ...dataFilter,
            page: 1
        });
    }

    const handleOpen = (id) => {
        debugger
        if (id !== 0) {
            let objPayloadEdit = {
                ...productGroupReducer.openModalProductGroup,
                productGroupId: id,
                modalOpen: true,
            };
            dispatch(productgroupRedux.actions.setOpenModalProductGroup(objPayloadEdit));
            // console.log('setOpenModal edit : ', productGroupReducer.openModalProductGroup);
        } else {
            let objPayloadAdd = {
                ...productGroupReducer.openModalProductGroup,
                productGroupId: 0,
                modalOpen: true,
            };
            dispatch(productgroupRedux.actions.setOpenModalProductGroup(objPayloadAdd));
            // console.log('setOpenModal add : ', productGroupReducer.openModalProductGroup);
        }

    };

    const handleDelete = (id) => {

        productgrouptAxios
            .getProductGroup(id)
            .then((res) => {
                if (res.data.isSuccess) {
                    swal.swalConfirm("Confirm delete?", `Confirm delete ${res.data.data.name}?`).then((res) => {
                        if (res.isConfirmed) {
                            //delete
                            productgrouptAxios
                                .deleteProductGroup(id)
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
        // .finally(() => {
        //     handleOpen(true);
        // });
    };

    const loadData = () => {
        setIsLoading(true);
        productgrouptAxios
            .getProductsGroupFilter(
                dataFilter.orderingField,
                dataFilter.ascendingOrder,
                dataFilter.page,
                dataFilter.recordsPerPage,
                dataFilter.searchValues.productGroupName,
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
            name: "name",
            label: "Name",
            option: {
                sort: false,
            },
        },
        {
            name: "CreatedBy",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <Grid>
                            {data[dataIndex].createdBy}
                        </Grid>
                    );
                },
            },
        },

        {
            name: "CreatedDate",
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
            name: "Status",
            label: "Status",
            options: {
                // sort: false,
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
                            {/* <ProductSearch submit={handleSearchProduct.bind(this)}></ProductSearch> */}
                            <Grid item xs={12} lg={2}>
                                <AddButton
                                    fullWidth
                                    color="primary"
                                    // disabled={isSubmitting}
                                    onClick={() => {
                                        handleOpen(0);
                                    }}
                                >
                                    Add Product Group
                    		</AddButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <MUIDataTable
                    title={
                        <Typography variant="h6">
                            Product Group
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
            <ProductGroupEdit submit={handleEditProductGroup.bind(this)}></ProductGroupEdit>
            <ProductGroupAdd submit={handleAddProductGroup.bind(this)}></ProductGroupAdd>
        </div>
    )
}

export default ProductGroupTable
