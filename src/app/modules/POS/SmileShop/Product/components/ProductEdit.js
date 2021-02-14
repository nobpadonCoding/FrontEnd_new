/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from "../../Product/_redux/productRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, FormControl, InputLabel, MenuItem, Select, Grid } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";
import * as CONST from '../../../../../../Constants';
import Axios from "axios";

function ProductEdit(props) {
    debugger

    const PRODUCTGROUP_API_URL = `${CONST.API_URL}/SmileShop/ProductGroups`
    const dispatch = useDispatch()
    const productReducer = useSelector(({ product }) => product);
    const [open, setOpen] = React.useState(false);
    const [productGroup, setProductGroup] = React.useState([])

    React.useEffect(() => {
        Axios.get(PRODUCTGROUP_API_URL)
            .then((res) => {
                //bind data
                if (res.data.isSuccess) {
                    setProductGroup(res.data.data)
                } else {
                    //internal error
                    swal.swalError("Error", res.data.message);
                }
            }).catch((err) => {
                //physical error
                swal.swalError("Error", err.message);
            })
    }, [])

    // React.useEffect(() => {
    //     if (props.productid !== 0) {
    //         handleGet();
    //     }
    // }, [props.productid]);

    React.useEffect(() => {
        debugger
        // console.log('useEffect openModal: ', productReducer.openModal);
        if (productReducer.openModal.modalOpen === true && productReducer.openModal.productId !== 0) {
            handleGet();
        }
    }, [productReducer.openModal]);

    const handleGet = () => {
        productAxios
            .getProduct(productReducer.openModal.productId)
            .then((res) => {
                if (res.data.isSuccess) {
                    // console.log(res.data);
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
                } else {
                    handleClose(true);
                    swal.swalError("Error", res.data.message);
                }
            })
            .catch((err) => {
                handleClose(true);
                swal.swalError("Error", err.message);
            })
            .finally(() => {
                handleOpen(true);
            });
    };

    const handleOpen = () => {
        setOpen(true);
        // console.log("handleOpen productToAdd: ", productReducer.productToAdd)
    };

    const handleClose = () => {
        setOpen(false);
        dispatch(productRedux.actions.resetProduct());
        dispatch(productRedux.actions.resetOpenModal());
        // console.log("handleClose productToAdd: ", productReducer.productToAdd)
        // console.log("handleClose openModal: ", productReducer.openModal)
    };
    const handleSave = ({ setSubmitting }, values) => {

        let objPayload = {
            ...productReducer,
            //Id: values.Id,
            ProductName: values.ProductName,
            ProductPrice: parseInt(values.Price),
            ProductGroupId: parseInt(values.ProductGroupId),
            productStatus: values.productStatus
        };

        dispatch(productRedux.actions.updateProduct(objPayload));

        productAxios.editProduct(objPayload, values.Id)
            .then((res) => {
                if (res.data.isSuccess) {
                    setSubmitting(false);
                    //reload
                    handleClose();
                    props.submit(true);
                    swal.swalSuccess("Success", `Add ${res.data.data.name} success.`)
                    dispatch(productRedux.actions.resetProduct());
                    dispatch(productRedux.actions.resetOpenModal());
                    // console.log("handleSave Success productToAdd: ", productReducer.productToAdd)
                    // console.log("handleSave Success openModal: ", productReducer.openModal)
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
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    handleSave({ setSubmitting }, values);
                    handleClose({ resetForm }, values);
                    setSubmitting(false);
                }}
            >
                {({ submitForm, isSubmitting, values, errors, setFieldValue }) => (
                    <Form>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit Product</DialogTitle>
                            <DialogContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
                                >
                                    <Grid item xs={12} lg={12}>
                                        <Field
                                        required
                                            fullWidth
                                            component={TextField}
                                            type="text"
                                            label="ProductName"
                                            name="ProductName"
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
                                        <InputLabel htmlFor="ProductGroup">ProductGroup</InputLabel>
                                        <Field
                                            fullWidth
                                            required
                                            component={Select}
                                            name="ProductGroupId"
                                            value={values.ProductGroupId}
                                            onChange={(event) => {
                                                setFieldValue("ProductGroupId", event.target.value);
                                            }}
                                        >
                                            <MenuItem disabled value={0} selected>
                                                กรุณาเลือก
        								</MenuItem>
                                            {productGroup.map((item) => (
                                                <MenuItem key={`ProductGroupId_${item.id}`} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12} lg={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Field
                                                component={Select}
                                                required
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
