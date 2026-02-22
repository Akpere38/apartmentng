import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAgents, approveAgent, deleteAgent } from '../../services/agentService';
import { CheckCircle, XCircle, Trash2, Phone, Mail, Building, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AgentManagement = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const fetchAgents = async () => {
    try {
      const data = await getAllAgents();
      setAgents(data);
    } catch (error) {
      alert('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleApprove = async (e, id, currentStatus) => {
    e.stopPropagation(); // Prevent card click
    setActionLoading({ ...actionLoading, [id]: true });
    try {
      await approveAgent(id, !currentStatus);
      fetchAgents();
    } catch (error) {
      alert(error.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading({ ...actionLoading, [id]: false });
    }
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm(`Are you sure you want to delete agent "${name}"?`)) {
      setActionLoading({ ...actionLoading, [id]: true });
      try {
        await deleteAgent(id);
        fetchAgents();
      } catch (error) {
        alert(error.response?.data?.error || 'Delete failed');
      } finally {
        setActionLoading({ ...actionLoading, [id]: false });
      }
    }
  };

  const handleCardClick = (agentId) => {
    navigate(`/admin/agents/${agentId}`);
  };

  if (loading) return <LoadingSpinner />;

  const pendingAgents = agents.filter(a => a.is_approved === 0);
  const approvedAgents = agents.filter(a => a.is_approved === 1);

  return (
    <div className="space-y-8">
      {/* Pending Approvals */}
      {pendingAgents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Pending Approvals
              <span className="ml-3 badge badge-warning">{pendingAgents.length}</span>
            </h2>
          </div>

          <div className="space-y-4">
            {pendingAgents.map((agent) => (
              <div 
                key={agent.id} 
                className="card p-6 border-2 border-amber-200 bg-amber-50/50 cursor-pointer hover:shadow-medium transition-all"
                onClick={() => handleCardClick(agent.id)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {agent.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{agent.name}</h3>
                        <span className="badge badge-warning">Pending Approval</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Mail className="w-4 h-4 mr-2 text-teal-500" />
                        {agent.email}
                      </div>
                      {agent.phone && (
                        <div className="flex items-center text-slate-600">
                          <Phone className="w-4 h-4 mr-2 text-teal-500" />
                          {agent.phone}
                        </div>
                      )}
                      {agent.company_name && (
                        <div className="flex items-center text-slate-600">
                          <Building className="w-4 h-4 mr-2 text-teal-500" />
                          {agent.company_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <button
                      onClick={(e) => handleApprove(e, agent.id, agent.is_approved)}
                      disabled={actionLoading[agent.id]}
                      className="btn-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Agent
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, agent.id, agent.name)}
                      disabled={actionLoading[agent.id]}
                      className="btn-ghost text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Agents */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Approved Agents
            <span className="ml-3 badge badge-success">{approvedAgents.length}</span>
          </h2>
        </div>

        {approvedAgents.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-600">No approved agents yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {approvedAgents.map((agent) => (
              <div 
                key={agent.id} 
                className="card p-6 cursor-pointer hover:shadow-medium transition-all group"
                onClick={() => handleCardClick(agent.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                        {agent.name}
                      </h3>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleApprove(e, agent.id, agent.is_approved)}
                      disabled={actionLoading[agent.id]}
                      className="btn-ghost text-red-600 hover:bg-red-50 text-sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Suspend
                    </button>
                    <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-600">
                    <Mail className="w-4 h-4 mr-2 text-teal-500" />
                    {agent.email}
                  </div>
                  {agent.phone && (
                    <div className="flex items-center text-slate-600">
                      <Phone className="w-4 h-4 mr-2 text-teal-500" />
                      {agent.phone}
                    </div>
                  )}
                  {agent.company_name && (
                    <div className="flex items-center text-slate-600">
                      <Building className="w-4 h-4 mr-2 text-teal-500" />
                      {agent.company_name}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Click to view profile & apartments</span>
                    <ChevronRight className="w-4 h-4" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;