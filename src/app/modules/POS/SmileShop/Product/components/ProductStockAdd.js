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

			return errors;
		},
		initialValues: {
			productGroupId: 0,
			productId: 0,
			storeTypeId: 0,
			quantity: "",
			productStockCount: "",
			stockAfter: ""
		},
		onSubmit: (values) => {
			// console.log(values);
		},
	});

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
		if (formik.values.productGroupId !== 0) {
			loadProductFromProductGroup();
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
									selectedCallback={() => {
										formik.setFieldValue("id", 0).then(() => {
											formik.setFieldValue("productId", 0);
											// formik.setFieldValue("productStockCount", "");
										});
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
									selectedCallback={() => {
										// console.log(product);
										formik.setFieldValue("productStockCount", stock);
										formik.setFieldValue("id", 0).then(() => {
											formik.setFieldValue("storeTypeId", 0);
										});
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
									selectedCallback={() => {
										formik.setFieldValue("id", 0).then(() => {
											// formik.setFieldValue("productGroupId", 0);
										});
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
									value={formik.values.stockAfter}
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
