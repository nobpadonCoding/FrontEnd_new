import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from "../../Product/_redux/productRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, Grid, Card, CardContent } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";

function ProductAdd(props) {
	debugger
	const dispatch = useDispatch();
	const productReducer = useSelector(({ product }) => product);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		debugger
		console.log('useEffect openModal add: ', productReducer.openModal);
		if (productReducer.openModal.modalOpen === true && productReducer.openModal.productId === 0) {
			handleOpen();
		}
	}, [productReducer.openModal]);

	const handleOpen = () => {
		debugger
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<Formik
				enableReinitialize
				//Form fields and default values
				initialValues={{
					Id: productReducer.productToAdd.Id,
					ProductName: productReducer.productToAdd.ProductName,
					price: productReducer.productToAdd.Price,
					StockCount: productReducer.productToAdd.StockCount,
					ProductGroupId: productReducer.productToAdd.ProductGroupId
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
						...productReducer.addProduct,
						//Id: values.Id,
						ProductName: values.ProductName,
						price: parseFloat(values.Price),
						StockCount: parseInt(values.StockCount),
						ProductGroupId: parseInt(values.ProductGroupId)
					}
					console.log(objPayload);
					dispatch(productRedux.actions.updateProduct(objPayload));
					productAxios.addProduct(objPayload)
						.then((res) => {
							if (res.data.isSuccess) {
								//reload
								// loadData();
								handleClose();
								swal.swalSuccess("Success", `Add ${res.data.data.Id} success.`)
								props.submit(true);
								//     handleClose();
								// });
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
							<DialogTitle id="form-dialog-title">Add Product</DialogTitle>
							<DialogContent>
								<DialogContentText>
									<Field
										fullWidth
										component={TextField}
										type="text"
										label="ProductName"
										name="ProductName"
									/>
									<Field
										margin="dense"
										component={TextField}
										name="Price"
										label="Price"
										type="text"
										fullWidth
									/>
									<Field
										margin="dense"
										component={TextField}
										name="StockCount"
										label="stock Count"
										type="text"
										fullWidth
									/>
									<Field
										margin="dense"
										component={TextField}
										name="ProductGroupId"
										label="Group Id"
										type="text"
										fullWidth
									/>
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button variant="contained" onClick={handleClose} color="secondary">
									Cancel
                                </Button>
								<Button variant="contained"
									onClick={submitForm}
									disabled={isSubmitting}
									color="primary"
									startIcon={<SaveIcon color="action" />}>
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

export default ProductAdd
