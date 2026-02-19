import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAnnualReturnsFirestore } from '../../hooks/useAnnualReturnsFirestore';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnnualReturnsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { annualReturns, getPublishedAnnualReturns, loading, error } = useAnnualReturnsFirestore();
  const publishedReturns = getPublishedAnnualReturns();
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const isVisible = isInView || publishedReturns.length > 0; // fail-safe to render even if IntersectionObserver misses
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const wrapLabel = (text: string, maxCharsPerLine = 16) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    words.forEach((w) => {
      if ((current + ' ' + w).trim().length > maxCharsPerLine) {
        lines.push(current.trim());
        current = w;
      } else {
        current = (current + ' ' + w).trim();
      }
    });
    if (current) lines.push(current.trim());
    return lines;
  };

  const renderActivityLabel = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, name, percent } = props;
    const labelOffset = isMobile ? 14 : 22;
    const fontSize = isMobile ? 9 : 12;
    const lineHeight = isMobile ? 11 : 14;
    const maxChars = isMobile ? 12 : 18;
    const radius = outerRadius + labelOffset;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const lines = wrapLabel(name || '', maxChars);
    return (
      <text
        x={x}
        y={y}
        fill="#0088bb"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="middle"
        fontSize={fontSize}
      >
        {lines.map((line: string, idx: number) => (
          <tspan key={idx} x={x} dy={idx === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
        <tspan x={x} dy={lineHeight}>
          {percent ? `${(percent * 100).toFixed(1)}%` : ''}
        </tspan>
      </text>
    );
  };
  
  // Handle error state
  if (error) {
    // Rendering handled below; no console logging to keep noise minimal
  }

  // Get available years
  const availableYears = publishedReturns.map(ret => ret.financialYear).sort((a, b) => b.localeCompare(a));
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  // Set default selected year when availableYears changes
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Get selected year data with a fallback to first entry in case of mismatch
  const selectedYearData = useMemo(() => {
    if (publishedReturns.length === 0) return undefined;
    const exact = publishedReturns.find(ret => ret.financialYear === selectedYear);
    return exact || publishedReturns[0];
  }, [publishedReturns, selectedYear]);

  // Prepare chart data for turnover trend
  const turnoverChartData = publishedReturns
    .sort((a, b) => a.financialYear.localeCompare(b.financialYear))
    .map(ret => ({
      year: ret.financialYear,
      turnover: ret.turnover / 10000000, // Convert to Crores
      netWorth: ret.netWorth ? ret.netWorth / 10000000 : null,
    }));

  // Prepare business activity data for pie chart
  const businessActivityData = selectedYearData?.businessActivities.map((activity) => ({
    name: activity.name,
    value: activity.percentage,
  })) || [];

  const COLORS = ['#00aeef', '#0099d4', '#0088bb', '#0077a2', '#006688', '#005577'];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatCroreTick = (value?: number) => {
    if (value === undefined || value === null) return '';
    return `₹${value.toFixed(0)} Cr`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const widgetVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 space-y-4">
        <h2 className="text-3xl font-bold text-black">Annual Return</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 shadow-sm">
          <p className="font-semibold mb-2">Unable to load Annual Returns</p>
          <p className="text-sm">
            {error}
          </p>
          <p className="text-xs text-red-600 mt-3">
            Ensure: (1) Firebase config is correct (VITE_FIREBASE_* env vars), (2) Firestore rules allow reading documents where status="published", (3) At least one document has status="published" (lowercase), (4) Composite index exists for status + financialYear fields. Check browser console for details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  if (!loading && publishedReturns.length === 0) {
    const hasDrafts = annualReturns.length > 0;
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-black mb-6">
          Annual Return
        </h2>
        {hasDrafts ? (
          <div className="space-y-3">
            <p className="text-lg md:text-xl text-gray-600">
              Annual returns exist but none are published yet.
            </p>
            <p className="text-sm text-gray-500">
              Publish at least one entry (status = "published") in the admin dashboard to display it here.
            </p>
            <div className="mx-auto max-w-xl bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-2">Loaded entries</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {annualReturns.slice(0, 5).map((ret, idx) => (
                  <li key={ret.id || idx} className="flex items-center justify-between">
                    <span className="truncate">
                      {ret.financialYear || 'Unknown year'} — {ret.companyName || 'Untitled'}
                    </span>
                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                      {ret.status || 'unknown'}
                    </span>
                  </li>
                ))}
                {annualReturns.length > 5 && (
                  <li className="text-xs text-gray-500">+{annualReturns.length - 5} more…</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-lg md:text-xl text-gray-600">
            No annual returns published yet. Please check back later.
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto space-y-4">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Annual Return
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Statutory disclosures under the Companies Act, 2013
        </motion.p>
      </motion.div>

      {/* Financial Year Selector */}
      {availableYears.length > 0 && (
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {availableYears.map((year) => (
            <motion.button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedYear === year
                  ? 'bg-[#00aeef] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}
            </motion.button>
          ))}
        </motion.div>
      )}

      {selectedYearData && (
        <>
          {/* Quick Statutory Facts */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          >
            {[
              { label: 'Financial Year', value: selectedYearData.financialYear },
              { label: 'Filing Date', value: formatDate(selectedYearData.filingDate) },
              { label: 'AGM Date', value: formatDate(selectedYearData.agmDate) },
              { label: 'Form Type', value: selectedYearData.formType },
            ].map((fact, index) => (
              <motion.div
                key={index}
                variants={widgetVariants}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {fact.label}
                </div>
                <div className="text-xl font-bold text-[#00aeef]">
                  {fact.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* PDF View Block */}
          {selectedYearData.documentUrl && (
            <>
              <motion.div 
                className="bg-gradient-to-r from-[#00aeef] to-[#0099d4] rounded-2xl shadow-lg p-8 mb-12 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">View Annual Return (PDF)</h3>
                    {selectedYearData.documentSize && (
                      <p className="text-white/80">
                        File size: {(selectedYearData.documentSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                    {selectedYearData.documentUploadedAt && (
                      <p className="text-white/80 text-sm">
                        Last updated: {formatDate(selectedYearData.documentUploadedAt.toISOString())}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPdfViewer(true)}
                      className="px-8 py-3 bg-white text-[#00aeef] rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => setShowDownloadMessage(true)}
                      className="px-8 py-3 bg-white/20 text-white border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200"
                    >
                      Request Download
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* PDF Viewer Modal */}
              {showPdfViewer && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80" onClick={() => setShowPdfViewer(false)}>
                  <div className="relative w-full h-[95dvh] sm:h-full sm:max-w-6xl sm:max-h-[90vh] bg-white rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
                      <h3 className="text-sm sm:text-lg font-semibold truncate pr-4">Annual Return - {selectedYearData.financialYear}</h3>
                      <button
                        onClick={() => setShowPdfViewer(false)}
                        className="text-white hover:text-gray-300 transition-colors text-2xl font-bold flex-shrink-0"
                        aria-label="Close viewer"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <iframe
                        src={`${selectedYearData.documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                        className="w-full h-full border-0"
                        title="Annual Return PDF Viewer"
                        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                        allow="fullscreen"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Download Request Message Modal */}
              {showDownloadMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowDownloadMessage(false)}>
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 bg-[#00aeef]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-[#00aeef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Request Document Download</h3>
                      <p className="text-slate-600 mb-6">
                        To download the Annual Return document, please contact us. We'll be happy to provide you with the document.
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-slate-700 mb-2"><strong>Contact Information:</strong></p>
                        <p className="text-sm text-slate-600">Email: <a href="mailto:info@plustech.com" className="text-[#00aeef] hover:underline">info@plustech.com</a></p>
                        <p className="text-sm text-slate-600">Phone: <a href="tel:+912026114961" className="text-[#00aeef] hover:underline inline-block min-h-[44px] min-w-[44px] flex items-center">+91 20 26114961</a></p>
                        <p className="text-sm text-slate-600">Phone: <a href="tel:+912026056366" className="text-[#00aeef] hover:underline inline-block min-h-[44px] min-w-[44px] flex items-center">+91 20 26056366</a></p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href="/contact"
                          className="flex-1 px-6 py-3 bg-[#00aeef] text-white rounded-lg font-semibold hover:bg-[#0099d4] transition-colors duration-200"
                        >
                          Contact Us
                        </a>
                        <button
                          onClick={() => setShowDownloadMessage(false)}
                          className="px-6 py-3 bg-gray-100 text-slate-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Statutory Snapshot */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { label: 'Company Type', value: selectedYearData.companyType || 'N/A' },
              { label: 'Authorized Capital', value: formatCurrency(selectedYearData.authorizedCapital) },
              { label: 'Paid-up Capital', value: formatCurrency(selectedYearData.paidUpCapital) },
              { label: 'Promoter Holding', value: `${selectedYearData.promoterHoldingPercent.toFixed(2)}%` },
            ].map((snapshot, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              >
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {snapshot.label}
                </div>
                <div className="text-xl font-bold text-[#00aeef]">
                  {snapshot.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Financial Highlights Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Turnover Trend Line Chart */}
            {turnoverChartData.length > 0 && (
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-black mb-4 sm:mb-6">
                  Turnover Trend
                </h3>
                <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
                  <LineChart
                    data={turnoverChartData}
                    margin={isMobile ? { top: 5, right: 10, left: -15, bottom: 8 } : { top: 10, right: 16, left: 0, bottom: 12 }}
                  >
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tickFormatter={formatCroreTick} tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }} width={isMobile ? 45 : 60} />
                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? `₹${value.toFixed(2)} Cr` : ''} />
                    <Legend wrapperStyle={isMobile ? { fontSize: '10px' } : undefined} />
                    <Line
                      type="monotone"
                      dataKey="turnover"
                      stroke="#00aeef"
                      strokeWidth={isMobile ? 2 : 3}
                      dot={{ r: isMobile ? 2 : 3 }}
                      activeDot={{ r: isMobile ? 4 : 6 }}
                      name="Turnover (₹ Cr)"
                    />
                    {selectedYearData?.netWorth && (
                      <Line
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#0099d4"
                        strokeWidth={isMobile ? 2 : 3}
                        dot={{ r: isMobile ? 2 : 3 }}
                        activeDot={{ r: isMobile ? 4 : 6 }}
                        name="Net Worth (₹ Cr)"
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Business Activity Pie Chart */}
            {businessActivityData.length > 0 && (
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-black mb-4 sm:mb-6">
                  Business Activity Split
                </h3>
                <div className="flex justify-center overflow-hidden">
                  <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
                    <PieChart>
                      <Pie
                        data={businessActivityData}
                        cx="50%"
                        cy="50%"
                        labelLine={!isMobile}
                        label={isMobile ? false : renderActivityLabel}
                        outerRadius={isMobile ? 80 : 120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {businessActivityData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : ''} />
                      {isMobile && <Legend wrapperStyle={{ fontSize: '10px' }} />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          {/* Governance Summary */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h3 className="text-2xl font-bold font-heading text-black mb-6">
              Governance Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#00aeef] mb-2">
                  {selectedYearData.totalDirectors}
                </div>
                <div className="text-gray-600">Total Directors</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#00aeef] mb-2">
                  {selectedYearData.boardMeetingsHeld}
                </div>
                <div className="text-gray-600">Board Meetings Held</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#00aeef] mb-2">
                  {selectedYearData.agmConducted ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-600">AGM Conducted</div>
              </div>
            </div>
          </motion.div>

          {/* Compliance Status */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <h3 className="text-2xl font-bold font-heading text-black mb-6">
              Compliance Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Filed on time', value: selectedYearData.filedOnTime },
                { label: 'No penalties', value: selectedYearData.noPenalties },
                { label: 'Statutory compliances met', value: selectedYearData.statutoryCompliancesMet },
              ].map((compliance, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  {compliance.value ? (
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={`font-medium ${compliance.value ? 'text-green-700' : 'text-red-700'}`}>
                    {compliance.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div 
            className="text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <p>
              Data shown is extracted from statutory filings. The complete Annual Return document is available above.
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AnnualReturnsSection;
