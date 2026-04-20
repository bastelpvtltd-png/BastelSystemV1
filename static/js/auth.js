const SUPABASE_URL = "https://jkcxavdgnsxitkgrcabu.supabase.co";
const SUPABASE_KEY = "sb_publishable_TxH3mLZAgCEd54vooXR6EA_-RGoKxGw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let sessionUser = "";
const userIP = document.body.dataset.ip;
const ALLOWED_ADMIN_IP = "212.104.231.90"; // ඔයා දුන්න IP එක

async function checkSecurity() {
    // UI එකේ IP එක පෙන්වන්න
    document.getElementById('displayIP').innerText = userIP;
    if(document.getElementById('currentIpSpan')) {
        document.getElementById('currentIpSpan').innerText = userIP;
    }

    // මුලින්ම බලනවා ඔයා දුන්න විශේෂ IP එකද කියලා
    if (userIP === ALLOWED_ADMIN_IP) {
        console.log("Admin IP Detected. Access Granted.");
        document.getElementById('ipBlocker').style.display = 'none';
        return; // IP එක මැච් නම් මෙතනින් එහාට චෙක් කරන්නේ නැහැ
    }

    // එහෙම නැත්නම් Supabase එකේ approved ලිස්ට් එකේ තියෙනවද බලනවා
    const { data, error } = await supabaseClient
        .from('allowed_ips')
        .select('*')
        .eq('ip_address', userIP)
        .eq('status', 'approved');

    if (!data || data.length === 0) {
        document.getElementById('ipBlocker').style.display = 'flex';
    } else {
        document.getElementById('ipBlocker').style.display = 'none';
    }
}

// System එක පූරණය වෙද්දීම ආරක්ෂාව පරීක්ෂා කරන්න
checkSecurity();

// LOGIN HANDLE
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