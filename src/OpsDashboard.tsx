import { useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BadgeCheck, Banknote, BarChart3, Bell, Calendar, CarFront, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleDollarSign, Clock3, Command, CreditCard, Eye, FileCheck2, Filter, Gauge,
  Headphones, HelpCircle, Layers, LayoutDashboard, MapPin, Menu, MessageSquare, MoreHorizontal,
  RefreshCw, RotateCcw, Route, Search, Settings, Shield, ShieldAlert, ShieldCheck, Siren,
  SlidersHorizontal, Sparkles, Star, UserCheck, Users, WalletCards, X, Zap,
} from 'lucide-react';
import Brand from './components/Brand';
import { Avatar, Modal, Toast } from './components/UI';
import { formatNaira, usePlatform } from './platform';
import { CorridorMapArtwork } from './product/shared';

type Props = {
  path: string;
  onNavigate: (path: string) => void;
  onExit: () => void;
  onApp: () => void;
};

type OpsNavItem = {
  slug: string;
  label: string;
  icon: typeof LayoutDashboard;
  count?: string;
  danger?: boolean;
};

/**
 * 20. Dashboard navigation (7 families):
 * Operations, Marketplace, Money, Safety, Quality, Intelligence, Configuration
 */
const navFamilies: { group: string; items: OpsNavItem[] }[] = [
  {
    group: 'OPERATIONS',
    items: [
      { slug: 'overview', label: 'Overview', icon: LayoutDashboard },
      { slug: 'live-trips', label: 'Live trips', icon: Route, count: '12' },
      { slug: 'at-risk-trips', label: 'At-risk trips', icon: AlertTriangle, count: '3', danger: true },
      { slug: 'alerts', label: 'Alerts', icon: Siren, count: '2' },
    ],
  },
  {
    group: 'MARKETPLACE',
    items: [
      { slug: 'users', label: 'Users', icon: Users },
      { slug: 'drivers', label: 'Drivers', icon: CarFront },
      { slug: 'vehicles', label: 'Vehicles', icon: CarFront },
      { slug: 'hubs', label: 'Hubs', icon: MapPin },
      { slug: 'routes', label: 'Routes', icon: Route },
      { slug: 'bookings', label: 'Bookings', icon: CheckCircle2 },
      { slug: 'trips', label: 'Trips', icon: Route },
    ],
  },
  {
    group: 'MONEY',
    items: [
      { slug: 'transactions', label: 'Transactions', icon: CreditCard },
      { slug: 'refunds', label: 'Refunds', icon: ArrowLeft, count: '4' },
      { slug: 'payouts', label: 'Payouts', icon: WalletCards },
      { slug: 'ledger', label: 'Ledger', icon: Banknote },
      { slug: 'reconciliation', label: 'Reconciliation', icon: Layers },
    ],
  },
  {
    group: 'SAFETY',
    items: [
      { slug: 'incidents', label: 'Incidents', icon: ShieldAlert, count: '2', danger: true },
      { slug: 'sos', label: 'SOS', icon: AlertCircle },
      { slug: 'appeals', label: 'Appeals', icon: FileCheck2 },
    ],
  },
  {
    group: 'QUALITY',
    items: [
      { slug: 'reliability', label: 'Reliability', icon: Gauge },
      { slug: 'support', label: 'Support', icon: Headphones },
    ],
  },
  {
    group: 'INTELLIGENCE',
    items: [
      { slug: 'analytics', label: 'Analytics', icon: BarChart3 },
      { slug: 'demand', label: 'Demand', icon: Sparkles },
      { slug: 'utilization', label: 'Utilization', icon: Activity },
    ],
  },
  {
    group: 'CONFIGURATION',
    items: [
      { slug: 'settings', label: 'Platform settings', icon: Settings },
      { slug: 'notifications', label: 'Notifications', icon: Bell },
      { slug: 'admins', label: 'Admins', icon: UserCheck },
      { slug: 'audit-logs', label: 'Audit logs', icon: Command },
    ],
  },
];

