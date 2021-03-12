/* eslint-disable no-restricted-imports */
import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { red } from '@material-ui/core/colors';
import * as commonValidators from '../../../../Common/functions/CommonValidators';
import { useSelector, useDispatch } from "react-redux";
import * as orderRedux from "../../Order/_redux/orderRedux";

function OrderDetailDialog() {
	const orderReducer = useSelector(({ order }) => order);
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (orderReducer.orderHeader.openDialogOrderDetail === true) {
			handleOpen();
		}
	}, [orderReducer.orderHeader.openDialogOrderDetail])

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		dispatch(orderRedux.actions.resetOrderHeader());
	}

	const total = orderReducer.orderHeader.total;
	const discount = orderReducer.orderHeader.discount;
	const totalAmount = orderReducer.orderHeader.totalAmount;

	return (
		<div>
			<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Bill Details</DialogTitle>
				<DialogContent>
					<Grid container>
						<Grid item xs={12} lg={12}>
							<TableContainer component={Paper}>
								<Table aria-label="spanning table">
									<TableHead>
										<TableRow>
											<TableCell>ProductName</TableCell>
											<TableCell align="right">Quantity</TableCell>
											<TableCell align="right">Price</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orderReducer.orderHeader.orderDetail.map((item) => (
											<TableRow key={item.productId}>
												<TableCell>{item.product.name}</TableCell>
												<TableCell align="right">{item.quantity}</TableCell>
												<TableCell align="right">{commonValidators.currencyFormat(item.product.price * item.quantity)}</TableCell>
											</TableRow>
										))}

										<TableRow>
											<TableCell rowSpan={4} />
											<TableCell colSpan={1}>total</TableCell>
											<TableCell align="right">{commonValidators.currencyFormat(total)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={1}>Discount</TableCell>
											<TableCell align="right">{commonValidators.currencyFormat(discount)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={1}>Total Amount</TableCell>
											<TableCell align="right">{commonValidators.currencyFormat(totalAmount)}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={() => {
						handleClose()
					}}
						style={{ backgroundColor: red[400] }}>
						Cancel
                                </Button>
				</DialogActions>
			</Dialog>
		</div >
	)
}

export default OrderDetailDialog
