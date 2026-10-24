const enc=encodeURIComponent;export const inside=(...values)=>'https://example.net/?'+values.map((v,i)=>'p'+i+'='+enc(v)).join('&');
export const cases=[
 {id:'1 original visual and userinfo',url:'https://microsoft.com@rnicrosoft.com/login',host:'rnicrosoft.com',target:'microsoft.com',thoughts:['“rn”','Text before @','actual hostname is rnicrosoft.com']},
 {id:'2 original visual and embedded userinfo',url:'https://rnicrosoft.com/?next='+enc('https://google.com@attacker.test/login'),host:'rnicrosoft.com',target:'microsoft.com',others:['attacker.test']},
 {id:'3 four distinct recovered findings',url:inside('https://rnicrosoft.com/','https://arnazon.com/','https://google.com.attacker.com/','https://аpplе.com/'),host:'example.net',warnings:4,unicode:'аpplе.com'},
 {id:'4 two identical recovered addresses',url:inside('https://rnicrosoft.com/login','https://rnicrosoft.com/login'),host:'example.net',target:'microsoft.com',count:2},
 {id:'5 two mechanisms in one recovered name',url:inside('https://microsoft.com@rnicrosoft.com/login'),host:'example.net',target:'microsoft.com',thoughts:['“rn”','Text before @','actual hostname is rnicrosoft.com']},
 {id:'6 visual HTTP and nondefault port',url:'http://rnicrosoft.com:8080/login',host:'rnicrosoft.com',target:'microsoft.com',port:'8080',thoughts:['“rn”','HTTP does not encrypt']},
 {id:'7 PRIVATE tenant structural placement',url:'https://google.com.github.io/',host:'google.com.github.io',target:'google.com',thoughts:['com.github.io']},
 {id:'8 supported percent-encoded hostname',url:'https://%72nicrosoft.com/login',host:'rnicrosoft.com',target:'microsoft.com',original:'%72nicrosoft.com'}
];
export const boundaries=[
 ['google.com.github.io','github.io','PRIVATE','com.github.io','google.com',true],
 ['google.com.blogspot.com','blogspot.com','PRIVATE','com.blogspot.com','google.com',true],
 ['google.com.pages.dev','pages.dev','PRIVATE','com.pages.dev','google.com',true],
 ['google.com.s3.amazonaws.com','s3.amazonaws.com','PRIVATE','com.s3.amazonaws.com','google.com',true],
 ['google.co.uk.github.io','github.io','PRIVATE','uk.github.io','google.co.uk',true],
 ['amazon.co.uk.pages.dev','pages.dev','PRIVATE','uk.pages.dev','amazon.co.uk',true],
 ['google.com.example.net','net','ICANN','example.net','google.com',true],
 ['google.com.com','com','ICANN','com.com','google.com',true],
 ['google.com.tenant.github.io','github.io','PRIVATE','tenant.github.io','google.com',true],
 ['accounts.google.com','com','ICANN','google.com','google.com',false],
 ['accounts.google.co.uk','co.uk','ICANN','google.co.uk','google.co.uk',false],
 ['notgoogle.com.github.io','github.io','PRIVATE','com.github.io','google.com',false],
 ['google.comgithub.io','io','ICANN','comgithub.io','google.com',false],
 ['google.com.github.io.evil.net','net','ICANN','evil.net','google.com',true],
 ['bp.blogspot.com.bp.blogspot.com','blogspot.com','PRIVATE','bp.blogspot.com','bp.blogspot.com',false]
];
