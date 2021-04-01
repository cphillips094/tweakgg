import React, { useState, useEffect } from 'react';
import configData from '../configuration/app.json';
import { Grid, Row, Col } from 'react-flexbox-grid';
import BobbingLogo from '../bobbing-logo';
import TwitchTitle from './twitch-title'
import { TwitchChat, TwitchPlayer } from 'react-twitch-embed';
import TwitchClips from './twitch-clips';
import "./index.scss";

const fetchResource = async (url, fetchConfig, resourceName, resourceAccessor, resourceErrorSetter, resourceLoadingSetter) => {
	let resource = null;
	try {
		resourceLoadingSetter(true);
		const response = await fetch(url, fetchConfig);
		const json = await response.json();
		if (!response.ok) {
			throw Object.assign(
				new Error(`Something went wrong when fetching ${resourceName}`)
			);
		}
		resource = resourceAccessor(json);
		resourceErrorSetter(null);
	} catch (e) {
		resourceErrorSetter(e);
	} finally {
		resourceLoadingSetter(false);
	}
	return resource;
}

const Index = () => {
	const [token, setToken] = useState(null);

	const [streamTitle, setStreamTitle] = useState(null);
	const [streamTitleError, setStreamTitleError] = useState(null);
	const [streamTitleLoading, setStreamTitleLoading] = useState(true);

	const [clips, setClips] = useState(null);
	const [clipsError, setClipsError] = useState(null);
	const [clipsLoading, setClipsLoading] = useState(true);

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
				<div className='clip-container colorful-border'>
					<a
						href={clipData.url}
						title={clipData.title}
						target='_blank'
						rel='noreferrer'
					>
						<img src={clipData.thumbnail_url} alt={`Twitch clip: ${clipData.title}`} />
					</a>
				</div>
			);
		}
		return clips;
	}

	useEffect(() => {
		const fetchToken = async () => {
			const token = await fetchResource(
				`https://id.twitch.tv/oauth2/token?client_id=${configData.clientId}&client_secret=${configData.clientSecret}&grant_type=client_credentials`,
				{ method: 'POST' },
				'access_token',
				(json) => json['access_token'],
				Function.prototype,
				Function.prototype,
			);
			return token;
		};

		fetchToken().then(foo => setToken(foo));
	}, []);

	useEffect(() => {
		const fetchStreamTitle = async (token) => {
			const streamTitle = await fetchResource(
				`https://api.twitch.tv/helix/channels?broadcaster_id=${configData.broadcasterId}`,
				{
					method: 'GET',
					headers: {
						'client-id': configData.clientId,
						'Authorization': `Bearer ${token}`
					}
				},
				'streamTitle',
				parseChannelData,
				setStreamTitleError,
				setStreamTitleLoading
			);
			return streamTitle;
		}
		const fetchClips = async (token) => {
			const clips = await fetchResource(
				`https://api.twitch.tv/helix/clips?broadcaster_id=${configData.broadcasterId}`,
				{
					method: 'GET',
					headers: {
						'client-id': configData.clientId,
						'Authorization': `Bearer ${token}`
					}
				},
				'clips',
				createClipObjects,
				setClipsError,
				setClipsLoading
			);
			return clips;
		};
		if (token) {
			fetchStreamTitle(token).then(streamTitle => setStreamTitle(streamTitle));
			fetchClips(token).then(clips => setClips(clips));
		}
	}, [token])

	return (
		<div
			id="twitch-page"
			className='page-container'
		>
			<BobbingLogo />
			<Grid
				fluid
				id='twitch-container'
				className='page-grid'
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
										<TwitchTitle
											loading={streamTitleLoading}
											error={streamTitleError}
											title={streamTitle}
										/>
										<div className='colorful-border big-border shadow rounded'>
											<TwitchPlayer
												id='twitch-player'
												channel='tweak'
												muted
												height="100%"
												width="100%"
											/>
										</div>
									</div>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<div className='twitch-content' style={{ marginTop: '20px' }}>
										<TwitchClips
											loading={clipsLoading}
											error={clipsError}
											clips={clips}
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