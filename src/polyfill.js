// src/polyfill.js
import { Buffer } from 'buffer';

window.Buffer = Buffer;
global.Buffer = Buffer;
