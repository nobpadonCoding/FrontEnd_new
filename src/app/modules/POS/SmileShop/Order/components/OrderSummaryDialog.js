/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as orderRedux from "../../Order/_redux/orderRedux";
import * as orderAxios from "../../Order/_redux/orderAxios";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Grid, List, Divider, ListItem, ListItemText, Typography, TextField } from "@material-ui/core";
import * as swal from "../../../../Common/components/SweetAlert";
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import { blue } from '@material-ui/core/colors';

function OrderSummaryDialog() {

	const orderReducer = useSelector(({ order }) => order);
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();

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
			totalAmount: orderReducer.orderSubtotal.subtotal

		},
		onSubmit: (values, { setSubmitting }) => {
			setSubmitting(false);
			handleSave({ setSubmitting }, values);
		},
	});

	const handleSave = ({ setSubmitting }, values) => {
		debugger
		setSubmitting(false);

		//แตก array orderDetail ออกมา
		let orderDetail = [...orderReducer.orderDetail];

		//ประกาศ obj orderHeader
		let orderHeader = {

			// ...orderReducer.orderHeader,
			total: orderReducer.orderSubtotal.subtotal,
			discount: values.productDiscount,
			totalAmount: values.totalAmount,
			//ยัด array orderDetail เข้าไป orderHeader
			orderDetail: orderDetail,
		};

		orderAxios.addOrder(orderHeader)
			.then((res) => {
				if (res.data.isSuccess) {
					handleClose();
					swal.swalSuccess("Success", `OrderId ${res.data.data.orderNoId}`)

					dispatch(orderRedux.actions.resetOrderDetail());
					dispatch(orderRedux.actions.resetOrderSubtotal());

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

		dispatch(orderRedux.actions.resetOrderDialogSummary());
	};

	React.useEffect(() => {

		if (orderReducer.dialogOrderSummary.openDialog === true) {
			handleOpen();
		}
	}, [orderReducer.dialogOrderSummary]);

	React.useEffect(() => {

		//ลด totalAmount = discount
		formik.setFieldValue("totalAmount", formik.values.total - formik.values.productDiscount);

	}, [formik.values.productDiscount])

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Order Summary</DialogTitle>
					<DialogContent>
						<Grid container>
							<Grid item xs={12} lg={6} style={{ marginRight: 6 }}>
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

							<Grid item xs={12} lg={5} >
								<Grid item xs={12} lg={12}>
									<TextField
										inputProps={{ style: { textAlign: 'center', fontSize: 25 } }}
										name="total"
										label="Total"
										required
										fullWidth
										disabled={true}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										value={formik.values.total}
										error={(formik.errors.total && formik.touched.total)}
										helperText={(formik.errors.total && formik.touched.total) && formik.errors.total}
									/>
								</Grid>
								<Grid item xs={12} lg={12}>
									<TextField
										inputProps={{ style: { textAlign: 'center', fontSize: 25, color: blue[500] } }}
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
								</Grid>
								<Grid item xs={12} lg={12}>
									<TextField
										inputProps={{ style: { textAlign: 'center', fontSize: 25 } }}
										name="totalAmount"
										label="Total Amount"
										required
										fullWidth
										disabled={true}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										value={formik.values.totalAmount}
										error={(formik.errors.test && formik.touched.totalAmount)}
										helperText={(formik.errors.totalAmount && formik.touched.totalAmount) && formik.errors.totalAmount}
									/>
								</Grid>
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
