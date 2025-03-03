import { Application, Graphics, Container, Ticker, triangulateWithHoles, TextStyle, Text, Sprite, Texture, Assets } from 'pixi.js';
import gsap from 'gsap';
interface PlayerData {
  [genre: string]: {
    [type: string]: {
      audio: HTMLAudioElement;
      audioBuffer: AudioBuffer;
      audioContext: AudioContext;
      source: MediaElementAudioSourceNode;
      objectUrl: string;
      waveform: number[];
    }
  }
}

export class AudioPlayer {
  private playerData: PlayerData = {};
  private audio: HTMLAudioElement[];
  private audioContext: AudioContext[];
  private sources: MediaElementAudioSourceNode[];
  private audioBuffer: AudioBuffer[] = [];
  private waveforms: number[][];
  public dragging: boolean;
  private progressLine: Graphics | any;
  private waveGraphics: Graphics[];
  private progressColors: Graphics[];
  private samples: number;
  private audioUrls: string[];
  private progressColorContainers: Container[];
  private beforeProgressColors: Graphics[]; 
  private onLoaded: (isLoaded: boolean) => void;
  public isMuted: boolean;
  private ticker: any;
  private barObjects: Graphics[][];
  private loaded: boolean[]
  private progress: number;
  public audioPlayerState: {playing: boolean, paused: boolean, loading: boolean}
  private firstLoad: boolean
  private offsetY: number
  private timeContainer: Container;
  private padding: number;
  private timePointer: Sprite | null = null
  private startTime: Text | null = null
  private endTime: Text | null = null
  private currentTime: Text | null = null
  private activeGenre: string = '';
  private activeTypes: string[] = [];
  private fetchingGenre: string[] = []

constructor(private app: Application, onLoaded: (isLoaded: boolean)=> void) {
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
  this.loaded =  [false, false, false, false]
  this.isMuted = false
  this.ticker = null
  this.barObjects = []
  this.progress = 0
  this.audioPlayerState = {playing: false, paused: false, loading: true}
  this.firstLoad = false
  this.setupDragEvents()
  this.offsetY = 56
  this.padding = 56
  this.timeContainer = new Container()
}
public async loadAssets(){
  await Assets.load('images/audioPlayer/timePointer.svg');
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
    this.progressColorContainers[index].x = this.padding

    this.app.stage.addChild(this.progressColorContainers[index]);
    this.app.stage.addChild(this.waveGraphics[index]);

    this.beforeProgressColors[index] = new Graphics();
    this.beforeProgressColors[index].rect(0, (this.app.screen.height - this.offsetY) / 4 * index + this.offsetY, this.app.screen.width, (this.app.screen.height - this.offsetY) / 4).fill('grey');
    this.progressColorContainers[index].addChild(this.beforeProgressColors[index])
    this.progressColorContainers[index].mask = this.waveGraphics[index];
    
    this.drawMutedWaveform(index, true)
}

public async setAudio(genre: string, type: string, index: number) {
  if(index === 0 && this.audioPlayerState.playing){
    this.audio.forEach((audio, index) => {
      audio.pause()
      audio.currentTime = 0
    })
  }
  this.setProgressColors(index, 0);
  try {
    this.audioLoaded(index, false, genre);
    this.setAudioPlayerState({playing: false, loading: true, paused: false});
    this.activeGenre = genre;
    this.activeTypes[index] = type;
    if (this.playerData[genre]?.[type]) {
      const cachedData = this.playerData[genre][type];
    
      this.audio[index] = cachedData.audio;
      this.audioContext[index] = cachedData.audioContext;
      this.sources[index] = cachedData.source;
      this.audioBuffer[index] = cachedData.audioBuffer;
      this.audioUrls[index] = cachedData.objectUrl;
      this.waveforms[index] = cachedData.waveform;
    
      this.setAudioPlayerState({ playing: false, loading: false, paused: true });
      this.audioLoaded(index, true, genre);
    
      // Mark this index as loaded
      this.loaded[index] = true;
    
      // Only after all are loaded, proceed with drawing and visualizations
      if (this.loaded.every(Boolean)) {
        this.firstLoad = true;
        this.onLoaded(true);
        this.audio[index].currentTime = 0
        this.drawTimeIndicators();   
        this.updateProgressLine()
        this.setProgressColors(index, 0);
    
        this.loaded.forEach((_, i) => {
          this.visualizeWaveform(this.audioBuffer[i], i);
          this.drawWaveform(i);
        });
      }
    
      // Handle audio end event
      this.audio[index].addEventListener("ended", () => {
        this.setAudioPlayerState({ playing: false, loading: false, paused: true });
      });
      console.log(this.playerData)
      return;
    }else{
      if(index === 0 && this.activeGenre === genre){
        this.loaded = [false, false, false, false];
        this.firstLoad = false;
        this.onLoaded(false)
        this.loaded.forEach((_, index)=>{
          this.drawMutedWaveform(index)  
        })    
      }
    }
    //this is for blocking multiple requests on same audio fetching
    this.audioLoaded(index, false, genre);
    if(this.fetchingGenre.includes(genre)){
      return
    } else if(index === this.loaded.length - 1){
      this.fetchingGenre.push(genre)
    }
    const response:any = await $fetch('/api/download', {
      method: 'POST',
      params: {
        genre: genre,
        fileType: type
      },
      body: {
        path: "/music"
      },
      responseType: 'blob'
    });

    const objectUrl = URL.createObjectURL(response);
    //this is for creating object url for the audio

    let audio = new Audio(objectUrl);
    let audioContext = new AudioContext();
    let source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);

    let decodedBuffer: AudioBuffer | null = null;
    try {
      const arrayBuffer = await response.arrayBuffer();
      decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("Audio visualization error", error);
    }
  
    if (!this.playerData[genre]) {
      this.playerData[genre] = {};
    }
    
    if (decodedBuffer) {
      const rawData = decodedBuffer.getChannelData(0);
      const blockSize = Math.floor(rawData.length / this.samples);
      const waveformData = new Array(this.samples).fill(0).map((_, i) => {
        const blockStart = i * blockSize;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        return sum / blockSize;
      });
      
      this.waveforms[index] = waveformData;
      
      this.playerData[genre][type] = {
        audio: audio,
        audioBuffer: decodedBuffer,
        audioContext: audioContext,
        source: source,
        objectUrl: objectUrl,
        waveform: waveformData
      };
    }
    if(genre !== this.activeGenre){
      return
    }else{
      this.setAudio(genre, type, index)
    }
  } catch (error) {
    console.error("Audio load error", error);
    this.setAudioPlayerState({playing: false, loading: false, paused: true});
    this.audioLoaded(index, false, genre);
  }
 
}

