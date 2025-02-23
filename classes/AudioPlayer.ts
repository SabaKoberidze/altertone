import { Application, Graphics, Container, Ticker } from 'pixi.js';

export class AudioPlayer {
  private audio: HTMLAudioElement[];
  private audioContext: AudioContext[];
  private sources: MediaElementAudioSourceNode[];
  private waveforms: number[][];
  public dragging: boolean;
  private progressLine: Graphics | any;
  private waveGraphics: Graphics[];
  private progressColors: Graphics[];
  private samples: number;
  private audioUrls: string[];
  private progressColorContainers: Container[];
  private beforeProgressColors: Graphics[]; 
  private onLoaded: (index: number) => void;
  public isPlaying: boolean[]
  public isMuted: boolean;
  private ticker: any;
  

  constructor(private app: Application, onLoaded: (index: number)=> void) {
    app.stage.interactive = true;
    this.audio = [];
    this.audioContext = [];
    this.sources = [];
    this.waveforms = [];
    this.dragging = false;
    this.waveGraphics = [];
    this.progressColors = [];
    this.samples = 100;
    this.audioUrls = [];
    this.progressColorContainers = [];
    this.beforeProgressColors = [];
    this.onLoaded = onLoaded;
    this.isPlaying = [false, false, false, false]
    this.isMuted = false
    this.ticker = null
  }

  public async init(index: number) {
    this.dragging = false;
    this.waveGraphics[index] = new Graphics();
    
    if (!this.progressLine) {
        this.progressLine = new Graphics();
        this.app.stage.addChild(this.progressLine);
    }
    
    this.progressColors[index] = new Graphics();
    this.progressColorContainers[index] = new Container();    

    this.app.stage.addChild(this.progressColorContainers[index]);
    this.app.stage.addChild(this.waveGraphics[index]);

    this.beforeProgressColors[index] = new Graphics();
    this.beforeProgressColors[index].rect(0, this.app.screen.height / 4 * index, this.app.screen.width, this.app.screen.height / 4).fill('grey');
    this.progressColorContainers[index].addChild(this.beforeProgressColors[index]);
    this.progressColorContainers[index].mask = this.waveGraphics[index];
    
    this.drawMutedWaveform(index)
    this.setupDragEvents(index);
}

  public async setAudio(url: string, index: number) {
    this.audioUrls[index] = url;
    this.audio[index] = new Audio(url);
    this.audio[index].crossOrigin = "anonymous";
    this.audioContext[index] = new AudioContext();
    this.sources[index] = this.audioContext[index].createMediaElementSource(this.audio[index]);
    this.sources[index].connect(this.audioContext[index].destination);

    try {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const audioBuffer = await this.audioContext[index].decodeAudioData(data);
        this.visualizeWaveform(audioBuffer, index);
    } catch (error) {
        console.error("Audio load or decode error", error);
    }
    this.onLoaded(index);
}

  public async unlockAudio() {
    await Promise.all(
        this.audioContext.map(async (ctx, i) => {
            if (ctx.state === "suspended") {
            await ctx.resume();
            }
            this.audio[i].play();
            this.isPlaying[i] = true
        })
    ).then(()=>{
      this.startTicker()
    });
  }

  public pauseAudio(){
    this.audio.forEach((audio : HTMLAudioElement, index: number) => {
      audio.pause();
      this.isPlaying[index] = false
    });
    this.stopTicker()
  }

  private drawMutedWaveform(index: number) {
    const waveGraphic = this.waveGraphics[index];
    waveGraphic.clear();

    const barWidth = this.app.screen.width / this.samples;
    const y = (this.app.screen.height / 4 * index + this.app.screen.height / 8);

    for (let i = 0; i < this.samples; i++) {
        const x = i * barWidth;
        waveGraphic.roundRect(x, y - 0.5, 2, 1, (barWidth - 2) / 2); 
        waveGraphic.fill({ color: 0xffffff });
    }
}

