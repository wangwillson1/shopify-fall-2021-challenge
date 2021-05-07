import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Album(props) {
  const classes = useStyles();
  const [pictures, setPictures] = useState(null);
  const [headers, setHeaders] = useState({
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem('token')
  });

  useEffect(() => {
    async function getImages() {
      let res = await axios.get("http://localhost:8000/api/images/userid", {headers: headers});
      setPictures(res.data.images);
    }
    getImages();
  }, [setPictures, headers, setHeaders]);

  const deleteImage = async (id) => {
    console.log(headers);
    
    try {
      await axios.delete("http://localhost:8000/api/images/delete", {
        headers: headers, 
        data: {
        "imgId": id,
      }});
    }
    catch (e) {
      if (e.response) {
        alert(e.response.data.message);
      }
      else {
          console.log(e);
      }
      return;
    }

    alert("Deletion successful");
    window.location.reload();
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              My Images
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary">
              Here are all your images. You can delete images from this page.
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
        {pictures && pictures.length === 0 &&
          <div className="empty">
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Oops! You don't have any pictures. Upload one now through the upload tab.
            </Typography>
          </div>
        }
          {/* End hero unit */}
          <Grid container spacing={4}>
            {pictures && pictures.map((picture) => (
              <Grid item key={picture.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={picture.imgUrl}
                    title="Image title"
                  />
                  <CardActions>
                    <Button size="small" color="primary">
                      <Link underline="none" href={picture.imgUrl}>View full image</Link>
                    </Button>
                    <Button size="small" color="secondary" onClick={() => {deleteImage(picture.id)}}>
                      <Link underline="none">Delete image</Link>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}