import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <TwentyfiveClock />
    </div>
  );
}

// ACCURATE TIMER FUNCTION // 
let intervalObj = null;
const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};

class TwentyfiveClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionDisplay: "Session",
      breakTime: 5,
      sessionTime: 25,
      clockState: "",
      timeLeft: 25 * 60,
      //intervalObj: null,
      timeLeftDisplay: "25:00"
    };
  }


  stopClicked = () => {
    this.timer("stopped");
    this.setState({ clockState: "stopped" });
  }


  playpauseClicked = () => {
    const isChanged = this.state.clockState === "play" ? "pause" : "play";
    //console.log(isChanged);
    this.timer(isChanged);
    this.setState({ clockState: isChanged });
    //console.log(this.state.clockState);
  };

  cleanMinutes = () => {
    this.setState({
      sessionTime: 25,
      breakTime: 5,
      timeLeft: 25 * 60,
      timeLeftDisplay: "25:00",
      sessionDisplay: "Session"
    });
  }

  playSound = () => {
    //console.log('PlaySound');
    const sound = document.getElementById("beep");
    sound.currentTime = 0;
    sound.play();
  }

  stopSound = () => {
    //console.log('PlaySound');
    const sound = document.getElementById("beep");
    sound.pause();
    sound.currentTime = 0;
    
  }


  timer = (clock_state) => {
    //console.log('timer ' + clock_state);
    if (clock_state == "") return;
    if (clock_state == "stopped") {
      //console.log('stopped');
      this.cleanMinutes();
      this.stopSound();
      if (intervalObj !== null) {
        intervalObj.cancel();
        //this.setState({ intervalObj: null });
        intervalObj = null;
      }
      return;
    }
    if (clock_state == "play") {
      //console.log('play');
      if (intervalObj === null) {
        intervalObj = accurateInterval(() => {
          //console.log('AccurateInterval');
          let time_left = this.state.timeLeft - 1;
          if (time_left < 0) {
            const nextDisplay = this.state.sessionDisplay === "Session" ? "Break" : "Session";
            const nextSecond = (nextDisplay === "Session" ? this.state.sessionTime : this.state.breakTime) * 60;

            this.setState({
              sessionDisplay: nextDisplay,
              timeLeft: nextSecond,
              timeLeftDisplay: this.formatTime(nextSecond)
            });

            this.playSound();

          } else {

            this.setState({
              timeLeft: time_left,
              timeLeftDisplay: this.formatTime(time_left)
            });

          }
        }, 1000);

        //this.setState({ intervalObj: id });
      }
      return;
    }
    if (clock_state == "pause") {
      //console.log('pause');
      if (intervalObj !== null) {
        intervalObj.cancel();
        //this.setState({ intervalObj: null });
        intervalObj = null;
      }
    }
  }

  incrementBreak = () => {
    if (this.state.clockState === "play" || this.state.breakTime == 60) return;

    this.setState((state, props) => ({ breakTime: state.breakTime + 1 }), () => console.log('IncrementBreak ' + this.state.breakTime));

  }

  decrementBreak = () => {
    if (this.state.clockState === "play" || this.state.breakTime == 1) return;

    this.setState((state, props) => ({ breakTime: state.breakTime - 1 }), () => console.log('DecrementBreak ' + this.state.breakTime));
  }


  incrementSession = () => {
    console.log(this.state.clockState + ' ' + this.state.sessionTime);
    if (this.state.clockState === "play" || this.state.sessionTime == 60) return;

    let session_time = this.state.sessionTime + 1;
    let time_left = session_time * 60;

    this.setState({

      sessionTime: session_time,
      timeLeft: time_left,
      timeLeftDisplay: this.formatTime(time_left)

    });

    console.log('incremenet time_left_display=' + this.state.timeLeftDisplay + ', time_left=' + this.state.timeLeft + ', SessionTime=' + this.state.sessionTime);
  }

  decrementSession = () => {
    console.log(this.state.clockState + ' ' + this.state.sessionTime);
    if (this.state.clockState === "play" || this.state.sessionTime == 1) return;

    let session_time = this.state.sessionTime - 1;
    let time_left = session_time * 60;

    this.setState({

      sessionTime: session_time,
      timeLeft: time_left,
      timeLeftDisplay: this.formatTime(time_left)

    });

    console.log('decrement time_left_display=' + this.state.timeLeftDisplay + ', time_left=' + this.state.timeLeft + ', SessionTime=' + this.state.sessionTime);
  }


  formatTime = (value) => {
    //console.log('FormatTime ' + value);
    let minutes = Math.floor(value / 60);
    let seconds = value % 60;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
  }

  render() {
    return (
      <section className='page-container'>
        <div className='clock-container'>
          <div className='settings-container'>
            <div className='items-display'>
              <h4 className='sub-title' id="break-label">Break Length</h4>
              <div className='keys-container'>
                <div className="fa-solid fa-plus my-key" id="break-increment" onClick={() => this.incrementBreak()}>
                </div>
                <div className="display-break my-display" id="break-length">
                  {this.state.breakTime}
                </div>
                <div className="fa-solid fa-minus my-key" id="break-decrement" onClick={() => this.decrementBreak()}>
                </div>
              </div>
            </div>
            <div className='items-display'>
              <h4 className='sub-title' id="session-label">Session Length</h4>
              <div className='keys-container'>
                <div className="fa-solid fa-plus my-key" id="session-increment" onClick={() => this.incrementSession()}>
                </div>
                <div className="display-session my-display" id="session-length">
                  {this.state.sessionTime}
                </div>
                <div className="fa-solid fa-minus my-key" id="session-decrement" onClick={() => this.decrementSession()}>
                </div>
              </div>
            </div>
          </div>
          <h4 className="sub-title sub-height size-of-font" id="timer-label">{this.state.sessionDisplay}</h4>
          <div className='timer-session-container'>
            <h2>
              <div className="timer-session" id="time-left">
                {this.state.timeLeftDisplay}
              </div>
            </h2>
          </div>
          <div className='keys-container'>
            <div className="fa-solid fa-play my-key" id="start_stop" onClick={() => this.playpauseClicked()}>
            </div>
            <div className="fa-solid fa-stop my-key" id="reset" onClick={() => this.stopClicked()}>
            </div>
          </div>
          <audio id="beep" src="https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/Electro%20and%20Synthetic/192[kb]clock_radio_alarm.wav.mp3">Your browser does not support the audio element.</audio>
        </div>
      </section>
    );
  }
}

export default App;
