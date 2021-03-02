import React from 'react'
import OrderProductGroup from '../../Order/components/OrderProductGroup'
import OrderProduct from '../../Order/components/OrderProduct'
import OrderDialog from '../../Order/components/OrderDialog'
function OrderList() {
	return (
		<div>
			<OrderProductGroup></OrderProductGroup>
			<OrderProduct></OrderProduct>
			<OrderDialog></OrderDialog>

		</div>
	)
}

export default OrderList
