import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Calculator, 
  Flame, 
  Zap, 
  Crown, 
  Crosshair, 
  Calendar, 
  Users, 
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Esports() {
  const toast = useToast();
  const [overview, setOverview] = useState({ games: [], tournaments: [], recentMatches: [] });
  const [activeTournamentId, setActiveTournamentId] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState({ tournament: {}, podium: {}, leaderboard: [], matches: [] });
  const [loading, setLoading] = useState(true);

  // Points Calculator State
  const [calcType, setCalcType] = useState('battle_royale'); // battle_royale or match_win
  const [calcPlacement, setCalcPlacement] = useState(1);
  const [calcKills, setCalcKills] = useState(8);
  const [calcIsWin, setCalcIsWin] = useState(true);
  const [calcResult, setCalcResult] = useState(null);

  // Fetch Esports Overview
  useEffect(() => {
    fetch('/api/esports/overview')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setOverview(data);
          if (data.tournaments && data.tournaments.length > 0) {
            setActiveTournamentId(data.tournaments[0].id);
          }
        }
      })
      .catch(() => toast.error('Failed to load esports hub data.'));
  }, []);

  // Fetch active tournament leaderboard
  useEffect(() => {
    if (!activeTournamentId) return;
    setLoading(true);
    fetch(`/api/esports/tournaments/${activeTournamentId}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLeaderboardData(data);
        }
      })
      .catch(() => toast.error('Failed to load tournament standings.'))
      .finally(() => setLoading(false));
  }, [activeTournamentId]);

  // Reactive Points Calculator calculation
  useEffect(() => {
    fetch('/api/esports/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scoring_type: calcType,
        placement: calcPlacement,
        kills: calcKills,
        is_win: calcIsWin
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.result) {
          setCalcResult(data.result);
        }
      })
      .catch(() => {});
  }, [calcType, calcPlacement, calcKills, calcIsWin]);

  const activeTourn = overview.tournaments.find(t => t.id === activeTournamentId) || leaderboardData.tournament;

  return (
    <div className="esports-hub-root" style={{ background: '#05070B' }}>
      {/* 1. Cyber Hero Header */}
      <section className="esports-hero">
        <div className="container">
          <div className="section-badge magenta esports-pill">
            <Flame size={14} />
            <span>Collegiate Esports Arena</span>
          </div>
          <h1 className="esports-title">
            NextGen <span className="gradient-text-esports">E-Sports Hub</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
            Tactical LAN championships, live points calculator simulator, and real-time tournament standings.
          </p>

          {/* Active Tournament Feature Card */}
          {activeTourn && (
            <div className="tournament-banner-card">
              <div style={{ textAlign: 'left' }}>
                <div className="tournament-meta-pills">
                  <span className="badge badge-magenta">{activeTourn.status ? activeTourn.status.toUpperCase() : 'LIVE'}</span>
                  <span className="badge badge-purple">{activeTourn.game_name || 'Apex / BGMI Battle Royale'}</span>
                  <span className="badge badge-emerald">Season 4</span>
                </div>
                <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {activeTourn.title}
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {activeTourn.description || '16 Collegiate squads competing for championship rings and regional glory.'}
                </p>
                <div className="prize-pool-tag">
                  <Trophy size={24} />
                  <span>Prize Pool: {activeTourn.prize_pool || '₹50,000 INR'}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="#standings" className="btn btn-primary">
                    <TrendingUp size={16} />
                    <span>View Live Standings</span>
                  </a>
                  <a href="#calculator" className="btn btn-secondary">
                    <Calculator size={16} />
                    <span>Open Points Calculator</span>
                  </a>
                </div>
              </div>

              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '220px' }}>
                <img
                  src={activeTourn.banner_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'}
                  alt="Esports Arena"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(5, 7, 11, 0.8) 0%, transparent 60%)' }} />
                <span style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00F0FF' }}>
                  📍 {activeTourn.venue || 'NextGen Esports Lab'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Top 3 Podium Cards */}
      <section className="section" id="standings" style={{ paddingTop: '4rem' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Trophy size={14} />
              <span>Championship Podium</span>
            </div>
            <h2 className="section-title">Current <span className="gradient-text">Top Contenders</span></h2>
            <p className="section-subtitle">
              Live standings computed from match placement points, frag eliminations, and victory multipliers.
            </p>
          </div>

          <div className="podium-container">
            {/* Rank 2 - Silver */}
            {leaderboardData.podium.second ? (
              <div className="podium-card rank-2">
                <span className="podium-crown">🥈</span>
                <div className="podium-rank-badge">2nd Place</div>
                <h3 className="podium-team-name">{leaderboardData.podium.second.team_name}</h3>
                <span className="badge badge-purple">{leaderboardData.podium.second.tag}</span>
                <div className="podium-score-box">
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.second.total_points}</span>
                    <span className="podium-score-lbl">Total Pts</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.second.kills}</span>
                    <span className="podium-score-lbl">Kills</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.second.wins}</span>
                    <span className="podium-score-lbl">WWCD</span>
                  </div>
                </div>
              </div>
            ) : <div className="podium-card rank-2"><p>Awaiting match...</p></div>}

            {/* Rank 1 - Gold */}
            {leaderboardData.podium.first ? (
              <div className="podium-card rank-1">
                <span className="podium-crown">👑 🥇</span>
                <div className="podium-rank-badge">Current Leader</div>
                <h3 className="podium-team-name" style={{ fontSize: '1.6rem', color: '#FFD700' }}>
                  {leaderboardData.podium.first.team_name}
                </h3>
                <span className="badge badge-amber">{leaderboardData.podium.first.tag}</span>
                <div className="podium-score-box" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                  <div>
                    <span className="podium-score-val" style={{ color: '#FFD700' }}>{leaderboardData.podium.first.total_points}</span>
                    <span className="podium-score-lbl">Total Pts</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.first.kills}</span>
                    <span className="podium-score-lbl">Kills</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.first.wins}</span>
                    <span className="podium-score-lbl">WWCD</span>
                  </div>
                </div>
              </div>
            ) : <div className="podium-card rank-1"><p>Awaiting match...</p></div>}

            {/* Rank 3 - Bronze */}
            {leaderboardData.podium.third ? (
              <div className="podium-card rank-3">
                <span className="podium-crown">🥉</span>
                <div className="podium-rank-badge">3rd Place</div>
                <h3 className="podium-team-name">{leaderboardData.podium.third.team_name}</h3>
                <span className="badge badge-purple">{leaderboardData.podium.third.tag}</span>
                <div className="podium-score-box">
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.third.total_points}</span>
                    <span className="podium-score-lbl">Total Pts</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.third.kills}</span>
                    <span className="podium-score-lbl">Kills</span>
                  </div>
                  <div>
                    <span className="podium-score-val">{leaderboardData.podium.third.wins}</span>
                    <span className="podium-score-lbl">WWCD</span>
                  </div>
                </div>
              </div>
            ) : <div className="podium-card rank-3"><p>Awaiting match...</p></div>}
          </div>

          {/* 3. Full Standings Table */}
          <div className="standings-table-box">
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={22} className="text-cyan" /> Full Tournament Standings
            </h3>
            <div className="table-wrapper">
              <table className="custom-table" id="esports-standings-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Rank</th>
                    <th>Team / Clan</th>
                    <th>Captain</th>
                    <th style={{ textAlign: 'center' }}>Matches</th>
                    <th style={{ textAlign: 'center' }}>Wins (WWCD)</th>
                    <th style={{ textAlign: 'center' }}>Total Kills</th>
                    <th style={{ textAlign: 'center' }}>Placement Pts</th>
                    <th style={{ textAlign: 'center' }}>Kill Pts</th>
                    <th style={{ textAlign: 'right' }}>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.leaderboard.map((team, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr key={team.id}>
                        <td>
                          <div className={`rank-badge-cell ${rank === 1 ? 'rank-1-cell' : rank === 2 ? 'rank-2-cell' : rank === 3 ? 'rank-3-cell' : 'rank-default-cell'}`}>
                            #{rank}
                          </div>
                        </td>
                        <td>
                          <div className="team-name-cell">
                            <span>{team.logo_url || '🎮'}</span>
                            <span style={{ color: '#FFFFFF' }}>{team.team_name}</span>
                            <span className="team-tag-pill">{team.tag}</span>
                          </div>
                        </td>
                        <td style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{team.captain_name}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{team.matches_played}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: team.wins > 0 ? '#00FF9D' : '#94A3B8' }}>{team.wins}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{team.kills}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>{team.placement_points}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>{team.kill_points}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="total-points-highlight">{team.total_points}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Points Calculator & Simulator Engine */}
      <section className="section" id="calculator" style={{ background: 'rgba(12, 16, 26, 0.7)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge emerald">
              <Calculator size={14} />
              <span>Scoring Engine</span>
            </div>
            <h2 className="section-title">Points Calculator & <span className="gradient-text-emerald">Match Simulator</span></h2>
            <p className="section-subtitle">
              Simulate match outcomes, test scoring rule presets, and calculate points for your squad.
            </p>
          </div>

          <div className="calculator-box">
            <div className="calculator-grid">
              {/* Left Column: Interactive Controls */}
              <div className="calc-inputs">
                <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>Match Variables</h4>

                <div className="form-group">
                  <label className="form-label">Game Scoring Preset</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setCalcType('battle_royale')}
                      className={`btn btn-sm ${calcType === 'battle_royale' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <Target size={16} />
                      <span>Battle Royale (15-pt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcType('match_win')}
                      className={`btn btn-sm ${calcType === 'match_win' ? 'btn-esports' : 'btn-secondary'}`}
                    >
                      <Crosshair size={16} />
                      <span>Tactical 5v5 (Match Win)</span>
                    </button>
                  </div>
                </div>

                {calcType === 'battle_royale' && (
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Squad Match Placement</label>
                      <span style={{ color: '#00F0FF', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                        #{calcPlacement} ({calcPlacement === 1 ? 'Winner Winner Chicken Dinner' : `${calcPlacement}th Place`})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={calcPlacement}
                      onChange={e => setCalcPlacement(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: '#00F0FF', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                      <span>#1 (15 pts)</span>
                      <span>#5 (6 pts)</span>
                      <span>#10 (1 pt)</span>
                      <span>#16 (0 pts)</span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Total Team Eliminations (Kills)</label>
                    <span style={{ color: '#FF007A', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                      {calcKills} Frags ({calcKills * 1} Pts)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    value={calcKills}
                    onChange={e => setCalcKills(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#FF007A', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                    <span>0 Kills</span>
                    <span>15 Kills</span>
                    <span>35 Kills</span>
                  </div>
                </div>

                {calcType === 'match_win' && (
                  <div className="form-group">
                    <label className="form-label">Match Win Bonus</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFFFFF', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={calcIsWin}
                        onChange={e => setCalcIsWin(e.target.checked)}
                        style={{ accentColor: '#00FF9D', width: '18px', height: '18px' }}
                      />
                      <span>Squad Won Match (+3 Points)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Live Calculation Display */}
              <div className="calc-display">
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                    Auto-Calculated Match Score
                  </span>
                  <div className="calc-total-pts">
                    {calcResult ? calcResult.total_points : 0} <span style={{ fontSize: '1.2rem', color: '#94A3B8' }}>PTS</span>
                  </div>
                </div>

                {calcResult && (
                  <div>
                    <div className="calc-breakdown-row">
                      <span>Placement Points:</span>
                      <span style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>+{calcResult.placement_points}</span>
                    </div>
                    <div className="calc-breakdown-row">
                      <span>Elimination Frag Points:</span>
                      <span style={{ color: '#FF007A', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>+{calcResult.kill_points}</span>
                    </div>
                    <div className="calc-breakdown-row">
                      <span>Winner Bonus:</span>
                      <span style={{ color: '#00FF9D', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>+{calcResult.bonus_points}</span>
                    </div>
                    <div className="calc-breakdown-row total-row">
                      <span>Total Match Yield:</span>
                      <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{calcResult.total_points} PTS</span>
                    </div>

                    <div className="formula-quote">
                      📐 {calcResult.formula}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Match Schedule & Results Archive */}
          {leaderboardData.matches && leaderboardData.matches.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={22} className="text-magenta" /> Match Results Archive
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {leaderboardData.matches.map(match => (
                  <div key={match.id} className="glass-card esports-glow">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-magenta">{match.map_name || 'Map Rotation'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{match.played_at}</span>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>{match.match_title}</h4>
                    {match.mvp_player && (
                      <p style={{ color: '#FFD700', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
                        ⭐ MVP: {match.mvp_player}
                      </p>
                    )}

                    {/* Top 3 of the match */}
                    {match.results && Array.isArray(match.results) && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {match.results.slice(0, 3).map((r, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#FFFFFF' }}>#{r.placement} {r.team_name}</span>
                            <span style={{ color: '#00F0FF', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{r.points} pts ({r.kills}k)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
