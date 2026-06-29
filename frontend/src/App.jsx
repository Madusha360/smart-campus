import { useState, useEffect } from 'react'
import { LayoutDashboard, Calendar, Ticket, Map, Bell } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', margin: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="title-glow" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={24} />
            Smart Campus
          </h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'facilities', label: 'Facilities', icon: <Map size={20} /> },
            { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
            { id: 'tickets', label: 'Incidents', icon: <Ticket size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === item.id ? 'var(--glass-border)' : 'transparent',
                color: activeTab === item.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>
            {activeTab === 'dashboard' && 'Operations Dashboard'}
            {activeTab === 'facilities' && 'Facilities Catalogue'}
            {activeTab === 'bookings' && 'Booking Management'}
            {activeTab === 'tickets' && 'Incident Ticketing'}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={24} />
            </button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AD
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card">
              <h3 className="text-muted">Active Bookings</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>42</p>
            </div>
            <div className="glass-card">
              <h3 className="text-muted">Open Tickets</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--accent-danger)' }}>7</p>
            </div>
            <div className="glass-card">
              <h3 className="text-muted">Available Rooms</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--accent-success)' }}>18</p>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Resources</h2>
              <button className="btn-primary">+ Add Resource</button>
            </div>
            <p className="text-muted">Facility management module will be loaded here.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
