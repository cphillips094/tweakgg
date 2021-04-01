import React, { useState, useEffect, useRef } from 'react';
import configData from '../configuration/app.json';
import { useSpring, useSprings, useChain, animated } from 'react-spring';
import { Grid, Row } from 'react-flexbox-grid';
import BobbingLogo from '../bobbing-logo';
import MediaItem from './media-item';
import { RiCloseCircleLine } from 'react-icons/ri'
import YouTube from './expanded/youtube';
import './index.scss';

import testPlaylistData from './testing/testPlaylistData';
import testPlaylistItemData from './testing/testPlaylistItemData';

const Index = () => {
	const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
	const [mediaIsOpen, setMediaIsOpen] = useState(false);
	const [playlistData, setPlaylistData] = useState(null);
	const [playlistItemData, setPlaylistItemData] = useState(null);

	const expandMedia = index => {
		setSelectedMediaIndex(index);
		setMediaIsOpen(true);
	}

	const closeMedia = () => {
		setSelectedMediaIndex(null);
		setMediaIsOpen(false);
	}

	const [media] = useState([
		{
			title: 'twitter',
			collapsed: <div>collapsed twitter content</div>,
			expanded: <div>expanded twitter content</div>,
		},
		{
			title: 'youtube',
			collapsed: <div>collapsed youtube content</div>,
			expanded: <YouTube
				embedHtml={playlistData?.embedHtml || ''}
				playlists={playlistData}
			/>,
		},
		{
			title: 'discord',
			collapsed: <div>collapsed discord content</div>,
			expanded: <div>expanded discord content</div>,
		},
		{
			title: 'instagram',
			collapsed: <div>collapsed instagram content</div>,
			expanded: <div>expanded instagram content</div>,
		},
	]);

	const smallMediaRef = useRef();
	const smallMediaStyles = useSprings(media.length, media.map(item => {
		let result = null;
		if (mediaIsOpen) {
			result = {
				height: '0%',
				position: 'inline-block',
				opacity: 0,
			}
		} else {
			result = {
				height: '80%',
				position: 'inline-block',
				opacity: 1,
			}
		}
		return { ...result, ref: smallMediaRef };
	}));

	const expandedMediaRef = useRef();
	const expandedMediaStyles = useSpring({
		transform: mediaIsOpen ? 'translate3d(0, 0 ,0)' : 'translate3d(0, -500px ,0)',
		height: mediaIsOpen ? '90%' : '0%',
		top: mediaIsOpen ? '5%' : '0%',
		opacity: mediaIsOpen ? 1 : 0,
		ref: expandedMediaRef,
	})

	useChain(mediaIsOpen ? [smallMediaRef, expandedMediaRef] : [expandedMediaRef, smallMediaRef]);

	const parsePlaylistData = (rawPlaylistData) => {
		let playlistData = [];
		try {
			if (rawPlaylistData) {
				const rawPlaylistItems = rawPlaylistData.items;
				rawPlaylistItems.forEach(rawPlaylistItem => {
					let playlistItem = {
						id: rawPlaylistItem.id || '',
					}
					const playlistItemSnippet = rawPlaylistItem.snippet;
					if (playlistItemSnippet) {
						playlistItem = {
							...playlistItem,
							title: playlistItemSnippet.title || '',
						}
						const thumbnails = playlistItemSnippet.thumbnails;
						if (thumbnails) {
							playlistItem = {
								...playlistItem,
								thumbnail: {
									url: thumbnails.default.url,
									width: thumbnails.default.width,
									height: thumbnails.default.height,
								}
							}
						}
					}

					const playlistItemPlayer = rawPlaylistItem.player;
					if (playlistItemPlayer) {
						playlistItem = {
							...playlistItem,
							embedHtml: playlistItemPlayer.embedHtml || '',
						}
					}
					playlistData.push(playlistItem);
				});
			}
		} catch (error) {
			console.error(error);
		}

		return playlistData;
	}

	const parsePlaylistItemsData = (playlistItemsData) => {
		const playlists = [];
		if (playlistItemsData) {
			// for each playlist
			playlistItemsData.forEach(rawPlaylistItem => {
				const videoData = [];
				const playlistItemData = rawPlaylistItem.data;
				if (playlistItemData) {
					const playlistItems = playlistItemData.items;
					if (playlistItems) {
						// for each video in playlist
						playlistItems.forEach(playlistItem => {
							let videoTitle = '';
							const playlistItemSnippet = playlistItem.snippet;
							if (playlistItemSnippet) {
								videoTitle = playlistItemSnippet.title || '';
							}
							const playlistItemVideoIDs = extractVideoID(playlistItem);
							videoData.push({
								videoTitle: videoTitle,
								videoID: playlistItemVideoIDs,
							})
						})
					}
				}
				playlists.push({
					title: rawPlaylistItem.title || '',
					embedHtml: rawPlaylistItem || '',
					videoData: videoData,
				});
			});
		}

		return playlists;
	}

	const extractVideoID = (playlistItem) => {
		let videoID = null;
		if (playlistItem) {
			const playlistItemContentDetails = playlistItem.contentDetails;
			if (playlistItemContentDetails) {
				videoID = playlistItemContentDetails.videoId;
			}
		}
		return videoID;
	};

	useEffect(() => {
		const fetchPlaylistData = async () => {
			let channelPlaylistData = null;
			try {
				// const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cplayer&channelId=${configData.youTubeChannelID}&key=${configData.youTubeAPIKey}`,
				// 	{ method: 'GET' });
				// const playlistData = await response.json();
				const playlistData = testPlaylistData;
				if (false) { //!response.ok) {
					throw Object.assign(
						new Error('Something went wrong when fetching channel playlist data')
					);
				}
				channelPlaylistData = playlistData;
			} catch (e) {
				console.error(e);
			} finally {

			}
			return channelPlaylistData;
		}

		fetchPlaylistData().then(rawPlaylistData => setPlaylistData(parsePlaylistData(rawPlaylistData)));
	}, []);

	useEffect(() => {
		const fetchPlaylistItemData = async (playlistData) => {
			let playlistItemsData = [];
			try {
				if (playlistData) {
					playlistData.forEach(playlistDataItem => {
						// const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistDataItem.id}&key=${configData.youTubeAPIKey}`,
						// 	{ method: 'GET' });
						// const playlistItemVideoData = await response.json();
						const playlistItemData = testPlaylistItemData;
						if (false) { //!response.ok) {
							throw Object.assign(
								new Error('Something went wrong when fetching playlist video data')
							);
						} else {
							playlistItemsData.push({
								title: playlistDataItem.title,
								embedHtml: playlistDataItem.embedHtml,
								data: playlistItemData,
							})
						}
					});
				}
			} catch (e) {
				console.error(e);
			}

			return playlistItemsData;
		}

		if (playlistData) {
			fetchPlaylistItemData(playlistData).then(playlistItemsData => setPlaylistItemData(parsePlaylistItemsData(playlistItemsData)));
		}
	}, [playlistData]);

	return (
		<div
			id='social-page'
			className='page-container'
		>
			<BobbingLogo />
			<animated.div
				id='main-media'
				className='colorful-border big-border shadow rounded'
				style={expandedMediaStyles}
			>
				<div className='bg-gradient rounded'>
					<RiCloseCircleLine
						className='clickable-icon close'
						onClick={closeMedia}
					/>
					{selectedMediaIndex !== null && media[selectedMediaIndex].expanded}
					{playlistItemData && JSON.stringify(playlistItemData)}
				</div>
			</animated.div>
			<Grid className='page-grid' fluid style={{ height: '100%', width: '100%' }}>
				<Row className='media-row'>
					{
						smallMediaStyles.slice(0, 2).map((style, index) => {
							const mediaData = media[index];
							const onExpand = () => expandMedia(index);
							return (
								<MediaItem
									mediaData={mediaData}
									onExpand={onExpand}
									style={style}
								/>
							);
						})
					}
				</Row>
				<Row className='media-row'>
					{
						smallMediaStyles.slice(2, 4).map((style, index) => {
							index = index + 2;
							const mediaData = media[index];
							const onExpand = () => expandMedia(index);
							return (
								<MediaItem
									mediaData={mediaData}
									onExpand={onExpand}
									style={style}
								/>
							);
						})
					}
				</Row>
			</Grid>
		</div >
	)
}

export default Index;