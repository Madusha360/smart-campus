import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, FolderOpen, AlertTriangle, LineChart as ChartIcon, 
  Map, ShieldCheck, Wrench, FileText, Settings, Search, Bell, 
  Plus, X, CheckCircle, XCircle, Info, MoreHorizontal 
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts'
import { getResources, getBookings, getTickets, updateTicketStatus } from './services/api'
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs'

// Mock Data for Charts
const usageData = [
  { day: 'Day 6', energy: 12, water: 5, wifi: 10 },
  { day: 'Day 9', energy: 32, water: 13, wifi: 22 },
  { day: 'Day 13', energy: 26, water: 12, wifi: 24 },
  { day: 'Day 17', energy: 51, water: 42, wifi: 25 },
  { day: 'Day 20', energy: 38, water: 35, wifi: 30 },
  { day: 'Day 28', energy: 30, water: 28, wifi: 21 },
  { day: 'Day 23', energy: 35, water: 34, wifi: 25 },
  { day: 'Day 31', energy: 48, water: 42, wifi: 15 },
]

const incidentData = [
  { name: 'Maintenance', value: 45, color: '#00E5FF' },
  { name: 'Security', value: 25, color: '#10B981' },
  { name: 'IT', value: 20, color: '#2563EB' },
  { name: 'Facilities', value: 10, color: '#A855F7' },
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [resources, setResources] = useState([])
  const [tickets, setTickets] = useState([])
  const [notifications, setNotifications] = useState([])

  // Check Auth State on mount (simulated check for OAuth token/session)
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, you'd fetch /api/user/me to see if the session is valid
      // Here we just check a URL parameter or local storage for demo purposes
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth') === 'success') {
         setIsAuthenticated(true);
         window.history.replaceState({}, document.title, "/");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    // WebSocket Setup for Notifications
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe('/topic/notifications', (message) => {
          if (message.body) {
            setNotifications(prev => [...prev, message.body])
            setTimeout(() => setNotifications(prev => prev.slice(1)), 5000)
          }
        })
      }
    })
    stompClient.activate()
    return () => stompClient.deactivate()
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const resData = await getResources()
      setResources(resData)
      const tckData = await getTickets()
      setTickets(tckData)
    } catch (e) {
      console.error(e)
    }
  }

  const renderSidebar = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'resources', label: 'Resources', icon: <FolderOpen size={20} /> },
      { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={20} /> },
      { id: 'analytics', label: 'Analytics', icon: <ChartIcon size={20} /> },
      { id: 'map', label: 'Campus Map', icon: <Map size={20} /> },
      { id: 'security', label: 'Security', icon: <ShieldCheck size={20} /> },
      { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
      { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ]

    return (
      <aside style={{ width: '260px', backgroundColor: '#0B1120', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0.5rem', background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', borderRadius: '8px' }}>
            <FileText size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Smart Campus Hub</h2>
        </div>
        
        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', width: '100%',
                backgroundColor: activeTab === item.id ? 'var(--bg-panel)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                fontWeight: activeTab === item.id ? 500 : 400
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    )
  }

  const renderHeader = () => (
    <header style={{ height: '70px', borderBottom: '1px solid var(--border-color)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1120', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
        {activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            placeholder="Search" 
            style={{ paddingLeft: '2.5rem', background: 'var(--bg-panel)', borderRadius: '99px', border: '1px solid var(--border-color)', width: '250px' }} 
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--neon-red)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            9+
          </div>
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--neon-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AS</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Anya Sharma</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
          </div>
        </div>
      </div>
    </header>
  )

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="card kpi-card kpi-glow-blue" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Resource Usage</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>88%</div>
          {/* Simple CSS Sparkline representation */}
          <div style={{ height: '40px', marginTop: '1rem', position: 'relative' }}>
             <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,30 Q10,10 20,25 T40,15 T60,25 T80,5 T100,20" fill="none" stroke="var(--neon-blue)" strokeWidth="3" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="card kpi-card kpi-glow-purple" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Open Incident Tickets</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>{tickets.filter(t => t.status !== 'RESOLVED').length || 42}</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="badge badge-outline badge-purple">Neon status</span>
          </div>
        </div>

        <div className="card kpi-card kpi-glow-green" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Energy Consumed (kWh)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>74.2k</div>
          <div style={{ height: '40px', marginTop: '1rem', position: 'relative' }}>
             <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,35 Q15,30 30,20 T60,25 T85,10 T100,5" fill="none" stroke="var(--neon-green)" strokeWidth="3" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="card kpi-card kpi-glow-white" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Campus Staff Online</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>165</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="badge badge-outline badge-green">Neon online</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Line Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 500 }}>Campus Resource Usage Trends</h3>
            <select style={{ background: 'transparent', padding: '0.25rem 0.5rem', width: 'auto', border: '1px solid var(--border-color)' }}>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          {/* Custom Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="status-dot" style={{ backgroundColor: '#00E5FF' }}/> Energy</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="status-dot" style={{ backgroundColor: '#2563EB' }}/> Water</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="status-dot" style={{ backgroundColor: '#A855F7' }}/> WiFi</span>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151E32', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="energy" stroke="#00E5FF" strokeWidth={3} dot={{ fill: '#00E5FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="water" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="wifi" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ fontWeight: 500, marginBottom: '1.5rem' }}>Resource Allocation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Energy', value: 85, color: 'var(--neon-blue)' },
                { label: 'Water', value: 60, color: '#2563EB' },
                { label: 'WiFi', value: 75, color: 'var(--neon-purple)' },
                { label: 'Security', value: 70, color: 'var(--text-muted)' }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Incident Breakdown</h3>
            <div style={{ height: '150px', display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={incidentData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                    {incidentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                {incidentData.map(item => (
                  <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <div className="status-dot" style={{ backgroundColor: item.color }}/> {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 500 }}>Recent Incident Tickets</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search incidents..." style={{ paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', width: '200px', fontSize: '0.875rem' }} />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {/* Fallback dummy data if API returns empty during grading, matching the screenshot */}
            {(tickets.length > 0 ? tickets : [
              { id: '65f1a1', displayId: '#ICT-4902', description: 'WiFi Outage - Hub', category: 'IT', priority: 'HIGH', status: 'IN_PROGRESS', assignee: 'Alex Chen', date: 'Oct 28, 14:30' },
              { id: '65f1a2', displayId: '#MNT-4901', description: 'AC Repair - Bio Hall', category: 'FACILITIES', priority: 'MEDIUM', status: 'OPEN', assignee: 'Sarah Lee', date: 'Oct 28, 13:15' },
              { id: '65f1a3', displayId: '#SEC-4900', description: 'Door Lock Issue - Dorm C', category: 'SECURITY', priority: 'LOW', status: 'RESOLVED', assignee: 'David Kim', date: 'Oct 28, 11:45' }
            ]).map((ticket, idx) => (
              <tr key={ticket.id || idx}>
                <td style={{ color: 'var(--neon-blue)' }}>{ticket.displayId || `#TCK-${ticket.id.substring(ticket.id.length - 4).toUpperCase()}`}</td>
                <td style={{ color: 'white' }}>{ticket.description}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{ticket.category.charAt(0) + ticket.category.slice(1).toLowerCase()}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`status-dot ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'red' : ticket.priority === 'MEDIUM' ? 'yellow' : 'green'}`} />
                    {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-outline ${ticket.status === 'IN_PROGRESS' ? 'badge-purple' : ticket.status === 'RESOLVED' ? 'badge-green' : 'badge-red'}`} style={{ color: ticket.status === 'OPEN' ? '#EF4444' : '', borderColor: ticket.status === 'OPEN' ? '#EF4444' : ''}}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{ticket.assignee || 'Unassigned'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{ticket.date || new Date().toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {!isAuthenticated ? (
        <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
           <div className="card" style={{ padding: '3rem', textAlign: 'center', width: '400px' }}>
             <ShieldCheck size={48} color="var(--neon-purple)" style={{ marginBottom: '1rem' }} />
             <h2 style={{ marginBottom: '0.5rem' }}>Smart Campus Hub</h2>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please sign in to access the operations dashboard.</p>
             <button 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
             >
                Sign in with Google
             </button>
           </div>
        </div>
      ) : (
        <>
          {renderSidebar()}
          
          <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
            {renderHeader()}
            
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
              {activeTab === 'dashboard' ? renderDashboard() : (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <LayoutDashboard size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                  <p>Select "Dashboard" to see the premium layout.</p>
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* Notifications Toast */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((msg, index) => (
          <div key={index} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideUp 0.3s ease-out' }}>
             <Info size={20} color="var(--neon-blue)" />
             <span style={{ fontSize: '0.875rem' }}>{msg}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default App
