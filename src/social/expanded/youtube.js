import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Slider from '../../side-scroller';

const YouTube = () => {

	return (
		<Grid fluid style={{ width: '100%', height: '100%' }}>
			<Row style={{ width: '100%', height: '50%' }}>
				<Col xs={12} style={{ height: '100%' }}>
					<h1>
						YOUTUBE
					</h1>
				</Col>
			</Row>
			<Row style={{ width: '100%', height: '50%' }}>
				<Col xs={12} style={{ height: '100%' }}>

				</Col>
			</Row>
		</Grid>
	);
}

export default YouTube;