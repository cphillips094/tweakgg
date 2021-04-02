import React, { useState, useEffect, useRef } from 'react';
import { useSpring, useSprings, useChain, animated } from 'react-spring';
import { Grid, Row } from 'react-flexbox-grid';
import BobbingLogo from '../bobbing-logo';
import MediaItem from './media-item';
import { RiCloseCircleLine } from 'react-icons/ri';
import YouTube from './youtube/youtube';
import {
	fetchPlaylistData,
	parsePlaylistData,
	fetchPlaylistItemData,
	parsePlaylistItemsData,
	fetchPlaylistVideoData,
	parsePlaylistVideoData
} from './youtube/apiCalls';
import './index.scss';

import testPlaylistData from './testing/testPlaylistData';
import testPlaylistItemData from './testing/testPlaylistItemData';

const Index = () => {
	const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
	const [mediaIsOpen, setMediaIsOpen] = useState(false);
	const [playlistData, setPlaylistData] = useState(null);
	const [playlistItemData, setPlaylistItemData] = useState(null);
	const [playlistVideoData, setPlaylistVideoData] = useState(null);

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



	useEffect(() => {
		fetchPlaylistData().then(rawPlaylistData => setPlaylistData(parsePlaylistData(rawPlaylistData)));
	}, []);

	useEffect(() => {
		if (playlistData) {
			fetchPlaylistItemData(playlistData).then(playlistItemsData => setPlaylistItemData(parsePlaylistItemsData(playlistItemsData)));
		}
	}, [playlistData]);

	useEffect(() => {
		if (playlistItemData) {
			fetchPlaylistVideoData(playlistItemData).then(playlistVideoData => setPlaylistVideoData(parsePlaylistVideoData(playlistVideoData)));
		}
	}, [playlistItemData]);

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