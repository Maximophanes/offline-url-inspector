export const inside=(...values)=>'https://example.net/?'+values.map((v,i)=>'p'+i+'='+encodeURIComponent(v)).join('&');
export const transportCases=[
 {name:'supplied visual HTTP and port',url:'http://rnicrosoft.com:8080/login',host:'rnicrosoft.com',identity:true,port:'8080'},
 {name:'supplied HTTP alone',url:'http://example.com/login',host:'example.com'},
 {name:'supplied HTTPS nondefault port',url:'https://example.com:8080/login',host:'example.com',http:false,port:'8080'},
 {name:'supplied HTTPS visual and port',url:'https://rnicrosoft.com:8443/login',host:'rnicrosoft.com',http:false,identity:true,port:'8443'},
 {name:'original Unicode and HTTP',url:'http://аpplе.com/',host:'xn--ppl-5cd2a.com',identity:true},
 {name:'original structural PRIVATE github and HTTP',url:'http://google.com.github.io/',host:'google.com.github.io',identity:true},
 {name:'original structural PRIVATE blogspot and HTTP',url:'http://google.com.blogspot.com/',host:'google.com.blogspot.com',identity:true},
 {name:'original structural regular suffix and HTTP',url:'http://google.com.example.net/',host:'google.com.example.net',identity:true},
 {name:'original userinfo and HTTP',url:'http://USER_PRIVATE:PASS_PRIVATE@attacker.test/',host:'attacker.test',identity:true,unsupported:true},
 {name:'original validation and HTTP',url:'http://bad_host.com/',host:'bad_host.com',identity:true},
 {name:'original malformed path encoding and HTTP',url:'http://rnicrosoft.com/%ZZ',host:'rnicrosoft.com',identity:true},
 {name:'expected mismatch and HTTP',url:'http://example.net/',expected:'google.com',host:'example.net',identity:true},
 {name:'saved and expected visual sources with HTTP',url:'http://rnicrosoft.com/',expected:'microsoft.com',saved:['microsoft.com'],host:'rnicrosoft.com',identity:true},
 {name:'weak spelling with HTTP',url:'http://googel.com/',host:'googel.com',weak:true},
 {name:'unsupported matching with HTTP',url:'http://example.test/',host:'example.test',unsupported:true},
 {name:'embedded visual HTTP and port',url:inside('http://rnicrosoft.com:8080/'),host:'example.net',identity:true,embedded:true,port:'8080'},
 {name:'embedded userinfo and HTTP',url:inside('http://USER_PRIVATE:PASS_PRIVATE@attacker.test/'),host:'example.net',identity:true,embedded:true,unsupported:true},
 {name:'embedded HTTP alone',url:inside('http://example.com/'),host:'example.net',embedded:true},
 {name:'embedded Unicode and HTTP',url:inside('http://аpplе.com/'),host:'example.net',identity:true,embedded:true,unicode:true},
 {name:'embedded structural and HTTP',url:inside('http://google.com.pages.dev/'),host:'example.net',identity:true,embedded:true},
 {name:'repeated embedded HTTP on one hostname',url:inside('http://rnicrosoft.com/','http://rnicrosoft.com/'),host:'example.net',identity:true,embedded:true},
 {name:'mixed HTTPS HTTP occurrences of one hostname',url:inside('https://rnicrosoft.com/','http://rnicrosoft.com/'),host:'example.net',identity:true,embedded:true},
 {name:'two independent embedded warnings weak information and HTTP',url:inside('http://rnicrosoft.com/','https://google.com@attacker.test/','https://googel.com/'),host:'example.net',identity:true,embedded:true,weak:true,unsupported:true},
 {name:'original and different embedded HTTP scopes',url:'http://rnicrosoft.com/?next='+encodeURIComponent('http://google.com@attacker.test/'),host:'rnicrosoft.com',identity:true,httpCount:2,unsupported:true},
 {name:'two distinct embedded HTTP hostnames',url:inside('http://rnicrosoft.com/','http://arnazon.com/'),host:'example.net',identity:true,embedded:true,httpCount:2},
 {name:'nested recovered HTTP visual and userinfo',url:inside('https://example.com/?next='+encodeURIComponent('http://USER_PRIVATE:PASS_PRIVATE@rnicrosoft.com/')),host:'example.net',identity:true,embedded:true},
 {name:'limited extraction preserves visual and HTTP cautions',url:inside(...Array(20).fill('https://google.com/'),'http://rnicrosoft.com/','https://googel.com/'),host:'example.net',identity:true,embedded:true,limited:true}
];

// Complete reference sequences, legitimate subdomains and partial-name controls
// use the independently authored pinned PSL expectations from the prior task.
export {boundaries} from './stress-cases.mjs';
