/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { TextField, Grid, Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import FormikDatePicker from "../../Order/components/FormikDatePicker";

// require("dayjs/locale/th");
// var dayjs = require("dayjs");
// dayjs.locale("th");

function OrderSearch(props) {

	const [today, setToday] = React.useState(new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	)
	);

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			orderNumber: "",
			startDate: today,
			endDate: today
		},
		onSubmit: (values, { setSubmitting }) => {
			// alert(JSON.stringify(values, null, 2));
			props.submit(values);
			setSubmitting(false);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={3}>
					<TextField
						name="orderNumber"
						label="OrderNumber"
						required
						fullWidth
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
						value={formik.values.orderNumber}
						error={(formik.errors.orderNumber && formik.touched.orderNumber)}
						helperText={(formik.errors.orderNumber && formik.touched.orderNumber) && formik.errors.orderNumber}
					/>

				</Grid>
				<Grid item xs={12} lg={3}>
					<FormikDatePicker
						formik={formik}
						name="startDate"
						label="Start"
						views={["year", "month", "date"]}
						format="DD/MM/YYYY"
					/>
				</Grid>
				<Grid item xs={12} lg={3}>
					<FormikDatePicker
						formik={formik}
						name="endDate"
						label="End"
						views={["year", "month", "date"]}
						format="DD/MM/YYYY"
					/>
				</Grid>
				<Grid item xs={12} lg={3}>
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
