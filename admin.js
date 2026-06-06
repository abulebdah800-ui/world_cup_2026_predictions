const password = prompt("أدخل كلمة المرور");

if (password !== "hamza2026") {

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

loadPlayers();

async function loadPlayers() {

    const { data } = await supabaseClient
        .from("predictions")
        .select("player_name");

    const uniquePlayers =
        [...new Set(data.map(p => p.player_name))];

    const select =
        document.getElementById("playerSelect");

    uniquePlayers.forEach(player => {

        select.innerHTML +=
            `<option>${player}</option>`;

    });

}

document
    .getElementById("playerSelect")
    .addEventListener("change", loadPredictions);

    document
    .getElementById("teamSearch")
    .addEventListener("input", loadPredictions);

async function loadPredictions() {

    const player =
        document.getElementById("playerSelect").value;

    const content =
        document.getElementById("adminContent");

        const searchText =
    document
        .getElementById("teamSearch")
        .value
        .trim()
        .toLowerCase();

    if (player === "اختر لاعب") {

        content.innerHTML = "";

        return;
    }

    const { data: predictions } =
        await supabaseClient
            .from("predictions")
            .select("*")
            .eq("player_name", player);

    const { data: matches } =
        await supabaseClient
            .from("matches")
            .select("*");

    content.innerHTML = "";

    let totalPoints = 0;

    const rounds = {};

    predictions.forEach(prediction => {

        if (!rounds[prediction.round]) {
            rounds[prediction.round] = [];
        }

        rounds[prediction.round].push(prediction);

    });

    Object.keys(rounds)
        .sort((a, b) => a - b)
        .forEach(round => {

            let roundPoints = 0;
            let roundHtml = "";

            rounds[round].forEach(prediction => {

                const match = matches.find(
                    m => m.id === prediction.match_id
                );

                if (!match) return;
                if (
    searchText &&
    !match.home_team.toLowerCase().includes(searchText) &&
    !match.away_team.toLowerCase().includes(searchText)
) {
    return;
}

                let points = 0;

                if (
                    match.home_score !== null &&
                    match.away_score !== null
                ) {

                    if (
                        prediction.predicted_home_score ==
                        match.home_score &&
                        prediction.predicted_away_score ==
                        match.away_score
                    ) {

                        points = 3;

                    } else {

                        const predictedResult =
                            Math.sign(
                                prediction.predicted_home_score -
                                prediction.predicted_away_score
                            );

                        const actualResult =
                            Math.sign(
                                match.home_score -
                                match.away_score
                            );

                        if (
                            predictedResult === actualResult
                        ) {
                            points = 1;
                        }

                    }

                }

                roundPoints += points;
                totalPoints += points;

                roundHtml += `
                <div class="match">

                    <h3>
                        ${match.home_team}
                        ×
                        ${match.away_team}
                    </h3>

                    <p>
                        التوقع:
                        ${prediction.predicted_home_score}
                        -
                        ${prediction.predicted_away_score}
                    </p>

                    <p>
                        النتيجة الفعلية:
                        ${match.home_score ?? "-"}
                        -
                        ${match.away_score ?? "-"}
                    </p>

                    <p>
                        النقاط:
                        ${points}
                    </p>

                </div>
                `;

            });

            content.innerHTML += `
            <div class="match">

                <h2
                    onclick="toggleRound('round-${round}')"
                    style="cursor:pointer"
                >
                    🏆 الجولة ${round}

                    <span style="color:#f4b400">
                        (${roundPoints} نقطة)
                    </span>

                    ▼
                </h2>

                <div
                    id="round-${round}"
                    style="display:none;"
                >

                    ${roundHtml}

                </div>

            </div>
            `;

        });

    content.innerHTML += `
    <div class="match">

        <h2>
            🏆 المجموع الكلي:
            ${totalPoints}
            نقطة
        </h2>

    </div>
    `;

}

function toggleRound(id) {

    const section =
        document.getElementById(id);

    if (section.style.display === "none") {

        section.style.display = "block";

    } else {

        section.style.display = "none";

    }

}