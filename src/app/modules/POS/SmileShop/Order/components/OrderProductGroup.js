import React from 'react';
import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import * as orderRedux from "../../Order/_redux/orderRedux";

function OrderProductGroup() {
	const dispatch = useDispatch();
	const orderReducer = useSelector(({ order }) => order);

	const handleGet = (id) => {
		let objPayload =
		{
			...orderReducer.productGet,
			productGroupId: id,
			clickProductGroup: true
		}
		console.log(objPayload)
		dispatch(orderRedux.actions.getProduct(objPayload));
	};
	return (
		<Card elevation={3}>
			<CardContent>
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					spacing={3}>
					<Grid item xs={12} lg={3} >
						<Button variant="outlined" color="primary" onClick={()=>{
							handleGet(4);
						}} >
							Food
      				</Button>
					</Grid>
					<Grid item xs={12} lg={3}>
						<Button variant="outlined" color="primary" onClick={()=>{
							handleGet(7);
						}}>
							Drinks
      				</Button>
					</Grid>
					<Grid item xs={12} lg={3}>
						<Button variant="outlined" color="primary" onClick={()=>{
							handleGet(6);
						}}>
							Snacks
      				</Button>
					</Grid>
					<Grid item xs={12} lg={3}>
						<Button variant="outlined" color="primary" onClick={()=>{
							handleGet(8);
						}}>
							Others
      				</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>


	)
}

export default OrderProductGroup
