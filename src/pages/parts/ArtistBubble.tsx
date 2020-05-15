import React from 'react';
import { DispatchProps, Artist } from "../../redux/types";
import { connect } from "react-redux";
import { createStyles, Theme, Avatar, IconButton, Typography, PaletteType } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from "@material-ui/core/colors";
import MusicNote from '@material-ui/icons/MusicNote';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
        },
        artistAvatarBox: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        circleIconLight: {
            background: blueGrey[300],
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        circleIconDark: {
            background: blueGrey[700],
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
);

interface OwnProps {
    artist: Artist,
    key: string,
    thememode: PaletteType,
}

type Props = DispatchProps & OwnProps;

const ArtistBubble: React.FC<Props> = (props: Props) => {

    const { artist, key, thememode } = props;
    const [redirectArtist, setRedirectArtist] = React.useState('');

    const classes = useStyles();

    if (redirectArtist) {
        return <Redirect to={'/artist?' + redirectArtist} />
    }

    return (
        <div className={classes.artistAvatar} key={'div_' + key} >
            <IconButton
                color="inherit"
                onClick={() => { if (artist.spotifyId) setRedirectArtist(artist.spotifyId) }}
            >
                {artist.picture ?
                    <Avatar src={artist.picture} alt={artist.name} className={classes.artistAvatarImg}
                        key={key} />
                    : <div className={thememode === 'light' ? classes.circleIconLight : classes.circleIconDark}>
                        <MusicNote fontSize={'large'} />
                    </div>}
            </IconButton>
            <Typography variant="caption" >
                {artist.name}
            </Typography>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch
    }
};

export default connect(
    mapDispatchToProps
)(ArtistBubble);
