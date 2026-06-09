const SUPABASE_URL = "https://lobrvpvvplbozmbsepag.supabase.co";
const SUPABASE_KEY = "sb_publishable_5fKjX0WFwQLfIwe74bXCow_knBJA00W";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("World Cup 2026 Loaded");
let id = 1;
let openHour = 7;
let closeHour = 21;
let currentRound = 1;

async function loadSettings() {

    const { data, error } = await supabaseClient
        .from("setting")
        .select("*");

    console.log("SETTINGS DATA =", data);
    console.log("SETTINGS ERROR =", error);

    if (error) {
        document.getElementById("countdownBox").innerHTML =
            "خطأ بقراءة الإعدادات";
        return;
    }

    if (!data || data.length === 0) {
        document.getElementById("countdownBox").innerHTML =
            "جدول setting فارغ";
        return;
    }

    const settings = data[0];

    openHour = settings.open_hour;
    closeHour = settings.close_hour;
    currentRound = settings.current_round;
    document.getElementById("roundBanner").innerHTML =
`🌍 اليوم ${currentRound} من كأس العالم 2026`;
    document.getElementById("closeTimeText").innerHTML =
`⏰ تغلق التوقعات عند الساعة ${closeHour}:00`;

loadMatches();

    console.log("OPEN =", openHour);
    console.log("CLOSE =", closeHour);

    startCountdown();
}
loadSettings();


