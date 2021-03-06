import React from 'react'
import { List, ListItemText, Typography, Grid, ListItem, Card, IconButton, ListItemSecondaryAction, TextField } from "@material-ui/core";
import * as orderRedux from "../../Order/_redux/orderRedux";
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";

function OrderDetail() {
	const orderReducer = useSelector(({ order }) => order);
	const dispatch = useDispatch();

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
		  test: orderReducer.orderSubtotal.subtotal,
		},
	  });

	return (

		<Card style={{ marginLeft: 5 }}>
			<Typography variant="h6" component="p" style={{ marginLeft: 5 }}>
				Order Detail
          </Typography>
			<Grid container>
				<Grid item xs={12} lg={10}>
					<List elevation={5} >
						{orderReducer.orderDetail.map((item) => (
							<ListItem key={item.productId} alignItems="flex-start" >
								<ListItemText primary={`${item.productName} จำนวน :  ${item.productQuantity} ราคา ${item.productPrice * item.productQuantity}`} />
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete"
										onClick={() => {
											debugger
											let orderList = [...orderReducer.orderDetail]
											let obj = orderList.find((obj => obj.productId === item.productId));

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
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</Grid>
				<TextField
					name="test"
					label="Test"
					required
					fullWidth
					value={formik.initialValues.test}
				/>
			</Grid>
		</Card>
	)
}

export default OrderDetail
