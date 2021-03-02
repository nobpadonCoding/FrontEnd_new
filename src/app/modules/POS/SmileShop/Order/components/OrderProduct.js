/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Paper, Grid, CardContent, Card, IconButton, Typography } from '@material-ui/core';
import * as swal from "../../../../Common/components/SweetAlert";
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import * as orderRedux from "../../Order/_redux/orderRedux";
import { useSelector, useDispatch } from "react-redux";
import * as CONST from '../../../../../../Constants';
import Axios from "axios";


function OrderProduct() {
	const orderReducer = useSelector(({ order }) => order);
	const dispatch = useDispatch();
	const [productGroup, setProductGroup] = React.useState([])
	const [product, setProduct] = React.useState([])

	const PRODUCTGROUP_API_URL = `${CONST.API_URL}/SmileShop/ProductGroups`

	React.useEffect(() => {
		debugger
		Axios.get(PRODUCTGROUP_API_URL)
			.then((res) => {
				console.log(res)
				//bind data
				if (res.data.isSuccess) {
					setProductGroup(res.data.data)
				} else {
					//internal error
					swal.swalError("Error", res.data.message);
				}
			}).catch((err) => {
				//physical error
				swal.swalError("Error", err.message);
			})
	}, [])

	const loadProductFromProductGroup = () => {
		if (orderReducer.productGet.productGroupId !== 0) {
			let objProduct = productGroup.find(obj => obj.id === orderReducer.productGet.productGroupId);
			setProduct(objProduct.products)
			console.log(objProduct)
		}

	};

	const handleAddProduct = () => {
		debugger
		let objPayload = {
			...orderReducer.dialogOrder,
			openDialog: true
		};
		console.log('handleAddProduct', objPayload)
		dispatch(orderRedux.actions.setOpenDialog(objPayload));
	}

	React.useEffect(() => {
		if (orderReducer.productGet.clickProductGroup === true) {
			loadProductFromProductGroup();
		}

	}, [orderReducer.productGet]);

	return (
		<div >
			<Grid
				container
			>
				{product.map((product) => (
					<Grid item xs={12} lg={3}>
						<Card elevation={5} style={{ margin: 5 }}>
							<CardContent style={{ cursor: 'pointer' }} onClick={() => {
								debugger
								let objProduct = {
									productId:product.id,
									productName: product.name,
									productPrice: product.price,
									stockCount: product.stockCount,
								}
								dispatch(orderRedux.actions.updateProduct(objProduct));
								handleAddProduct();
							}}>

							</CardContent>
							<Typography style={{ textAlign: 'center' }}>{product.name}  {commonValidators.currencyFormat(product.price)} ฿</Typography>
						</Card>
					</Grid>
				))}
			</Grid>
		</div >
	)
}

export default OrderProduct
