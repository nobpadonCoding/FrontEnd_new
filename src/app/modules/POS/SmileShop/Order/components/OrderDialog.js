/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-imports */
import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, Button, Grid, CardContent, Card, Typography, TextField, Icon } from "@material-ui/core";
import { blue } from '@material-ui/core/colors';
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as swal from "../../../../Common/components/SweetAlert";
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import * as orderRedux from "../../Order/_redux/orderRedux";
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

			// if (values.quantity < 0) {

			// 	errors.quantity = "Quantity Less than 0"
			// }

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
			quantity: 1

		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
		},
	});

	React.useEffect(() => {
		debugger
		if (orderReducer.dialogOrder.openDialog === true) {
			handleOpen();
		}
	}, [orderReducer.dialogOrder]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);

		//reset redux openDialog(false)
		dispatch(orderRedux.actions.resetDialog());
		formik.setFieldValue("quantity", formik.initialValues.quantity)
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
		<form onSubmit={formik.handleSubmit}>
			<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">New Order</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Grid container>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
									<CardContent style={{ textAlign: 'center' }}>
										<img src="https://i.pinimg.com/236x/4d/d7/ea/4dd7ea06ee085b5e0d8f855e415b2bb6.jpg" alt="01" style={{ width: 150, height: 'auto' }} />
									</CardContent>
									<Typography style={{ textAlign: 'center' }}>{formik.values.productName} {commonValidators.currencyFormat(formik.values.productPrice)}฿  Quantity: {formik.values.stockCount}</Typography>
								</Card>
							</Grid>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
									<CardContent>
										<Grid container>
											<Grid item xs={12} lg={2}>
												<Icon className="fa fa-sort-up" style={{ fontSize: 30, marginTop: 25, color: blue[500], cursor: 'pointer' }} onClick={() => { handleUp() }} />
											</Grid>
											<Grid item xs={12} lg={8}>
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
											<Grid item xs={12} lg={2}>
												<Icon className="fa fa-sort-down" style={{ fontSize: 30, marginTop: 15, color: blue[500], cursor: 'pointer' }} onClick={() => { handleDown() }} />
											</Grid>
										</Grid>
									</CardContent>
								</Card>
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
	)
}

export default OrderDialog
