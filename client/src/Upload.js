import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import AWS from 'aws-sdk';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.warning.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Upload(props) {
  const classes = useStyles();
  const [isPublic, setPublic] = useState(true);
  const [pictures, setPictures] = useState(null);
  const [isUploading, setUploading] = useState(false);

  const handlePublicCheck = async (e) => {
    setPublic(!isPublic);
  }

  let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (pictures.length === 0) {
      alert("Please select at least one photo");
      return;
    }

    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:fd5b8325-340f-4457-ad04-4ffeb4b080da'
    });
    const albumBucketName = "willson-test"

    if (pictures.length > 10) {
      alert("You can upload a maximum of 10 images at a time.");
      return;
    }

    let listLinks = [];

    for (let i=0; i < pictures.length; i++) {
      let picture = pictures[i];
      let pictureName = guid();
      
      let upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
                  Key: pictureName,
                  Body: picture,
                  ContentType: picture.type,
                  ACL: "public-read"
        }
      });

      let imgUrl = await upload.promise().then(data => data.Location).catch(
        e => alert(e.message));
      listLinks.push(imgUrl);

      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem('token')
      }

      try {
        await axios.post("http://localhost:8000/api/images/upload", {
          "imgUrl": imgUrl,
          "isPublic": isPublic
        }, { headers: headers });
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
    }
    alert("Upload successful");
    setUploading(false);
    props.history.push('/');
  }

  const onDrop = picture => {
    setPictures(picture);
    console.log(pictures);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CloudUpload />
        </Avatar>
        <Typography component="h1" variant="h5">
          Upload an image
        </Typography>
        <form className={classes.form} noValidate>
          <ImageUploader
                withIcon={true}
                withPreview={true}
                buttonText='Choose images'
                imgExtension={['.jpg', '.png']}
                label={"Max file size 5MB. Accepted: jpg, png"}
                maxFileSize={5242880}
                onChange={onDrop}
            />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" checked={isPublic}/>}
            label="Make public"
            onChange={e => handlePublicCheck(e)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => handleSubmit(e)}
          >
            {isUploading? "Uploading..." : "Upload" }
          </Button>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  );
}