async function loadMatches() {

const flags = {
    "الارجنتين": "ar",
    "البرازيل": "br",
    "اسبانيا": "es",
    "فرنسا": "fr",
    "المانيا": "de",
    "هولندا": "nl",
    "البرتغال": "pt",
    "الاوروجواي": "uy",
    "المكسيك": "mx",

    "انجلترا": "gb",
    "بلجيكا": "be",
    "ايطاليا": "it",
    "كرواتيا": "hr",
    "الدنمارك": "dk",
    "سويسرا": "ch",
    "صربيا": "rs",
    "بولندا": "pl",
    "السويد": "se",
    "النرويج": "no",
    "اوكرانيا": "ua",
    "تركيا": "tr",
    "اليونان": "gr",
    "التشيك": "cz",
    "المجر": "hu",
    "النمسا": "at",
    "اسكتلندا": "gb-sct",
    "ويلز": "gb-wls",

    "المغرب": "ma",
    "الجزائر": "dz",
    "تونس": "tn",
    "مصر": "eg",
    "السنغال": "sn",
    "نيجيريا": "ng",
    "غانا": "gh",
    "الكاميرون": "cm",
    "ساحل العاج": "ci",
    "جنوب افريقيا": "za",

    "الولايات المتحدة": "us",
    "كندا": "ca",
    "كوستاريكا": "cr",
    "بنما": "pa",
    "جامايكا": "jm",
    "هندوراس": "hn",

    "اليابان": "jp",
    "كوريا الجنوبية": "kr",
    "استراليا": "au",
    "ايران": "ir",
    "السعودية": "sa",
    "قطر": "qa",
    "العراق": "iq",
    "الاردن": "jo",
    "الامارات": "ae",
    "اوزبكستان": "uz",

    "كولومبيا": "co",
    "تشيلي": "cl",
    "بيرو": "pe",
    "الاكوادور": "ec",
    "فنزويلا": "ve",
    "باراغواي": "py",
    "بوليفيا": "bo"
};

    const { data, error } = await supabaseClient
        .from("matches")
.select("*")
.eq("round", currentRound);

    console.log("DATA =", data);
    console.log("ERROR =", error);

    if (error) {
        console.log("ERROR:", error);
        alert(JSON.stringify(error));
        return;
    }

    const container = document.getElementById("matchesContainer");

    container.innerHTML = "";
    if (data.length === 0) {

    container.innerHTML =
        "<h3 style='text-align:center'>⚠️ لم يتم إضافة مباريات لهذه الجولة بعد</h3>";

    document.getElementById("saveBtn").disabled = true;

    return;
}

document.getElementById("saveBtn").disabled = false;

    data.forEach(match => {

         container.innerHTML += `
<div class="match"
style="
--home-flag:url('https://flagcdn.com/w320/${flags[match.home_team]}.png');
--away-flag:url('https://flagcdn.com/w320/${flags[match.away_team]}.png');
">

<div class="match-row">

        <div class="team-right">
    <span class="team-name">${match.home_team}</span>

    <img class="team-flag"
    src="https://flagcdn.com/w40/${flags[match.home_team]}.png">
</div>

    <div class="prediction-center">

        <input class="score-input"
        type="number" min="0" value=""
placeholder="-">

        <img src="worldcup-logo.png" class="vs-logo">

        <input class="score-input"
        type="number" min="0" value=""
placeholder="-">

    </div>

    <div class="team-left">

    <span class="team-name">${match.away_team}</span>

    <img class="team-flag"
    src="https://flagcdn.com/w40/${flags[match.away_team]}.png">

</div>

</div>

<div class="match-date">
    🕒 ${match.match_date}
</div>

</div>
`;

    });

}

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {

    const matchesCheck = await supabaseClient
    .from("matches")
    .select("*")
    .eq("round", currentRound);

if (matchesCheck.data.length === 0) {

    alert("لم يتم إضافة مباريات لهذه الجولة بعد");

    return;
}
    const player = document.getElementById("player").value;
const { data: existingPredictions } = await supabaseClient
    .from("predictions")
    .select("*")
    .eq("player_name", player)
    .eq("round", currentRound);

if (existingPredictions.length > 0) {
    alert("لقد قمت بإرسال توقعاتك مسبقاً");
    return;
}
    const inputs = document.querySelectorAll("input");

    if (inputs.length < 2) {
        alert("لم يتم تحميل المباريات");
        return;
    }

    const predictions = [];

const matches = await supabaseClient
    .from("matches")
    .select("*")
    .eq("round", currentRound);

matches.data.forEach((match, index) => {

    predictions.push({
    player_name: player,
    round: currentRound,
    match_id: match.id,
        predicted_home_score: parseInt(inputs[index * 2].value),
        predicted_away_score: parseInt(inputs[index * 2 + 1].value)
    });

});

const { data, error } = await supabaseClient
    .from("predictions")
    .insert(predictions);

    if (error) {
        console.log("ERROR:", error);
        alert("فشل الحفظ");
    } else {
        const msg =
document.getElementById("successMessage");

msg.innerHTML =
"✅ تم حفظ التوقع بنجاح";

msg.style.display = "block";

setTimeout(() => {

    msg.style.display = "none";

}, 3000);
        console.log(data);
    }

});
function startCountdown() {

    const countdownBox =
        document.getElementById("countdownBox");

    setInterval(() => {

        const now = new Date();

        const currentHour = now.getHours();

        // قبل وقت الفتح
        if (currentHour < openHour) {

            countdownBox.innerHTML =
                `🔓 تفتح التوقعات الساعة ${openHour}:00`;

            document.getElementById("saveBtn").disabled = true;

            return;
        }

        // بعد وقت الإغلاق
        if (currentHour >= closeHour) {

            countdownBox.innerHTML =
                "🔒 انتهى استقبال التوقعات";

            document.getElementById("saveBtn").disabled = true;

            return;
        }

        // أثناء فترة التوقعات
        document.getElementById("saveBtn").disabled = false;

        const closeTime = new Date();
        closeTime.setHours(closeHour, 0, 0, 0);

        const diff = closeTime - now;

        const hours =
            Math.floor(diff / 1000 / 60 / 60);

        const minutes =
            Math.floor(diff / 1000 / 60) % 60;

        const seconds =
            Math.floor(diff / 1000) % 60;

        countdownBox.innerHTML =
            `⌛ باقي على إغلاق التوقعات:
            <span class="timer-red">${hours}</span> ساعة
            <span class="timer-red">${minutes}</span> دقيقة
            <span class="timer-red">${seconds}</span> ثانية`;

    }, 1000);
}

