/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { TextField, Grid, Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

function OrderSearch(props) {
	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			StoreType: ""
		}
	});

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			orderNumber: 0,
		},
		onSubmit: (values, { setSubmitting }) => {
			// console.log("add stock", values);
			props.submit(values);
			setSubmitting(false);
		},
	});

	React.useEffect(() => {

	}, [formik.values.storeTypeId]);

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={6}>
					<TextField
						name="orderNumber"
						label="OrderNumber"
						required
						fullWidth
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.quantity}
						error={(formik.errors.quantity && formik.touched.quantity)}
						helperText={(formik.errors.quantity && formik.touched.quantity) && formik.errors.quantity}
					/>

				</Grid>
				<Grid item xs={12} lg={6}>
					<Button
						fullWidth
						style={{ marginTop: 6, marginRight: 100 }}
						variant="contained"
						color="primary"
						// disabled={isSubmitting}
						onClick={formik.handleSubmit}
						startIcon={<SearchIcon color="action" />}
					>
						Search
                </Button>
				</Grid>

			</Grid>
		</form>
	)
}

export default OrderSearch
