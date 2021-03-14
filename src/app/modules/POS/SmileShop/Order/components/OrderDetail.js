/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { List, ListItemText, Typography, Grid, ListItem, Card, CardContent, IconButton, ListItemSecondaryAction, Divider, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import * as orderRedux from "../../Order/_redux/orderRedux";
import DeleteIcon from '@material-ui/icons/Delete';
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";

function OrderDetail() {
	const orderReducer = useSelector(({ order }) => order);
	const [disabled, setDisabled] = React.useState(true);
	const dispatch = useDispatch();

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			test: orderReducer.orderSubtotal.subtotal,
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {

			handleCheckOut({ setSubmitting, resetForm });
		},
	});

	const handleCheckOut = ({ setSubmitting }) => {
		debugger
		setSubmitting(false);
		let objPayload = {
			...orderReducer.dialogOrderSummary,
			openDialog: true
		};
		dispatch(orderRedux.actions.setOpenDialogSummary(objPayload));
	};

	React.useEffect(() => {

		if (orderReducer.orderSubtotal.subtotal > 0 ? setDisabled(false) : setDisabled(true));

	}, [orderReducer.orderSubtotal.subtotal])

	return (

		<Card style={{ marginLeft: 5 }}>
			<CardContent>
				<Typography variant="h6" component="p">
					Order Detail
          		</Typography>
				<Grid container>
					<Grid item xs={12} lg={12}>
						<TableContainer component={Paper}>
							<Table aria-label="spanning table">
								<TableHead>
									<TableRow>
										<TableCell>ProductName</TableCell>
										<TableCell align="right">Quantity</TableCell>
										<TableCell align="right">Price</TableCell>
										<TableCell align="right"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orderReducer.orderDetail.map((item) => (
										<TableRow>
											<TableCell>{item.productName}</TableCell>
											<TableCell align="right">{item.productQuantity}</TableCell>
											<TableCell align="right">{commonValidators.currencyFormat(item.productPrice * item.productQuantity)}</TableCell>
											<TableCell align="right">
												<IconButton edge="end" aria-label="delete"
													onClick={() => {
														debugger
														let orderList = [...orderReducer.orderDetail]

														let obj = orderList.find((obj => obj.productId === item.productId));

														let orderSubtotal = {
															...orderReducer.orderSubtotal
														}

														// ลด Subtotal เท่ากับ productPrice
														orderSubtotal.subtotal -= obj.productPrice
														dispatch(orderRedux.actions.sumOrderSubtotal(orderSubtotal));

														if (obj) {

															//edit qty -1
															obj.productQuantity -= 1;

															//เช็ค qty = 0 ไหม
															if (obj.productQuantity !== 0) {

																//qty != 0 edit qty -1 save redux
																dispatch(orderRedux.actions.updateOrderDetail(orderList));

															} else {

																//qty = 0 remove array product
																orderList.splice(obj, 1);
																dispatch(orderRedux.actions.deleteorderDetail(obj));
															}
														} else {
															alert("product not found")
														}
													}}
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
					<Grid item xs={12} lg={12}>
						<Typography style={{ textAlign: 'right' }}>
							{commonValidators.currencyFormat(formik.initialValues.test)}
						</Typography>
					</Grid>
					<Grid container justify="flex-end" item xs={12} lg={12} style={{ marginTop: 5 }}>
						<Button variant="contained"
							type="submit"
							onClick={formik.handleSubmit}
							disabled={disabled}
							color="primary"
							startIcon={<ShoppingCart color="action" />}>
							Check Out
                    	</Button>
					</Grid>

				</Grid>
			</CardContent>
		</Card>
	)
}

export default OrderDetail
