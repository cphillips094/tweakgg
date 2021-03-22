import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { TwitchChat, TwitchPlayer } from 'react-twitch-embed';
import Slider from '../side-scroller';
import Logo from '../assets/images/full-logo.png'
import "./index.scss";

const Index = () => {
	const [token, setToken] = useState('');
	const [streamTitle, setStreamTitle] = useState('');
	const [clips, setClips] = useState([]);
	useEffect(() => { fetchToken() }, []);
	useEffect(() => { fetchStreamTitle() }, [token]);
	useEffect(() => { fetchClips() }, [token]);

	const fetchToken = async () => {
		try {
			//setFetchingItems(true);
			const response = await fetch(
				'https://id.twitch.tv/oauth2/token?client_id=eyt3nit0oell5gdmi1jvr9mlmbjvrn&client_secret=pviql3gqkrhwe4sh0u0tbv59hadnq1&grant_type=client_credentials',
				{ method: 'POST' }
			);
			const json = await response.json();
			if (!response.ok || json.message) {
				throw json.message || 'Something went wrong';
			}
			setToken(json.access_token);
		} catch (error) {
			console.log(error);
		} finally {
			//setFetchingItems(false);
		}
	}

	const fetchStreamTitle = async () => {
		try {
			//setFetchingItems(true);
			const response = await fetch(
				'https://api.twitch.tv/helix/channels?broadcaster_id=158130480',
				{
					method: 'GET',
					headers: {
						'client-id': 'eyt3nit0oell5gdmi1jvr9mlmbjvrn',
						'Authorization': `Bearer ${token}`
					}
				}
			);
			const json = await response.json();
			if (!response.ok || json.message) {
				throw json.message || 'Something went wrong';
			}
			setStreamTitle(parseChannelData(json));
		} catch (error) {
			console.log(error);
		} finally {
			//setFetchingItems(false);
		}
	}

	const fetchClips = async () => {
		if (token) {
			try {
				//setFetchingItems(true);
				const response = await fetch(
					'https://api.twitch.tv/helix/clips?broadcaster_id=158130480',
					{
						method: 'GET',
						headers: {
							'client-id': 'eyt3nit0oell5gdmi1jvr9mlmbjvrn',
							'Authorization': `Bearer ${token}`
						}
					}
				);
				const json = await response.json();
				if (!response.ok || json.message) {
					throw json.message || 'Something went wrong';
				}
				// alert(JSON.stringify(json));
				setClips(createClipObjects(json));
			} catch (error) {
				console.log(error);
			} finally {
				//setFetchingItems(false);
			}
		}
	}

	const parseChannelData = (json) => {
		let title = '';
		if (json) {
			const data = json.data;
			if (data) {
				const streamData = data[0];
				if (streamData) {
					title = streamData.title;
				}
			}
		}
		return title;
	}

	const createClipObjects = (json) => {
		let clips = [];
		if (json) {
			clips = json.data.map(clipData =>
				<a
					href={clipData.url}
					title={clipData.title}
					target='_blank'
				>
					<img src={clipData.thumbnail_url} />
				</a>
			);
		}
		return clips;
	}

	return (
		<div id="twitch-page">
			<a
				href='https://www.twitch.tv/tweak'
				target='_blank'
			>
				<img
					class='tweak-logo filter-shadow'
					src={Logo}
					alt=''
				/>
			</a>
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
									<div className='twitch-content'>
										<h1>
											{streamTitle.toUpperCase()}
										</h1>
										<TwitchPlayer
											id='twitch-player'
											className='shadow'
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
										<h2 style={{ marginBottom: '10px' }}>
											TOP CLIPS
										</h2>
										<Slider
											items={clips}
											className='filter-shadow'
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
							className='shadow'
							channel='tweak'
							theme='dark'
							height='100%'
						/>
					</Col>
				</Row>
			</Grid>
		</div>
	);
}

export default Index;