// LocalStorage එකෙන් users ලව ගන්නවා, නැත්නම් default admin (bathiya) දානවා
let users = JSON.parse(localStorage.getItem('bastel_v1')) || { 
    "bathiya": { pass: "7788", name: "H A B P Kumara", desig: "Admin", tabs: ["HOME", "OPEN_ACCOUNT", "ACCESS", "CONTACT"] } 
};

let sessionUser = "";

function handleLogin() {
    let u = document.getElementById('userField').value.toLowerCase();
    let p = document.getElementById('passField').value;
    let agree = document.getElementById('agree').checked;

    if(!agree) { alert("Please agree to the security terms!"); return; }

    if (users[u] && users[u].pass === p) {
        sessionUser = u;
        startDashboard();
    } else {
        document.getElementById('errorMsg').innerText = "ACCESS DENIED! Invalid Credentials.";
    }
}

function startDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('userSpan').innerText = users[sessionUser].name;
    document.getElementById('roleSpan').innerText = users[sessionUser].desig;
    
    renderTabs();
    showTab('HOME');
}

function renderTabs() {
    let container = document.getElementById('dynamicTabs');
    container.innerHTML = "";
    users[sessionUser].tabs.forEach(tab => {
        let div = document.createElement('div');
        div.className = 'nav-tab';
        div.innerText = tab.replace('_', ' ');
        div.onclick = () => showTab(tab);
        div.id = "btn-" + tab;
        container.appendChild(div);
    });
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    let content = document.getElementById(tabId);
    if(content) content.classList.add('active-content');
    
    let btn = document.getElementById("btn-" + tabId);
    if(btn) btn.classList.add('active');
}