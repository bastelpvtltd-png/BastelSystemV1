const SUPABASE_URL = "https://jkcxavdgnsxitkgrcabu.supabase.co";
const SUPABASE_KEY = "sb_publishable_TxH3mLZAgCEd54vooXR6EA_-RGoKxGw";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let sessionUser = "";
const userIP = document.body.dataset.ip;
const ALLOWED_ADMIN_IP = "212.104.231.90";

async function checkSecurity() {
    document.getElementById('displayIP').innerText = userIP;
    if(document.getElementById('currentIpSpan')) document.getElementById('currentIpSpan').innerText = userIP;

    if (userIP === ALLOWED_ADMIN_IP) {
        document.getElementById('ipBlocker').style.display = 'none';
        return;
    }

    const { data } = await supabaseClient.from('allowed_ips').select('*').eq('ip_address', userIP).eq('status', 'approved');
    if (!data || data.length === 0) {
        document.getElementById('ipBlocker').style.display = 'flex';
    }
}
checkSecurity();

// --- LOGIN HANDLE ---
async function handleLogin() {
    let u = document.getElementById('userField').value.toLowerCase();
    let p = document.getElementById('passField').value;
    
    const { data, error } = await supabaseClient.from('users').select('*').eq('username', u).single();

    if (data && data.password === p) {
        sessionUser = data;
        
        // පලවෙනි පාර ලොග් වෙනවා නම් (ඒ කියන්නේ තාම password එක reset කරලා නැත්නම්)
        // මේක චෙක් කරන්නේ database එකේ 'is_new' කියලා column එකක් තියෙනවා කියලා හිතලා.
        // එහෙම නැත්නම් ඔයා දෙන common password එකක් තියෙනවා නම් ඒකෙන් චෙක් කරන්නත් පුළුවන්.
        if (data.is_new === true) {
            document.getElementById('pwPopup').style.display = 'flex';
        } else {
            startDashboard();
        }
    } else {
        document.getElementById('errorMsg').innerText = "INVALID CREDENTIALS!";
    }
}

// --- PASSWORD UPDATE LOGIC ---
async function saveNewPassword() {
    let n1 = document.getElementById('newPW').value;
    let n2 = document.getElementById('confirmPW').value;

    if(n1 !== n2 || n1 === "") {
        alert("Passwords do not match!");
        return;
    }

    const { error } = await supabaseClient
        .from('users')
        .update({ password: n1, is_new: false }) // Password එක අලුත් කරලා is_new එක false කරනවා
        .eq('username', sessionUser.username);

    if(!error) {
        alert("Password Security Updated!");
        document.getElementById('pwPopup').style.display = 'none';
        startDashboard();
    } else {
        alert("Update Error: " + error.message);
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

// --- NEW USER CREATION (By Admin) ---
async function createNewAccount() {
    let u = document.getElementById('regUser').value;
    let p = document.getElementById('regPass').value;
    let n = document.getElementById('regName').value;

    const { error } = await supabaseClient.from('users').insert([{
        username: u,
        password: p,
        full_name: n,
        role: "Staff",
        allowed_tabs: ["HOME", "CONTACT"],
        is_new: true // අලුත් යූසර් කෙනෙක් හදද්දී මේක true වෙන්න ඕනේ
    }]);

    if(!error) alert("User Created! They will be asked to change password on first login.");
}

// (අනිත් functions කලින් වගේමයි...)
function renderTabs() { /* ... */ }
function showTab(tabId) { /* ... */ }
function showSubTab(subId) { /* ... */ }
async function requestIPAccess() { /* ... */ }