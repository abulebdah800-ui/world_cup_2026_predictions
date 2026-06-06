const password = prompt("أدخل كلمة مرور SOS");

if (password !== "sos2026") {

    document.body.innerHTML =
        "<h1 style='text-align:center'>🚫 غير مصرح بالدخول</h1>";

    throw new Error("Unauthorized");
}

const SUPABASE_URL =
"https://lobrvpvvplbozmbsepag.supabase.co";

const SUPABASE_KEY =
"sb_publishable_5fKjX0WFwQLfIwe74bXCow_knBJA00W";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

loadSettings();



async function loadSettings() {

    const { data } =
        await supabaseClient
            .from("setting")
            .select("*");

    document.getElementById(
    "currentRound"
).value =
    data[0].current_round;

document.getElementById(
    "openHour"
).value =
    data[0].open_hour;

document.getElementById(
    "closeHour"
).value =
    data[0].close_hour;
    loadMatches();

}

document
.getElementById("saveSettingsBtn")
.addEventListener("click", saveSettings);

async function saveSettings() {

    const round =
        parseInt(
            document.getElementById(
                "currentRound"
            ).value
        );

    const openHour =
        parseInt(
            document.getElementById(
                "openHour"
            ).value
        );

    const closeHour =
        parseInt(
            document.getElementById(
                "closeHour"
            ).value
        );

    const { error } =
        await supabaseClient
            .from("setting")
            .update({
                current_round: round,
                open_hour: openHour,
                close_hour: closeHour
            })
            .eq("id", 1);

    if (error) {

        alert("فشل الحفظ");

    } else {

        alert("تم حفظ الإعدادات بنجاح");

    }

}

async function loadMatches() {

    const { data: matches } =
        await supabaseClient
            .from("matches")
            .select("*")
            .order("round");

    const container =
        document.getElementById("matchesResults");

    container.innerHTML = "";

   const rounds = {};

matches.forEach(match => {

    if (!rounds[match.round]) {
        rounds[match.round] = [];
    }

    rounds[match.round].push(match);

});

Object.keys(rounds)
    .sort((a, b) => a - b)
    .forEach(round => {

        let matchesHtml = "";

        rounds[round].forEach(match => {

            matchesHtml += `
            <div class="match">

                <input
    type="text"
    id="edit-home-${match.id}"
    value="${match.home_team}"
>

×

<input
    type="text"
    id="edit-away-${match.id}"
    value="${match.away_team}"
>

<br><br>

<input
    type="number"
    id="edit-round-${match.id}"
    value="${match.round}"
>

<input
    type="text"
    id="edit-date-${match.id}"
    value="${match.match_date ?? ""}"
>

                <input
                    type="number"
                    id="home-${match.id}"
                    value="${match.home_score ?? ""}"
                    style="width:80px"
                >

                <input
                    type="number"
                    id="away-${match.id}"
                    value="${match.away_score ?? ""}"
                    style="width:80px"
                >

                <button
                    onclick="saveResult(${match.id})"
                >
                    💾 حفظ النتيجة
                </button>

                <button
    onclick="deleteMatch(${match.id})"
>
    🗑️ حذف المباراة
</button>

<button
    onclick="updateMatch(${match.id})"
>
    ✏️ تعديل المباراة
</button>
            </div>
            `;

        });

        container.innerHTML += `
        <div class="match">

            <h2
                onclick="toggleRound('sos-round-${round}')"
                style="cursor:pointer"
            >
                🏆 الجولة ${round}
                (${rounds[round].length} مباريات)
                ▼
            </h2>

            <div
                id="sos-round-${round}"
                style="display:none;"
            >
                ${matchesHtml}
            </div>

        </div>
        `;

    });

}

async function saveResult(matchId) {

    const homeScore =
        parseInt(
            document.getElementById(
                `home-${matchId}`
            ).value
        );

    const awayScore =
        parseInt(
            document.getElementById(
                `away-${matchId}`
            ).value
        );

    const { error } =
        await supabaseClient
            .from("matches")
            .update({
                home_score: homeScore,
                away_score: awayScore
            })
            .eq("id", matchId);

    if (error) {

    alert("فشل حفظ النتيجة");

} else {

    const { data: predictions } =
        await supabaseClient
            .from("predictions")
            .select("*")
            .eq("match_id", matchId);

    for (const prediction of predictions) {

        let points = 0;

        // النتيجة الدقيقة
        if (
            prediction.predicted_home_score === homeScore &&
            prediction.predicted_away_score === awayScore
        ) {

            points = 3;

        } else {

            const actualResult =
                homeScore > awayScore
                    ? "home"
                    : homeScore < awayScore
                    ? "away"
                    : "draw";

            const predictedResult =
                prediction.predicted_home_score >
                prediction.predicted_away_score
                    ? "home"
                    : prediction.predicted_home_score <
                      prediction.predicted_away_score
                    ? "away"
                    : "draw";

            if (
                actualResult === predictedResult
            ) {

                points = 1;

            }

        }

        await supabaseClient
            .from("predictions")
            .update({
                points: points
            })
            .eq("id", prediction.id);

    }

    alert("✅ تم حفظ النتيجة وحساب النقاط");

}


}

function toggleSection(id) {

    const section =
        document.getElementById(id);

    if (section.style.display === "none") {

        section.style.display = "block";

    } else {

        section.style.display = "none";

    }

}

const toggleRound = toggleSection;

document
.getElementById("addMatchBtn")
.addEventListener("click", addMatch);

async function addMatch() {

    const homeTeam =
        document.getElementById(
            "newHomeTeam"
        ).value;

    const awayTeam =
        document.getElementById(
            "newAwayTeam"
        ).value;

    const round =
        parseInt(
            document.getElementById(
                "newRound"
            ).value
        );

    const matchDate =
        document.getElementById(
            "newMatchDate"
        ).value;

    const { error } =
        await supabaseClient
            .from("matches")
            .insert([{
                home_team: homeTeam,
                away_team: awayTeam,
                round: round,
                match_date: matchDate
            }]);

    if (error) {

        alert("فشل إضافة المباراة");

        console.log(error);

    } else {

        alert("✅ تم إضافة المباراة");

        loadMatches();

    }

}

async function deleteMatch(matchId) {

    const confirmDelete =
        confirm("هل أنت متأكد من حذف المباراة؟");

    if (!confirmDelete) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("matches")
            .delete()
            .eq("id", matchId);

    if (error) {

        alert("فشل حذف المباراة");

        console.log(error);

    } else {

        alert("✅ تم حذف المباراة");

        loadMatches();

    }

}


async function updateMatch(matchId) {

    const homeTeam =
        document.getElementById(
            `edit-home-${matchId}`
        ).value;

    const awayTeam =
        document.getElementById(
            `edit-away-${matchId}`
        ).value;

    const round =
        parseInt(
            document.getElementById(
                `edit-round-${matchId}`
            ).value
        );

    const matchDate =
        document.getElementById(
            `edit-date-${matchId}`
        ).value;

    const { error } =
        await supabaseClient
            .from("matches")
            .update({
                home_team: homeTeam,
                away_team: awayTeam,
                round: round,
                match_date: matchDate
            })
            .eq("id", matchId);

    if (error) {

        alert("فشل تعديل المباراة");

        console.log(error);

    } else {

        alert("✅ تم تعديل المباراة");

        loadMatches();

    }

}
