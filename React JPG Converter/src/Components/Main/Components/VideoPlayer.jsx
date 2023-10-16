import Animation from "./animation.mp4"
import Icon from "./icon.png"

function VideoPlayer() {
    return (
      <video
        width="256"
        height="256"
        preload="none"
        style={{
          background: `transparent url(${Icon}) 50% 50% / cover no-repeat`,
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={Animation} type="video/mp4" />
      </video>
    );
  }
  
  export default VideoPlayer;
  