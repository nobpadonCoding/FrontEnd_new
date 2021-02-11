import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from "../../Product/_redux/productRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, FormControl, InputLabel, MenuItem, Select, Grid } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";

function ProductEdit(props) {

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

    const [open, openModal] = React.useState(false);

    const productReducer = useSelector(({ product }) => product);
    const dispatch = useDispatch()

    React.useEffect(() => {
        if (productReducer.openModal === true) {
            handleOpen();
        }
    }, [productReducer.openModal]);


    const handleOpen = () => {
        productAxios
            .getProduct(productReducer.openModal.productId)
            .then((res) => {
                if (res.data.isSuccess) {
                    console.log(res.data);
                    let apiData = res.data.data;
                    let objPayload = {
                        ...productReducer.productToAdd,
                        Id: apiData.id,
                        ProductName: apiData.name,
                        Price: apiData.price,
                        StockCount: apiData.stockCount,
                        ProductGroupId: apiData.productGroupId,
                        productStatus: apiData.status
                    };
                    dispatch(productRedux.actions.updateProduct(objPayload));
                }
            })
    };

    const handleClose = (values) => {
        dispatch(productRedux.actions.resetOpenModal());
    };

    return (
        <div>
            <Formik
                enableReinitialize
                //Form fields and default values
                initialValues={{
                    Id: productReducer.productToAdd.Id,
                    ProductName: productReducer.productToAdd.ProductName,
                    Price: productReducer.productToAdd.Price,
                    StockCount: productReducer.productToAdd.StockCount,
                    ProductGroupId: productReducer.productToAdd.ProductGroupId,
                    productStatus: productReducer.productToAdd.productStatus
                }}
                //Validation section
                validate={(values) => {
                    const errors = {};

                    return errors;
                }}
                //Form Submission
                // ต้องผ่าน Validate ก่อน ถึงจะถูกเรียก
                onSubmit={(values, { setSubmitting }) => {
                    let objPayload = {
                        ...productReducer,
                        //Id: values.Id,
                        ProductName: values.ProductName,
                        ProductPrice: parseInt(values.Price),
                        //StockCount: parseInt(values.StockCount),
                        ProductGroupId: parseInt(values.ProductGroupId),
                        productStatus: values.productStatus
                    }

                    dispatch(productRedux.actions.updateProduct(objPayload));
                    productAxios.editProduct(objPayload, values.Id)
                        .then((res) => {
                            if (res.data.isSuccess) {
                                //reload
                                // loadData();
                                handleClose();
                                swal.swalSuccess("Success", `Add ${res.data.data.Id} success.`)
                            } else {
                                handleClose();
                                swal.swalError("Error", res.data.message);
                            }
                        })
                        .catch((err) => {
                            //network error
                            handleClose();
                            swal.swalError("Error", err.message);

                        });

                }}
            >
                {({ submitForm, isSubmitting, values, errors, setFieldValue }) => (
                    <Form>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit Product</DialogTitle>
                            <DialogContent fullWidth>
                                <Grid item xs={12} lg={12}>
                                    <Field
                                        fullWidth
                                        component={TextField}
                                        type="text"
                                        label="ProductName"
                                        name="ProductName"
                                    // values={values.ProductName}
                                    // onChange={(e) => setFieldValue('ProductName', e)}
                                    />
                                </Grid>
                                <Field
                                    margin="dense"
                                    component={TextField}
                                    name="Price"
                                    label="Price"
                                    type="text"
                                    fullWidth
                                />
                                <Grid item xs={12} lg={12}>
                                    <Field
                                        margin="dense"
                                        component={TextField}
                                        name="ProductGroupId"
                                        label="Group Id"
                                        type="text"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Field
                                            component={Select}
                                            name="productStatus"
                                            value={values.productStatus}
                                            onChange={(event) => {
                                                setFieldValue("productStatus", event.target.value);
                                            }}
                                        >
                                            <MenuItem value={true}>Active</MenuItem>
                                            <MenuItem value={false}>Delete</MenuItem>
                                        </Field>
                                    </FormControl>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={submitForm} disabled={isSubmitting} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ProductEdit
