import React, { useState, useRef } from 'react';
import { useAnnualReturnsFirestore, type BusinessActivity } from '../hooks/useAnnualReturnsFirestore';
import { uploadPDFToStorage, extractAnnualReturnDataFromPDF, formatDateToISO } from '../lib/pdfUtils';

const AnnualReturnManager: React.FC = () => {
  const { annualReturns, loading, error, createAnnualReturn, updateAnnualReturn, deleteAnnualReturn } = useAnnualReturnsFirestore();
  const [showForm, setShowForm] = useState(false);
  const [editingReturn, setEditingReturn] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [extractingData, setExtractingData] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [selectedPDFFile, setSelectedPDFFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    financialYear: '',
    filingDate: '',
    agmDate: '',
    formType: 'MGT-7',
    cin: '',
    companyName: '',
    companyType: '',
    authorizedCapital: '',
    paidUpCapital: '',
    turnover: '',
    netWorth: '',
    businessActivities: [] as BusinessActivity[],
    promoterHoldingPercent: '',
    totalDirectors: '',
    boardMeetingsHeld: '',
    agmConducted: false,
    filedOnTime: false,
    noPenalties: false,
    statutoryCompliancesMet: false,
    documentUrl: '',
    documentSize: 0,
    documentUploadedAt: undefined as Date | undefined,
    status: 'draft' as 'draft' | 'published',
  });

  const handlePDFSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError(null);
    setSelectedPDFFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-extract data from PDF
    try {
      setExtractingData(true);
      const extractedData = await extractAnnualReturnDataFromPDF(file);
      
      // Update form with extracted data
      if (extractedData.financialYear) {
        setFormData(prev => ({ ...prev, financialYear: extractedData.financialYear! }));
      }
      if (extractedData.cin) {
        setFormData(prev => ({ ...prev, cin: extractedData.cin! }));
      }
      if (extractedData.companyName) {
        setFormData(prev => ({ ...prev, companyName: extractedData.companyName! }));
      }
      if (extractedData.filingDate) {
        setFormData(prev => ({ ...prev, filingDate: formatDateToISO(extractedData.filingDate!) }));
      }
      if (extractedData.agmDate) {
        setFormData(prev => ({ ...prev, agmDate: formatDateToISO(extractedData.agmDate!) }));
      }
      if (extractedData.formType) {
        setFormData(prev => ({ ...prev, formType: extractedData.formType! }));
      }
      if (extractedData.authorizedCapital) {
        setFormData(prev => ({ ...prev, authorizedCapital: extractedData.authorizedCapital!.toString() }));
      }
      if (extractedData.paidUpCapital) {
        setFormData(prev => ({ ...prev, paidUpCapital: extractedData.paidUpCapital!.toString() }));
      }
      if (extractedData.turnover) {
        setFormData(prev => ({ ...prev, turnover: extractedData.turnover!.toString() }));
      }
      if (extractedData.netWorth) {
        setFormData(prev => ({ ...prev, netWorth: extractedData.netWorth!.toString() }));
      }
      if (extractedData.businessActivities && extractedData.businessActivities.length > 0) {
        setFormData(prev => ({ ...prev, businessActivities: extractedData.businessActivities! }));
      }
      if (extractedData.promoterHoldingPercent !== undefined) {
        setFormData(prev => ({ ...prev, promoterHoldingPercent: extractedData.promoterHoldingPercent!.toString() }));
      }
      if (extractedData.totalDirectors) {
        setFormData(prev => ({ ...prev, totalDirectors: extractedData.totalDirectors!.toString() }));
      }
      if (extractedData.boardMeetingsHeld) {
        setFormData(prev => ({ ...prev, boardMeetingsHeld: extractedData.boardMeetingsHeld!.toString() }));
      }
      
      console.log('[AnnualReturn] Data extracted from PDF:', extractedData);
    } catch (extractError: any) {
      console.error('[AnnualReturn] Extraction error:', extractError);
      setFormError(`PDF extraction failed: ${extractError.message}. You can still fill the form manually.`);
    } finally {
      setExtractingData(false);
    }
  };

  const handleRemovePDF = () => {
    setSelectedPDFFile(null);
    setPdfPreview(null);
    setFormData(prev => ({ ...prev, documentUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddBusinessActivity = () => {
    setFormData(prev => ({
      ...prev,
      businessActivities: [...prev.businessActivities, { name: '', percentage: 0 }],
    }));
  };

  const handleUpdateBusinessActivity = (index: number, field: 'name' | 'percentage', value: string | number) => {
    setFormData(prev => {
      const updated = [...prev.businessActivities];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, businessActivities: updated };
    });
  };

  const handleRemoveBusinessActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessActivities: prev.businessActivities.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string | null => {
    // Validate business activities sum to 100%
    const totalPercentage = formData.businessActivities.reduce((sum, activity) => sum + activity.percentage, 0);
    if (formData.businessActivities.length > 0 && Math.abs(totalPercentage - 100) > 0.01) {
      return `Business activities must total 100% (currently ${totalPercentage.toFixed(2)}%)`;
    }

    // Validate required fields
    if (!formData.financialYear) return 'Financial Year is required';
    if (!formData.filingDate) return 'Filing Date is required';
    if (!formData.documentUrl && !selectedPDFFile) return 'PDF document is required';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    try {
      let finalDocumentUrl = formData.documentUrl;
      let finalDocumentSize = formData.documentSize;
      let finalDocumentUploadedAt = formData.documentUploadedAt;

      // Upload PDF if a new file is selected
      if (selectedPDFFile) {
        setUploadingPDF(true);
        try {
          const uploadResult = await uploadPDFToStorage(selectedPDFFile, 'annualReturns/pdfs');
          finalDocumentUrl = uploadResult.url;
          finalDocumentSize = uploadResult.size;
          finalDocumentUploadedAt = new Date();
          console.log('[AnnualReturn] PDF uploaded:', finalDocumentUrl);
        } catch (uploadError: any) {
          setUploadingPDF(false);
          throw new Error(`Failed to upload PDF: ${uploadError.message}`);
        }
        setUploadingPDF(false);
      }

      // Prepare data for Firestore
      const returnData = {
        financialYear: formData.financialYear,
        filingDate: formData.filingDate,
        agmDate: formData.agmDate,
        formType: formData.formType,
        cin: formData.cin,
        companyName: formData.companyName,
        companyType: formData.companyType,
        authorizedCapital: parseFloat(formData.authorizedCapital) || 0,
        paidUpCapital: parseFloat(formData.paidUpCapital) || 0,
        turnover: parseFloat(formData.turnover) || 0,
        netWorth: formData.netWorth ? parseFloat(formData.netWorth) : undefined,
        businessActivities: formData.businessActivities,
        promoterHoldingPercent: parseFloat(formData.promoterHoldingPercent) || 0,
        totalDirectors: parseInt(formData.totalDirectors, 10) || 0,
        boardMeetingsHeld: parseInt(formData.boardMeetingsHeld, 10) || 0,
        agmConducted: formData.agmConducted,
        filedOnTime: formData.filedOnTime,
        noPenalties: formData.noPenalties,
        statutoryCompliancesMet: formData.statutoryCompliancesMet,
        documentUrl: finalDocumentUrl,
        documentSize: finalDocumentSize,
        documentUploadedAt: finalDocumentUploadedAt,
        status: formData.status,
      };
      
      if (editingReturn) {
        await updateAnnualReturn({ ...returnData, id: editingReturn });
      } else {
        await createAnnualReturn(returnData);
      }

      // Reset form
      handleCancel();
    } catch (err: any) {
      console.error('Error saving annual return:', err);
      const errorMsg = err?.message || err?.code || 'Failed to save annual return. Check console for details.';
      setFormError(errorMsg);
      setUploadingPDF(false);
    }
  };

  const handleEdit = (returnId: string) => {
    const returnData = annualReturns.find(r => r.id === returnId);
    if (!returnData) return;

    setEditingReturn(returnId);
    setFormData({
      financialYear: returnData.financialYear,
      filingDate: returnData.filingDate,
      agmDate: returnData.agmDate,
      formType: returnData.formType,
      cin: returnData.cin,
      companyName: returnData.companyName,
      companyType: returnData.companyType,
      authorizedCapital: returnData.authorizedCapital.toString(),
      paidUpCapital: returnData.paidUpCapital.toString(),
      turnover: returnData.turnover.toString(),
      netWorth: returnData.netWorth?.toString() || '',
      businessActivities: returnData.businessActivities,
      promoterHoldingPercent: returnData.promoterHoldingPercent.toString(),
      totalDirectors: returnData.totalDirectors.toString(),
      boardMeetingsHeld: returnData.boardMeetingsHeld.toString(),
      agmConducted: returnData.agmConducted,
      filedOnTime: returnData.filedOnTime,
      noPenalties: returnData.noPenalties,
      statutoryCompliancesMet: returnData.statutoryCompliancesMet,
      documentUrl: returnData.documentUrl,
      documentSize: returnData.documentSize || 0,
      documentUploadedAt: returnData.documentUploadedAt,
      status: returnData.status,
    });
    setPdfPreview(returnData.documentUrl);
    setSelectedPDFFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this annual return?')) {
      try {
        await deleteAnnualReturn(id);
      } catch (err) {
        console.error('Error deleting annual return:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReturn(null);
    setFormError(null);
    setSelectedPDFFile(null);
    setPdfPreview(null);
    setFormData({
      financialYear: '',
      filingDate: '',
      agmDate: '',
      formType: 'MGT-7',
      cin: '',
      companyName: '',
      companyType: '',
      authorizedCapital: '',
      paidUpCapital: '',
      turnover: '',
      netWorth: '',
      businessActivities: [],
      promoterHoldingPercent: '',
      totalDirectors: '',
      boardMeetingsHeld: '',
      agmConducted: false,
      filedOnTime: false,
      noPenalties: false,
      statutoryCompliancesMet: false,
      documentUrl: '',
      documentSize: 0,
      documentUploadedAt: undefined,
      status: 'draft',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: 'draft' | 'published') => {
    const returnData = annualReturns.find(r => r.id === id);
    if (!returnData) return;

    try {
      await updateAnnualReturn({
        id,
        status: currentStatus === 'published' ? 'draft' : 'published',
      });
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const businessActivityTotal = formData.businessActivities.reduce((sum, activity) => sum + activity.percentage, 0);

  if (loading && annualReturns.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-red-200 font-bold text-lg mb-2">⚠️ Firestore Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Annual Return Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
        >
          Add New Annual Return
        </button>
      </div>

      {/* Annual Return Form */}
      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingReturn ? 'Edit Annual Return' : 'Create New Annual Return'}
          </h3>
          {formError && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PDF Upload Section */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Annual Return PDF *
              </label>
              
              {(pdfPreview || formData.documentUrl) && (
                <div className="mb-3 relative">
                  <iframe
                    src={pdfPreview || formData.documentUrl}
                    className="w-full h-64 border border-white/20 rounded-lg"
                    title="PDF Preview"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePDF}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFSelect}
                  className="hidden"
                  id="pdf-upload"
                  disabled={uploadingPDF || extractingData}
                />
                <label
                  htmlFor="pdf-upload"
                  className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingPDF || extractingData
                      ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed'
                      : 'border-white/30 bg-white/5 hover:border-[#00aeef] hover:bg-white/10'
                  }`}
                >
                  {extractingData ? (
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]"></div>
                      <span>Extracting data from PDF...</span>
                    </div>
                  ) : uploadingPDF ? (
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00aeef]"></div>
                      <span>Uploading PDF...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-white">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">
                        {selectedPDFFile
                          ? `Selected: ${selectedPDFFile.name} (${(selectedPDFFile.size / (1024 * 1024)).toFixed(2)}MB)`
                          : 'Click to upload PDF (Max 50MB)'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Data will be auto-extracted from the PDF
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Financial Year *
                </label>
                <input
                  type="text"
                  required
                  value={formData.financialYear}
                  onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="2024-25"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Form Type *
                </label>
                <input
                  type="text"
                  required
                  value={formData.formType}
                  onChange={(e) => setFormData({ ...formData, formType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="MGT-7"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Filing Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.filingDate}
                  onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  AGM Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.agmDate}
                  onChange={(e) => setFormData({ ...formData, agmDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  CIN
                </label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="L12345XX2024PLC123456"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Company Type
                </label>
                <input
                  type="text"
                  value={formData.companyType}
                  onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  placeholder="Private Limited"
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-semibold mb-4">Financial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Authorized Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.authorizedCapital}
                    onChange={(e) => setFormData({ ...formData, authorizedCapital: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Paid-up Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.paidUpCapital}
                    onChange={(e) => setFormData({ ...formData, paidUpCapital: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Turnover (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.turnover}
                    onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Net Worth (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.netWorth}
                    onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Promoter Holding (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.promoterHoldingPercent}
                    onChange={(e) => setFormData({ ...formData, promoterHoldingPercent: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Business Activities */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Business Activities</h4>
                <button
                  type="button"
                  onClick={handleAddBusinessActivity}
                  className="px-3 py-1 bg-[#00aeef] text-black text-sm rounded hover:bg-[#0099d4] transition-colors"
                >
                  Add Activity
                </button>
              </div>
              {formData.businessActivities.length === 0 ? (
                <p className="text-gray-300 text-sm">No business activities added. Click "Add Activity" to add one.</p>
              ) : (
                <div className="space-y-3">
                  {formData.businessActivities.map((activity, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={activity.name}
                        onChange={(e) => handleUpdateBusinessActivity(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        placeholder="Activity name"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={activity.percentage}
                        onChange={(e) => handleUpdateBusinessActivity(index, 'percentage', parseFloat(e.target.value) || 0)}
                        className="w-32 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        placeholder="%"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBusinessActivity(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className={`text-sm ${Math.abs(businessActivityTotal - 100) < 0.01 ? 'text-green-300' : 'text-red-300'}`}>
                    Total: {businessActivityTotal.toFixed(2)}% {Math.abs(businessActivityTotal - 100) < 0.01 ? '✓' : '(Must equal 100%)'}
                  </div>
                </div>
              )}
            </div>

            {/* Governance */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-semibold mb-4">Governance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Total Directors
                  </label>
                  <input
                    type="number"
                    value={formData.totalDirectors}
                    onChange={(e) => setFormData({ ...formData, totalDirectors: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Board Meetings Held
                  </label>
                  <input
                    type="number"
                    value={formData.boardMeetingsHeld}
                    onChange={(e) => setFormData({ ...formData, boardMeetingsHeld: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-semibold mb-4">Compliance Status</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.agmConducted}
                    onChange={(e) => setFormData({ ...formData, agmConducted: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-white">AGM Conducted</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.filedOnTime}
                    onChange={(e) => setFormData({ ...formData, filedOnTime: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-white">Filed on Time</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.noPenalties}
                    onChange={(e) => setFormData({ ...formData, noPenalties: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-white">No Penalties</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.statutoryCompliancesMet}
                    onChange={(e) => setFormData({ ...formData, statutoryCompliancesMet: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-white">Statutory Compliances Met</span>
                </label>
              </div>
            </div>

            {/* Status */}
            <div className="border-t border-white/20 pt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                  className="mr-2"
                />
                <span className="text-white">Publish (visible on frontend)</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-4 border-t border-white/20">
              <button
                type="submit"
                disabled={uploadingPDF || extractingData}
                className="px-6 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPDF ? 'Uploading...' : extractingData ? 'Extracting...' : editingReturn ? 'Update Annual Return' : 'Create Annual Return'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Annual Returns List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">All Annual Returns ({annualReturns.length})</h3>
        <div className="space-y-4">
          {annualReturns.length === 0 ? (
            <p className="text-gray-300 text-center py-8">No annual returns found. Create your first annual return!</p>
          ) : (
            annualReturns.map((returnData) => (
              <div key={returnData.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">
                        Financial Year: {returnData.financialYear}
                      </h4>
                      {returnData.status === 'published' && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                          Published
                        </span>
                      )}
                      {returnData.status === 'draft' && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Filing Date:</span> {returnData.filingDate}
                      </div>
                      <div>
                        <span className="text-gray-400">AGM Date:</span> {returnData.agmDate}
                      </div>
                      <div>
                        <span className="text-gray-400">Form:</span> {returnData.formType}
                      </div>
                      <div>
                        <span className="text-gray-400">Turnover:</span> ₹{returnData.turnover.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => returnData.documentUrl && window.open(returnData.documentUrl, '_blank')}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      disabled={!returnData.documentUrl}
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => handleEdit(returnData.id!)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(returnData.id!, returnData.status)}
                      className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                        returnData.status === 'published'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {returnData.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(returnData.id!)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualReturnManager;

