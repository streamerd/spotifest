import React from 'react';
import { AppState, DispatchProps, FestivalMatch, MatchingMethod } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, MuiThemeProvider, Theme, Avatar, Paper, IconButton, Collapse } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pink from "@material-ui/core/colors/pink";
import { Model } from "../../redux/types";
//import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import Typography from '@material-ui/core/Typography';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Box from '@material-ui/core/Box';
import { PaletteType } from "@material-ui/core";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			justifyContent: 'space-between',
			flexGrow: 1,
			flexDirection: 'column',
			padding: theme.spacing(2, 4, 2, 4),
			marginBottom: theme.spacing(2),
			width: '100%',
			//alignItems: 'center',
		},
		alignCenter: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: theme.spacing(2)
		},
		circleSize: {
			width: '72px'
		},
		text: {
			paddingRight: '40px'
		},
		festivalTitle: {
			flexGrow: 1,
			//paddingRight: theme.spacing(1)
		},
		box: {
			width: '80%',
			maxWidth: '764px'
		},
		button: {
			textTransform: 'none',
			padding: theme.spacing(0),
			fontSize: '18px',
			"&:hover": {
				backgroundColor: "transparent",
			}
		},
		invisibleButton: {
			display: 'none'
		},
		artistAvatar: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			width: '100px',
			textAlign: 'center'
		},
		artistAvatarImg: {
			height: 80,
			width: 80,
			//borderRadius: 13,
		},
		artistAvatarBox: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		},
		titleAndMatchBox: {
			width: '100%',
			display: 'flex',
			//paddingRight: theme.spacing(1),
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignItems: 'center',
			minHeight: '48px'
		},
		expand: {
			transform: 'rotate(0deg)',
			//marginLeft: 'auto',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest,
			}),
		},
		expandOpen: {
			transform: 'rotate(180deg)',
		},
		titleLine: {
			width: '100%',
		},
	}),
);

interface StoreProps {
	model: Model;
	thememode: PaletteType,
	festivalMatches: FestivalMatch[],
	matchingMethod: MatchingMethod
}

type Props = DispatchProps & StoreProps;

const FestivalMatchView: React.FC<Props> = (props: Props) => {

	// const smallScreen = useMediaQuery('(max-width:610px)');

	const { festivalMatches, thememode, matchingMethod } = props;

	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const lightBluePinkMuiTheme = createMuiTheme({
		palette: {
			primary: {
				light: lightBlue[300],
				main: lightBlue[500],
				dark: lightBlue[700]
			},
			secondary: {
				light: pink[300],
				main: pink[500],
				dark: pink[700]
			},
			type: thememode
		}
	});

	const classes = useStyles();

	return (
		<Box className={classes.box}>
			{festivalMatches.sort((a, b) => (matchingMethod === MatchingMethod.Genre ?
				(a.matching_percent_genres < b.matching_percent_genres) :
				(a.matching_percent_artists < b.matching_percent_artists)) ? 1 : -1)
				.map((festival: FestivalMatch, idx) => {
					let matching_percent: number = 0;
					switch (matchingMethod) {
						case MatchingMethod.Genre:
							matching_percent = Math.ceil(festival.matching_percent_genres);
							break;
						case MatchingMethod.Artist:
							matching_percent = Math.ceil(festival.matching_percent_artists);
							break;
						default:
							break;
					}
					const pathColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const textColor = thememode === 'light' ? '#3FBF3F' : '#3de53d';
					const trailColor = thememode === 'light' ? '#d6d6d6' : 'rgba(104, 104, 104)';
					return (
						<Paper elevation={3} className={classes.root} key={festival.name}>
							<MuiThemeProvider theme={lightBluePinkMuiTheme}>
								<div className={classes.titleLine}>
									<div className={classes.titleAndMatchBox}>
										<Typography className={classes.festivalTitle} variant="h2">
											{festival.name}
										</Typography>
										<div>
											<div className={classes.circleSize}>
												<CircularProgressbar value={matching_percent} text={`${matching_percent}%`}
													styles={buildStyles({
														textSize: '22px',
														pathTransitionDuration: 0.5,
														pathColor: pathColor,
														textColor: textColor,
														trailColor: trailColor,
														//backgroundColor: '#3e98c7',
													})}
												/>
											</div>
										</div>
									</div>
								</div>
								<div>
									<Typography variant="subtitle1">
										January 22-25, 2020
									</Typography>
									<Typography variant="subtitle1">
										Location, location, country
									</Typography>
									<div className={classes.titleAndMatchBox}>
										<Typography variant="body1" color='primary' >
											{festival.matching_artists.length > 0 ? 'Matching artists' : 'No matching artists'}
										</Typography>
									</div>
									<div className={classes.artistAvatarBox}>
										{festival.matching_artists.length > 0 &&
											festival.matching_artists.map((artist) => (
												<div className={classes.artistAvatar}>
													<Avatar src={artist.picture} alt={artist.name} className={classes.artistAvatarImg} />
													<Typography variant="caption" color='primary' >
														{artist.name}
													</Typography>
												</div>)
										)}
									</div>
									<div className={classes.titleAndMatchBox}>
										<Typography variant="body1" color='primary' >
											Popular artists at this festival
										</Typography>
										<IconButton
											className={clsx(classes.expand, {
												[classes.expandOpen]: expanded,
											})}
											onClick={handleExpandClick}
											aria-expanded={expanded}
											aria-label="show more"
										>
											<ExpandMoreIcon />
										</IconButton>
									</div>
									<Collapse in={expanded} timeout="auto" unmountOnExit>
										<div className={classes.artistAvatarBox}>
											{festival.popular_artists.length > 0 &&
												festival.popular_artists.map((artist) => (
													<div className={classes.artistAvatar}>
														<Avatar src={artist.picture} alt={artist.name} className={classes.artistAvatarImg} />
														<Typography variant="caption" color='primary' >
															{artist.name}
														</Typography>
													</div>)
												)}
										</div>
									</Collapse>
								</div>
							</MuiThemeProvider>
						</Paper>
					)
				})}
		</Box>
	);
};

const mapStateToProps = (state: AppState) => ({
	model: state.model,
	thememode: state.model.thememode,
	festivalMatches: state.model.festivalMatches,
	matchingMethod: state.model.matchingMethod
});

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatch
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FestivalMatchView);
