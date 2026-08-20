import React, { useState } from 'react';
import { Building2, Mail, Users, Factory, MapPin, X, ArrowRight, Sparkles } from 'lucide-react';
import { CompanyProfile } from '../types';

interface CompanyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: CompanyProfile) => void;
  consultantName: string;
  accessCode: string;
}

const SECTORS = [
  'Alimentos, Gourmet y Bebidas',
  'Manufactura y Producción Industrial',
  'Servicios Jurídicos y Legales',
  'Salud, Farmacéutica y Clínicas',
  'Logística, Transporte y Almacenamiento',
  'Comercio, Retail y E-Commerce',
  'Financiero, Seguros y Contabilidad',
  'Tecnología y Software',
  'Otro / Especializado',
];

const EMPLOYEE_RANGES = [
  '1 a 10 empleados',
  '11 a 50 empleados',
  '51 a 200 empleados',
  '201 a 500 empleados',
  'Más de 500 empleados',
];

export const CompanyRegistrationModal: React.FC<CompanyRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  consultantName,
  accessCode,
}) => {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [customSector, setCustomSector] = useState('');
  const [employees, setEmployees] = useState(EMPLOYEE_RANGES[1]);
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCompany: CompanyProfile = {
      id: 'comp_' + Date.now(),
      name: name.trim(),
      contactEmail: contactEmail.trim(),
      sector: sector === 'Otro / Especializado' && customSector ? customSector : sector,
      customSector,
      employees,
      location: location.trim(),
      consultantName,
      accessCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'in_progress',
      instruments: {},
    };

    onSave(newCompany);
    setName('');
    setContactEmail('');
    setLocation('');
    onClose();
  };

  const loadDemoCastaGourmet = () => {
    setName('Casta Gourmet');
    setContactEmail('gerencia@castagourmet.com');
    setSector('Alimentos, Gourmet y Bebidas');
    setEmployees('51 a 200 empleados');
    setLocation('Planta Principal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211B1D]/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FDF2E4] border border-[#05352E]/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-[#182A21] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#05352E] text-[#85BCB0] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#05352E]">
              Registrar Nueva Empresa
            </h2>
            <p className="text-xs text-[#4A4843]">
              Habilita la batería completa de los 6 instrumentos de diagnóstico.
            </p>
          </div>
        </div>

        {/* Demo button */}
        <div className="mb-4 bg-[#85BCB0]/20 p-2.5 rounded-xl border border-[#85BCB0]/40 flex items-center justify-between">
          <div className="text-xs text-[#05352E]">
            <span className="font-bold">¿Visita de prueba?</span> Cargar datos de Casta Gourmet
          </div>
          <button
            type="button"
            onClick={loadDemoCastaGourmet}
            className="text-xs font-semibold px-2.5 py-1 bg-[#05352E] text-white rounded-lg hover:bg-[#0F6E56] transition-colors"
          >
            Cargar Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#05352E]" />
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Casta Gourmet S.A.S."
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#D5D2C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-[#05352E]" />
                Sector Económico
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D5D2C9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#05352E]" />
                Cantidad de Empleados
              </label>
              <select
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#D5D2C9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
              >
                {EMPLOYEE_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#05352E]" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contacto@empresa.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5D2C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#182A21] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#05352E]" />
                Sede / Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Planta Bogotá"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5D2C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05352E] text-[#182A21]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#05352E] hover:bg-[#0F6E56] text-[#FDF2E4] font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#FDDC42]" />
            <span>Crear Diagnóstico y Abrir Instrumentos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
