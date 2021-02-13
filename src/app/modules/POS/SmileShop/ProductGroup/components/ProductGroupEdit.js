/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as productgroupAxios from "../../ProductGroup/_redux/productgroupAxios";
import * as productgroupRedux from "../../ProductGroup/_redux/productgroupRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, FormControl, InputLabel, MenuItem, Select, Grid } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";

function ProductEdit(props) {
    debugger
    const dispatch = useDispatch()
    const productGroupReducer = useSelector(({ productGroup }) => productGroup);
    const [open, setOpen] = React.useState(false);

    // React.useEffect(() => {
    //     if (props.productid !== 0) {
    //         handleGet();
    //     }
    // }, [props.productid]);

    React.useEffect(() => {
        debugger
        console.log('useEffect openModal: ', productGroupReducer.openModalProductGroup);
        if (productGroupReducer.openModalProductGroup.modalOpen === true && productGroupReducer.openModalProductGroup.productGroupId !== 0) {
            handleGet();
        }
    }, [productGroupReducer.openModalProductGroup]);

    const handleGet = () => {
        productgroupAxios
            .getProductGroup(productGroupReducer.openModalProductGroup.productGroupId)
            .then((res) => {
                if (res.data.isSuccess) {
                    console.log(res.data);
                    let apiData = res.data.data;
                    let objPayload = {
                        ...productGroupReducer.productGroupToAdd,
						Id:apiData.id,
                        productGroupName: apiData.name,
                        productGroupStatus: apiData.status
                    };
                    dispatch(productgroupRedux.actions.updateProductGroup(objPayload));
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
        console.log("handleOpen productgroupToAdd: ", productGroupReducer.productGroupToAdd)
    };

    const handleClose = () => {
        setOpen(false);
        dispatch(productgroupRedux.actions.resetProductGroup());
        dispatch(productgroupRedux.actions.resetOpenModalProductGroup());
        console.log("handleClose productgroup ToAdd: ", productGroupReducer.productGroupToAdd)
        console.log("handleClose openModal Edit: ", productGroupReducer.openModalProductGroup)
    };
    const handleSave = ({ setSubmitting }, values) => {

        let objPayload = {
            ...productGroupReducer,
            productGroupName: values.productGroupName,
            productGroupStatus: values.productGroupStatus
        };

        dispatch(productgroupRedux.actions.updateProductGroup(objPayload));

        productgroupAxios.editProductGroup(objPayload, values.Id)
            .then((res) => {
                if (res.data.isSuccess) {
                    setSubmitting(false);
                    //reload
                    handleClose();
                    props.submit(true);
                    swal.swalSuccess("Success", `Edit ${res.data.data.name} success.`)
                    dispatch(productgroupRedux.actions.resetProductGroup());
                    dispatch(productgroupRedux.actions.resetOpenModalProductGroup());
                    console.log("handleSave Success productToAdd: ", productGroupReducer.productGroupToAdd)
                    console.log("handleSave Success openModal: ", productGroupReducer.openModal)
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
					Id:productGroupReducer.productGroupToAdd.Id,
                    productGroupName: productGroupReducer.productGroupToAdd.productGroupName,
                    // productGroupId: productGroupReducer.productToAdd.productGroupId,
					productGroupStatus:productGroupReducer.productGroupToAdd.productGroupStatus
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
                            <DialogTitle id="form-dialog-title">Edit ProductGroup</DialogTitle>
                            <DialogContent>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
                                >
                                    <Grid item xs={12} lg={12}>
                                        <Field
                                            fullWidth
                                            component={TextField}
                                            type="text"
                                            label="productGroupName"
                                            name="productGroupName"
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Field
                                                component={Select}
                                                name="productGroupStatus"
                                                value={values.productGroupStatus}
                                                onChange={(event) => {
                                                    setFieldValue("productGroupStatus", event.target.value);
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
