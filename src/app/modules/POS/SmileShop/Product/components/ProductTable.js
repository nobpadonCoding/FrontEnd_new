import React from 'react'
import MUIDataTable from "mui-datatables";
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from '../../Product/_redux/productRedux';
import EditButton from "../../../../Common/components/Buttons/EditButton";
import ProductEdit from "../../Product/components/ProductEdit";
import { Grid, Chip, Typography, CircularProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function ProductTable() {

    const [paginated, setPaginated] = React.useState({
        page: 1,
        recordsPerPage: 10,
        orderingField: "",
        ascendingOrder: true,
        searchValues: {
            productName: "",
            productGroupName: ""
        }
    });

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [totalRecords, setTotalRecords] = React.useState(0);

    const productReducer = useSelector(({ product }) => product);
    const dispatch = useDispatch()

    React.useEffect(() => {
        //load data from api
        loadData();
    }, [paginated]);


    const handleOpen = (id) => {
        let objPayload = {
            ...productReducer.openmodal,
            productId: id,
            openModal: true,
        };
        dispatch(productReducer.actions.setOpenModal(objPayload));
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
        "price",
        "stockCount",
        {
            name: "createdBy",
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
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <Grid
                            style={{ padding: 0, margin: 0 }}
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                        >
                            <EditButton
                                style={{ marginRight: 5 }}
                                onClick={() => {
                                    handleOpen(data[dataIndex].id);
                                }}
                            >
                                Edit
                            </EditButton>
                        </Grid>
                    );
                },
            },
        },
    ];

    const loadData = () => {
        setIsLoading(true);
        productAxios
            .getProductsFilter(
                paginated.orderingField,
                paginated.ascendingOrder,
                paginated.page,
                paginated.recordsPerPage,
                paginated.searchValues.productName,
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

    return (
        <div>
            <ProductEdit></ProductEdit>
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
            // options={options}
            />
        </div>
    )
}

export default ProductTable
