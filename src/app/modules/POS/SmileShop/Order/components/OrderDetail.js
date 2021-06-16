/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Grid, Card, CardContent, IconButton, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
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

	const handleDown = (item) => {

		debugger
		let orderList = [...orderReducer.orderDetail]

		let obj = orderList.find((obj => obj.productId === item.productId));

		let orderSubtotal = {
			...orderReducer.orderSubtotal
		}

		// ลด Subtotal เท่ากับ productPrice
		orderSubtotal.subtotal -= parseInt(obj.productPrice);
		dispatch(orderRedux.actions.sumOrderSubtotal(orderSubtotal));

		if (obj) {

			//edit qty -1
			parseInt(obj.productQuantity -= 1);

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
	}

	const handleUp = (item) => {

		debugger
		let orderList = [...orderReducer.orderDetail]

		let obj = orderList.find((obj => obj.productId === item.productId));

		let orderSubtotal = {
			...orderReducer.orderSubtotal
		}

		// ลด Subtotal เท่ากับ productPrice
		orderSubtotal.subtotal += parseInt(obj.productPrice);
		dispatch(orderRedux.actions.sumOrderSubtotal(orderSubtotal));

		if (obj) {

			//edit qty +1
			// obj.productQuantity += 1;
			parseInt(obj.productQuantity += 1);

			//qty != 0 edit qty +1 save redux
			dispatch(orderRedux.actions.updateOrderDetail(orderList));
		}
	}

	return (

		<Card style={{ marginLeft: 5 }}>
			<CardContent>
				<Grid container>
					<Grid item xs={12} lg={12}>
						<TableContainer component={Paper}>
							<Table aria-label="spanning table">
								<TableHead>
									<TableRow>
										<TableCell>ProductName</TableCell>
										<TableCell align="center">Quantity</TableCell>
										<TableCell align="right">Price</TableCell>
										<TableCell align="right"></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orderReducer.orderDetail.map((item) => (
										<TableRow key={item.productId}>
											<TableCell>{item.productName}</TableCell>
											<TableCell align="center">
												<ArrowDropDownIcon style={{ cursor: 'pointer', fontSize: 'large' }} onClick={() => { handleDown(item); }} />
												{item.productQuantity}
												<ArrowDropUpIcon style={{ cursor: 'pointer', fontSize: 'large' }} onClick={() => { handleUp(item); }} />
											</TableCell>
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

														// ลด Subtotal เท่ากับ productPrice * Quantity ที่ มีอยู่ใน array
														orderSubtotal.subtotal -= obj.productPrice * obj.productQuantity;
														dispatch(orderRedux.actions.sumOrderSubtotal(orderSubtotal));

														if (obj) {

															//remove array product
															orderList.splice(obj, 1);
															dispatch(orderRedux.actions.deleteorderDetail(obj));

														} else {
															alert("product not found")
														}
													}}
												>
													<DeleteIcon titleAccess="remove" />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell rowSpan={1} />
										<TableCell align="center" colSpan={1}>total</TableCell>
										<TableCell align="right">{commonValidators.currencyFormat(formik.initialValues.test)}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
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
