import React from 'react'
import { Grid } from "@material-ui/core";
import OrderProductGroup from '../../Order/components/OrderProductGroup'
import OrderProduct from '../../Order/components/OrderProduct'
import OrderDialog from '../../Order/components/OrderDialog'
import OrderDetail from '../../Order/components/OrderDetail'
function OrderList() {
	return (
		<div>
			<Grid container>
				<Grid item xs={12} lg={9}>
					<OrderProductGroup></OrderProductGroup>
					<OrderProduct></OrderProduct>
				</Grid>
				<Grid item xs={12} lg={3}>
					<OrderDetail></OrderDetail>
				</Grid>
				<OrderDialog></OrderDialog>
			</Grid>

		</div>
	)
}

export default OrderList
