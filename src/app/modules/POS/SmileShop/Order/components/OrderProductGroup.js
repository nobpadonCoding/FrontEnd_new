/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import * as orderRedux from "../../Order/_redux/orderRedux";
import * as CONST from '../../../../../../Constants';
import * as swal from "../../../../Common/components/SweetAlert";
import Axios from "axios";

function OrderProductGroup() {
	const dispatch = useDispatch();
	const orderReducer = useSelector(({ order }) => order);
	const [productGroup, setProductGroup] = React.useState([])
	const PRODUCTGROUP_API_URL = `${CONST.API_URL}/SmileShop/ProductGroups`

	React.useEffect(() => {
		Axios.get(PRODUCTGROUP_API_URL)
			.then((res) => {
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

	const handleGet = (id) => {
		let objPayload =
		{
			...orderReducer.productGet,
			productGroupId: id,
			clickProductGroup: true
		}
		dispatch(orderRedux.actions.getProduct(objPayload));
	};
	return (
		<Card elevation={3}>
			<CardContent>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={3}>
					{productGroup.map((productGroup) => (
						<Grid item xs={12} lg={3} key={`product_${productGroup.id}`}>
							<Button variant="outlined" color="primary" onClick={() => {
								handleGet(productGroup.id);
							}} >
								{productGroup.name}
							</Button>
						</Grid>
					))}
				</Grid>
			</CardContent>
		</Card>


	)
}

export default OrderProductGroup
