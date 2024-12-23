"use strict";(self.webpackChunkaudioshop=self.webpackChunkaudioshop||[]).push([[272],{272:(e,t,a)=>{a.r(t),a.d(t,{MP4Parser:()=>W});var s=a(833),n=a(17),i=a(604),r=a(191),o=a(31),c=a(324);const h=s("music-metadata:parser:MP4:atom");class l extends((0,c.fO)("MP4")){}const d={len:8,get:(e,t)=>{const a=n.UINT32_BE.get(e,t);if(a<0)throw new l("Invalid atom header length");return{length:BigInt(a),name:new n.StringType(4,"latin1").get(e,t+4)}},put:(e,t,a)=>(n.UINT32_BE.put(e,t,Number(a.length)),o.e.put(e,t+4,a.name))},m=n.UINT64_BE,g={len:4,get:(e,t)=>({type:new n.StringType(4,"ascii").get(e,t)})};class u{constructor(e,t,a){if(this.len=e,e<t)throw new l(`Atom ${a} expected to be ${t}, but specifies ${e} bytes long.`);e>t&&h(`Warning: atom ${a} expected to be ${t}, but was actually ${e} bytes long.`)}}const p=(e,t)=>{const a=n.UINT32_BE.get(e,t)-2082844800;return new Date(1e3*a)};class T extends u{constructor(e){super(e,24,"mdhd"),this.len=e}get(e,t){return{version:n.UINT8.get(e,t+0),flags:n.UINT24_BE.get(e,t+1),creationTime:p(e,t+4),modificationTime:p(e,t+8),timeScale:n.UINT32_BE.get(e,t+12),duration:n.UINT32_BE.get(e,t+16),language:n.UINT16_BE.get(e,t+20),quality:n.UINT16_BE.get(e,t+22)}}}class f extends u{constructor(e){super(e,100,"mvhd"),this.len=e}get(e,t){return{version:n.UINT8.get(e,t),flags:n.UINT24_BE.get(e,t+1),creationTime:p(e,t+4),modificationTime:p(e,t+8),timeScale:n.UINT32_BE.get(e,t+12),duration:n.UINT32_BE.get(e,t+16),preferredRate:n.UINT32_BE.get(e,t+20),preferredVolume:n.UINT16_BE.get(e,t+24),previewTime:n.UINT32_BE.get(e,t+72),previewDuration:n.UINT32_BE.get(e,t+76),posterTime:n.UINT32_BE.get(e,t+80),selectionTime:n.UINT32_BE.get(e,t+84),selectionDuration:n.UINT32_BE.get(e,t+88),currentTime:n.UINT32_BE.get(e,t+92),nextTrackID:n.UINT32_BE.get(e,t+96)}}}class k{constructor(e){this.len=e}get(e,t){return{type:{set:n.UINT8.get(e,t+0),type:n.UINT24_BE.get(e,t+1)},locale:n.UINT24_BE.get(e,t+4),value:new n.Uint8ArrayType(this.len-8).get(e,t+8)}}}class w{constructor(e){this.len=e}get(e,t){return{version:n.UINT8.get(e,t),flags:n.UINT24_BE.get(e,t+1),name:new n.StringType(this.len-4,"utf-8").get(e,t+4)}}}class I{constructor(e){this.len=e}get(e,t){return{version:n.UINT8.get(e,t),flags:n.UINT24_BE.get(e,t+1),creationTime:p(e,t+4),modificationTime:p(e,t+8),trackId:n.UINT32_BE.get(e,t+12),duration:n.UINT32_BE.get(e,t+20),layer:n.UINT16_BE.get(e,t+24),alternateGroup:n.UINT16_BE.get(e,t+26),volume:n.UINT16_BE.get(e,t+28)}}}class y{constructor(e){this.len=e}get(e,t){return{dataFormat:o.e.get(e,t),dataReferenceIndex:n.UINT16_BE.get(e,t+10),description:new n.Uint8ArrayType(this.len-12).get(e,t+12)}}}class E{constructor(e){this.len=e}get(e,t){const a=((e,t)=>({version:n.UINT8.get(e,t),flags:n.UINT24_BE.get(e,t+1),numberOfEntries:n.UINT32_BE.get(e,t+4)}))(e,t);t+=8;const s=[];for(let i=0;i<a.numberOfEntries;++i){const a=n.UINT32_BE.get(e,t);t+=n.UINT32_BE.len,s.push(new y(a).get(e,t)),t+=a}return{header:a,table:s}}}const N=8,B=(e,t)=>({version:n.INT16_BE.get(e,t),revision:n.INT16_BE.get(e,t+2),vendor:n.INT32_BE.get(e,t+4)}),_=(e,t)=>({numAudioChannels:n.INT16_BE.get(e,t+0),sampleSize:n.INT16_BE.get(e,t+2),compressionId:n.INT16_BE.get(e,t+4),packetSize:n.INT16_BE.get(e,t+6),sampleRate:n.UINT16_BE.get(e,t+8)+n.UINT16_BE.get(e,t+10)/1e4});class b{constructor(e,t){this.len=e,this.token=t}get(e,t){const a=n.INT32_BE.get(e,t+4);return{version:n.INT8.get(e,t+0),flags:n.INT24_BE.get(e,t+1),numberOfEntries:a,entries:P(e,this.token,t+8,this.len-8,a)}}}const U={len:8,get:(e,t)=>({count:n.INT32_BE.get(e,t+0),duration:n.INT32_BE.get(e,t+4)})};class S extends b{constructor(e){super(e,U),this.len=e}}const z={len:12,get:(e,t)=>({firstChunk:n.INT32_BE.get(e,t),samplesPerChunk:n.INT32_BE.get(e,t+4),sampleDescriptionId:n.INT32_BE.get(e,t+8)})};class $ extends b{constructor(e){super(e,z),this.len=e}}class C{constructor(e){this.len=e}get(e,t){const a=n.INT32_BE.get(e,t+8);return{version:n.INT8.get(e,t),flags:n.INT24_BE.get(e,t+1),sampleSize:n.INT32_BE.get(e,t+4),numberOfEntries:a,entries:P(e,n.INT32_BE,t+12,this.len-12,a)}}}class v extends b{constructor(e){super(e,n.INT32_BE),this.len=e}}class A{constructor(e){this.len=e}get(e,t){const a=n.INT16_BE.get(e,t+0);return new n.StringType(a,"utf-8").get(e,t+2)}}function P(e,t,a,s,n){if(h(`remainingLen=${s}, numberOfEntries=${n} * token-len=${t.len}`),0===s)return[];if(s!==n*t.len)throw new l("mismatch number-of-entries with remaining atom-length");const i=[];for(let s=0;s<n;++s)i.push(t.get(e,a)),a+=t.len;return i}const D=s("music-metadata:parser:MP4:Atom");class x{static async readAtom(e,t,a,s){const n=e.position;D(`Reading next token on offset=${n}...`);const i=await e.readToken(d),r=1n===i.length;r&&(i.length=await e.readToken(m));const o=new x(i,r,a),c=o.getPayloadLength(s);return D(`parse atom name=${o.atomPath}, extended=${o.extended}, offset=${n}, len=${o.header.length}`),await o.readData(e,t,c),o}constructor(e,t,a){this.header=e,this.extended=t,this.parent=a,this.children=[],this.atomPath=(this.parent?`${this.parent.atomPath}.`:"")+this.header.name}getHeaderLength(){return this.extended?16:8}getPayloadLength(e){return(0n===this.header.length?e:Number(this.header.length))-this.getHeaderLength()}async readAtoms(e,t,a){for(;a>0;){const s=await x.readAtom(e,t,this,a);this.children.push(s),a-=0n===s.header.length?a:Number(s.header.length)}}async readData(e,t,a){switch(this.header.name){case"moov":case"udta":case"trak":case"mdia":case"minf":case"stbl":case"<id>":case"ilst":case"tref":return this.readAtoms(e,t,this.getPayloadLength(a));case"meta":{const s="hdlr"===(await e.peekToken(d)).name?0:4;return await e.ignore(s),this.readAtoms(e,t,this.getPayloadLength(a)-s)}default:return t(this,a)}}}var O=a(255),F=a(523);const L=s("music-metadata:parser:MP4"),M={raw:{lossy:!1,format:"raw"},MAC3:{lossy:!0,format:"MACE 3:1"},MAC6:{lossy:!0,format:"MACE 6:1"},ima4:{lossy:!0,format:"IMA 4:1"},ulaw:{lossy:!0,format:"uLaw 2:1"},alaw:{lossy:!0,format:"uLaw 2:1"},Qclp:{lossy:!0,format:"QUALCOMM PureVoice"},".mp3":{lossy:!0,format:"MPEG-1 layer 3"},alac:{lossy:!1,format:"ALAC"},"ac-3":{lossy:!0,format:"AC-3"},mp4a:{lossy:!0,format:"MPEG-4/AAC"},mp4s:{lossy:!0,format:"MP4S"},c608:{lossy:!0,format:"CEA-608"},c708:{lossy:!0,format:"CEA-708"}};function R(e,t,a){return a.indexOf(e)===t}class W extends i.s{constructor(){super(...arguments),this.tracks=[],this.atomParsers={mvhd:async e=>{const t=await this.tokenizer.readToken(new f(e));this.metadata.setFormat("creationTime",t.creationTime),this.metadata.setFormat("modificationTime",t.modificationTime)},mdhd:async e=>{const t=await this.tokenizer.readToken(new T(e)),a=this.getTrackDescription();a.creationTime=t.creationTime,a.modificationTime=t.modificationTime,a.timeScale=t.timeScale,a.duration=t.duration},chap:async e=>{const t=this.getTrackDescription(),a=[];for(;e>=n.UINT32_BE.len;)a.push(await this.tokenizer.readNumber(n.UINT32_BE)),e-=n.UINT32_BE.len;t.chapterList=a},tkhd:async e=>{const t=await this.tokenizer.readToken(new I(e));this.tracks.push(t)},mdat:async e=>{if(this.audioLengthInBytes=e,this.calculateBitRate(),this.options.includeChapters){const t=this.tracks.filter((e=>e.chapterList));if(1===t.length){const a=t[0].chapterList,s=this.tracks.filter((e=>-1!==a.indexOf(e.trackId)));if(1===s.length)return this.parseChapterTrack(s[0],t[0],e)}}await this.tokenizer.ignore(e)},ftyp:async e=>{const t=[];for(;e>0;){const a=await this.tokenizer.readToken(g);e-=g.len;const s=a.type.replace(/\W/g,"");s.length>0&&t.push(s)}L(`ftyp: ${t.join("/")}`);const a=t.filter(R).join("/");this.metadata.setFormat("container",a)},stsd:async e=>{const t=await this.tokenizer.readToken(new E(e));this.getTrackDescription().soundSampleDescription=t.table.map((e=>this.parseSoundSampleDescription(e)))},stsc:async e=>{const t=await this.tokenizer.readToken(new $(e));this.getTrackDescription().sampleToChunkTable=t.entries},stts:async e=>{const t=await this.tokenizer.readToken(new S(e));this.getTrackDescription().timeToSampleTable=t.entries},stsz:async e=>{const t=await this.tokenizer.readToken(new C(e)),a=this.getTrackDescription();a.sampleSize=t.sampleSize,a.sampleSizeTable=t.entries},stco:async e=>{const t=await this.tokenizer.readToken(new v(e));this.getTrackDescription().chunkOffsetTable=t.entries},date:async e=>{const t=await this.tokenizer.readToken(new n.StringType(e,"utf-8"));await this.addTag("date",t)}}}static read_BE_Integer(e,t){const a=(t?"INT":"UINT")+8*e.length+(e.length>1?"_BE":""),s=n[a];if(!s)throw new l(`Token for integer type not found: "${a}"`);return Number(s.get(e,0))}async parse(){this.tracks=[];let e=this.tokenizer.fileInfo.size||0;for(;!this.tokenizer.fileInfo.size||e>0;){try{if("\0\0\0\0"===(await this.tokenizer.peekToken(d)).name){const e=`Error at offset=${this.tokenizer.position}: box.id=0`;L(e),this.addWarning(e);break}}catch(e){if(!(e instanceof Error))throw e;{const t=`Error at offset=${this.tokenizer.position}: ${e.message}`;L(t),this.addWarning(t)}break}const t=await x.readAtom(this.tokenizer,((e,t)=>this.handleAtom(e,t)),null,e);e-=t.header.length===BigInt(0)?e:Number(t.header.length)}const t=[];this.tracks.forEach((e=>{const a=[];e.soundSampleDescription.forEach((e=>{const t={},s=M[e.dataFormat];if(s?(a.push(s.format),t.codecName=s.format):t.codecName=`<${e.dataFormat}>`,e.description){const{description:a}=e;a.sampleRate>0&&(t.type=O.S.audio,t.audio={samplingFrequency:a.sampleRate,bitDepth:a.sampleSize,channels:a.numAudioChannels})}this.metadata.addStreamInfo(t)})),a.length>=1&&t.push(a.join("/"))})),t.length>0&&this.metadata.setFormat("codec",t.filter(R).join("+"));const a=this.tracks.filter((e=>e.soundSampleDescription.length>=1&&e.soundSampleDescription[0].description&&e.soundSampleDescription[0].description.numAudioChannels>0));if(a.length>=1){const e=a[0];if(e.timeScale>0){const t=e.duration/e.timeScale;this.metadata.setFormat("duration",t)}const t=e.soundSampleDescription[0];if(t.description&&(this.metadata.setFormat("sampleRate",t.description.sampleRate),this.metadata.setFormat("bitsPerSample",t.description.sampleSize),this.metadata.setFormat("numberOfChannels",t.description.numAudioChannels),0===e.timeScale&&e.timeToSampleTable.length>0)){const a=e.timeToSampleTable.map((e=>e.count*e.duration)).reduce(((e,t)=>e+t))/t.description.sampleRate;this.metadata.setFormat("duration",a)}const s=M[t.dataFormat];s&&this.metadata.setFormat("lossless",!s.lossy),this.calculateBitRate()}}async handleAtom(e,t){if(e.parent)switch(e.parent.header.name){case"ilst":case"<id>":return this.parseMetadataItemData(e)}if(this.atomParsers[e.header.name])return this.atomParsers[e.header.name](t);L(`No parser for atom path=${e.atomPath}, payload-len=${t}, ignoring atom`),await this.tokenizer.ignore(t)}getTrackDescription(){return this.tracks[this.tracks.length-1]}calculateBitRate(){this.audioLengthInBytes&&this.metadata.format.duration&&this.metadata.setFormat("bitrate",8*this.audioLengthInBytes/this.metadata.format.duration)}async addTag(e,t){await this.metadata.addTag("iTunes",e,t)}addWarning(e){L(`Warning: ${e}`),this.metadata.addWarning(e)}parseMetadataItemData(e){let t=e.header.name;return e.readAtoms(this.tokenizer,(async(e,a)=>{const s=e.getPayloadLength(a);switch(e.header.name){case"data":return this.parseValueAtom(t,e);case"name":case"mean":case"rate":{const e=await this.tokenizer.readToken(new w(s));t+=`:${e.name}`;break}default:{const a=await this.tokenizer.readToken(new n.Uint8ArrayType(s));this.addWarning(`Unsupported meta-item: ${t}[${e.header.name}] => value=${(0,F.EY)(a)} ascii=${(0,F.SW)(a,"ascii")}`)}}}),e.getPayloadLength(0))}async parseValueAtom(e,t){const a=await this.tokenizer.readToken(new k(Number(t.header.length)-d.len));if(0!==a.type.set)throw new l(`Unsupported type-set != 0: ${a.type.set}`);switch(a.type.type){case 0:switch(e){case"trkn":case"disk":{const t=n.UINT8.get(a.value,3),s=n.UINT8.get(a.value,5);await this.addTag(e,`${t}/${s}`);break}case"gnre":{const t=n.UINT8.get(a.value,1),s=r.jR[t-1];await this.addTag(e,s);break}case"rate":{const t=new TextDecoder("ascii").decode(a.value);await this.addTag(e,t);break}default:L(`unknown proprietary value type for: ${t.atomPath}`)}break;case 1:case 18:await this.addTag(e,new TextDecoder("utf-8").decode(a.value));break;case 13:if(this.options.skipCovers)break;await this.addTag(e,{format:"image/jpeg",data:Uint8Array.from(a.value)});break;case 14:if(this.options.skipCovers)break;await this.addTag(e,{format:"image/png",data:Uint8Array.from(a.value)});break;case 21:await this.addTag(e,W.read_BE_Integer(a.value,!0));break;case 22:await this.addTag(e,W.read_BE_Integer(a.value,!1));break;case 65:await this.addTag(e,n.UINT8.get(a.value,0));break;case 66:await this.addTag(e,n.UINT16_BE.get(a.value,0));break;case 67:await this.addTag(e,n.UINT32_BE.get(a.value,0));break;default:this.addWarning(`atom key=${e}, has unknown well-known-type (data-type): ${a.type.type}`)}}parseSoundSampleDescription(e){const t={dataFormat:e.dataFormat,dataReferenceIndex:e.dataReferenceIndex};let a=0;const s=B(e.description,a);return a+=N,0===s.version||1===s.version?t.description=_(e.description,a):L(`Warning: sound-sample-description ${s} not implemented`),t}async parseChapterTrack(e,t,a){if(!e.sampleSize&&e.chunkOffsetTable.length!==e.sampleSizeTable.length)throw new Error("Expected equal chunk-offset-table & sample-size-table length.");const s=[];for(let n=0;n<e.chunkOffsetTable.length&&a>0;++n){const i=e.chunkOffsetTable[n]-this.tokenizer.position,r=e.sampleSize>0?e.sampleSize:e.sampleSizeTable[n];if((a-=i+r)<0)throw new l("Chapter chunk exceeding token length");await this.tokenizer.ignore(i);const o=await this.tokenizer.readToken(new A(r));L(`Chapter ${n+1}: ${o}`);const c={title:o,sampleOffset:this.findSampleOffset(t,this.tokenizer.position)};L(`Chapter title=${c.title}, offset=${c.sampleOffset}/${this.tracks[0].duration}`),s.push(c)}this.metadata.setFormat("chapters",s),await this.tokenizer.ignore(a)}findSampleOffset(e,t){let a=0;e.timeToSampleTable.forEach((e=>{a+=e.count*e.duration})),L(`Total duration=${a}`);let s=0;for(;s<e.chunkOffsetTable.length&&e.chunkOffsetTable[s]<t;)++s;return this.getChunkDuration(s+1,e)}getChunkDuration(e,t){let a=0,s=t.timeToSampleTable[a].count,n=t.timeToSampleTable[a].duration,i=1,r=this.getSamplesPerChunk(i,t.sampleToChunkTable),o=0;for(;i<e;){const e=Math.min(s,r);o+=e*n,s-=e,r-=e,0===r?(++i,r=this.getSamplesPerChunk(i,t.sampleToChunkTable)):(++a,s=t.timeToSampleTable[a].count,n=t.timeToSampleTable[a].duration)}return o}getSamplesPerChunk(e,t){for(let a=0;a<t.length-1;++a)if(e>=t[a].firstChunk&&e<t[a+1].firstChunk)return t[a].samplesPerChunk;return t[t.length-1].samplesPerChunk}}}}]);
//# sourceMappingURL=272.bundle.js.map