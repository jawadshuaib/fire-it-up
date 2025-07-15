
import React, { useState, useEffect } from 'react';
import { Asset, RiskLevel } from '../types';

interface AssetFormProps {
  asset?: Asset | null;
  onSave: (asset: Asset | Omit<Asset, 'id'>) => void;
  onClose: () => void;
}

export const AssetForm: React.FC<AssetFormProps> = ({ asset, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    rate: '',
    risk: RiskLevel.Medium,
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        principal: asset.principal.toString(),
        rate: asset.rate.toString(),
        risk: asset.risk,
      });
    } else {
       setFormData({ name: '', principal: '', rate: '', risk: RiskLevel.Medium });
    }
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const principalNum = parseFloat(formData.principal);
    const rateNum = parseFloat(formData.rate);

    if (formData.name && !isNaN(principalNum) && principalNum >= 0 && !isNaN(rateNum)) {
       const submittedAsset = {
        name: formData.name,
        principal: principalNum,
        rate: rateNum,
        risk: formData.risk,
      };

      if(asset) {
        onSave({ ...submittedAsset, id: asset.id });
      } else {
        onSave(submittedAsset);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">{asset ? 'Edit Asset' : 'Add New Asset'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Asset Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-white p-2" />
          </div>
          <div>
            <label htmlFor="principal" className="block text-sm font-medium text-gray-300">Principal Amount ($)</label>
            <input type="number" name="principal" id="principal" value={formData.principal} onChange={handleChange} required min="0" step="1000" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-white p-2" />
          </div>
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-300">Expected Annual Rate (%)</label>
            <input type="number" name="rate" id="rate" value={formData.rate} onChange={handleChange} required min="-100" max="100" step="0.1" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-white p-2" />
          </div>
          <div>
            <label htmlFor="risk" className="block text-sm font-medium text-gray-300">Risk Profile</label>
            <select name="risk" id="risk" value={formData.risk} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm text-white p-2">
              {Object.values(RiskLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-secondary hover:bg-brand-accent rounded-md text-white font-semibold">{asset ? 'Save Changes' : 'Add Asset'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
