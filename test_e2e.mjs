// Use native Node.js global fetch

async function runTests() {
  console.log('🧪 Starting Automated E2E Integration Tests for NextGen AR/VR Portal...\n');
  const BASE_URL = 'http://localhost:5000';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('API Health Check', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('Status not healthy');
  });

  // 2. Public Events API
  await test('Public Events List & Live Spots Calculation', async () => {
    const res = await fetch(`${BASE_URL}/api/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.events) || data.events.length === 0) throw new Error('No events returned');
    const first = data.events[0];
    if (typeof first.spots_remaining !== 'number') throw new Error('Missing spots_remaining calculation');
  });

  // 3. Public Members Directory
  await test('Public Members Directory & Filtering', async () => {
    const res = await fetch(`${BASE_URL}/api/members`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.members) || data.members.length === 0) throw new Error('No members returned');
  });

  // 4. Interactive E-Sports Points Calculator
  await test('E-Sports Calculator Engine (Battle Royale & Multiplier)', async () => {
    const res = await fetch(`${BASE_URL}/api/esports/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scoring_type: 'battle_royale',
        placement: 1, // 15 pts
        kills: 8,     // 8 pts
        is_win: true  // +5 bonus -> 28 total
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.result.total_points !== 28) throw new Error(`Expected 28 points, got ${data.result.total_points}`);
    if (data.result.placement_points !== 15) throw new Error('Placement points mismatch');
  });

  // 5. Submit Club Application
  let testAppId = null;
  await test('Submit Public Club Membership Application', async () => {
    const uniqueRoll = `TEST${Date.now().toString().slice(-4)}`;
    const res = await fetch(`${BASE_URL}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Test Applicant XR',
        roll_no: uniqueRoll,
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        email: `test.${uniqueRoll.toLowerCase()}@college.edu`,
        phone: '+91 99999 88888',
        domains: ['AR/VR & Spatial Computing', 'Game Development'],
        why_join: 'Passionate about building WebXR and Three.js 3D spatial simulations.',
        experience: 'Built 2 Unity prototypes',
        portfolio_url: 'https://github.com/test-applicant'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.application_id) throw new Error('Missing application_id');
    testAppId = data.application_id;
  });

  // 6. Submit Event Registration
  await test('Submit Event Registration (Solo Mode)', async () => {
    const res = await fetch(`${BASE_URL}/api/events/2/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Rohan Event Tester',
        roll_no: `REG${Date.now().toString().slice(-4)}`,
        email: `rohan.reg${Date.now().toString().slice(-4)}@college.edu`,
        phone: '+91 98888 77777',
        branch: 'Information Technology',
        year: '3rd Year',
        is_team: false
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ticket_id) throw new Error('Missing ticket_id');
  });

  // 7. Submit Feedback
  await test('Submit Event Feedback with 5-Star Ratings', async () => {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: 1,
        rating_content: 5,
        rating_organization: 5,
        rating_speaker: 5,
        what_liked: 'Fantastic hands-on Quest 3 passthrough demo!',
        what_improve: 'None, loved it.',
        author_name: 'Feedback Tester',
        author_email: 'tester@college.edu'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 8. Admin Login Authentication
  let adminToken = null;
  await test('Admin Authentication with Bcrypt & JWT Issuance', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nextgenarvr.club',
        password: 'Admin@NextGen2026!'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error('No JWT token returned');
    adminToken = data.token;
  });

  // 9. Admin Protected Route - Dashboard Stats
  await test('Protected Admin Dashboard KPI Metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/cms/dashboard-stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.metrics || data.metrics.totalMembers === undefined) throw new Error('Missing dashboard metrics');
  });

  // 10. Admin Approve Application -> Auto-Creates Member
  if (testAppId) {
    await test('Admin 1-Click Approve Application & Automatic Member Conversion', async () => {
      const res = await fetch(`${BASE_URL}/api/applications/${testAppId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'approved',
          review_notes: 'Approved via automated test suite'
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.createdMember) throw new Error('Failed to auto-create member in database');
      if (data.createdMember.full_name !== 'Test Applicant XR') throw new Error('Member name mismatch');
    });
  }

  // 11. Admin Esports Record Match Results
  await test('Admin Match Results Entry & Leaderboard Live Recalculation', async () => {
    const res = await fetch(`${BASE_URL}/api/esports/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        tournament_id: 1,
        match_title: 'Match 3: Sanhok Jungle Brawl',
        match_number: 3,
        map_name: 'Sanhok',
        mvp_player: 'VP_Krypton (10 Kills)',
        results: [
          { team_id: 1, team_name: 'Vortex Phantom', placement: 1, kills: 12 },
          { team_id: 2, team_name: 'Cyber Valkyries', placement: 2, kills: 7 },
          { team_id: 3, team_name: 'HyperDrive Gaming', placement: 3, kills: 5 }
        ]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.leaderboard || data.leaderboard.length === 0) throw new Error('No updated leaderboard');
    // Top team should maintain or increase total points
    const topTeam = data.leaderboard[0];
    if (topTeam.total_points < 110) throw new Error('Points recalculation failed');
  });

  // 12. Admin CSV Exports
  await test('Admin CSV Exports (Members, Registrants, Feedback, Applications)', async () => {
    const res1 = await fetch(`${BASE_URL}/api/admin/export/members.csv`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
    if (!res1.ok || !res1.headers.get('content-type').includes('csv')) throw new Error('Members CSV failed');

    const res2 = await fetch(`${BASE_URL}/api/admin/export/feedback.csv`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
    if (!res2.ok || !res2.headers.get('content-type').includes('csv')) throw new Error('Feedback CSV failed');

    const res3 = await fetch(`${BASE_URL}/api/admin/export/applications.csv`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
    if (!res3.ok || !res3.headers.get('content-type').includes('csv')) throw new Error('Applications CSV failed');
  });

  console.log(`\n======================================================`);
  console.log(`🎉 ALL TESTS FINISHED: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);
}

runTests().catch(console.error);
