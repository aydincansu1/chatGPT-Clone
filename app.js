/*
!tarayicilarin depolama alanlari

localStorage ve sessionStorage tarayicinin sundugu iki farkli depolama alanidir

*/

//localStorage veri ekleme
localStorage.setItem("kullaniciAdi", "cansu");
//localStroge veri cekme
const kullaniciAdi = localStorage.getItem("kullaniciAdi");
console.log(kullaniciAdi); // cansu
