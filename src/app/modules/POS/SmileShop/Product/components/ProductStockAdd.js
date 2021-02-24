/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, Hidden, } from "@material-ui/core";
import { TextField, Grid } from "@material-ui/core/";
import FormikDropdown from "../../../../_FormikUseFormik/components/FormikDropdown";
import SaveIcon from '@material-ui/icons/Save';
import { useFormik } from "formik";
import * as swal from "../../../../Common/components/SweetAlert";
import * as productAxios from "../../Product/_redux/productAxios";
import * as productRedux from "../../Product/_redux/productRedux";
import * as CONST from '../../../../../../Constants';
import Axios from "axios";
import * as commonValidators from '../../../../Common/functions/CommonValidators';

function ProductStockAdd(props) {
	const dispatch = useDispatch()
	const productReducer = useSelector(({ product }) => product);
	const PRODUCTGROUP_API_URL = `${CONST.API_URL}/SmileShop/ProductGroups`
	const PRODUCT_API_URL = `${CONST.API_URL}/SmileShop/Products`
	const [open, setOpen] = React.useState(false);
	const [productGroup, setProductGroup] = React.useState([])
	const [product, setProduct] = React.useState([])
	const [stock, setStock] = React.useState([])
	const [storeType, setStoreType] = React.useState([
		{
			id: 1,
			name: "Add"
		},
		{
			id: 2,
			name: "Remove"
		}
	])

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			if (formik.values.storeTypeId === 2) {
				if (values.quantity > stock) {
					errors.quantity = "Quantity Over ProductStockCount"
				}
			}



			if (!commonValidators.validationOnlyNumeric(values.quantity)) {
				errors.quantity = "number only"
			}

			return errors;
		},
		initialValues: {
			productGroupId: 0,
			productId: 0,
			storeTypeId: 0,
			quantity: 0,
			productStockCount: 0,
			stockAfter: ""
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			console.log("add stock", values);
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ resetForm, setSubmitting }) => {
		debugger
		setSubmitting(false);
		let objPayload =
		{
			...productReducer.addStockProduct,
			productId: formik.values.productId,
			storeTypeId: formik.values.storeTypeId,
			quantity: formik.values.quantity,
			productStockCount: formik.values.productStockCount,
			stockAfter: formik.values.stockAfter
		}
		console.log("updateStockProduct", objPayload);
		dispatch(productRedux.actions.updateStockProduct(objPayload));
		productAxios.addStockProduct(objPayload)
			.then((res) => {
				if (res.data.isSuccess) {

					handleClose({ resetForm });
					swal.swalSuccess("Success", `Edit ${res.data.data.id} success.`)
					props.submit(true);
					dispatch(productRedux.actions.resetOpenModalStock());
					dispatch(productRedux.actions.resetProductStock());
				} else {
					handleClose({ resetForm });
					dispatch(productRedux.actions.resetOpenModalStock());
					dispatch(productRedux.actions.resetProductStock());
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				handleClose({ resetForm });
				swal.swalError("Error", err.message);

			});
	}

	const loadProductGroup = () => {
		Axios.get(PRODUCTGROUP_API_URL)
			.then((res) => {
				// console.log(res);
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
	};

	const loadProduct = () => {
		Axios.get(PRODUCT_API_URL)
			.then((res) => {
				//bind data
				if (res.data.isSuccess) {
					setProduct(res.data.data)
				} else {
					//internal error
					swal.swalError("Error", res.data.message);
				}
			}).catch((err) => {
				//physical error
				swal.swalError("Error", err.message);
			})
	};

	const loadProductFromProductGroup = () => {

		let objProduct = productGroup.find(obj => obj.id === formik.values.productGroupId);
		setProduct(objProduct.products)
	};

	const loadStockFromProduct = () => {
		debugger
		let objStock = product.find(obj => obj.id === formik.values.productId);

		setStock(objStock.stockCount);
		console.log("objStock", objStock.stockCount);
		console.log("productId", formik.values.productId);
	};

	React.useEffect(() => {
		loadProductGroup();
	}, []);

	React.useEffect(() => {
		if (formik.values.storeTypeId === 1) {
			if (formik.values.quantity >= 0) {
				formik.setFieldValue("stockAfter", parseInt(formik.values.productStockCount) + parseInt(formik.values.quantity));
			}
		} else if (formik.values.storeTypeId === 2) {
			if (formik.values.quantity >= 0) {
				if (formik.values.productStockCount >= formik.values.quantity) {
					formik.setFieldValue("stockAfter", formik.values.productStockCount - formik.values.quantity);
				} else {
					formik.setFieldValue("stockAfter", "")
				}
			}
		}

	}, [formik.values.quantity]);

	React.useEffect(() => {
		formik.setFieldValue("productStockCount", stock);
	}, [stock]);

	React.useEffect(() => {
		if (formik.values.productGroupId !== 0) {
			loadProductFromProductGroup();
			formik.setFieldValue("productStockCount", 0);
		}

	}, [formik.values.productGroupId]);

	React.useEffect(() => {

		if (formik.values.productId === 0) {
			formik.setFieldValue("storeTypeId", 0);
		}

		if (formik.values.productId !== 0) {
			loadStockFromProduct();
		}

	}, [formik.values.productId]);

	React.useEffect(() => {
		// console.log('useEffect openModal add: ', productReducer.openModal);
		if (productReducer.openModalStock.stockModalOpen === true && productReducer.openModalStock.stockId === 0) {
			handleOpen();
		}
	}, [productReducer.openModalStock]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		// resetForm();
		dispatch(productRedux.actions.resetOpenModalStock());
		setOpen(false);
	};
	return (
		<form onSubmit={formik.handleSubmit}>
			<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Add Stock</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Grid container spacing={3}>
							<Grid item xs={12} lg={6}>
								<FormikDropdown
									formik={formik}
									name="productGroupId"
									label="ProductGroup"
									data={productGroup}
									firstItemText="Select ProductGroup"
									valueFieldName="id"
									displayFieldName="name"
									selectedCallback={(e) => {
										formik.setFieldValue("productId", 0);
									}}
								/>
							</Grid>
							<Grid item xs={12} lg={6}>
								<FormikDropdown
									formik={formik}
									name="productId"
									label="Product"
									data={product}
									firstItemText="Select Product"
									valueFieldName="id"
									displayFieldName="name"
									selectedCallback={(e) => {
										// console.log(product);
										formik.setFieldValue("storeTypeId", 0);
									}}
								/>
							</Grid>
							<Grid item xs={12} lg={6}>
								<FormikDropdown
									formik={formik}
									name="storeTypeId"
									label="Store Type"
									data={storeType}
									firstItemText="Select StoreType"
									valueFieldName="id"
									displayFieldName="name"
									selectedCallback={(e) => {
										//something
									}}
								/>
							</Grid>
							<Grid item xs={12} lg={6}>
								<TextField
									name="quantity"
									label="Quantity"
									required
									fullWidth
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.quantity}
									error={(formik.errors.quantity && formik.touched.quantity)}
									helperText={(formik.errors.quantity && formik.touched.quantity) && formik.errors.quantity}
								/>
							</Grid>
							<Grid item xs={12} lg={6}>
								<TextField
									name="productStockCount"
									label="Product Stock"
									required
									fullWidth
									disabled={true}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.productStockCount}
									error={(formik.errors.test && formik.touched.productStockCount)}
									helperText={(formik.errors.productStockCount && formik.touched.productStockCount) && formik.errors.productStockCount}
								/>
							</Grid>
							<Grid item xs={12} lg={6}>
								<TextField
									name="stockAfter"
									label="Stock After"
									required
									fullWidth
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={(isNaN(formik.values.stockAfter) ? formik.values.productStockCount : formik.values.stockAfter)}
									error={(formik.errors.stockAfter && formik.touched.stockAfter)}
									helperText={(formik.errors.stockAfter && formik.touched.stockAfter) && formik.errors.stockAfter}
								/>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={() => {
						handleClose()
					}}
						color="secondary">
						Cancel
                                </Button>
					<Button variant="contained"
						type="submit"
						onClick={formik.handleSubmit}
						// disabled={isSubmitting}
						color="primary"
						startIcon={<SaveIcon color="action" />}>
						Save
                    </Button>
				</DialogActions>
			</Dialog>
		</form>
	);
}

export default ProductStockAdd
