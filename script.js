// ===== FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVPdYtQXU15K0Jxlbp7IZ4QiODNt-cRwU",
  authDomain: "naseslicice-1009.firebaseapp.com",
  projectId: "naseslicice-1009",
  storageBucket: "naseslicice-1009.firebasestorage.app",
  messagingSenderId: "532185526368",
  appId: "1:532185526368:web:034918d6e7503b52629305"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== PODACI =====
const categories = {
    "00": 0,
    "FWC": 19
};

const groups = [
    { name:"Grupa A", teams:[{name:"Meksiko",code:"MEX"},{name:"Južna Afrika",code:"RSA"},{name:"Južna Koreja",code:"KOR"},{name:"Češka",code:"CZE"}] },
    { name:"Grupa B", teams:[{name:"Kanada",code:"CAN"},{name:"Bosna i Hercegovina",code:"BIH"},{name:"Katar",code:"QAT"},{name:"Švajcarska",code:"SUI"}] },
    { name:"Grupa C", teams:[{name:"Brazil",code:"BRA"},{name:"Maroko",code:"MAR"},{name:"Haiti",code:"HAI"},{name:"Škotska",code:"SCO"}] },
    { name:"Grupa D", teams:[{name:"SAD",code:"USA"},{name:"Paragvaj",code:"PAR"},{name:"Australija",code:"AUS"},{name:"Turska",code:"TUR"}] },
    { name:"Grupa E", teams:[{name:"Nemačka",code:"GER"},{name:"Kiraso",code:"CUW"},{name:"Obala Slonovače",code:"CIV"},{name:"Ekvador",code:"ECU"}] },
    { name:"Grupa F", teams:[{name:"Holandija",code:"NED"},{name:"Japan",code:"JPN"},{name:"Švedska",code:"SWE"},{name:"Tunis",code:"TUN"}] },
    { name:"Grupa G", teams:[{name:"Belgija",code:"BEL"},{name:"Egipat",code:"EGY"},{name:"Iran",code:"IRN"},{name:"Novi Zeland",code:"NZL"}] },
    { name:"Grupa H", teams:[{name:"Španija",code:"ESP"},{name:"Zelenortska Ostrva",code:"CPV"},{name:"Saudijska Arabija",code:"KSA"},{name:"Urugvaj",code:"URU"}] },
    { name:"Grupa I", teams:[{name:"Francuska",code:"FRA"},{name:"Senegal",code:"SEN"},{name:"Irak",code:"IRQ"},{name:"Norveška",code:"NOR"}] },
    { name:"Grupa J", teams:[{name:"Argentina",code:"ARG"},{name:"Alžir",code:"ALG"},{name:"Austrija",code:"AUT"},{name:"Jordan",code:"JOR"}] },
    { name:"Grupa K", teams:[{name:"Portugal",code:"POR"},{name:"DR Kongo",code:"COD"},{name:"Uzbekistan",code:"UZB"},{name:"Kolumbija",code:"COL"}] },
    { name:"Grupa L", teams:[{name:"Engleska",code:"ENG"},{name:"Hrvatska",code:"CRO"},{name:"Gana",code:"GHA"},{name:"Panama",code:"PAN"}] },
];

// ===== STANJE =====
let data = {};
let currentKey = null;

// Učitaj iz Firebase
async function loadData() {
    const ref = doc(db, "album", "stickers");
    const snap = await getDoc(ref);
    if (snap.exists()) {
        data = snap.data();
    }
    render();
}

// Sačuvaj u Firebase
async function saveData() {
    const ref = doc(db, "album", "stickers");
    await setDoc(ref, data);
}

// ===== RENDER =====
function render(){
    const app = document.getElementById("app");
    app.innerHTML = "";

    // kategorije
    for(let cat in categories){
        let html = `<h2>${cat}</h2><div class="grid">`;

        for(let i=1;i<=categories[cat];i++){
            let key = cat + "-" + i;
            let status = data[key];
            html += `<div class="item ${status===true?'owned':status===false?'missing':''}" onclick="openModal('${key}')">${i}</div>`;
        }

        html += `</div>`;
        app.innerHTML += html;
    }

    // grupe i timovi
    groups.forEach(group => {
        let html = `<h2>${group.name}</h2>`;

        group.teams.forEach(team => {
            html += `<h3>${team.code}</h3><div class="grid">`;

            for(let i=1;i<=20;i++){
                let key = team.code + "-" + i;
                let status = data[key];
                html += `<div class="item ${status===true?'owned':status===false?'missing':''}" onclick="openModal('${key}')">${i}</div>`;
            }

            html += `</div>`;
        });

        app.innerHTML += html;
    });
}

// ===== MODAL =====
function openModal(key){
    currentKey = key;
    document.getElementById("modalTitle").innerText = key;
    document.getElementById("modal").style.display = "flex";
}

function closeModal(){
    document.getElementById("modal").style.display = "none";
}

async function setStatus(val){
    data[currentKey] = val;
    await saveData();
    closeModal();
    render();
}

// Eksportuj funkcije za HTML onclick
window.openModal = openModal;
window.closeModal = closeModal;
window.setStatus = setStatus;

// start
loadData();