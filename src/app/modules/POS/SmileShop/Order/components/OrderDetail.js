import React from 'react'
import { List, Typography, Grid, ListItem, Card, ListItemText } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

function OrderDetail() {
	const orderReducer = useSelector(({ order }) => order);
	return (
		<Grid container>
			<Grid item xs={12} lg={12}>
				<Card style={{ marginLeft: 5 }}>
					<List elevation={5} >
						{orderReducer.orderDetail.map((item) => (
							<ListItem key={`pd_${item.productId}`} alignItems="flex-start">
								<Typography component="p">
									{item.productQuantity} {item.productName} {item.productPrice}
								</Typography>
							</ListItem>
						))}
					</List>
				</Card>
			</Grid>
		</Grid>
	)
}

export default OrderDetail
