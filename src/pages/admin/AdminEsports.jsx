import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Calculator, 
  Flame, 
  TrendingUp, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

export default function AdminEsports() {
  const { token } = useAuth();
  const toast = useToast();

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournId, setSelectedTournId] = useState(1);
  const [leaderboard, setLeaderboard] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchForm, setMatchForm] = useState({
    match_title: '',
    match_number: 1,
    map_name: 'Erangel',
    mvp_player: '',
    results: [] // Array of { team_id, team_name, placement, kills }
  });

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ team_id: null, team_name: '', total_points_override: 0, reason: '' });

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ team_name: '', tag: '', captain_name: '', captain_contact: '', members: '' });

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/esports/overview')
      .then(res => res.json())
      .then(data => {
        if (data && data.tournaments) {
          setTournaments(data.tournaments);
          if (data.tournaments.length > 0 && !selectedTournId) {
            setSelectedTournId(data.tournaments[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchLeaderboard = () => {
    if (!selectedTournId) return;
    fetch(`/api/esports/tournaments/${selectedTournId}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLeaderboard(data.leaderboard || []);
          setMatches(data.matches || []);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTournId]);

  const handleOpenEnterMatch = () => {
    // Initialize results array for each team in the tournament
    const initialResults = leaderboard.map((team, idx) => ({
      team_id: team.id,
      team_name: team.team_name,
      placement: idx + 1,
      kills: 0
    }));

    setMatchForm({
      match_title: `Match #${(matches.length || 0) + 1}`,
      match_number: (matches.length || 0) + 1,
      map_name: 'Miramar / Desert',
      mvp_player: '',
      results: initialResults
    });
    setMatchModalOpen(true);
  };

  const handleSaveMatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/esports/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tournament_id: selectedTournId,
          ...matchForm
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Match results recorded and leaderboard updated!');
        setMatchModalOpen(false);
        fetchLeaderboard();
      } else {
        toast.error(data.error || 'Failed to record match.');
      }
    } catch (err) {
      toast.error('Network error recording match.');
    }
  };

  const handleOpenAdjust = (team) => {
    setAdjustForm({
      team_id: team.id,
      team_name: team.team_name,
      total_points_override: team.total_points,
      reason: ''
    });
    setAdjustModalOpen(true);
  };

  const handleSaveAdjust = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/esports/teams/${adjustForm.team_id}/adjust-points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total_points_override: adjustForm.total_points_override,
          reason: adjustForm.reason
        })
      });

      if (res.ok) {
        toast.success('Points adjusted successfully!');
        setAdjustModalOpen(false);
        fetchLeaderboard();
      } else {
        toast.error('Failed to adjust points.');
      }
    } catch (err) {
      toast.error('Network error during point adjustment.');
    }
  };

  const handleSaveNewTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/esports/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tournament_id: selectedTournId,
          ...teamForm
        })
      });

      if (res.ok) {
        toast.success('Team registered in tournament!');
        setTeamModalOpen(false);
        setTeamForm({ team_name: '', tag: '', captain_name: '', captain_contact: '', members: '' });
        fetchLeaderboard();
      } else {
        toast.error('Failed to register team.');
      }
    } catch (err) {
      toast.error('Network error registering team.');
    }
  };

  return (
    <div className="admin-esports-root">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>E-Sports Operations & Scoring</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Input match results, configure scoring rule engines, and manage live standings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setTeamModalOpen(true)} className="btn btn-sm btn-secondary">
            <Users size={16} />
            <span>Register Squad</span>
          </button>
          <button onClick={handleOpenEnterMatch} className="btn btn-sm btn-primary">
            <Plus size={16} />
            <span>Record Match Results</span>
          </button>
        </div>
      </div>

      {/* Tournament Selector */}
      <div className="glass-card-static" style={{ marginBottom: '1.75rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={20} className="text-magenta" />
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>Active Tournament:</span>
        </div>
        <select
          className="form-select"
          style={{ maxWidth: '380px' }}
          value={selectedTournId}
          onChange={e => setSelectedTournId(parseInt(e.target.value, 10))}
        >
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.game_name})
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard Table with Live Point Editor */}
      <div className="glass-card-static" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} className="text-cyan" /> Tournament Standings & Team Points
          </h3>
          <span className="badge badge-emerald">Real-time Recalculation Active</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Captain</th>
                <th style={{ textAlign: 'center' }}>Matches</th>
                <th style={{ textAlign: 'center' }}>Wins</th>
                <th style={{ textAlign: 'center' }}>Kills</th>
                <th style={{ textAlign: 'center' }}>Placement Pts</th>
                <th style={{ textAlign: 'center' }}>Total Pts</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, idx) => (
                <tr key={team.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: idx === 0 ? '#FFD700' : (idx === 1 ? '#C0C0C0' : (idx === 2 ? '#CD7F32' : '#94A3B8')) }}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{team.logo_url || '🎮'}</span>
                      <strong style={{ color: '#FFFFFF' }}>{team.team_name}</strong>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{team.tag}</span>
                    </div>
                  </td>
                  <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{team.captain_name}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{team.matches_played}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#00FF9D' }}>{team.wins}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{team.kills}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>{team.placement_points}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#00F0FF', fontWeight: '800', fontSize: '1.05rem' }}>
                    {team.total_points}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenAdjust(team)}
                      className="btn btn-sm btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                      title="Adjust points manually"
                    >
                      <Sliders size={13} /> Adjust Pts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Match Results Modal */}
      {matchModalOpen && (
        <Modal
          isOpen={matchModalOpen}
          onClose={() => setMatchModalOpen(false)}
          title={`Input Results: ${matchForm.match_title}`}
          maxWidth="720px"
        >
          <form onSubmit={handleSaveMatch}>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Match Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={matchForm.match_title}
                  onChange={e => setMatchForm({ ...matchForm, match_title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Map Rotation</label>
                <input
                  type="text"
                  className="form-control"
                  value={matchForm.map_name}
                  onChange={e => setMatchForm({ ...matchForm, map_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Match MVP Player</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. VP_Vortex (9 Kills)"
                  value={matchForm.mvp_player}
                  onChange={e => setMatchForm({ ...matchForm, mvp_player: e.target.value })}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', margin: '1rem 0 0.75rem 0' }}>
              Squad Placements & Kills (Points Auto-Calculated)
            </h4>

            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem', background: 'rgba(0, 0, 0, 0.4)' }}>
              {matchForm.results.map((resItem, idx) => (
                <div
                  key={resItem.team_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.8fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: idx < matchForm.results.length - 1 ? '1px dashed rgba(255, 255, 255, 0.08)' : 'none'
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9rem' }}>{resItem.team_name}</span>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Rank Placement</label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                      value={resItem.placement}
                      onChange={e => {
                        const updated = [...matchForm.results];
                        updated[idx].placement = parseInt(e.target.value, 10);
                        setMatchForm({ ...matchForm, results: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Kills / Eliminations</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                      value={resItem.kills}
                      onChange={e => {
                        const updated = [...matchForm.results];
                        updated[idx].kills = parseInt(e.target.value, 10);
                        setMatchForm({ ...matchForm, results: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setMatchModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Calculate & Update Leaderboard
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Adjust Points Modal */}
      {adjustModalOpen && (
        <Modal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          title={`Adjust Points: ${adjustForm.team_name}`}
        >
          <form onSubmit={handleSaveAdjust}>
            <div className="form-group">
              <label className="form-label">Total Points Override</label>
              <input
                type="number"
                className="form-control"
                value={adjustForm.total_points_override}
                onChange={e => setAdjustForm({ ...adjustForm, total_points_override: parseInt(e.target.value, 10) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Adjustment Reason / Notes</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Penalty deduction (-5) for late lobby check-in"
                value={adjustForm.reason}
                onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setAdjustModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Adjustment</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Register Team Modal */}
      {teamModalOpen && (
        <Modal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          title="Register Team in Tournament"
        >
          <form onSubmit={handleSaveNewTeam}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apex Predators"
                  value={teamForm.team_name}
                  onChange={e => setTeamForm({ ...teamForm, team_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Team Tag</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. APX"
                  value={teamForm.tag}
                  onChange={e => setTeamForm({ ...teamForm, tag: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Captain Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={teamForm.captain_name}
                  onChange={e => setTeamForm({ ...teamForm, captain_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Captain Contact</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email or Discord"
                  value={teamForm.captain_contact}
                  onChange={e => setTeamForm({ ...teamForm, captain_contact: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Teammates Roster (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Raptor, Fang, Ghost, Venom"
                value={teamForm.members}
                onChange={e => setTeamForm({ ...teamForm, members: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setTeamModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Register Team</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
