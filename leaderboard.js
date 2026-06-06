const SUPABASE_URL = "https://lobrvpvvplbozmbsepag.supabase.co";
const SUPABASE_KEY = "sb_publishable_5fKjX0WFwQLfIwe74bXCow_knBJA00W";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

loadLeaderboard();

async function loadLeaderboard() {

    const { data: predictions, error: predictionsError } =
        await supabaseClient
            .from("predictions")
            .select("*");

    const { data: matches, error: matchesError } =
        await supabaseClient
            .from("matches")
            .select("*");

    if (predictionsError || matchesError) {
        console.log(predictionsError || matchesError);
        return;
    }

    const players = {};

    predictions.forEach(prediction => {

        const match = matches.find(
            m => m.id === prediction.match_id
        );

        if (!match) return;

        if (
            match.home_score === null ||
            match.away_score === null
        ) {
            return;
        }

        let points = 0;

        // توقع النتيجة بالزبط
        if (
            prediction.predicted_home_score == match.home_score &&
            prediction.predicted_away_score == match.away_score
        ) {
            points = 3;
        }

        // توقع الفائز أو التعادل
        else {

            const predictedResult = Math.sign(
                prediction.predicted_home_score -
                prediction.predicted_away_score
            );

            const actualResult = Math.sign(
                match.home_score -
                match.away_score
            );

            if (predictedResult === actualResult) {
                points = 1;
            }

        }

        if (!players[prediction.player_name]) {
            players[prediction.player_name] = 0;
        }

        players[prediction.player_name] += points;

    });

    const ranking = Object.entries(players)
        .sort((a, b) => b[1] - a[1]);

    const leaderboard =
        document.getElementById("leaderboard");

    leaderboard.innerHTML = "";

    ranking.forEach(([player, points], index) => {

        let medal = "";

        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        leaderboard.innerHTML += `
            <div class="match">
                <h2>${medal} #${index + 1} - ${player}</h2>
                <p>${points} نقطة</p>
            </div>
        `;

    });

}