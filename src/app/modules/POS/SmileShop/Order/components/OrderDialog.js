import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, Button, Grid, CardContent, Card } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field, useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
function OrderDialog() {
	const orderReducer = useSelector(({ order }) => order);
	const [open, setOpen] = React.useState(false);

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			productId: orderReducer.productObj.productId,
			productName: orderReducer.productObj.productName,
			productPrice: orderReducer.productObj.productPrice,
			stockCount: orderReducer.productObj.stockCount
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
		},
	});

	React.useEffect(() => {
		debugger
		if (orderReducer.dialogOrder.openDialog === true) {
			handleOpen();
		}
	}, [orderReducer.dialogOrder]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	}
	return (
		<form onSubmit={formik.handleSubmit}>
			<Dialog fullWidth={true} maxWidth='sm' open={open} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">New Order</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Grid container>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
								<CardContent>
									55555
								</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} lg={6}>
								<Card elevation={5} style={{ margin: 5 }}>
								<CardContent>
									55555
								</CardContent>
								</Card>
							</Grid>
						</Grid>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={() => {
						handleClose()
					}}
						color="secondary">
						Cancel
                                </Button>
					<Button variant="contained"
						type="submit"
						onClick={formik.handleSubmit}
						// disabled={isSubmitting}
						color="primary"
						startIcon={<SaveIcon color="action" />}>
						Save
                    </Button>
				</DialogActions>
			</Dialog>
		</form>
	)
}

export default OrderDialog
