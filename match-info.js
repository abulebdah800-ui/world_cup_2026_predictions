const params = new URLSearchParams(window.location.search);

const homeTeam = params.get("home");
const awayTeam = params.get("away");

document.getElementById("matchTitle").innerHTML =
`${homeTeam} × ${awayTeam}`;

const matchAnalysis = {

"النمسا|الاردن":`
📊 تحليل المباراة

🇦🇹 النمسا

🌍 الترتيب العالمي: 23

📈 آخر 5 نتائج (الأقدم ← الأحدث):
🤝 البوسنة 1-1 النمسا
✅ النمسا 5-1 غانا
✅ النمسا 1-0 كوريا الجنوبية
✅ النمسا 1-0 تونس
🤝 صربيا 1-1 النمسا

🚑 أبرز الغيابات:
كريستوف باومغارتنر

🇯🇴 الأردن

🌍 الترتيب العالمي: 63

📈 آخر 5 نتائج (الأقدم ← الأحدث):
🤝 الأردن 1-1 نيجيريا
🤝 الأردن 2-2 كوستاريكا
❌ سويسرا 4-1 الأردن
❌ كولومبيا 2-0 الأردن
❌ الأردن 0-1 النمسا (ودية مغلقة)

🚑 أبرز الغيابات:
يزن النعيمات

📊 نسب التوقع:

🇦🇹 فوز النمسا: 64%

🤝 التعادل: 22%

🇯🇴 فوز الأردن: 14%

🎯 النتيجة المتوقعة:

النمسا 2-0 الأردن

📝 التحليل:

النمسا تدخل المباراة بفورمة أفضل ونتائج أكثر استقراراً، كما تتفوق بوضوح في التصنيف العالمي وجودة اللاعبين والخبرة الأوروبية. الأردن يمتلك عناصر مميزة مثل موسى التعمري وروحاً قتالية عالية، لكن النتائج الأخيرة أمام منتخبات قوية أظهرت صعوبة مواجهة منتخبات المستوى الأول.ح
`
};

const matchKey = `${homeTeam}|${awayTeam}`;

const analysis =
matchAnalysis[matchKey] ||
`
لا يوجد تحليل لهذه المباراة حالياً.

سيتم إضافة التحليل قبل موعد المباراة.
`;

document.getElementById("matchInfoContent").innerHTML = `
<div style="
    text-align:right;
    line-height:2;
    font-size:18px;
    white-space:pre-line;
    background:#ffffff;
    padding:20px;
    border-radius:15px;
">
${analysis}
</div>
`;