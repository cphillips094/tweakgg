import configData from '../../configuration/app.json';

// PLAYLIST DATA
const fetchPlaylistData = async () => {
	let channelPlaylistData = null;
	try {
		const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2Cplayer&channelId=${configData.youTubeChannelID}&key=${configData.youTubeAPIKey}`,
			{ method: 'GET' });
		const playlistData = await response.json();
		// const playlistData = testPlaylistData;
		if (!response.ok) {
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

// PLAYLIST ITEM DATA
const fetchPlaylistItemData = async (playlistData) => {
	let playlistItemsData = [];
	try {
		if (playlistData) {
			for (const playlistDataItem of playlistData) {
				const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=${playlistDataItem.id}&key=${configData.youTubeAPIKey}`,
					{ method: 'GET' });
				const playlistItemData = await response.json();
				// const playlistItemData = testPlaylistItemData;
				if (!response.ok) {
					throw Object.assign(
						new Error('Something went wrong when fetching playlist item data')
					);
				} else {
					playlistItemsData.push({
						title: playlistDataItem.title,
						embedHtml: playlistDataItem.embedHtml,
						data: playlistItemData,
					})
				}
			};
		}
	} catch (e) {
		console.error(e);
	}

	return playlistItemsData;
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
				embedHtml: rawPlaylistItem.embedHtml || '',
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

//PLAYLIST VIDEO DATA
const fetchPlaylistVideoData = async (playlistItemData) => {
	let playlistVideosData = [];
	try {
		if (playlistItemData) {
			for (const playlistItemDataItem of playlistItemData) {
				let videoIDsString = '';
				const itemVideoIDs = playlistItemDataItem.videoData;
				if (itemVideoIDs) {
					const videoIDs = itemVideoIDs.map(video => video.videoID);
					videoIDsString = videoIDs.join('%2C');
				}
				const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cplayer&id=${videoIDsString}&key=${configData.youTubeAPIKey}`,
					{ method: 'GET' });
				const playlistVideoData = await response.json();
				if (!response.ok) {
					throw Object.assign(
						new Error('Something went wrong when fetching playlist video data')
					);
				} else {
					playlistVideosData.push({
						title: playlistItemDataItem.title,
						embedHtml: playlistItemDataItem.embedHtml,
						data: playlistVideoData,
					})
				}
			};
		}
	} catch (e) {
		console.error(e);
	}

	return playlistVideosData;
}

const parsePlaylistVideoData = (playlistVideoData) => {
	let videos = [];
	if (playlistVideoData) {
		playlistVideoData.forEach(playlistVideoItem => {
			let playlistVideos = [];
			const videoData = playlistVideoItem.data;
			if (videoData) {
				const videoDataItems = videoData.items;
				if (videoDataItems) {
					videoDataItems.forEach(videoDataItem => {
						let videoTitle = '';
						let videoThumbnail = null;
						let videoEmbedHtml = '';

						const videoDataItemSnippet = videoDataItem.snippet;
						if (videoDataItemSnippet) {
							videoTitle = videoDataItemSnippet.title || '';

							const videoDataItemSnippetThumbnails = videoDataItemSnippet.thumbnails;
							if (videoDataItemSnippetThumbnails) {
								const defaultThumbnail = videoDataItemSnippetThumbnails.default;
								if (defaultThumbnail) {
									videoThumbnail = {
										height: defaultThumbnail.height,
										width: defaultThumbnail.width,
										url: defaultThumbnail.url,
									}
								}
							}
						}

						const videoDataItemPlayer = videoDataItem.player;
						if (videoDataItemPlayer) {
							videoEmbedHtml = videoDataItemPlayer.embedHtml || '';
						}

						playlistVideos.push({
							title: videoTitle,
							thumbnail: videoThumbnail,
							embedHtml: videoEmbedHtml,
						});
					});
				}
			}
			videos.push({
				playlistTitle: playlistVideoItem.title,
				playlistEmbed: playlistVideoItem.embedHtml,
				videos: playlistVideos,
			})
		});
	}

	return videos;
}

export { fetchPlaylistData, parsePlaylistData, fetchPlaylistItemData, parsePlaylistItemsData, fetchPlaylistVideoData, parsePlaylistVideoData };