import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import "./capture-image.css";
import Button from "@material-ui/core/Button";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import { MediaControlCard } from "../video-feed/video-feed";
import { useRef } from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Resizer from "react-image-file-resizer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    button: {
      width: "100%",
    },
    buttonLeft: {
      width: "50%",
    },
    buttonRight: {
      width: "50%",
    },
    content: {
      flex: "1 0 auto",
    },
    cover: {
      width: "640px",
    },
    controls: {},
    playIcon: {
      height: 38,
      width: 38,
    },
    containerFeed: {
      position: "relative",
    },
    overlayFeed: {},
    overlayButtonLeft: {
      bottom: "6px",
      left: "9px",
      position: "absolute",
      color: "white",
      borderColor: "white",
    },
    overlayButtonRight: {
      bottom: "6px",
      right: "9px",
      position: "absolute",
      color: "white",
      borderColor: "white",
    },
  })
);

export const CaptureImage: React.FC = () => {
  const WIDTH = 256;
  const HEIGHT = 256;
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const classes = useStyles();
  const theme = useTheme();

  const [displayVideoFeed, setDisplayVideoFeed] = useState<boolean>(false);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
  const webcamRef = useRef<any>(null);
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState<any>(null);
  const videoConstraints = {
    facingMode: facingMode,
  };

  const resizeFile = (file: File) => {
    Resizer.imageFileResizer(
      file,
      WIDTH,
      HEIGHT,
      "JPEG",
      100,
      0,
      (uri) => {
        setImgSrc(uri);
      },
      "base64"
    );
  };

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot(WIDTH, HEIGHT);
      setImgSrc(imageSrc);
      setDisplayVideoFeed(false);
    } else {
      hiddenFileInput.current?.click();
    }
  }, [webcamRef, setImgSrc, hiddenFileInput]);
  return (
    <div className={classes.root}>
      <Card className={classes.cover}>
        <div className={classes.button}>
          <Button
            className={classes.buttonLeft}
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={() => {
              displayVideoFeed
                ? setDisplayVideoFeed(false)
                : setDisplayVideoFeed(true);
              setImgSrc(null);
            }}
            endIcon={displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />}
          >
            {!displayVideoFeed ? (
              <div>Enable Camera</div>
            ) : (
              <div>Disable Camera</div>
            )}
          </Button>
          <Button
            className={classes.buttonRight}
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={(event) => {
              event.preventDefault();
              hiddenFileInput.current?.click();
              setDisplayVideoFeed(false);
            }}
            endIcon={displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />}
          >
            Upload a Picture
          </Button>
        </div>
        {displayVideoFeed ? (
          <div className={classes.containerFeed}>
            <Webcam
              audio={false}
              videoConstraints={videoConstraints}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.95}
              className={classes.overlayFeed}
            />
            <Button
              className={classes.overlayButtonLeft}
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={() => {
                setFacingMode((prevState) =>
                  prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
                );
              }}
              endIcon={
                displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />
              }
            >
              Switch Camera
            </Button>
            <Button
              className={classes.overlayButtonRight}
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={capture}
              hidden={!displayVideoFeed}
              endIcon={
                displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />
              }
            >
              Capture photo
            </Button>
          </div>
        ) : (
          <div></div>
        )}
        {
          <img
            src={imgSrc ? imgSrc : ""}
            onClick={(event) => {
              event.preventDefault();
              hiddenFileInput.current?.click();
            }}
          />
        }
        <input
          type="file"
          ref={hiddenFileInput}
          accept="image/*"
          onChange={(event: any) => {
            const file = event.target.files[0];
            if (file && file.type.substr(0, 5) === "image") {
              resizeFile(file);
            }
          }}
          style={{ display: "none" }}
        />
        <MediaControlCard latestImage={imgSrc} />
      </Card>
    </div>
  );
};
