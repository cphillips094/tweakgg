import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { TwitchChat, TwitchPlayer } from 'react-twitch-embed';
import Slider from '../side-scroller';
import "./index.css";

const Index = () => {
	return (
		<Grid
			fluid
			id='twitch-container'
		>
			<Row>
				<Col
					className='col'
					xs={9}
				>
					<Grid fluid>
						<Row>
							<Col xs={12}>
								<div class='twitch-content'>
									<h1>
										This is a stream title
									</h1>
									<TwitchPlayer
										id='twitch-player'
										channel='tweak'
										muted
										height="100%"
										width="100%"
									/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								<div className='twitch-content' style={{ marginTop: '20px' }}>
									<h2>
										TOP CLIPS
									</h2>
									<Slider
										items={clips}
									/>
								</div>
							</Col>
						</Row>
					</Grid>
				</Col>
				<Col
					className='col'
					xs={3}
				>
					<TwitchChat
						id='twitch-chat'
						channel='tweak'
						theme='dark'
						height='100%'
					/>
				</Col>
			</Row>
		</Grid>
	);
}

export default Index;