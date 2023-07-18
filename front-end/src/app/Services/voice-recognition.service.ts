import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords!: string;

  constructor() { }

  init() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results) // e.results is a list of all the words that have been recognized
        .map((result: any) => result[0]) // result[0] is the first alternative of the most recent SpeechRecognitionResult
        .map((result: any) => result.transcript) // result.transcript is the recognized word
        .join(''); // join all the words into a single string
      this.tempWords = transcript; // set tempWords to the string of all the words
      console.log("tempwords : ", transcript);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
    this.tempWords = '';
  }

  wordConcat() {
    // if undefined, set to empty string
    if (this.text === undefined || this.tempWords === undefined) {
      this.text = '';
    } else {
      this.text = this.text + ' ' + this.tempWords;
      this.tempWords = '';
    }
    
  }
}
