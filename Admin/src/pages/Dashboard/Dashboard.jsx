import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 shadow-card p-5 animate-fadeUp`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center text-xl`}>{icon}</div>
    </div>
    <p className="font-display font-bold text-2xl text-slate-900">{value}</p>
    <p className="text-sm font-semibold text-slate-700 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
)

const MiniBar = ({ value, max, color }) => (
  <div className="flex items-center gap-2 flex-1">
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}/>
    </div>
    <span className="text-xs font-bold text-slate-700 w-10 text-right">${value.toFixed(0)}</span>
  </div>
)

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await axios.get(url + '/api/order/stats')
      if (res.data.success) setStats(res.data.data)
    } catch (e) { console.log(e) }
    setLoading(false)
  }

  if (loading) return (
    <div className="max-w-5xl animate-fadeUp">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white rounded-3xl border border-slate-100 animate-pulse"/>)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[1,2].map(i => <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse"/>)}
      </div>
    </div>
  )

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
      <span className="text-5xl mb-4">📊</span>
      <p className="font-semibold text-slate-600">Could not load stats</p>
      <button onClick={fetchStats} className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">Retry</button>
    </div>
  )

  const maxRevenue = Math.max(...stats.dailyRevenue.map(d => d.revenue), 1)

  return (
    <div className="max-w-5xl animate-fadeUp space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-500 text-xs font-semibold rounded-xl transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} sub="All time" color="bg-blue-50"/>
        <StatCard icon="💰" label="Total Revenue" value={`$${stats.totalRevenue.toFixed(0)}`} sub="All time" color="bg-emerald-50"/>
        <StatCard icon="👨‍🍳" label="Processing" value={stats.processing} sub="In kitchen" color="bg-amber-50"/>
        <StatCard icon="✅" label="Delivered" value={stats.delivered} sub="Completed" color="bg-orange-50"/>
      </div>

      {/* Revenue + Top Items */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Revenue chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-slate-900">Revenue (7 days)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily breakdown</p>
            </div>
            <span className="text-xl">📈</span>
          </div>
          <div className="space-y-3">
            {stats.dailyRevenue.map((d, i) => {
              const day = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">{day}</span>
                  <MiniBar value={d.revenue} max={maxRevenue} color={d.revenue > 0 ? 'bg-orange-400' : 'bg-slate-200'}/>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-slate-900">Top Selling</h3>
              <p className="text-xs text-slate-400 mt-0.5">Most ordered dishes</p>
            </div>
            <span className="text-xl">🏆</span>
          </div>
          {stats.topItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <span className="text-3xl mb-2">🍽️</span>
              <p className="text-sm">No data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.count} orders · ${item.revenue.toFixed(0)}</p>
                  </div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(item.count / stats.topItems[0].count) * 100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 5 orders</p>
          </div>
          <button onClick={() => navigate('/orders')} className="text-xs font-semibold text-orange-500 hover:underline">View all →</button>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="text-3xl mb-2">📭</span>
              <p className="text-sm">No orders yet</p>
            </div>
          ) : stats.recentOrders.map((order, i) => {
            const statusColors = {
              'Food Processing': 'bg-amber-50 text-amber-600 border-amber-200',
              'Out for Delivery': 'bg-blue-50 text-blue-600 border-blue-200',
              'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
            }
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-lg flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {order.items?.map(item => item.name).join(', ')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900">${order.amount}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${statusColors[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Add Dish', icon: '➕', color: 'bg-orange-500', action: () => navigate('/add') },
          { label: 'View Menu', icon: '🍽️', color: 'bg-blue-500', action: () => navigate('/list') },
          { label: 'All Orders', icon: '📦', color: 'bg-emerald-500', action: () => navigate('/orders') },
        ].map((a, i) => (
          <button key={i} onClick={a.action} className={`${a.color} text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity shadow-sm`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-bold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
