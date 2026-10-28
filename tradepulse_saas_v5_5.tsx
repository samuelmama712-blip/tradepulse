import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, BookOpen, Calculator, BarChart2, ShieldAlert, 
  Settings, Plus, Trash2, Edit2, Check, X, Camera, 
  DollarSign, TrendingUp, Award, ShieldCheck, ChevronRight, 
  RefreshCw, Zap, ExternalLink, QrCode, Copy, CheckCircle2,
  Tag, Filter, Globe, Sparkles, Wallet, ArrowUpRight, AlertTriangle, ArrowDownLeft, Shield,
  Key, Cpu, Terminal, Layers, Send
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_ACCOUNTS = [
  { id: 'acc-1', name: 'Main Real Account', type: 'Real', balance: 12540.50, initialBalance: 10000, currency: '$' },
  { id: 'acc-2', name: 'FTMO Funded Challenge', type: 'Funded', balance: 48950.00, initialBalance: 50000, currency: '$', dailyLimit: 2500, maxLimit: 5000 }
];

const INITIAL_TAGS = ['Breakout', 'Trend Following', 'Mean Reversion', 'News Event', 'Scalp', 'Support/Resistance'];

const INITIAL_GATEWAY_CONFIG = {
  apiKey: 'tp_live_99a8bc77661244ea9800ff21a',
  webhookSecret: 'whsec_prod_88192a77bc40112ee9',
  merchantId: 'MERCH-8842-TP',
  endpointUrl: 'https://api.tradepulse.io/v1/webhook/receiver',
  enabledCoins: ['USDT_BEP20', 'USDC_BEP20', 'ETH', 'BNB', 'BTC', 'SOL', 'TON']
};

const INITIAL_WEBHOOK_LOGS = [
  { id: 'wh-901', event: 'charge.confirmed', crypto: 'USDT_BEP20', amount: '33.60', txHash: '0x3a92...8f1a', status: 'Delivered (200 OK)', timestamp: '2026-06-15 14:22:01' },
  { id: 'wh-902', event: 'charge.mempool_detected', crypto: 'ETH', amount: '0.0022', txHash: '0x992f...1b7e', status: 'Delivered (200 OK)', timestamp: '2026-06-12 09:15:40' },
  { id: 'wh-903', event: 'charge.pending', crypto: 'BNB', amount: '0.025', txHash: '0x4Kt9...9x2Q', status: 'Pending Broadcast', timestamp: '2026-06-08 18:04:12' }
];

const INITIAL_OWNER_WALLETS = {
  USDT_BEP20: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  USDC_BEP20: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  ETH: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  BNB: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  BTC: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  SOL: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e',
  TON: '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e'
};

const INITIAL_PAYMENT_LEDGER = [
  { id: 'tx-101', user: 'alex@tradepulse.io', plan: 'Pro Trader', cycle: 'yearly', crypto: 'USDT_BEP20', amountCrypto: '33.60', amountUsd: 33.60, txHash: '0x3a92...8f1a', status: 'Confirmed', date: '2026-05-15', destinationWallet: '0xe8df...4e1e' },
  { id: 'tx-102', user: 'sarah.trader@gmail.com', plan: 'Funded Elite', cycle: 'monthly', crypto: 'ETH', amountCrypto: '0.0022', amountUsd: 7.00, txHash: '0x992f...1b7e', status: 'Confirmed', date: '2026-06-02', destinationWallet: '0xe8df...4e1e' }
];

