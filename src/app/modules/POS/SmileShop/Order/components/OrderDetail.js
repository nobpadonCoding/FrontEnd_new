import React from 'react'
import { List, ListItemText, Typography, Grid, ListItem, Card, IconButton, ListItemSecondaryAction } from "@material-ui/core";
import * as orderRedux from "../../Order/_redux/orderRedux";
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector, useDispatch } from "react-redux";

function OrderDetail() {
	const orderReducer = useSelector(({ order }) => order);
	const dispatch = useDispatch();

	return (

		<Card style={{ marginLeft: 5 }}>
			<Typography variant="h6" component="p" style={{ marginLeft: 5 }}>
				Order Detail
          </Typography>
			<Grid container>
				<Grid item xs={12} lg={10}>
					<List elevation={5} >
						{orderReducer.orderDetail.map((item, i) => (
							<ListItem key={item.productId} alignItems="flex-start" >
								<ListItemText primary={`${item.productName} จำนวน :  ${item.productQuantity}`} />
								<ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete"
										onClick={() => {

											let orderList = [...orderReducer.orderDetail]
											let obj = orderList.find(obj => obj.productId === item.productId);

											//down qty
											obj.productQuantity -= 1;

											//check qty = 0
											if (obj.productQuantity === 0) {

												//ค้นหา product qty = 0
												let quantityZero = orderList.find(o => o.productId === item.productId);
												if (quantityZero !== null) {

													//remove array
													orderList.splice(quantityZero, 1);

													// save product redux
													dispatch(orderRedux.actions.deleteorderDetail(quantityZero));
												}
											} else {

												dispatch(orderRedux.actions.updateProductDetail(obj));
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
			</Grid>
		</Card>
	)
}

export default OrderDetail
