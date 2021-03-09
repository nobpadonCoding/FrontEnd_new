import React from 'react'
import { Grid } from "@material-ui/core";
import OrderProductGroup from '../../Order/components/OrderProductGroup'
import OrderProduct from '../../Order/components/OrderProduct'
import OrderDialog from '../../Order/components/OrderDialog'
import OrderDetail from '../../Order/components/OrderDetail'
import OrderSummaryDialog from '../../Order/components/OrderSummaryDialog'
function OrderList() {
	return (
		<div>
			<Grid container>
				<Grid item xs={12} lg={8}>
					<OrderProductGroup></OrderProductGroup>
					<OrderProduct></OrderProduct>
				</Grid>
				<Grid item xs={12} lg={4}>
					<OrderDetail></OrderDetail>
				</Grid>
				<OrderDialog></OrderDialog>
				<OrderSummaryDialog></OrderSummaryDialog>
			</Grid>
		</div>
	)
}

export default OrderList
