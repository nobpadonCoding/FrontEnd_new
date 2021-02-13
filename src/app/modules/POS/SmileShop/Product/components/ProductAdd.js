/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from "../../Product/_redux/productRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, InputLabel, MenuItem } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from "formik";
import { Select } from "formik-material-ui";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";
import * as CONST from '../../../../../../Constants';
import Axios from "axios";

function ProductAdd(props) {
	debugger
	const PRODUCTGROUP_API_URL = `${CONST.API_URL}/SmileShop/ProductGroups`
	const dispatch = useDispatch();
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

	const handleSave = ({ resetForm, setSubmitting }, values) => {
		setSubmitting(false);
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

					handleClose({ resetForm });
					swal.swalSuccess("Success", `Add ${res.data.data.name} success.`)
					props.submit(true);
				} else {
					handleClose({ resetForm });
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				handleClose({ resetForm });
				swal.swalError("Error", err.message);

			});
	}

	const handleClose = ({ resetForm }) => {
		resetForm();
		dispatch(productRedux.actions.resetOpenModal());
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

					if (!values.ProductName) {
                        errors.ProductName = "Required";
                    }
					if (!values.Price) {
                        errors.Price = "Required";
                    }
					if (!values.StockCount) {
                        errors.StockCount = "Required";
                    }
					if (!values.ProductGroupId) {
                        errors.ProductGroupId = "Required";
                    }

					return errors;
				}}
				//Form Submission
				// ต้องผ่าน Validate ก่อน ถึงจะถูกเรียก
				onSubmit={(values, { setSubmitting, resetForm }) => {
					handleSave({ setSubmitting, resetForm }, values);
				}}
			>
				{({ submitForm, isSubmitting, values, errors, setFieldValue, resetForm }) => (
					<Form>
						<Dialog open={open} aria-labelledby="form-dialog-title">
							<DialogTitle id="form-dialog-title">Add Product</DialogTitle>
							<DialogContent>
								<DialogContentText>
									<Field
										fullWidth
										component={TextField}
										type="text"
										label="ProductName"
										name="ProductName"
										errors={errors}
									/>
									<Field
										margin="dense"
										component={TextField}
										name="Price"
										label="Price"
										type="text"
										errors={errors}
										fullWidth
									/>
									<Field
										margin="dense"
										component={TextField}
										name="StockCount"
										label="stock Count"
										type="text"
										errors={errors}
										fullWidth
									/>
									<InputLabel htmlFor="ProductGroup">ProductGroup</InputLabel>
									<Field
										fullWidth
										errors={errors}
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
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button variant="contained" onClick={() => {
									handleClose({ resetForm })
								}}
								color="secondary">
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
