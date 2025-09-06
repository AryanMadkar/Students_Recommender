// tests/apiSmokeTest.js
const axios = require("axios");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // FIXED: Port 5000
const api = axios.create({
  baseURL: BASE_URL + "/api",
  validateStatus: () => true,
  headers: { "Content-Type": "application/json" },
});

// Health endpoint needs separate client (not under /api)
const healthApi = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true,
});

const rand = Math.floor(Math.random() * 1e6);
const testUser = {
  name: `Aryan${rand}`,
  // email: `aryan${rand}@example.com`,
  email: `aryanmadkar70@example.com`,
  password: "StrongP4ssword",
  phone: "9876543210",
  educationStage: "ongoing",
};

let token = "";
let assessmentId = "";
let resultId = "";
let collegeIdA = "";
let collegeIdB = "";

function hr(label) {
  console.log(`\n=== ${label} ===`);
}

function show(res) {
  const { status, data } = res;
  console.log("Status:", status);
  console.log("Body:", JSON.stringify(data, null, 2));
  return { status, data };
}

async function main() {
  try {
    hr("HEALTH CHECK");
    // FIXED: Use healthApi for /health endpoint
    let res = await healthApi.get("/health");
    show(res);

    hr("AUTH: REGISTER");
    res = await api.post("/auth/register", testUser);
    show(res);

    hr("AUTH: LOGIN");
    res = await api.post("/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });
    const login = show(res).data;
    token = login?.data?.token;
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token obtained:", token.substring(0, 20) + "...");
    }

    hr("AUTH: ME");
    res = await api.get("/auth/me");
    show(res);

    hr("AUTH: VALIDATE TOKEN");
    res = await api.get("/auth/validate");
    show(res);

    hr("USERS: PROFILE GET");
    res = await api.get("/users/profile");
    show(res);

    hr("USERS: PROFILE UPDATE");
    res = await api.put("/users/profile", {
      personalInfo: { city: "Mumbai", state: "Maharashtra" },
    });
    show(res);

    hr("ASSESSMENTS: LIST");
    res = await api.get("/assessments");
    const assessments = show(res).data?.data || [];
    if (assessments.length > 0) {
      assessmentId = assessments[0]._id;
      console.log("✅ Found assessment:", assessmentId);

      hr("ASSESSMENTS: START");
      res = await api.get(`/assessments/${assessmentId}/start`);
      const start = show(res).data?.data;
      const questions = start?.questions || [];

      if (questions.length > 0) {
        // Build a submission payload
        const responses = {};
        const timeSpent = {};
        for (const q of questions.slice(0, 5)) {
          // Test with first 5 questions
          if (q.type === "multiple_choice" && q.options?.[0]) {
            responses[q._id] = q.options[0].value;
          } else if (q.type === "rating") {
            responses[q._id] = 4;
          } else if (q.type === "boolean") {
            responses[q._id] = true;
          } else if (q.type === "ranking" && q.options) {
            responses[q._id] = q.options.map((o) => o.value);
          } else if (q.type === "text") {
            responses[q._id] = "Sample response";
          }
          timeSpent[q._id] = 5;
        }
        timeSpent.total = Object.keys(responses).length * 5;

        hr("ASSESSMENTS: SUBMIT");
        res = await api.post(`/assessments/${assessmentId}/submit`, {
          responses,
          timeSpent,
        });
        const submit = show(res).data?.data;
        resultId = submit?.result?._id;

        hr("ASSESSMENTS: RESULTS LIST");
        res = await api.get("/assessments/results");
        show(res);

        if (resultId) {
          hr("ASSESSMENTS: RESULT DETAIL");
          res = await api.get(`/assessments/results/${resultId}`);
          show(res);
        }
      }
    }

    hr("COLLEGES: SEARCH (PUBLIC)");
    res = await api.get("/colleges/search", {
      params: { state: "Delhi", course: "Computer Science", limit: 5 },
    });
    const search = show(res).data?.data?.colleges || [];
    if (search.length > 0) {
      collegeIdA = search[0]._id;
      collegeIdB = search[1]?._id;

      hr("COLLEGES: DETAILS (PUBLIC)");
      res = await api.get(`/colleges/${collegeIdA}`);
      show(res);

      if (collegeIdB) {
        hr("COLLEGES: COMPARE (AUTH)");
        res = await api.post("/colleges/compare", {
          collegeIds: [collegeIdA, collegeIdB],
        });
        show(res);
      }

      hr("COLLEGES: ADD FAVORITE (AUTH)");
      res = await api.post(`/colleges/${collegeIdA}/favorite`);
      show(res);

      hr("COLLEGES: USER FAVORITES (AUTH)");
      res = await api.get("/colleges/user/favorites");
      show(res);
    }

    hr("COLLEGES: PERSONALIZED RECS (AUTH)");
    res = await api.get("/colleges/recommendations/personalized", {
      params: {
        course: "Computer Science",
        budget: 250000,
        preferredState: "Maharashtra",
      },
    });
    show(res);

    hr("RECOMMENDATIONS: GENERATE (AUTH)");
    res = await api.post("/recommendations/generate");
    show(res);

    hr("RECOMMENDATIONS: GUIDANCE (AUTH)");
    res = await api.get("/recommendations/guidance");
    show(res);

    hr("RECOMMENDATIONS: CAREERS (AUTH)");
    res = await api.get("/recommendations/careers");
    show(res);

    hr("DASHBOARD: OVERVIEW (AUTH)");
    res = await api.get("/dashboard");
    show(res);

    hr("USERS: PREFERENCES GET (AUTH)");
    res = await api.get("/users/preferences");
    show(res);

    console.log("\n✅ All smoke tests completed successfully!");
  } catch (e) {
    console.error("❌ Test run failed:", e?.response?.data || e.message);
  }
}

main();
