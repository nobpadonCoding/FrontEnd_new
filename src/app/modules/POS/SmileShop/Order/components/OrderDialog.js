/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-imports */
import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Grid, CardContent, Card, Typography, TextField } from "@material-ui/core";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { blue, red } from '@material-ui/core/colors';
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import * as orderRedux from "../../Order/_redux/orderRedux";
import * as swal from "../../../../Common/components/SweetAlert";

function OrderDialog() {
	const orderReducer = useSelector(({ order }) => order);
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			if (values.quantity > formik.values.stockCount) {

				errors.quantity = "Quantity Over"
			}

			if (!commonValidators.validationOnlyNumeric(formik.values.quantity)) {

				errors.quantity = "number only (0-9)"
			}

			return errors;
		},
		initialValues: {
			productId: orderReducer.productObj.productId,
			productName: orderReducer.productObj.productName,
			productPrice: orderReducer.productObj.productPrice,
			stockCount: orderReducer.productObj.stockCount,
			quantity: 0

		},
		onSubmit: (values, { setSubmitting }) => {
			setSubmitting(false);
			handleSave({ setSubmitting }, values);
		},
	});

	React.useEffect(() => {

		if (orderReducer.dialogOrder.openDialog === true) {
			handleOpen();
		}
	}, [orderReducer.dialogOrder]);


	const calculate = (values) => {

		let objOrderDetail =
		{
			productId: values.productId,
			productQuantity: parseInt(formik.values.quantity),
			productName: values.productName,
			productPrice: parseInt(values.productPrice)
		}

		let orderDetailUpdate = [...orderReducer.orderDetail];

		let hasOrder = orderReducer.orderDetail.find(obj => obj.productId === objOrderDetail.productId);

		//check product ว่ามีไหม ใน array ไหม
		if (!hasOrder) {

			//ไม่มี product ใน array add เข้าไป
			let newOrders = [...orderReducer.orderDetail, objOrderDetail];
			dispatch(orderRedux.actions.addOrderDetail(newOrders));

		} else {

			// มี product ใน array + qty
			hasOrder.productQuantity += objOrderDetail.productQuantity;
			dispatch(orderRedux.actions.updateOrderDetail(orderDetailUpdate));
			console.log(hasOrder);
		}
		console.log(orderReducer.orderSubtotal.subtotal, "55");
		console.log("objOrderDetail", orderDetailUpdate);

		//close dialog
		handleClose();

	}

	const handleSave = ({ setSubmitting }, values) => {

		setSubmitting(false);
		calculate(values);

	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);

		//reset redux openDialog(false)
		dispatch(orderRedux.actions.resetDialog());
		formik.setFieldValue("quantity", parseInt(formik.initialValues.quantity));
	}

	React.useEffect(() => {
		if (formik.values.quantity > formik.values.stockCount) {

			formik.setFieldValue("quantity", parseInt(formik.values.quantity) - 1)
		}

		if (formik.values.quantity < 0) {

			formik.setFieldValue("quantity", 0)
		}

	}, [formik.values.quantity]);

	const handleDown = () => {
		formik.setFieldValue("quantity", parseInt(formik.values.quantity) - 1)
	}

	const handleUp = () => {
		formik.setFieldValue("quantity", parseInt(formik.values.quantity) + 1)
	}

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">New Order</DialogTitle>
					<DialogContent>
						<Grid container>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
									<CardContent style={{ textAlign: 'center' }}>
										<img src="http://blog.sogoodweb.com/upload/510/ZDqhSBYemO.jpg" alt="01" style={{ width: 130, height: 'auto' }} />

									</CardContent>
									<Typography style={{ textAlign: 'center' }}>{formik.values.productName} {commonValidators.currencyFormat(formik.values.productPrice)}฿  Quantity: {formik.values.stockCount}</Typography>
								</Card>
							</Grid>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
									<CardContent style={{ textAlign: 'center' }}>
										<Grid container>
											<Grid item xs={12} lg={2}>
												<ArrowDropDownIcon style={{ fontSize: 50, marginTop: 10, color: blue[500], cursor: 'pointer' }} onClick={() => { handleDown() }} />
											</Grid>
											<Grid item xs={12} lg={8} >
												<TextField
													inputProps={{ style: { textAlign: 'center', fontSize: 25, color: blue[500] } }}
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
											<Grid item xs={12} lg={2}>
												<ArrowDropUpIcon style={{ fontSize: 50, marginTop: 10, color: blue[500], cursor: 'pointer' }} onClick={() => { handleUp() }} />
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button style={{ backgroundColor: red[400] }} variant="contained" onClick={() => {
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
							startIcon={<AddShoppingCartIcon style={{ color: blue[50] }} />}
						>
							Add To Cart
						</Button>
					</DialogActions>
				</Dialog>
			</form>
		</div>
	)
}

export default OrderDialog