public cleanup() {
  this.audioUrls.forEach(url => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
}

  private drawTimeIndicators() {
    if(this.timeContainer.children.length > 0){
      this.updateTimeIndicators();
      return
    }
    this.timeContainer.removeChildren();
    this.timeContainer.height = this.offsetY;
    
    const textStyle = new TextStyle({
        fontFamily: 'SF Georgian',
        fontSize: 16,
        fill: 0x666666,
        align: 'center',
        dropShadow: {
            alpha: 0.5,
            angle: Math.PI / 6,
            blur: 2,
            color: 'black',
            distance: 2
        }
    });

    const currentStyle = new TextStyle({
      fontFamily: 'SF Georgian',
      fontSize: 16,
      fill: 0xffffff,
      align: 'center',
      dropShadow: {
          alpha: 0.5,
          angle: Math.PI / 6,
          blur: 2,
          color: 'black',
          distance: 2
      }
  });

    const duration = this.audio[0]?.duration || 0;
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    };
      
    if (!this.startTime) {
        this.startTime = new Text({
            text: '0:00',
            style: textStyle
        });
    }
    
    if (!this.currentTime) {
        this.currentTime = new Text({
            text: '0:00',
            style: currentStyle
        });
    }
    
    if (!this.endTime) {
        this.endTime = new Text({
            text: formatTime(duration),
            style: textStyle
        });
    }

    if(!this.timePointer) {
        let PointerTexture = Texture.from('images/audioPlayer/timePointer.svg')
        this.timePointer = new Sprite(PointerTexture)
        this.timePointer.anchor.set(0.5, 0)
    }

    this.timeContainer.addChild(this.startTime, this.currentTime, this.endTime, this.timePointer);
    
    if (!this.app.stage.children.includes(this.timeContainer)) {
        this.app.stage.addChild(this.timeContainer);
    }
    
    this.positionTimeIndicators();
}

  private positionTimeIndicators() {
    if (!this.startTime || !this.currentTime || !this.endTime) return;


    this.startTime.x = this.padding;
    this.startTime.y = this.offsetY / 2;
    this.startTime.anchor.set(0, 0.5);

    this.currentTime.x = this.app.screen.width / 2;
    this.currentTime.y = this.offsetY * 3 / 5;
    this.currentTime.anchor.set(0.5, 0.5);

    this.endTime.x = this.app.screen.width - this.padding;
    this.endTime.y = this.offsetY / 2;
    this.endTime.anchor.set(1, 0.5);

}