export default function OpsDashboard({ path, onNavigate, onExit, onApp }: Props) {
  const { state, resolveAtRiskIntervention } = usePlatform();
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [recoverModalItem, setRecoverModalItem] = useState<{
    id: string;
    driverName: string;
    route: string;
    time: string;
    issue: string;
    passengers: number;
    alternativeDriver?: string;
  } | null>(null);

  const requestedSlug = path.split('/').filter(Boolean)[1] ?? 'overview';
  const allItems = navFamilies.flatMap((g) => g.items);
  const currentItem = allItems.find((item) => item.slug === requestedSlug) ?? navFamilies[0].items[0];
  const currentSlug = currentItem.slug;

  const notify = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(''), 2400);
  };

  const openModule = (slug: string) => {
    onNavigate(`/ops/${slug}`);
    setMenu(false);
  };

  const handleRecoverAction = (action: 'recover' | 'refund') => {
    if (!recoverModalItem) return;
    resolveAtRiskIntervention(recoverModalItem.id, action);
    notify(
      action === 'recover'
        ? `Backup assigned for ${recoverModalItem.driverName}. Passengers re-seated!`
        : `Instant refund processed for 3 passengers on ${recoverModalItem.route}.`,
    );
    setRecoverModalItem(null);
  };

  return (
    <div className="ops-app">
      {/* Sidebar with 7 families */}
      <aside className={`ops-sidebar ${menu ? 'open' : ''}`}>
        <div className="ops-brand">
          <button onClick={onExit}>
            <Brand inverse />
          </button>
          <span className="ops-badge">OPS</span>
          <button className="ops-close" onClick={() => setMenu(false)}>
            <X />
          </button>
        </div>

        <nav className="ops-nav-tree">
          {navFamilies.map((family) => (
            <div className="ops-nav-group" key={family.group}>
              <span className="nav-group-title">{family.group}</span>
              {family.items.map(({ slug, label, icon: Icon, count, danger }) => (
                <button
                  key={slug}
                  className={`ops-nav-btn ${currentSlug === slug ? 'active' : ''} ${danger ? 'danger' : ''}`}
                  onClick={() => openModule(slug)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {count && <i className={`count-pill ${danger ? 'danger' : ''}`}>{count}</i>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ops-system-status">
          <span className="status-live-dot" />
          <div>
            <strong>Operations Active</strong>
            <small>Corridors monitored 24/7</small>
          </div>
        </div>

        <div className="ops-user-card">
          <Avatar initials="KA" color="#1c604c" size={36} />
          <div>
            <strong>Kemi A.</strong>
            <small>Lead Dispatcher</small>
          </div>
        </div>
      </aside>

      {menu && <div className="side-scrim" onClick={() => setMenu(false)} />}

      {/* Main Workspace */}
      <section className="ops-workspace">
        <header className="ops-topbar">
          <div className="topbar-left">
            <button className="ops-menu" onClick={() => setMenu(true)}>
              <Menu size={18} />
            </button>
            <span className="ops-parent">COMUTA Operations</span>
            <ChevronRight size={14} />
            <strong className="ops-current">{currentItem.label}</strong>
          </div>
          <div className="topbar-actions">
            <div className="ops-search-box">
              <Search size={15} />
              <input placeholder="Search corridors, drivers, PINs..." />
            </div>
            <button className="ops-quick-btn" onClick={onApp}>
              View Mobile App ➔
            </button>
          </div>
        </header>

        <main className="ops-content-body">
          {currentSlug === 'overview' || currentSlug === 'at-risk-trips' ? (
            <>
              {/* WHAT NEEDS INTERVENTION? (Operations-First Hero Banner) */}
              <section className="intervention-hero-banner">
                <div className="ihb-title-row">
                  <div className="ihb-left">
                    <span className="live-pulsing-tag">LIVE INTERVENTION QUEUE</span>
                    <h1>What needs intervention?</h1>
                    <p>Immediate operational issues requiring dispatcher decision right now.</p>
                  </div>
                  <span className="corridor-active-clock">
                    <Clock3 size={14} />
                    <span>Lagos Time: 06:42 WAT · Morning Window</span>
                  </span>
                </div>

                {/* 5 Critical Intervention KPIs */}
                <div className="intervention-kpis-grid">
                  <div className="kpi-item active-trips">
                    <div className="kpi-top">
                      <span className="kpi-tag">ACTIVE</span>
                      <Route size={16} />
                    </div>
                    <strong>12</strong>
                    <span>active trips on corridors</span>
                  </div>

                  <div className="kpi-item at-risk-trips danger">
                    <div className="kpi-top">
                      <span className="kpi-tag danger">CRITICAL</span>
                      <AlertTriangle size={16} />
                    </div>
                    <strong>3</strong>
                    <span>at-risk trips (driver alerts)</span>
                  </div>

                  <div className="kpi-item unconfirmed-drivers warn">
                    <div className="kpi-top">
                      <span className="kpi-tag warn">T-8 PENDING</span>
                      <Clock3 size={16} />
                    </div>
                    <strong>7</strong>
                    <span>unconfirmed drivers (T-8)</span>
                  </div>

                  <div className="kpi-item incidents danger">
                    <div className="kpi-top">
                      <span className="kpi-tag danger">SAFETY</span>
                      <Siren size={16} />
                    </div>
                    <strong>2</strong>
                    <span>incidents under review</span>
                  </div>

                  <div className="kpi-item failed-payments">
                    <div className="kpi-top">
                      <span className="kpi-tag">PAYSTACK</span>
                      <CreditCard size={16} />
                    </div>
                    <strong>4</strong>
                    <span>failed payments</span>
                  </div>
                </div>
              </section>

              {/* AT-RISK TRIPS TABLE (With Recover Action) */}
              <section className="ops-panel at-risk-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-eyebrow">RECOVERY WORKBENCH</span>
                    <h2>At-risk trips</h2>
                    <p>Drivers unable to confirm, late alerts, or vehicle mechanical flags.</p>
                  </div>
                  <span className="action-required-tag">3 Require Action</span>
                </div>

                <div className="ops-table-container">
                  <table className="ops-data-table">
                    <thead>
                      <tr>
                        <th>DRIVER</th>
                        <th>ROUTE</th>
                        <th>TIME</th>
                        <th>ISSUE</th>
                        <th>PASSENGERS</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.atRiskInterventions.map((item) => (
                        <tr key={item.id} className={item.status === 'open' ? 'row-urgent' : ''}>
                          <td>
                            <div className="driver-cell">
                              <Avatar initials={item.driverName.slice(0, 2).toUpperCase()} color="#0C392C" size={30} />
                              <strong>{item.driverName}</strong>
                            </div>
                          </td>
                          <td>
                            <strong className="route-text">{item.route}</strong>
                          </td>
                          <td>
                            <span className="time-badge">{item.time}</span>
                          </td>
                          <td>
                            <span className="issue-pill danger">{item.issue}</span>
                          </td>
                          <td>
                            <strong>{item.passengers} riders</strong>
                          </td>
                          <td>
                            <span className={`status-pill ${item.status}`}>
                              {item.status === 'open' ? 'NEEDS RECOVERY' : item.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {item.status === 'open' ? (
                              <button
                                className="btn-recover-action"
                                onClick={() => setRecoverModalItem(item)}
                              >
                                <span>Recover</span>
                                <ArrowRight size={13} />
                              </button>
                            ) : (
                              <span className="resolved-check">
                                <Check size={14} /> Resolved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* LIVE OPERATIONS (Map / List) */}
              <section className="ops-panel live-ops-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-eyebrow">LIVE OPERATIONS</span>
                    <h2>Corridor live map & active dispatch</h2>
                    <p>Ikorodu ↔ Victoria Island arterial status: Smooth flow across Third Mainland Bridge.</p>
                  </div>
                  <span className="live-status-pill">
                    <span className="pulse" />
                    <span>Live Tracking (12 Vehicles)</span>
                  </span>
                </div>

                <div className="live-map-wrapper">
                  <CorridorMapArtwork
                    fromLabel="Ikorodu Hub (Main Gate)"
                    toLabel="Victoria Island Hub (Sterling)"
                    showVehicle
                    vehicleProgress={45}
                  />
                </div>

                <div className="active-dispatch-grid">
                  <div className="dispatch-card">
                    <div className="dc-top">
                      <span className="badge-active">IN TRANSIT</span>
                      <small>CM-IKR-01</small>
                    </div>
                    <strong>Adebayo K. (Toyota Corolla · ABC 123 XY)</strong>
                    <p>Ikorodu Hub ➔ Victoria Island Hub · 3 riders · ETA 32 min</p>
                  </div>

                  <div className="dispatch-card">
                    <div className="dc-top">
                      <span className="badge-active">BOARDING</span>
                      <small>CM-IKR-02</small>
                    </div>
                    <strong>Ifeoma N. (Honda Accord · KJA 208 FT)</strong>
                    <p>Ikorodu Hub ➔ Victoria Island Hub · 4 riders · Departing 6:45 AM</p>
                  </div>

                  <div className="dispatch-card">
                    <div className="dc-top">
                      <span className="badge-active">BOARDING</span>
                      <small>CM-IKR-04</small>
                    </div>
                    <strong>Chidi O. (Toyota Camry · LND 902 EK)</strong>
                    <p>Ikorodu Hub ➔ Victoria Island Hub · 2 riders · Departing 7:30 AM</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* Dedicated Family Views */
            <div className="ops-generic-page">
              <div className="ogp-header">
                <div>
                  <span className="ogp-eyebrow">{currentItem.label.toUpperCase()}</span>
                  <h1>{currentItem.label} Operations</h1>
                  <p>Operational control and records for {currentItem.label.toLowerCase()} in COMUTA.</p>
                </div>
                <button className="btn btn-primary" onClick={() => notify('Report exported.')}>
                  Export CSV
                </button>
              </div>

              <div className="ops-stats-mini-grid">
                <div className="os-box"><span>TOTAL RECORDS</span><strong>842</strong></div>
                <div className="os-box"><span>VERIFIED</span><strong>819</strong></div>
                <div className="os-box"><span>PENDING AUDIT</span><strong>23</strong></div>
                <div className="os-box"><span>UPTIME</span><strong>99.98%</strong></div>
              </div>

              <div className="ops-panel">
                <div className="empty-state-card">
                  <CheckCircle2 size={36} />
                  <h3>Records synchronised with backend ledger</h3>
                  <p>Authority controls are active. Staff actions are permanently logged in audit trails.</p>
                  <button className="btn btn-outline" onClick={() => openModule('overview')}>
                    Return to Intervention Overview ➔
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </section>

      {/* Recover Modal */}
      {recoverModalItem && (
        <Modal open onClose={() => setRecoverModalItem(null)}>
          <div className="recover-modal-content">
            <header className="rmc-head">
              <span className="rmc-tag">DISPATCH RECOVERY</span>
              <h2>Recover At-Risk Commute</h2>
              <p>Resolve passenger journey without leaving riders stranded.</p>
            </header>

            <div className="rmc-trip-summary">
              <div className="rmc-row"><span>Driver</span><strong>{recoverModalItem.driverName}</strong></div>
              <div className="rmc-row"><span>Corridor</span><strong>{recoverModalItem.route}</strong></div>
              <div className="rmc-row"><span>Time</span><strong>{recoverModalItem.time}</strong></div>
              <div className="rmc-row"><span>Issue</span><strong className="text-danger">{recoverModalItem.issue}</strong></div>
              <div className="rmc-row"><span>Affected</span><strong>{recoverModalItem.passengers} passengers</strong></div>
            </div>

            <div className="rmc-recovery-options">
              <div className="option-box primary-reassign">
                <span className="opt-badge">RECOMMENDED ACTION</span>
                <h4>Reassign to verified backup driver</h4>
                <p>
                  Available supply: <strong>Ifeoma N. (6:45 AM)</strong> or <strong>Chidi O. (7:30 AM)</strong>.
                  Passengers automatically notified with same pickup point at Ikorodu Hub Main Gate.
                </p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => handleRecoverAction('recover')}
                >
                  Confirm Reassignment & Notify Passengers
                </button>
              </div>

              <div className="option-box secondary-refund">
                <h4>Instant 100% Refund</h4>
                <p>Reverse card authorizations immediately and release compensation credits.</p>
                <button
                  className="btn btn-outline btn-block"
                  onClick={() => handleRecoverAction('refund')}
                >
                  Process Instant Refund
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Toast visible={!!toast} message={toast} />
    </div>
  );
}
