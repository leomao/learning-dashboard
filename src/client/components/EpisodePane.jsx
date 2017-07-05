import React from 'react';
import Canvid from 'canvid';

class EpisodePane extends React.Component {
  componentDidMount() {
    this.createVideo();
  }

  componentDidUpdate() {
    if (this.canvid && this.canvid.destroy) {
      this.canvid.destroy();
    }
    this.createVideo();
  }

  createVideo() {
    let { episode, steps, width, height } = this.props.data;
    this.canvid = Canvid({
      selector: this.container,
      videos: {
        clip: {
          src: 'data:image/png;base64,' + episode,
          frames: steps,
          cols: 100,
        }
      },
      width: width,
      height: height,
      loaded: () => {
        this.canvid.play('clip', false)
      }
    });
  }

  toggleVideo = () => {
    if (this.canvid.isPlaying())
      this.canvid.pause();
    else
      this.canvid.resume();
  }

  render() {
    return (
      <div className='pane episode'>
        <div ref={(node) => { this.container = node; }} />
        <div className='video-btns'>
          <button onClick={() => this.toggleVideo() }>pause/resume</button>
        </div>
      </div>
    )
  }
}

export default EpisodePane;
