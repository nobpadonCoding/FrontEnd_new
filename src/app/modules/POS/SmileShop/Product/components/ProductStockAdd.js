/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, } from "@material-ui/core";
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

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			productGroupId: 0,
			productId: 0
		},
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});

	const loadProductGroup = () => {
		debugger
		Axios.get(PRODUCTGROUP_API_URL)
			.then((res) => {
				console.log(res);
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
				console.log(res);
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
		debugger
		let obj = productGroup.find(obj => obj.id === formik.values.productGroupId)
		setProduct(obj.products)
	};



	React.useEffect(() => {
		loadProductGroup();
	}, []);

	React.useEffect(() => {
		debugger
		if(formik.values.productGroupId !== 0){
				loadProductFromProductGroup();
		}

	}, [formik.values.productGroupId]);



	React.useEffect(() => {
		debugger
		// console.log('useEffect openModal add: ', productReducer.openModal);
		if (productReducer.openModalStock.stockModalOpen === true && productReducer.openModalStock.stockId === 0) {
			handleOpen();
		}
	}, [productReducer.openModalStock]);

	const handleOpen = () => {
		debugger
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
										formik.setFieldValue("id", 0).then(() => {
											// formik.setFieldValue("productGroupId", 0);
										});
									}}
								/>
							</Grid>
							{/* <Grid item xs={12} lg={6}>
								<FormikDropdown
									formik={formik}
									name="productId"
									label="Product"
									data={product}
									firstItemText="Select Product"
									valueFieldName="id"
									displayFieldName="name"
									selectedCallback={() => {
										formik.setFieldValue("id", 0).then(() => {
											// formik.setFieldValue("productGroupId", 0);
										});
									}}
								/>
							</Grid> */}
							<Grid item xs={12} lg={6}>
								<TextField
									name="test"
									label="Test"
									required
									fullWidth
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.test}
									error={(formik.errors.test && formik.touched.test)}
									helperText={(formik.errors.test && formik.touched.test) && formik.errors.test}
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
						// onClick={submitForm}
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