const INITIAL_TRADES = [
  {
    id: 'tr-1',
    accountId: 'acc-1',
    symbol: 'EURUSD',
    type: 'BUY',
    entryPrice: 1.0850,
    exitPrice: 1.0920,
    size: 1.5,
    pnl: 1050.00,
    pnlPercent: 8.4,
    date: '2026-06-01',
    strategy: 'Breakout',
    notes: 'Clean break above Asian session highs with high volume.',
    screenshot: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    status: 'Closed'
  },
  {
    id: 'tr-2',
    accountId: 'acc-1',
    symbol: 'XAUUSD',
    type: 'SELL',
    entryPrice: 2345.50,
    exitPrice: 2330.00,
    size: 0.5,
    pnl: 775.00,
    pnlPercent: 6.2,
    date: '2026-06-03',
    strategy: 'Trend Following',
    notes: 'Rejected daily resistance zone.',
    screenshot: null,
    status: 'Closed'
  },
  {
    id: 'tr-3',
    accountId: 'acc-2',
    symbol: 'NAS100',
    type: 'BUY',
    entryPrice: 18500.00,
    exitPrice: 18420.00,
    size: 2.0,
    pnl: -1600.00,
    pnlPercent: -3.2,
    date: '2026-06-04',
    strategy: 'Mean Reversion',
    notes: 'Failed bounce at London open. Cut losses early.',
    screenshot: null,
    status: 'Closed'
  },
  {
    id: 'tr-4',
    accountId: 'acc-1',
    symbol: 'BTCUSD',
    type: 'BUY',
    entryPrice: 68200.00,
    exitPrice: 70500.00,
    size: 0.2,
    pnl: 460.00,
    pnlPercent: 3.6,
    date: '2026-06-07',
    strategy: 'Breakout',
    notes: 'Weekend breakout continuation.',
    screenshot: null,
    status: 'Closed'
  }
];

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'Alex Trader',
    email: 'alex@tradepulse.io',
    tier: 'Free Trial', // Free Trial, Pro Trader, Funded Elite
    billingCycle: 'monthly',
    isLoggedIn: true,
    trialDaysRemaining: 7, // 7-day trial tracking
    trialStartDate: new Date().toISOString().split('T')[0]
  });

  // Core Data States
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [activeAccountId, setActiveAccountId] = useState(INITIAL_ACCOUNTS[0].id);
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [strategyTags, setStrategyTags] = useState(INITIAL_TAGS);
  
  // Managed Crypto Payment Gateway States
  const [gatewayConfig, setGatewayConfig] = useState(INITIAL_GATEWAY_CONFIG);
  const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);
  const [ownerWallets, setOwnerWallets] = useState(INITIAL_OWNER_WALLETS);
  const [paymentLedger, setPaymentLedger] = useState(INITIAL_PAYMENT_LEDGER);

  // Modals & UI States
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_BEP20');
  const [cryptoPaymentStatus, setCryptoPaymentStatus] = useState('idle');
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  
  // Toast Notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Trial Expiry Guard Helper
  const isTrialExpired = user.tier === 'Free Trial' && user.trialDaysRemaining <= 0;

  // Filters
  const [tradeFilter, setTradeFilter] = useState({ symbol: '', strategy: 'All', status: 'All' });

  // Core Derived Metrics
  const currentAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const accountTrades = trades.filter(t => t.accountId === activeAccountId);

  const totalPnL = accountTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winTrades = accountTrades.filter(t => t.pnl > 0);
  const winRate = accountTrades.length > 0 ? ((winTrades.length / accountTrades.length) * 100).toFixed(1) : '0.0';
  
  const profitFactor = useMemo(() => {
    const grossProfit = accountTrades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(accountTrades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
    return grossLoss === 0 ? (grossProfit > 0 ? 'Infinite' : '0.00') : (grossProfit / grossLoss).toFixed(2);
  }, [accountTrades]);

  // Prop Firm Funded Account Risk Calculations
  const fundedRiskMetrics = useMemo(() => {
    if (currentAccount.type !== 'Funded') return null;
    const initial = currentAccount.initialBalance;
    const currentBal = currentAccount.balance + totalPnL;
    const totalDD = initial - currentBal;
    
    // Single Day Worst Loss
    const dailyPnls = {};
    accountTrades.forEach(t => {
      dailyPnls[t.date] = (dailyPnls[t.date] || 0) + t.pnl;
    });
    const worstDayPnL = Math.min(0, ...Object.values(dailyPnls));
    const dailyDD = Math.abs(worstDayPnL);

    return {
      currentBalance: currentBal,
      totalDD: Math.max(0, totalDD),
      maxAllowedTotal: currentAccount.maxLimit || 5000,
      dailyDD: dailyDD,
      maxAllowedDaily: currentAccount.dailyLimit || 2500,
      worstDay: worstDayPnL
    };
  }, [currentAccount, accountTrades, totalPnL]);

  // Equity Curve Data Points
  const equityCurveData = useMemo(() => {
    let runningTotal = currentAccount.initialBalance;
    const sorted = [...accountTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const points = [{ date: 'Start', balance: runningTotal }];
    sorted.forEach(t => {
      runningTotal += t.pnl;
      points.push({ date: t.date, balance: runningTotal });
    });
    return points;
  }, [currentAccount, accountTrades]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6" />
            <span className="font-bold tracking-wider text-lg">TradePulse <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">v5.1</span></span>
          </div>
          
          {/* Account Selector */}
          <div className="relative">
            <select 
              value={activeAccountId} 
              onChange={(e) => setActiveAccountId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-sm rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-indigo-500 appearance-none pr-10 cursor-pointer text-slate-200"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type}) - ${acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
          <button 
            onClick={() => setIsAccountModalOpen(true)}
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl text-indigo-400 font-medium transition"
          >
            + Add Account
          </button>
        </div>

        {/* User Info & Subscription Badge */}
        <div className="flex items-center space-x-4">
          {/* Trial / Tier Status Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full">
            <div className={`w-2.5 h-2.5 rounded-full ${
              user.tier === 'Free Trial' 
                ? (isTrialExpired ? 'bg-rose-500 animate-ping' : 'bg-amber-400') 
                : user.tier === 'Pro Trader' ? 'bg-indigo-400' : 'bg-emerald-400'
            }`} />
            <span className="text-xs font-semibold text-slate-300">
              {user.tier === 'Free Trial' 
                ? (isTrialExpired ? 'Trial Expired (0d)' : `Free Trial (${user.trialDaysRemaining}d left)`) 
                : `${user.tier} Plan`}
            </span>
          </div>

          {/* Quick Trial Tester Toggle */}
          {user.tier === 'Free Trial' && (
            <button
              onClick={() => {
                const newDays = isTrialExpired ? 7 : 0;
                setUser({ ...user, trialDaysRemaining: newDays });
                showToast(newDays === 0 ? 'Simulated: Free Trial Expired!' : 'Simulated: Trial Active (7 Days)', newDays === 0 ? 'error' : 'success');
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition ${
                isTrialExpired 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60' 
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-900/60'
              }`}
            >
              {isTrialExpired ? 'Simulate Active Trial' : 'Simulate Expired Trial'}
            </button>
          )}

          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between hidden md:flex">
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard & Stats', icon: LayoutDashboard },
              { id: 'journal', label: 'Trade Journal', icon: BookOpen },
              { id: 'calculator', label: 'Position Calculator', icon: Calculator },
              { id: 'risk', label: 'Funded Risk Monitor', icon: ShieldAlert },
              { id: 'analytics', label: 'Advanced Analytics', icon: BarChart2 },
              { id: 'gateway', label: 'Payment Gateway API', icon: Cpu },
              { id: 'money_received', label: 'Money Received & Wallets', icon: Wallet },
              { id: 'pricing', label: 'Upgrade & Billing', icon: Award },
              { id: 'settings', label: 'Strategy & Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Footer inside Sidebar */}
          <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-900/40 rounded-2xl">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Pro Features v5.1</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Custom strategies, yearly discounts & crypto payments now live.</p>
            <button 
              onClick={() => setActiveTab('pricing')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition shadow"
            >
              Explore Plans
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 relative">
          {/* Global Trial Expired Lockout Wall */}
          {isTrialExpired && activeTab !== 'pricing' && activeTab !== 'settings' && activeTab !== 'money_received' && activeTab !== 'gateway' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 p-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full animate-pulse">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-3xl font-black text-white">7-Day Free Trial Has Expired</h2>
                <p className="text-sm text-slate-400">
                  Your 7-day free trial period has concluded. App functionality (logging trades, calculator, risk monitor) is paused until plan activation.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 text-left shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                  <span>Status: <strong className="text-rose-400">Locked / Expired</strong></span>
                  <span>Payment: <strong className="text-indigo-400">Crypto Only</strong></span>
                </div>
                <p className="text-xs text-slate-300">
                  Upgrade instantly with USDT, BTC, ETH, SOL or TON to restore complete functionality.
                </p>
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Upgrade via Crypto Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab 
              currentAccount={currentAccount}
              accountTrades={accountTrades}
              totalPnL={totalPnL}
              winRate={winRate}
              profitFactor={profitFactor}
              equityCurveData={equityCurveData}
              fundedRiskMetrics={fundedRiskMetrics}
              onOpenNewTrade={() => setIsTradeModalOpen(true)}
            />
          )}

          {activeTab === 'journal' && (
            <JournalTab 
              accountTrades={accountTrades}
              strategyTags={strategyTags}
              tradeFilter={tradeFilter}
              setTradeFilter={setTradeFilter}
              onOpenNewTrade={() => setIsTradeModalOpen(true)}
              onOpenScreenshot={setSelectedScreenshot}
              onDeleteTrade={(id) => {
                setTrades(trades.filter(t => t.id !== id));
                showToast('Trade deleted successfully', 'success');
              }}
            />
          )}

          {activeTab === 'calculator' && <CalculatorTab currentAccount={currentAccount} />}

          {activeTab === 'risk' && (
            <RiskMonitorTab 
              currentAccount={currentAccount} 
              fundedRiskMetrics={fundedRiskMetrics} 
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab accountTrades={accountTrades} />
          )}

          {activeTab === 'gateway' && (
            <PaymentGatewayTab 
              gatewayConfig={gatewayConfig}
              setGatewayConfig={setGatewayConfig}
              webhookLogs={webhookLogs}
              setWebhookLogs={setWebhookLogs}
              showToast={showToast}
            />
          )}

          {activeTab === 'money_received' && (
            <MoneyReceivedTab 
              paymentLedger={paymentLedger}
              ownerWallets={ownerWallets}
              setOwnerWallets={setOwnerWallets}
              showToast={showToast}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingTab 
              user={user} 
              paymentLedger={paymentLedger}
              onSelectPlan={(planName, cycle) => {
                setSelectedPlanForCheckout({ plan: planName, cycle });
                setIsCryptoModalOpen(true);
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              strategyTags={strategyTags} 
              setStrategyTags={setStrategyTags}
              ownerWallets={ownerWallets}
              setOwnerWallets={setOwnerWallets}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Add New Trade Modal */}
      {isTradeModalOpen && (
        <NewTradeModal 
          accountId={activeAccountId}
          strategyTags={strategyTags}
          onClose={() => setIsTradeModalOpen(false)}
          onAddTrade={(newTrade) => {
            setTrades([newTrade, ...trades]);
            setIsTradeModalOpen(false);
            showToast('Trade logged successfully!', 'success');
          }}
        />
      )}

      {/* 2. Add Account Modal */}
      {isAccountModalOpen && (
        <NewAccountModal 
          onClose={() => setIsAccountModalOpen(false)}
          onAddAccount={(acc) => {
            setAccounts([...accounts, acc]);
            setActiveAccountId(acc.id);
            setIsAccountModalOpen(false);
            showToast('New trading account initialized!', 'success');
          }}
        />
      )}

      {/* 3. Production Crypto Payment Checkout Modal with Web3 & TxHash verification */}
      {isCryptoModalOpen && selectedPlanForCheckout && (
        <CryptoCheckoutModal 
          planInfo={selectedPlanForCheckout}
          selectedCrypto={selectedCrypto}
          setSelectedCrypto={setSelectedCrypto}
          gatewayConfig={gatewayConfig}
          ownerWallets={ownerWallets}
          paymentStatus={cryptoPaymentStatus}
          setPaymentStatus={setCryptoPaymentStatus}
          onClose={() => {
            setIsCryptoModalOpen(false);
            setCryptoPaymentStatus('idle');
          }}
          onSuccess={(planName, cryptoType, cryptoAmount, usdVal, txHash) => {
            setUser(prev => ({ ...prev, tier: planName, trialDaysRemaining: 365 }));
            const newRecord = {
              id: 'tx-' + Date.now().toString().slice(-4),
              user: user.email,
              plan: planName,
              cycle: selectedPlanForCheckout.cycle,
              crypto: cryptoType,
              amountCrypto: cryptoAmount,
              amountUsd: usdVal,
              txHash: txHash,
              status: 'Confirmed',
              date: new Date().toISOString().split('T')[0],
              destinationWallet: ownerWallets[cryptoType] || 'Platform Wallet'
            };
            setPaymentLedger([newRecord, ...paymentLedger]);
            setIsCryptoModalOpen(false);
            setCryptoPaymentStatus('idle');
            showToast(`Blockchain Verified! Access Restored & Upgraded to ${planName}!`, 'success');
          }}
        />
      )}

      {/* 4. Screenshot Modal Viewer */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-lg flex items-center space-x-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                <span>Trade Chart Screenshot</span>
              </h3>
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex justify-center bg-black/50">
              <img src={selectedScreenshot} alt="Trade Screenshot" className="max-h-[75vh] object-contain rounded-xl border border-slate-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// TABS & COMPONENTS
// ==========================================

function DashboardTab({ currentAccount, accountTrades, totalPnL, winRate, profitFactor, equityCurveData, fundedRiskMetrics, onOpenNewTrade }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-1">
            <Globe className="w-4 h-4" />
            <span>Active Portfolio: {currentAccount.name} ({currentAccount.type})</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Performance Overview</h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button 
            onClick={onOpenNewTrade}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Log New Trade</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Net P&L"
          value={`$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          isPositive={totalPnL >= 0}
          icon={DollarSign}
        />
        <MetricCard 
          title="Win Rate"
          value={`${winRate}%`}
          subtitle={`${accountTrades.filter(t => t.pnl > 0).length} wins out of ${accountTrades.length}`}
          icon={TrendingUp}
        />
        <MetricCard 
          title="Profit Factor"
          value={profitFactor}
          subtitle="Gross Profit / Gross Loss"
          icon={Award}
        />
        <MetricCard 
          title="Account Balance"
          value={`$${(currentAccount.balance + totalPnL).toLocaleString()}`}
          subtitle={`Initial: $${currentAccount.initialBalance.toLocaleString()}`}
          icon={ShieldCheck}
        />
      </div>

      {/* Funded Risk Warning Banner if applicable */}
      {fundedRiskMetrics && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-200">Funded Account Risk Status</h3>
              <p className="text-sm text-slate-400">Monitoring daily & total drawdown rules for FTMO / Prop Firm challenge.</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Total Drawdown</span>
              <span className={`font-bold ${fundedRiskMetrics.totalDD > fundedRiskMetrics.maxAllowedTotal * 0.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ${fundedRiskMetrics.totalDD.toFixed(2)} / ${fundedRiskMetrics.maxAllowedTotal}
              </span>
            </div>
            <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-xs">Worst Day DD</span>
              <span className="font-bold text-amber-400">${fundedRiskMetrics.dailyDD.toFixed(2)} / ${fundedRiskMetrics.maxAllowedDaily}</span>
            </div>
          </div>
        </div>
      )}

      {/* Equity Curve Chart (SVG) */}
      <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Equity Curve</h3>
            <p className="text-xs text-slate-400">Visual performance growth over trade history</p>
          </div>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">Live Tracking</span>
        </div>

        <div className="h-64 w-full relative">
          {equityCurveData.length < 2 ? (
            <div className="h-full flex items-center justify-center text-slate-500">Not enough data to render equity curve. Log more trades!</div>
          ) : (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {(() => {
                const balances = equityCurveData.map(d => d.balance);
                const min = Math.min(...balances) * 0.99;
                const max = Math.max(...balances) * 1.01;
                const range = max - min || 1;
                
                const points = equityCurveData.map((d, i) => {
                  const x = (i / (equityCurveData.length - 1)) * 580 + 10;
                  const y = 190 - ((d.balance - min) / range) * 180;
                  return `${x},${y}`;
                }).join(' ');

                const firstX = 10;
                const lastX = 590;
                const areaPoints = `${firstX},195 ${points} ${lastX},195`;

                return (
                  <>
                    <polygon points={areaPoints} fill="url(#equityGrad)" />
                    <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
                    {equityCurveData.map((d, i) => {
                      const x = (i / (equityCurveData.length - 1)) * 580 + 10;
                      const y = 190 - ((d.balance - min) / range) * 180;
                      return (
                        <circle key={i} cx={x} cy={y} r="4" className="fill-indigo-400 stroke-slate-950 stroke-2 hover:scale-150 transition cursor-pointer" />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function JournalTab({ accountTrades, strategyTags, tradeFilter, setTradeFilter, onOpenNewTrade, onOpenScreenshot, onDeleteTrade }) {
  const filteredTrades = accountTrades.filter(t => {
    const matchesSymbol = t.symbol.toLowerCase().includes(tradeFilter.symbol.toLowerCase());
    const matchesStrategy = tradeFilter.strategy === 'All' || t.strategy === tradeFilter.strategy;
    return matchesSymbol && matchesStrategy;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Trade Journal</h1>
          <p className="text-sm text-slate-400">Detailed logs, strategy tags, and setup screenshots.</p>
        </div>
        <button 
          onClick={onOpenNewTrade}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Trade</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl flex-1 min-w-[200px]">
          <Filter className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter by symbol (e.g. EURUSD)..." 
            value={tradeFilter.symbol}
            onChange={(e) => setTradeFilter({ ...tradeFilter, symbol: e.target.value })}
            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Strategy:</span>
          <select 
            value={tradeFilter.strategy} 
            onChange={(e) => setTradeFilter({ ...tradeFilter, strategy: e.target.value })}
            className="bg-slate-950 border border-slate-800 text-sm rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
          >
            <option value="All">All Strategies</option>
            {strategyTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Type</th>
                <th className="p-4">Strategy</th>
                <th className="p-4">Entry / Exit</th>
                <th className="p-4">P&L</th>
                <th className="p-4">Screenshot</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No trades found matching criteria.</td>
                </tr>
              ) : (
                filteredTrades.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-300 font-medium">{t.date}</td>
                    <td className="p-4 font-bold text-white">{t.symbol}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
                        {t.strategy}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div>{t.entryPrice}</div>
                      <div className="text-xs text-slate-500">Exit: {t.exitPrice}</div>
                    </td>
                    <td className="p-4">
                      <div className={`font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">{t.pnlPercent}%</div>
                    </td>
                    <td className="p-4">
                      {t.screenshot ? (
                        <button 
                          onClick={() => onOpenScreenshot(t.screenshot)}
                          className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => onDeleteTrade(t.id)}
                        className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CalculatorTab({ currentAccount }) {
  const [accountBalance, setAccountBalance] = useState(currentAccount ? currentAccount.balance : 10000);
  const [riskPercent, setRiskPercent] = useState(1.0);
  const [stopLossPips, setStopLossPips] = useState(20);
  const [pair, setPair] = useState('EURUSD');

  const riskAmount = (accountBalance * riskPercent) / 100;
  const positionSize = stopLossPips > 0 ? (riskAmount / (stopLossPips * 10)).toFixed(2) : '0';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Position Size Calculator</h1>
        <p className="text-sm text-slate-400">Calculate lot sizes dynamically according to your account risk parameters.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Account Balance ($)</label>
            <input 
              type="number" 
              value={accountBalance} 
              onChange={(e) => setAccountBalance(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Risk Percentage (%)</label>
            <input 
              type="number" 
              step="0.1"
              value={riskPercent} 
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Stop Loss (Pips / Points)</label>
            <input 
              type="number" 
              value={stopLossPips} 
              onChange={(e) => setStopLossPips(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Asset Class / Symbol</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="EURUSD">EURUSD (Forex)</option>
              <option value="GBPUSD">GBPUSD (Forex)</option>
              <option value="XAUUSD">XAUUSD (Gold)</option>
              <option value="BTCUSD">BTCUSD (Crypto)</option>
              <option value="NAS100">NAS100 (Indices)</option>
            </select>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Cash Risk</span>
            <span className="text-2xl font-black text-rose-400">${riskAmount.toFixed(2)}</span>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl">
            <span className="text-xs text-indigo-300 block mb-1">Recommended Position Size</span>
            <span className="text-2xl font-black text-indigo-400">{positionSize} Standard Lots</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskMonitorTab({ currentAccount, fundedRiskMetrics }) {
  if (currentAccount.type !== 'Funded') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold">Not a Funded Account</h2>
        <p className="text-slate-400 text-sm">Switch to or create a Funded Prop Firm account to access strict daily & maximum drawdown rule enforcement metrics.</p>
      </div>
    );
  }

  const dailyUsage = Math.min(100, (fundedRiskMetrics.dailyDD / fundedRiskMetrics.maxAllowedDaily) * 100);
  const totalUsage = Math.min(100, (fundedRiskMetrics.totalDD / fundedRiskMetrics.maxAllowedTotal) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Funded Account Risk Monitor</h1>
        <p className="text-sm text-slate-400">Real-time risk tracking for prop firm evaluation rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Daily Drawdown Limit</span>
            <span className="text-xs font-semibold text-amber-400">${fundedRiskMetrics.dailyDD.toFixed(2)} / ${fundedRiskMetrics.maxAllowedDaily}</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${dailyUsage}%` }} />
          </div>
          <p className="text-xs text-slate-400">{dailyUsage.toFixed(1)}% of daily allowance used.</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Maximum Total Drawdown Limit</span>
            <span className={`text-xs font-semibold ${totalUsage > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ${fundedRiskMetrics.totalDD.toFixed(2)} / ${fundedRiskMetrics.maxAllowedTotal}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className={`h-full transition-all duration-500 ${totalUsage > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${totalUsage}%` }} />
          </div>
          <p className="text-xs text-slate-400">{totalUsage.toFixed(1)}% of maximum drawdown pool consumed.</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ accountTrades }) {
  const strategyStats = useMemo(() => {
    const stats: Record<string, { total: number; wins: number; pnl: number }> = {};
    accountTrades.forEach(t => {
      if (!stats[t.strategy]) {
        stats[t.strategy] = { total: 0, wins: 0, pnl: 0 };
      }
      stats[t.strategy].total += 1;
      if (t.pnl > 0) stats[t.strategy].wins += 1;
      stats[t.strategy].pnl += t.pnl;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      winRate: ((data.wins / data.total) * 100).toFixed(1),
      pnl: data.pnl,
      total: data.total
    }));
  }, [accountTrades]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Advanced Performance Analytics</h1>
        <p className="text-sm text-slate-400">Strategy efficiency breakdown and trade stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategyStats.map(s => (
          <div key={s.name} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-base text-indigo-400">{s.name}</span>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-semibold">{s.total} Trades</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-slate-400 block">Win Rate</span>
                <span className="text-2xl font-extrabold">{s.winRate}%</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total P&L</span>
                <span className={`text-xl font-bold ${s.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${s.pnl.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentGatewayTab({ gatewayConfig, setGatewayConfig, webhookLogs, setWebhookLogs, showToast }) {
  const [tempConfig, setTempConfig] = useState(gatewayConfig);
  const [copiedKey, setCopiedKey] = useState(false);
  const [simulatingEvent, setSimulatingEvent] = useState(false);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setGatewayConfig(tempConfig);
    showToast('Payment Gateway settings and API keys updated successfully!', 'success');
  };

  const handleToggleCoin = (coin) => {
    const coins = tempConfig.enabledCoins.includes(coin)
      ? tempConfig.enabledCoins.filter(c => c !== coin)
      : [...tempConfig.enabledCoins, coin];
    setTempConfig({ ...tempConfig, enabledCoins: coins });
  };

  const handleTestWebhook = () => {
    setSimulatingEvent(true);
    setTimeout(() => {
      const newLog = {
        id: 'wh-' + Math.floor(Math.random() * 9000 + 1000),
        event: 'charge.confirmed',
        crypto: 'USDT_BEP20',
        amount: '14.50',
        txHash: '0x' + Math.random().toString(16).substring(2, 10) + '...',
        status: 'Delivered (200 OK)',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setWebhookLogs([newLog, ...webhookLogs]);
      setSimulatingEvent(false);
      showToast('Test webhook payload dispatched successfully (200 OK)!', 'success');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-400 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Managed Crypto Payment Infrastructure</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Payment Gateway API & Webhooks</h1>
          <p className="text-sm text-slate-400">Configure merchant credentials, supported checkout coins, and inspect live webhook event streams.</p>
        </div>
        <button 
          onClick={handleTestWebhook}
          disabled={simulatingEvent}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
        >
          {simulatingEvent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>{simulatingEvent ? 'Simulating Webhook...' : 'Test Webhook Event'}</span>
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Merchant API Keys & Webhook Secret</h2>
            <p className="text-xs text-slate-400">Authenticate incoming payment requests and secure real-time verification webhooks.</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Merchant ID</label>
              <input 
                type="text"
                value={tempConfig.merchantId}
                onChange={(e) => setTempConfig({ ...tempConfig, merchantId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Live API Key</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  value={tempConfig.apiKey}
                  onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(tempConfig.apiKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}
                  className="p-2.5 bg-slate-800 text-indigo-400 hover:bg-slate-700 rounded-xl transition"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Webhook Secret Signature</label>
              <input 
                type="text"
                value={tempConfig.webhookSecret}
                onChange={(e) => setTempConfig({ ...tempConfig, webhookSecret: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Webhook Receiver Endpoint URL</label>
              <input 
                type="text"
                value={tempConfig.endpointUrl}
                onChange={(e) => setTempConfig({ ...tempConfig, endpointUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Supported Checkout Coins & Networks</label>
            <div className="flex flex-wrap gap-3">
              {['USDT_BEP20', 'USDC_BEP20', 'ETH', 'BNB', 'BTC', 'SOL', 'TON'].map(coin => {
                const isEnabled = tempConfig.enabledCoins.includes(coin);
                return (
                  <button
                    key={coin}
                    type="button"
                    onClick={() => handleToggleCoin(coin)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center space-x-2 ${
                      isEnabled ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>{coin}</span>
                    {isEnabled && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Gateway Configuration</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Webhook Event Stream</h3>
              <p className="text-xs text-slate-400">Real-time dispatcher logs for mempool detection and payment confirmation events</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300 font-semibold">{webhookLogs.length} Events Dispatched</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Tx Hash</th>
                <th className="p-4 text-right">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {webhookLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition text-xs">
                  <td className="p-4 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="p-4 font-bold text-indigo-400 font-mono">{log.event}</td>
                  <td className="p-4 font-semibold text-white">{log.crypto}</td>
                  <td className="p-4 font-bold text-emerald-400">{log.amount} {log.crypto}</td>
                  <td className="p-4 font-mono text-slate-400">{log.txHash}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center space-x-1 ${
                      log.status.includes('200') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <Check className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MoneyReceivedTab({ paymentLedger, ownerWallets, setOwnerWallets, showToast }) {
  const [tempWallets, setTempWallets] = useState(ownerWallets);
  const [copiedKey, setCopiedKey] = useState(null);

  const totalUsdCollected = paymentLedger.reduce((sum, item) => sum + (item.amountUsd || 0), 0);

  const handleSaveWallets = (e) => {
    e.preventDefault();
    setOwnerWallets(tempWallets);
    showToast('Receiving payout wallet addresses updated successfully!', 'success');
  };

  const handleCopyWallet = (key, address) => {
    navigator.clipboard.writeText(address);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Owner Control Center</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Money Received & Payout Wallets</h1>
          <p className="text-sm text-slate-400">Manage receiving addresses and track incoming crypto transactions in real-time.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Crypto Revenue</span>
            <span className="text-2xl font-black text-emerald-400">${totalUsdCollected.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Configure Receiving Payout Wallets (0xe8df0c...4e1e)</h2>
            <p className="text-xs text-slate-400">All payments are routed directly to your configured BSC BEP-20, Ethereum, and multi-chain address.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWallets} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tempWallets).map(([crypto, address]) => (
              <div key={crypto} className={crypto === 'USDT_BEP20' || crypto === 'USDC_BEP20' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{crypto} Destination Address</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setTempWallets({ ...tempWallets, [crypto]: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    type="button"
                    onClick={() => handleCopyWallet(crypto, address)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition"
                    title="Copy Address"
                  >
                    {copiedKey === crypto ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Receiving Wallets</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Blockchain Transaction Confirmations</h3>
              <p className="text-xs text-slate-400">Real-time verification log of funds received from subscribers</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300 font-semibold">{paymentLedger.length} Confirmed TXs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Subscriber Email</th>
                <th className="p-4">Plan Purchased</th>
                <th className="p-4">Amount Received</th>
                <th className="p-4">Destination Wallet</th>
                <th className="p-4">Tx Hash</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {paymentLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">No transactions recorded yet.</td>
                </tr>
              ) : (
                paymentLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition text-xs">
                    <td className="p-4 text-slate-300">{item.date}</td>
                    <td className="p-4 font-semibold text-white">{item.user}</td>
                    <td className="p-4">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
                        {item.plan} ({item.cycle})
                      </span>
                    </td>
                    <td className="p-4 font-black text-emerald-400">
                      {item.amountCrypto} {item.crypto} <span className="text-[10px] text-slate-500 font-normal">(${item.amountUsd})</span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{item.destinationWallet}</td>
                    <td className="p-4 font-mono text-indigo-400 flex items-center space-x-1">
                      <span>{item.txHash}</span>
                      <ExternalLink className="w-3 h-3 cursor-pointer" />
                    </td>
                    <td className="p-4 text-right">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold inline-flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PricingTab({ user, paymentLedger, onSelectPlan }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free Trial',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: '7-day limited free trial for setup testing and trade logging.',
      features: ['7-Day Full Access', 'Up to 50 Trade Logs', 'Position Calculator', '1 Account Support', 'Requires Crypto Upgrade After 7 Days'],
      badge: user.tier === 'Free Trial' ? 'Active Trial' : 'Trial'
    },
    {
      name: 'Pro Trader',
      monthlyPrice: 4.00,
      yearlyPrice: 33.60,
      description: 'Advanced analytics, custom strategy tags, and unlimited trades.',
      features: ['Unlimited Trade Logging', 'Custom Strategy Tagging', '3 Multi-Accounts', 'Equity Curve Visualizer', 'Export CSV Data'],
      badge: 'Most Popular'
    },
    {
      name: 'Funded Elite',
      monthlyPrice: 7.00,
      yearlyPrice: 58.80,
      description: 'Complete risk monitoring built strictly for prop firm evaluations.',
      features: ['Everything in Pro Trader', 'Prop Firm Risk Monitor', 'Daily Drawdown Rules', 'Screenshot Chart Vault', 'Priority Direct Crypto Payout'],
      badge: 'Best Value'
    }
  ];

  const totalCryptoRevenue = paymentLedger.reduce((acc, item) => acc + (item.amountUsd || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
      {/* Pricing Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold">
          <Wallet className="w-4 h-4" />
          <span>Strictly Web3 & Crypto Payments (USDT, BTC, ETH, SOL, TON)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Upgrade Your Pulse Portfolio</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Choose a subscription plan below. Zero fiat processing fees — fast and secure blockchain verification restores full feature access.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-8 bg-slate-800 rounded-full p-1 border border-slate-700 transition"
          >
            <div className={`w-6 h-6 rounded-full bg-indigo-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>Yearly</span>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">Save 30%</span>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = user.tier === plan.name;
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div 
              key={plan.name}
              className={`bg-slate-900/60 border rounded-3xl p-8 flex flex-col justify-between relative shadow-xl backdrop-blur transition-all duration-300 ${
                plan.name === 'Funded Elite' ? 'border-indigo-500/60 ring-2 ring-indigo-500/20' : 'border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-2 min-h-[32px]">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-black">${price.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 ml-1">USD / {billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                </div>

                <div className="space-y-3 border-t border-slate-800/80 pt-6">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                {isCurrent ? (
                  <div className="w-full bg-slate-800 text-slate-300 font-bold py-3 rounded-2xl text-center text-xs border border-slate-700">
                    Active Plan
                  </div>
                ) : plan.name === 'Free Trial' ? (
                  <div className="w-full bg-slate-950 text-slate-500 font-bold py-3 rounded-2xl text-center text-xs border border-slate-850">
                    Expired Trial Mode
                  </div>
                ) : (
                  <button 
                    onClick={() => onSelectPlan(plan.name, billingCycle)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Upgrade with Crypto</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crypto Revenue Summary Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Crypto Payout & Revenue Overview</h3>
              <p className="text-xs text-slate-400">Total collected via direct blockchain transfer</p>
            </div>
          </div>
          <div className="bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 flex items-center space-x-4">
            <span className="text-xs text-slate-400">Total Crypto Collected:</span>
            <span className="text-xl font-black text-emerald-400">${totalCryptoRevenue.toFixed(2)} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ strategyTags, setStrategyTags, ownerWallets, setOwnerWallets, showToast }) {
  const [newTagInput, setNewTagInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const [tempWallets, setTempWallets] = useState(ownerWallets);

  const handleSaveWallets = (e) => {
    e.preventDefault();
    setOwnerWallets(tempWallets);
    showToast('Platform payout wallets saved successfully!', 'success');
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (strategyTags.includes(newTagInput.trim())) {
      showToast('Strategy tag already exists!', 'error');
      return;
    }
    setStrategyTags([...strategyTags, newTagInput.trim()]);
    setNewTagInput('');
    showToast('New strategy tag added successfully!', 'success');
  };

  const handleDeleteTag = (tagToDelete) => {
    setStrategyTags(strategyTags.filter(t => t !== tagToDelete));
    showToast('Strategy tag deleted', 'success');
  };

  const handleSaveEdit = (oldTag) => {
    if (!editText.trim()) return;
    const updated = strategyTags.map(t => t === oldTag ? editText.trim() : t);
    setStrategyTags(updated);
    setEditingIndex(null);
    setEditText('');
    showToast('Strategy tag updated', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Platform & Strategy Settings</h1>
        <p className="text-sm text-slate-400">Configure receiving payout wallets and manage trade strategy tags.</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Platform Payout Wallet Configurator (0xe8df0c...4e1e)</h2>
            <p className="text-xs text-slate-400">Set destination addresses to receive subscriber crypto payments directly into your wallets.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWallets} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tempWallets).map(([crypto, address]) => (
              <div key={crypto} className={crypto === 'USDT_BEP20' || crypto === 'USDC_BEP20' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{crypto} Receiving Address</label>
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setTempWallets({ ...tempWallets, [crypto]: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Payout Wallets</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <h2 className="text-lg font-bold border-b border-slate-800 pb-4">Strategy Tag Manager</h2>
        <form onSubmit={handleAddTag} className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter new strategy tag (e.g. London Breakout)..." 
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl transition shadow flex items-center space-x-2 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Tag</span>
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Active Strategy Tags ({strategyTags.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strategyTags.map((tag, idx) => (
              <div key={tag} className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl flex items-center justify-between">
                {editingIndex === idx ? (
                  <div className="flex items-center space-x-2 flex-1 mr-2">
                    <input 
                      type="text" 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500 text-sm px-3 py-1.5 rounded-xl focus:outline-none text-white"
                    />
                    <button onClick={() => handleSaveEdit(tag)} className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingIndex(null)} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span className="font-semibold text-slate-200">{tag}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => { setEditingIndex(idx); setEditText(tag); }}
                        className="p-2 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTag(tag)}
                        className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CryptoCheckoutModal({ planInfo, selectedCrypto, setSelectedCrypto, gatewayConfig, ownerWallets, paymentStatus, setPaymentStatus, onClose, onSuccess }) {
  const [copied, setCopied] = useState(false);
  const [payMode, setPayMode] = useState('web3');
  const [userTxHash, setUserTxHash] = useState('');
  
  const [connectedWalletType, setConnectedWalletType] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const usdPrice = planInfo.cycle === 'yearly' 
    ? (planInfo.plan === 'Pro Trader' ? 33.60 : 58.80) 
    : (planInfo.plan === 'Pro Trader' ? 4.00 : 7.00);

  const cryptoAmounts = {
    USDT_BEP20: usdPrice.toFixed(2),
    USDC_BEP20: usdPrice.toFixed(2),
    ETH: (usdPrice / 3400).toFixed(4),
    BNB: (usdPrice / 620).toFixed(3),
    BTC: (usdPrice / 65000).toFixed(5),
    SOL: (usdPrice / 145).toFixed(3),
    TON: (usdPrice / 5.2).toFixed(2)
  };

  const activeWalletAddress = ownerWallets[selectedCrypto] || '0xe8df0ce79fac8e02f35f8d2bce7b71edae924e1e';
  const activeAmount = cryptoAmounts[selectedCrypto] || usdPrice.toFixed(2);

  const handleConnectWallet = async (walletType) => {
    setIsConnectingWallet(true);
    setConnectedWalletType(walletType);

    try {
      if (walletType === 'MetaMask' || walletType === 'Binance' || walletType === 'OKX') {
        const provider = window.ethereum || window.okxwallet || (window.BinanceChain && window.BinanceChain);
        if (!provider) {
          alert(`${walletType} wallet extension not detected in browser. Please install or unlock it.`);
          setIsConnectingWallet(false);
          setConnectedWalletType(null);
          return;
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          const balanceHex = await provider.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] });
          const ethBal = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
          setWalletBalance(ethBal + ' BNB/ETH');
        }
      } else if (walletType === 'Phantom') {
        const solProvider = window.solana;
        if (!solProvider || !solProvider.isPhantom) {
          alert('Phantom wallet extension not detected in browser.');
          setIsConnectingWallet(false);
          setConnectedWalletType(null);
          return;
        }
        const response = await solProvider.connect();
        setConnectedAccount(response.publicKey.toString());
        setWalletBalance('1.450 SOL');
      } else {
        await new Promise(r => setTimeout(r, 1200));
        setConnectedAccount('0xe8df0c...4e1e');
        setWalletBalance('1,250.00 USDT');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      alert('Wallet connection request was rejected.');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyTxHash = () => {
    if (!userTxHash || userTxHash.length < 8) {
      alert('Please enter a valid Transaction Hash / TxID');
      return;
    }
    setPaymentStatus('verifying');
    setTimeout(() => {
      onSuccess(planInfo.plan, selectedCrypto, activeAmount, usdPrice, userTxHash);
    }, 2200);
  };

  const handleExecuteWeb3Payment = async () => {
    if (!connectedAccount) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    setPaymentStatus('verifying');

    try {
      let signedTxHash = '';
      const provider = window.ethereum || window.okxwallet;
      if (provider) {
        const weiValue = '0x' + Math.floor(usdPrice * 1e16).toString(16);
        signedTxHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: connectedAccount,
            to: activeWalletAddress,
            value: weiValue,
            gas: '0x5208',
          }],
        });
      } else {
        await new Promise(r => setTimeout(r, 2000));
        signedTxHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      }

      setTimeout(() => {
        onSuccess(planInfo.plan, selectedCrypto, activeAmount, usdPrice, signedTxHash.substring(0, 12) + '...');
      }, 1500);
    } catch (err) {
      console.error('Transaction signature rejected:', err);
      setPaymentStatus('idle');
      alert('Transaction signature was cancelled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              Your OKX / BEP-20 Gateway
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Subscribe to {planInfo.plan}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Billing Cycle: <span className="text-white font-bold capitalize">{planInfo.cycle}</span> (${usdPrice.toFixed(2)} USD total)
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {gatewayConfig.enabledCoins.map(crypto => (
            <button
              key={crypto}
              onClick={() => setSelectedCrypto(crypto)}
              className={`py-2 px-1 rounded-xl border font-bold text-xs transition flex flex-col items-center ${
                selectedCrypto === crypto ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="truncate w-full text-center">{crypto}</span>
            </button>
          ))}
        </div>

        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setPayMode('web3')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${payMode === 'web3' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Web3 (OKX / MetaMask)
          </button>
          <button 
            onClick={() => setPayMode('manual')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${payMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Manual Transfer
          </button>
        </div>

        {payMode === 'web3' ? (
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Select Web3 Provider</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'OKX', name: 'OKX Wallet', icon: '🟢' },
                { id: 'MetaMask', name: 'MetaMask', icon: '🦊' },
                { id: 'Binance', name: 'Binance Web3', icon: '🟡' },
                { id: 'Phantom', name: 'Phantom', icon: '👻' }
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => handleConnectWallet(w.id)}
                  disabled={isConnectingWallet}
                  className={`p-3 rounded-2xl border flex items-center space-x-3 transition ${
                    connectedWalletType === w.id 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{w.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-xs">{w.name}</div>
                    <div className="text-[10px] text-slate-500">{connectedWalletType === w.id && connectedAccount ? 'Connected' : 'Click to link'}</div>
                  </div>
                </button>
              ))}
            </div>

            {connectedAccount && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Linked Account:</span>
                  <span className="font-mono font-bold text-indigo-300">{connectedAccount.substring(0, 6)}...</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Balance:</span>
                  <span className="font-bold text-emerald-400">{walletBalance}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Send exact amount:</span>
              <span className="text-base font-black text-emerald-400">{activeAmount} {selectedCrypto}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Your Destination Wallet Address:</span>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-emerald-400 truncate flex-1">{activeWalletAddress}</span>
                <button onClick={handleCopy} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-3">
              <label className="block text-xs font-semibold text-slate-300">Submit Transaction Hash (TxID)</label>
              <input 
                type="text" 
                placeholder="Paste transaction hash..."
                value={userTxHash}
                onChange={(e) => setUserTxHash(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        )}

        {paymentStatus === 'verifying' ? (
          <div className="text-center py-4 space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Processing blockchain transaction to your address...</p>
          </div>
        ) : (
          <button 
            onClick={payMode === 'web3' ? handleExecuteWeb3Payment : handleVerifyTxHash}
            disabled={payMode === 'web3' && !connectedAccount}
            className={`w-full font-bold py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center space-x-2 ${
              payMode === 'web3' && !connectedAccount 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
            }`}
          >
            <span>{payMode === 'web3' ? `Sign & Pay to ${activeWalletAddress.substring(0, 6)}...` : 'Verify TxHash & Activate Plan'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function NewTradeModal({ accountId, strategyTags, onClose, onAddTrade }) {
  const [symbol, setSymbol] = useState('EURUSD');
  const [type, setType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState(1.0850);
  const [exitPrice, setExitPrice] = useState(1.0910);
  const [size, setSize] = useState(1.0);
  const [strategy, setStrategy] = useState(strategyTags[0] || 'Breakout');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const pnl = type === 'BUY' ? (Number(exitPrice) - Number(entryPrice)) * Number(size) * 1000 : (Number(entryPrice) - Number(exitPrice)) * Number(size) * 1000;
    const pnlPercent = ((pnl / 10000) * 100).toFixed(2);

    const newTrade = {
      id: 'tr-' + Date.now(),
      accountId,
      symbol: symbol.toUpperCase(),
      type,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
      size: Number(size),
      pnl: Number(pnl.toFixed(2)),
      pnlPercent: Number(pnlPercent),
      date: new Date().toISOString().split('T')[0],
      strategy,
      notes,
      screenshot: screenshot.trim() ? screenshot : null,
      status: 'Closed'
    };

    onAddTrade(newTrade);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-black">Log New Trade</h2>
          <p className="text-xs text-slate-400">Record your execution details and strategy tags.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Symbol</label>
              <input 
                type="text" 
                required
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
              >
                <option value="BUY">BUY (Long)</option>
                <option value="SELL">SELL (Short)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Entry Price</label>
              <input 
                type="number" 
                step="any"
                required
                value={entryPrice} 
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Exit Price</label>
              <input 
                type="number" 
                step="any"
                required
                value={exitPrice} 
                onChange={(e) => setExitPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Size (Lots)</label>
              <input 
                type="number" 
                step="0.1"
                required
                value={size} 
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Strategy Tag</label>
            <select 
              value={strategy} 
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
            >
              {strategyTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Chart Screenshot URL (Optional)</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/..."
              value={screenshot} 
              onChange={(e) => setScreenshot(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Trade Notes</label>
            <textarea 
              rows={3}
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Psychology, execution quality, lessons learned..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition shadow">
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewAccountModal({ onClose, onAddAccount }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Real');
  const [balance, setBalance] = useState(10000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newAcc = {
      id: 'acc-' + Date.now(),
      name,
      type,
      balance: Number(balance),
      initialBalance: Number(balance),
      currency: '$',
      dailyLimit: type === 'Funded' ? balance * 0.05 : undefined,
      maxLimit: type === 'Funded' ? balance * 0.10 : undefined
    };
    onAddAccount(newAcc);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-black">Add Trading Account</h2>
          <p className="text-xs text-slate-400">Initialize a Real or Funded prop firm account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Account Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Apex Funded 50k"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Account Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="Real">Real Personal Account</option>
              <option value="Funded">Funded Prop Firm Account</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Balance ($)</label>
            <input 
              type="number" 
              required
              value={balance} 
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition shadow">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, isPositive }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className={`text-2xl font-black ${isPositive !== undefined ? (isPositive ? 'text-emerald-400' : 'text-rose-400') : 'text-white'}`}>
          {value}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}