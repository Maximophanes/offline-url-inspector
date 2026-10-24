// Final-acceptance presentation cases shared by DOM and native Firefox checks.
export const inside=(...urls)=>'https://example.net/?'+urls.map((u,i)=>'p'+i+'='+encodeURIComponent(u)).join('&');
export const nestedLimit='https://example.net/?outer=https%3A%2F%2Fexample.org%2F%3Fnext%3Dhttps%253A%252F%252Frnicrosoft.com%252Flogin';
export const cases=[
 {id:'primary visual and embedded userinfo caution',url:'https://rnicrosoft.com/?next='+encodeURIComponent('https://google.com@attacker.test/login'),warnings:2,information:0,scope:'Original address'},
 {id:'primary visual and informational port',url:'https://rnicrosoft.com:8443/login',warnings:1,information:1,scope:'Original address'},
 {id:'multiple embedded warnings',url:inside('https://rnicrosoft.com/','https://arnazon.com/','https://google.com.attacker.com/'),warnings:3,information:0,scope:'Address found inside the URL'},
 {id:'HTTP caution and informational port',url:'http://example.com:8080/login',warnings:1,information:1,scope:'Original address'},
 {id:'original userinfo sentence and lookalike',url:'https://microsoft.com@rnicrosoft.com/login',warnings:1,information:0,scope:'Original address',userinfo:'rnicrosoft.com'},
 {id:'embedded userinfo sentence and lookalike',url:inside('https://microsoft.com@rnicrosoft.com/login'),warnings:1,information:0,scope:'Address found inside the URL',userinfo:'rnicrosoft.com'},
 {id:'strong original userinfo and custom child',url:'https://google.com@attacker.test/?next='+encodeURIComponent('https://acrnecorpaudit.com/'),refs:['acmecorpaudit.com'],warnings:2,information:0,scope:'Original address',userinfo:'attacker.test'},
 {id:'completed neutral inspection',url:'https://example.net/',warnings:0,information:0,scope:'Original address',neutral:true},
 {id:'repeated ordinary recovered hostname',url:inside('https://example.org/','https://example.org/'),warnings:0,information:0,summary:[['example.org','']],occurrences:2},
 {id:'direct parameter recovery',url:inside('https://example.org/'),warnings:0,information:0,summary:[['example.org','']]},
 {id:'direct path recovery',url:'https://example.net/go/https://example.org/',warnings:0,information:0,summary:[['example.org','']]},
 {id:'direct fragment recovery',url:'https://example.net/#https://example.org/',warnings:0,information:0,summary:[['example.org','']]},
 {id:'nested neutral recovery retains distinction',url:inside('https://example.org/?next='+encodeURIComponent('https://example.com/')),warnings:0,information:0,summary:[['example.org',''],['example.com','Found inside another address.']]},
 {id:'same hostname recovered directly and nested',url:inside('https://example.com/','https://example.org/?next=https://example.com/'),warnings:0,information:0,summary:[['example.com','Also found inside another address.'],['example.org','']]},
 {id:'exact supplied nested depth limitation',url:nestedLimit,warnings:1,information:0,scope:'Address found inside the URL',limited:true,summary:[['example.org','']]},
 {id:'complete nested equivalent keeps child finding',url:inside('https://example.org/?next=https://rnicrosoft.com/login'),warnings:1,information:0,scope:'Address found inside the URL',complete:true,summary:[['example.org','']]},
 {id:'complete direct recovered lookalike',url:inside('https://rnicrosoft.com/'),warnings:1,information:0,scope:'Address found inside the URL',complete:true},
 {id:'HTTP and weak spelling and port information',url:'http://googel.com:8080/',warnings:1,information:2,scope:'Original address'},
 {id:'original and embedded scope transitions',url:'http://rnicrosoft.com:8080/?next='+encodeURIComponent('http://google.com.github.io:8443/'),warnings:4,information:2,scope:'Original address'},
 {id:'weak information without warnings',url:'https://googel.com/',warnings:0,information:1,scope:'Original address'},
 {id:'optional Expected notice stays informational',url:'https://example.com/',expected:'bad/path',warnings:0,information:1},
 {id:'Stage 8 custom child correction',url:inside('https://acrnecorpaudit.com/'),refs:['acmecorpaudit.com'],warnings:1,information:0,scope:'Address found inside the URL'},
 {id:'Unicode primary and independent recovered caution',url:'https://аpplе.com/?next='+encodeURIComponent('https://google.com@attacker.test/login'),warnings:2,information:0,scope:'Original address',userinfo:'attacker.test'},
 {id:'private recovered address',url:inside('http://SECRET_USER:SECRET_PASS@rnicrosoft.com/?token=SECRET_TOKEN'),warnings:2,information:0,scope:'Address found inside the URL',userinfo:'rnicrosoft.com'},
 {id:'two embedded warnings plus information',url:inside('https://rnicrosoft.com/','https://google.com@attacker.test/','https://googel.com/'),warnings:2,information:1,scope:'Address found inside the URL'}
];
