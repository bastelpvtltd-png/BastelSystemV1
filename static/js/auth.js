const SUPABASE_URL = "https://jkcxavdgnsxitkgrcabu.supabase.co";
const SUPABASE_KEY = "sb_publishable_TxH3mLZAgCEd54vooXR6EA_-RGoKxGw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let sessionUser = "";
const userIP = document.body.dataset.ip;

async function checkSecurity() {
    document.getElementById('displayIP').innerText = userIP;
    if(document.getElementById('currentIpSpan')) document.getElementById('currentIpSpan').innerText = userIP;

    const { data, error } = await supabaseClient
        .from('allowed_ips')
        .select('*')
        .eq('ip_address', userIP)
        .eq('status', 'approved');

    if (!data || data.length === 0) {
        document.getElementById('ipBlocker').style.display = 'flex';
    }
}

checkSecurity();

async function handleLogin() {
    let u = document.getElementById('userField').value.toLowerCase();
    let p = document.getElementById('passField').value;
    let agree = document.getElementById('agree').checked;

    if(!agree) { alert("Please agree to terms!"); return; }

    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('username', u)
        .single();

    if (data && data.password === p) {
        sessionUser = data;
        startDashboard();
    } else {
        document.getElementById('errorMsg').innerText = "ACCESS DENIED!";
    }
}

function startDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('userSpan').innerText = sessionUser.full_name;
    document.getElementById('roleSpan').innerText = sessionUser.role;
    renderTabs();
    showTab('HOME');
}

function renderTabs() {
    let container = document.getElementById('dynamicTabs');
    container.innerHTML = "";
    let tabs = sessionUser.allowed_tabs || ["HOME", "CONTACT"];
    tabs.forEach(tab => {
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
    document.getElementById(tabId).classList.add('active-content');
    if(document.getElementById("btn-" + tabId)) document.getElementById("btn-" + tabId).classList.add('active');
}

function showSubTab(subId) {
    document.querySelectorAll('.sub-tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.v-tab').forEach(v => v.classList.remove('active'));
    document.getElementById(subId).classList.add('active');
    event.currentTarget.classList.add('active');
}

async function requestIPAccess() {
    const { error } = await supabaseClient
        .from('allowed_ips')
        .insert([{ ip_address: userIP, status: 'approved' }]);
    if(!error) alert("IP Approved & Saved to Supabase!");
    else alert("Error: " + error.message);
}