  private visualizeWaveform(audioBuffer: AudioBuffer, index: number) {
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / this.samples);
    this.waveforms[index] = new Array(this.samples).fill(0).map((_, i) => {
        const blockStart = i * blockSize;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
        }
        return sum / blockSize;
    });
    this.drawWaveform(index);
    //this.app.ticker.add(() => this.updateProgressLine(index));
  }

  private drawWaveform(index: number) {
    if(this.audio[index].muted === true) return
    const waveGraphic = this.waveGraphics[index];
    waveGraphic.clear()
    const barWidth = this.app.screen.width / this.samples;
    const maxHeight = this.app.screen.height / 2;
    for (let i = 0; i < this.samples; i++) {
        let barHeight = this.waveforms[index][i] * maxHeight;
        const x = i * barWidth;
        const y = (this.app.screen.height / 4 * index + this.app.screen.height / 8) - barHeight / 2;
        if (barHeight < 1) {
          barHeight = 1;
        }
        waveGraphic.roundRect(x, y, 2, barHeight, (barWidth - 2) / 2);
        waveGraphic.fill({ color: 0xffffff });
    }
   
  }

  private updateProgressLine(index: number) {
    const progress = this.audio[index].currentTime / this.audio[index].duration;
  
    this.progressLine.clear();
    const x = progress * this.app.screen.width;
    this.progressLine.moveTo(x, 0);
    this.progressLine.lineTo(x, this.app.screen.height);
    this.progressLine.stroke({ width: 2, color: 0xffffff });
  
    if(this.isPlaying[index]){
        this.setProgressColors(index, progress)
      }

    this.progressLine.zIndex = 3
  }

  private setProgressColors(index: number, progress: number) {
      this.progressColors[index].clear();
      this.progressColors[index].rect(0, 0, progress * this.app.screen.width, this.app.screen.height);
      this.progressColors[index].fill({ color: 'white' });
      
      this.progressColorContainers[index].removeChild(this.progressColors[index]); 
      this.progressColorContainers[index].addChild(this.progressColors[index]);
  }

  private setupDragEvents(index: number) {
    this.app.stage.on("pointerdown", (event) => {
      this.startTicker()
      const clickX = event.global.x;
      const seekRatio = clickX / this.app.screen.width;
      this.audio[index].currentTime = seekRatio * this.audio[index].duration;
      this.dragging = true;
    });

    this.app.stage.on("pointermove", (event) => {
      if (this.dragging) {
        const moveX = event.global.x;
        const seekRatio = Math.max(0, Math.min(moveX / this.app.screen.width, 1));
        this.audio[index].currentTime = seekRatio * this.audio[index].duration;
      }
    });

    this.app.stage.on("pointerup", () => {
      this.stopTicker()
      this.dragging = false;
    });

  }
  private startTicker() {
    if (!this.ticker) {
      const callback = () => {
        this.audio.forEach((_, index) => {
          this.updateProgressLine(index);  
        });
      };
      this.ticker = callback;
      this.app.ticker.add(callback);
    }
  }
  
  private stopTicker() {
    if (this.ticker && !this.isPlaying[0]) {
      this.app.ticker.remove(this.ticker);
      this.ticker = null;
    }
  }
  public toggleSound(index: number) {
    if(!this.audio[index].muted){
      this.audio[index].muted = true
      this.drawMutedWaveform(index)
    }
    else{
      this.audio[index].muted = false
      this.drawWaveform(index)
    }
  }

  public toggleMute(){
    this.isMuted = !this.isMuted
    this.audio.forEach(audio =>{
        audio.muted = this.isMuted
    })
  }

  public resize() {
    //this.samples = this.app.screen.width / 10
    if (this.progressLine) {
      const progress = this.audio[0]?.currentTime / this.audio[0]?.duration || 0;
      const x = progress * this.app.screen.width;
      this.progressLine.clear();
      this.progressLine.moveTo(x, 0);
      this.progressLine.lineTo(x, this.app.screen.height);
    }
    this.waveGraphics.forEach((waveGraphic, index) => {
      if(this.audio[index].muted === true){
        this.drawMutedWaveform(index)
      } else{
        this.drawWaveform(index); 
      }
      this.beforeProgressColors[index].clear()
      this.beforeProgressColors[index].rect(0, this.app.screen.height / 4 * index, this.app.screen.width, this.app.screen.height / 4).fill('grey')
    });
  }
}
