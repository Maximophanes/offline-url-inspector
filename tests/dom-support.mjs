// Trusted generated-code DOM harness; no network permissions and no real layout.
import { Window } from 'npm:happy-dom@20.8.4';
import {html,MemoryStorage} from './harness.mjs';
export function mount({storage=new MemoryStorage(),platform='MacIntel',edition='standalone'}={}){
 const source=html(edition),network=[],w=new Window({url:'file:///offline-url-inspector.html',settings:{enableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableIframePageLoading:true}});
 Object.defineProperty(w,'localStorage',{value:storage});Object.defineProperty(w.navigator,'platform',{value:platform});w.TextEncoder=TextEncoder;w.confirm=()=>{throw Error('Native confirmations are prohibited');};w.alert=w.prompt=w.confirm;
 for(const name of ['fetch','open'])w[name]=(...args)=>{network.push([name,...args.map(String)]);throw Error('Prohibited inspection network/navigation');};
 for(const name of ['XMLHttpRequest','WebSocket','EventSource','Worker'])w[name]=class{constructor(){network.push([name]);throw Error('Prohibited inspection network');}};
 w.document.write(source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 const tag=w.document.createElement('script');tag.type='application/json';tag.id='unicode-data';tag.textContent=source.match(/id="unicode-data">([\s\S]*?)<\/script>/)[1];w.document.body.append(tag);
 // Count invocations for shortcut/double-execution tests only; analysis is unchanged.
 const runtime=source.match(/<script>([\s\S]*?)<\/script>/)[1].replace('function analyze(){','function analyze(){window.inspectionRuns=(window.inspectionRuns||0)+1;').replace('try{lastResult=Inspector.inspect','try{if(window.testInspectionFailure)throw Error("Controlled test failure");lastResult=Inspector.inspect');
 w.eval(runtime+'\nwindow.testComparisonRecord=record=>comparisonRecords.get(record);window.testLastResult=()=>lastResult;window.testInspector=Inspector;window.testPresentation=Presentation;window.testReferences=referenceStore;window.reviewImportText=beginImport;window.resetReferenceUI=()=>{referenceStore.clear(true);resetEdit();cancelImport();refreshReferences();};');
 const $=id=>w.document.getElementById(id),inspect=(url,expected='')=>{$('link').value=url;$('expected').value=expected;$('inspect').click();return w.testInspector.inspect(url,expected);};
 const key=(target,options={})=>{const event=new w.KeyboardEvent('keydown',{key:'Enter',metaKey:true,bubbles:true,cancelable:true,...options});target.dispatchEvent(event);return event;};
 return {w,$,inspect,key,storage,network,close:()=>w.happyDOM.close()};
}
