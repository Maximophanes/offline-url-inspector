import {inside} from './http-structure-cases.mjs';export {inside};
export const cases=[
 {id:'A HTTP alone',url:'http://example.com/login',advice:'http',warnings:1,http:1,scope:'Original address',host:'example.com'},
 {id:'B HTTP plus original lookalike',url:'http://rnicrosoft.com:8080/login',advice:'mixed',warnings:2,http:1,scope:'Original address',host:'rnicrosoft.com',information:1},
 {id:'C HTTPS nondefault port',url:'https://example.com:8080/login',advice:null,warnings:0,http:0,scope:'Original address',host:'example.com',information:1},
 {id:'D HTTPS original with recovered HTTP',url:inside('http://example.com/login'),advice:'http',warnings:1,http:1,scope:'Address found inside the URL',host:'example.com'},
 {id:'E HTTP original with recovered HTTPS lookalike',url:'http://example.net/?next='+encodeURIComponent('https://rnicrosoft.com/'),advice:'mixed',warnings:2,http:1,scope:'Address found inside the URL',host:'rnicrosoft.com'},
 {id:'F distinct recovered cautions and information',url:inside('http://rnicrosoft.com:8080/','https://google.com@attacker.test/','https://google.com.github.io/','https://аpplе.com/','https://googel.com/'),advice:'mixed',warnings:5,http:1,scope:'Address found inside the URL',host:'xn--ppl-5cd2a.com',information:2,oneGroup:true},
 {id:'G original and recovered cautions',url:'https://rnicrosoft.com/?next='+encodeURIComponent('http://google.com.blogspot.com/'),advice:'mixed',warnings:3,http:1,scope:'Original address',host:'rnicrosoft.com'},
 {id:'H neutral result',url:'https://example.com/',advice:null,warnings:0,http:0,scope:'Original address',host:'example.com',neutral:true},
 {id:'HTTP with weak spelling only',url:'http://googel.com/',advice:'http',warnings:1,http:1,scope:'Original address',host:'googel.com',information:1},
 {id:'HTTP with exact saved reference',url:'http://example.test/',saved:['example.test'],advice:'http',warnings:1,http:1,scope:'Original address',host:'example.test'},
 {id:'HTTPS lookalike without HTTP',url:'https://rnicrosoft.com/',advice:'identity',warnings:1,http:0,scope:'Original address',host:'rnicrosoft.com'},
 {id:'recovered HTTPS lookalike without HTTP',url:inside('https://rnicrosoft.com/'),advice:'identity',warnings:1,http:0,scope:'Address found inside the URL',host:'rnicrosoft.com'},
 {id:'priority order requires scope transitions',url:'http://rnicrosoft.com:8080/?next='+encodeURIComponent('http://google.com.github.io:8443/'),advice:'mixed',warnings:4,http:2,scope:'Original address',host:'rnicrosoft.com',information:2,groups:['Addresses found inside the URL','Original address','Addresses found inside the URL','Original address','Addresses found inside the URL']},
 {id:'private recovered userinfo and nested source',url:inside('https://USER_PRIVATE:PASS_PRIVATE@attacker.test/?token=TOKEN_PRIVATE&next='+encodeURIComponent('http://rnicrosoft.com/')),advice:'mixed',warnings:3,http:1,scope:'Address found inside the URL',host:'rnicrosoft.com'},
 {id:'limited recovered extraction',url:inside(...Array(20).fill('https://google.com/'),'http://rnicrosoft.com/'),advice:'mixed',warnings:2,http:1,scope:'Address found inside the URL',host:'rnicrosoft.com',limited:true}
];