private updateTimeIndicators(){
  const endTime = this.audio[0].duration;
    const minutes = Math.floor(endTime / 60); 
    const seconds = Math.floor(endTime % 60); 
    if (this.currentTime && this.endTime) {
      this.endTime.text = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
}

  private audioLoaded(index:number, isLoaded: boolean, genre: string){ 
    if(genre !== this.activeGenre) return
    this.loaded[index] = isLoaded
    if(this.loaded.every(elem => elem === true)){
      this.onLoaded(true);
    }else{
      this.onLoaded(false);
    }
  }

  public setAudioPlayerState(newState: {playing: boolean, loading: boolean, paused: boolean}){
    this.audioPlayerState = newState
  }

  private async unlockAudioContext() {
    await Promise.all(
      this.audioContext.map(async (ctx) => {
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
      })
    );
  }

  public async playAudio() {
    await this.unlockAudioContext();   
    this.audio.forEach((audio, i) => {
      audio.play().catch((er)=>{
        console.log(er)
      });
    });
    this.startTicker();
    this.setAudioPlayerState({playing: true, loading: false, paused: false})
  }

  public pauseAudio(isLoading?: boolean){
    if(!isLoading){
      this.setAudioPlayerState({playing: false, loading: false, paused: true})
    }
    this.audio.forEach((audio : HTMLAudioElement, index: number) => {
      audio.pause();
    });
    this.stopTicker()
  }

  private drawMutedWaveform(index: number, firstDraw?: boolean) {
    const waveGraphic = this.waveGraphics[index];
    const barWidth = (this.app.screen.width - this.padding * 2) / this.samples ;
    const startX = (barWidth - 2) / 2
    const y = ((this.app.screen.height - this.offsetY) / 4 * index + (this.app.screen.height - this.offsetY) / 8) + this.offsetY;
    if (!this.barObjects) {
        this.barObjects = [];
    }
    if (!this.barObjects[index]) {
        this.barObjects[index] = [];
    }

    for (let i = 0; i < this.samples; i++) {
        const x = startX + i * barWidth + this.padding;

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

        const bar = this.barObjects[index][i];
        const waveIntensity = Math.random() * 5 + 5;
        const newY = y - waveIntensity / 2;

        if(firstDraw) {
            gsap.to(bar, {
                height: waveIntensity,
                y: newY,
                duration: 0.5,
                ease: "power2.inOut",
                repeat: -1,
                yoyo: true,
            });
        }else if (!this.firstLoad) {
          gsap.killTweensOf(bar)
          bar.height = 1
          gsap.to(bar, {
              height: waveIntensity,
              y: newY,
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
  }

  private drawWaveform(index: number, isResize?: boolean) {
    if (this.audio[index].muted) return;
    const duration = isResize ? 0 : 0.3;
    const barWidth = this.app.screen.width / this.samples;
    const maxHeight = (this.app.screen.height - this.offsetY) / 2;

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
        const y = ((this.app.screen.height - this.offsetY) / 4 * index + (this.app.screen.height - this.offsetY) / 8) - barHeight / 2 + this.offsetY;
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
    const y = ((this.app.screen.height - this.offsetY) / 4 * index + (this.app.screen.height - this.offsetY) / 8) + this.offsetY;

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

  private updateProgressLine() {
    const progress = this.audio[0].currentTime / this.audio[0].duration;
    this.progressLine.clear();
    const availableWidth = this.app.screen.width - (this.padding * 2);
    const x = this.padding + (progress * availableWidth); 
    this.progressLine.moveTo(x, this.offsetY);
    this.progressLine.lineTo(x, (this.app.screen.height - this.offsetY / 2));
    this.progressLine.stroke({ width: 2, color: 0xffffff });

    const currentTimeInSeconds = this.audio[0].currentTime;
    const minutes = Math.floor(currentTimeInSeconds / 60); 
    const seconds = Math.floor(currentTimeInSeconds % 60); 
    if (this.currentTime) {
        this.currentTime.text = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        this.currentTime.x = x;
    }
    if (this.timePointer) {
        this.timePointer.x = x;
        this.timePointer.y = this.offsetY;
    }
    
    
    if(this.audioPlayerState.playing){
        this.audio.forEach((_, index)=>{
            this.setProgressColors(index, progress);
        });
    }
    this.progressLine.zIndex = 3;
}

  private setProgressColors(index: number, progress: number) {
      this.progressColors[index].clear();
      this.progressColors[index].rect(0, 0, progress * (this.app.screen.width - this.padding* 2), (this.app.screen.height - this.offsetY));
      this.progressColors[index].fill({ color: 'white' });
      
      this.progressColorContainers[index].removeChild(this.progressColors[index]); 
      this.progressColorContainers[index].addChild(this.progressColors[index]);
  }

  private async seekToTime(seekRatio: number) {
    this.onLoaded(false)
    this.pauseAudio(true);
    this.setAudioPlayerState({playing: this.audioPlayerState.playing, loading: true, paused: false})
    const targetTime = seekRatio * this.audio[0].duration; 
    this.audio.forEach((audio) => {
      audio.currentTime = targetTime;
    });
    this.updateProgressLine();
    await Promise.all(
      this.audio.map((audio, index) =>
        new Promise((resolve) => {
          if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            resolve(true); 
          } else {
            audio.addEventListener("canplay", () => resolve(true), { once: true });
          }
        }).then(() => this.audioLoaded(index, true, this.activeGenre))
      )
    );
    if (this.audioPlayerState.playing) {
      await this.playAudio();
      this.setAudioPlayerState({playing: this.audioPlayerState.playing, loading: true, paused: false})
    } 
  }

  private setupDragEvents() {
    this.app.stage.on("pointerdown", (event) => {
      if (!this.firstLoad) return;
      this.dragging = true;

      const clickX = event.global.x - this.padding;
      
      let seekRatio = Math.max(0, Math.min(clickX / (this.app.screen.width - this.padding * 2), 1));
      this.seekToTime(seekRatio);
    });
  
    this.app.stage.on("pointermove", (event) => {
      if (this.dragging) {
        const moveX = event.global.x - this.padding;
        
        const seekRatio = Math.max(0, Math.min(moveX / (this.app.screen.width - this.padding * 2), 1));
        
        this.updateProgressLine();
        this.seekToTime(seekRatio);
      }
    });
  
  
    this.app.stage.on("pointerup", () => {
      this.dragging = false;
    });

    this.app.stage.on("pointerupoutside", () => {
      this.dragging = false;
    });
  }

  private startTicker() {
    if (!this.ticker) {
      const callback = () => {
        this.audio.forEach((_, index) => {
          this.updateProgressLine();  
        });
      };
      this.ticker = callback;
      this.app.ticker.add(callback);
    }
  }
  
  private stopTicker() {
    if (this.ticker && !this.audioPlayerState.playing) {
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
        const x = this.padding + progress * this.app.screen.width;
        this.progressLine.clear();
        this.progressLine.moveTo(x, 0);
        this.progressLine.lineTo(x, (this.app.screen.height - this.offsetY));
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
      const waveHeight = (this.app.screen.height - this.offsetY) / 4;
      const yPosition = waveHeight * index;
      this.progressColorContainers[index].y = this.offsetY
      this.progressColorContainers[index].x = this.padding
      this.beforeProgressColors[index].clear();
      this.beforeProgressColors[index].rect(0, yPosition, this.app.screen.width, waveHeight).fill('grey');
    });
    this.positionTimeIndicators()
    this.updateProgressLine()
}
}

