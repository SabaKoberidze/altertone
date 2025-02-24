import { Application, Graphics, Container, Ticker } from 'pixi.js';
import gsap from 'gsap';

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
  private barObjects: Graphics[][];
  

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
    this.barObjects = []
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
    
    this.drawMutedWaveform(index, true)
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

  private drawMutedWaveform(index: number, firstDraw?: boolean) {
    const waveGraphic = this.waveGraphics[index];
    const barWidth = this.app.screen.width / this.samples;
    const y = (this.app.screen.height / 4 * index + this.app.screen.height / 8);

    if (!this.barObjects) {
        this.barObjects = [];
    }
    if (!this.barObjects[index]) {
        this.barObjects[index] = [];
    }

    for (let i = 0; i < this.samples; i++) {
        const x = i * barWidth;

        if (!this.barObjects[index][i]) {
            const bar = new Graphics();
            bar.roundRect(0, 0, 2, 1, (barWidth - 2) / 2);
            bar.fill({ color: 0xffffff });
            bar.x = x;
            bar.y = y - 0.5;

            this.barObjects[index][i] = bar;
            waveGraphic.addChild(bar);
        } else {
            const bar = this.barObjects[index][i];
            bar.x = x;
            bar.y = y - 0.5;
        }

        if (firstDraw) {
          const bar = this.barObjects[index][i];
          const waveIntensity = Math.random() * 5 + 1; 

          gsap.to(bar, {
              height: waveIntensity,
              y: bar.y - waveIntensity / 2,
              duration: 0.5,
              ease: "power2.inOut",
              repeat: -1, 
              yoyo: true,
          });
      }
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

  private drawWaveform(index: number, isResize?: boolean) {
    if (this.audio[index].muted) return;
    const duration = isResize ? 0 : 0.3;
    const barWidth = this.app.screen.width / this.samples;
    const maxHeight = this.app.screen.height / 2;

    if (!this.barObjects) {
        this.barObjects = [];
    }
    
    if (!this.barObjects[index]) {
        this.barObjects[index] = [];
    }

    for (let i = 0; i < this.samples; i++) {
        let barHeight = this.waveforms[index][i] * maxHeight;
        if (barHeight < 1) barHeight = 1;
        const x = i * barWidth;
        const y = (this.app.screen.height / 4 * index + this.app.screen.height / 8) - barHeight / 2;
        const bar = this.barObjects[index][i];
        gsap.getTweensOf(bar).forEach(tween => tween.kill());

        gsap.to(bar, {
            y: y,
            height: barHeight,
            duration: duration,
            ease: "power2.out"
        });
        }
  }
  private muteWaveform(index: number, isResize?: boolean) {
    if (!this.barObjects || !this.barObjects[index]) return;
    const duration = isResize ? 0 : 0.3;
    const y = (this.app.screen.height / 4 * index + this.app.screen.height / 8);

    for (let i = 0; i < this.samples; i++) {
        const bar = this.barObjects[index][i];
        if (!bar) continue;
        gsap.getTweensOf(bar).forEach(tween => tween.kill());
        gsap.to(bar, {
            height: 1,
            y: y - 0.5,
            duration: duration,
            ease: "power2.out",
        });
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
      this.muteWaveform(index)
    }
    else{
      this.audio[index].muted = false
      this.drawWaveform(index)
    }
  }

  public toggleMute(){
    this.isMuted = !this.isMuted
    this.audio.forEach(audio =>{
      if(this.isMuted){
        audio.volume = 0
      }else{
        audio.volume = 1
      }
    })
  }

  public resize(isLoaded: boolean) {
    if (this.progressLine) {
        const progress = this.audio[0]?.currentTime / this.audio[0]?.duration || 0;
        const x = progress * this.app.screen.width;
        this.progressLine.clear();
        this.progressLine.moveTo(x, 0);
        this.progressLine.lineTo(x, this.app.screen.height);
    }

    this.waveGraphics.forEach((waveGraphic, index) => {
        this.drawMutedWaveform(index);  
        if(isLoaded){
          if (this.audio[index]?.muted === true) {
              this.muteWaveform(index,  true)
          } else {
              this.drawWaveform(index, true); 
          }
        }

        const waveHeight = this.app.screen.height / 4;
        const yPosition = waveHeight * index;
        this.beforeProgressColors[index].clear();
        this.beforeProgressColors[index].rect(0, yPosition, this.app.screen.width, waveHeight).fill('grey');
    });
}
}
