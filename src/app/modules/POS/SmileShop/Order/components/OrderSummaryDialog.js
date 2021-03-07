/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useField, useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as orderAxios from "../../Order/_redux/orderAxios";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Grid, List, Divider, ListItem, ListItemText, Typography, TextField } from "@material-ui/core";
import * as swal from "../../../../Common/components/SweetAlert";
import * as commonValidators from '../../../../Common/functions/CommonValidators';

function OrderSummaryDialog() {

	const orderReducer = useSelector(({ order }) => order);
	const [open, setOpen] = React.useState(false);

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			subtotal: orderReducer.orderSubtotal.subtotal,
			total: orderReducer.orderSubtotal.subtotal,
			productDiscount: 0,
			totalAmount: 0

		},
		onSubmit: (values, { setSubmitting }) => {
			setSubmitting(false);
			handleSave({ setSubmitting }, values);
		},
	});

	const handleSave = ({ setSubmitting }, values) => {
		debugger
		setSubmitting(false);

		let orderDetailUpdate = [...orderReducer.orderDetail];

		//add key/value to an obj in array
		var result = orderDetailUpdate.map((el) => {
			var o = Object.assign({}, el);
			o.total = orderReducer.orderSubtotal.subtotal;
			o.productDiscount = values.productDiscount;
			o.totalAmount = values.totalAmount;
			return o;
		})

		console.log("xxxxx", result)
		orderAxios.addOrder(result)
			.then((res) => {
				if (res.data.isSuccess) {
					handleClose();
					swal.swalSuccess("Success", `add Order success.`)

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
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	React.useEffect(() => {

		if (orderReducer.dialogOrderSummary.openDialog === true) {
			handleOpen();
		}
	}, [orderReducer.dialogOrderSummary]);

	React.useEffect(() => {

		formik.setFieldValue("totalAmount", formik.values.total - formik.values.productDiscount);

	}, [formik.values.productDiscount])

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Order Summary</DialogTitle>
					<DialogContent>
						<Grid container>
							<Grid item xs={12} lg={6}>
								<List elevation={5} >
									<Divider />
									{orderReducer.orderDetail.map((item) => (
										<ListItem key={item.productId} alignItems="flex-start" >
											<ListItemText primary={`${item.productName} จำนวน :  ${item.productQuantity} ราคา ${item.productPrice * item.productQuantity}`} />
											<Divider />
										</ListItem>
									))}
									<Divider />
								</List>
								<Typography style={{ textAlign: 'right' }}>
									{commonValidators.currencyFormat(formik.initialValues.subtotal)}
								</Typography>
							</Grid>
							<Grid item xs={12} lg={6}>
								<List elevation={5} >
									<ListItem alignItems="flex-start" >
										<TextField
											name="total"
											label="Total"
											required
											fullWidth
											disabled={false}
											onBlur={formik.handleBlur}
											onChange={formik.handleChange}
											value={formik.values.total}
											error={(formik.errors.total && formik.touched.total)}
											helperText={(formik.errors.total && formik.touched.total) && formik.errors.total}
										/>
										<TextField
											name="productDiscount"
											label="Discount"
											required
											fullWidth
											disabled={false}
											onBlur={formik.handleBlur}
											onChange={formik.handleChange}
											value={formik.values.productDiscount}
											error={(formik.errors.productDiscount && formik.touched.productDiscount)}
											helperText={(formik.errors.productDiscount && formik.touched.productDiscount) && formik.errors.productDiscount}
										/>
										<TextField
											name="totalAmount"
											label="Total Amount"
											required
											fullWidth
											disabled={false}
											onBlur={formik.handleBlur}
											onChange={formik.handleChange}
											value={formik.values.totalAmount}
											error={(formik.errors.test && formik.touched.totalAmount)}
											helperText={(formik.errors.totalAmount && formik.touched.totalAmount) && formik.errors.totalAmount}
										/>
									</ListItem>
								</List>
							</Grid>
						</Grid>
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
						// startIcon={<AddShoppingCartIcon style={{ color: blue[50] }} />}
						>
							Summit Order
                    </Button>
					</DialogActions>
				</Dialog>
			</form>
		</div>
	)
}

export default OrderSummaryDialog
