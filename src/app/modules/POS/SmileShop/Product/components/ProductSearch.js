/* eslint-disable no-restricted-imports */
import React from "react";
import { Formik, Form, Field } from "formik";
import { Grid, LinearProgress, Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import SearchIcon from '@material-ui/icons/Search';

function ProductSearch(props) {

	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			productName: "",
			productGroupName: ""
		}
	});

	return (
		// 	<Card elevation={3} style={{ marginBottom: 5 }} >
		// 		<CardContent>
		<Formik
			//Form fields and default values
			initialValues={{
				productName: "",
				productGroupName: ""
			}}
			//Validation section
			validate={(values) => {
				const errors = {};

				return errors;
			}}
			//Form Submission
			// ต้องผ่าน Validate ก่อน ถึงจะถูกเรียก
			onSubmit={(values, { setSubmitting }) => {
				setSubmitting(false);
				// console.log(values);
				props.submit(values);
			}}
		>
			{({ submitForm, isSubmitting, values, errors }) => (
				<Form>
					<Grid container spacing={3}>
						<Grid item xs={12} lg={6}>
							<Field
								fullWidth
								component={TextField}
								type="text"
								label="ProductName"
								name="productName"
							/>
						</Grid>
						{/* <Grid item xs={12} lg={3}>
							<Field
								fullWidth
								component={TextField}
								type="text"
								label="productGroupName"
								name="productGroupName"
							/>
						</Grid> */}
						<Grid item xs={12} lg={4}>
							{isSubmitting && <LinearProgress />}
							<Button
								fullWidth
								style={{ marginTop: 6, marginRight: 100 }}
								variant="contained"
								color="primary"
								disabled={isSubmitting}
								onClick={submitForm}
								startIcon={<SearchIcon color="action" />}
							>
								Search
                			</Button>
						</Grid>
					</Grid>
				</Form>

			)}
		</Formik>
		// 	</CardContent>
		// </Card>
	);
}

export default ProductSearch;