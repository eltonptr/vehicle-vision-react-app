import React, { useState } from "react";
import Webcam from "react-webcam";
import "./capture-image.css";
import Button from "@material-ui/core/Button";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import { MediaControlCard } from "../video-feed/video-feed";
import { useRef } from "react";

export const CaptureImage: React.FC = () => {
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";

  const [displayVideoFeed, setDisplayVideoFeed] = useState<boolean>(false);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState();
  const videoConstraints = {
    facingMode: facingMode,
  };
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  return (
    <div>
      Capture Image or Upload File Component
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={() => {
          displayVideoFeed
            ? setDisplayVideoFeed(false)
            : setDisplayVideoFeed(true);
        }}
        endIcon={displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />}
      >
        {!displayVideoFeed ? (
          <div>Enable Video Feed</div>
        ) : (
          <div>Disable Video Feed</div>
        )}
      </Button>
      <Button
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
        endIcon={displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />}
      >
        Switch Camera
      </Button>
      {displayVideoFeed ? (
        <Webcam
          audio={false}
          videoConstraints={videoConstraints}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.95}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 255,
            height: 255,
          }}
        />
      ) : (
        <div> No Feed </div>
      )}
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={capture}
        endIcon={displayVideoFeed ? <VideocamIcon /> : <VideocamOffIcon />}
      >
        Capture photo
      </Button>
      {<img src={imgSrc ? imgSrc : ""} />}
      {MediaControlCard({
        latestImage: "Hello",
        imageShots: [{ image: "Hello" }],
      })}
    </div>
  );
};
