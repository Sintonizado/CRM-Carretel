import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface City {
  name: string;
  uf: string;
}

interface Props {
  value: string;
  uf: string;
  onChange: (city: string, uf: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const CityAutocomplete: React.FC<Props> = ({ value, uf, onChange, placeholder = "Buscar cidade...", className = "", inputClassName = "px-4 py-3 rounded-xl border-gray-200" }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value ? `${value}${uf ? ` - ${uf}` : ''}` : '');
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await response.json();
        const formattedCities = data.map((item: any) => ({
          name: item.nome,
          uf: item.microrregiao?.mesorregiao?.UF?.sigla || ''
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value ? `${value}${uf ? ` - ${uf}` : ''}` : '');
    }
  }, [value, uf, isOpen]);

  const filteredCities = cities
    .filter(city => 
      `${city.name} - ${city.uf}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 50);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          className={`w-full border focus:ring-2 focus:ring-indigo-500 outline-none pl-10 ${inputClassName}`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
                onChange('', '');
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        {loading && (
           <div className="absolute right-3 top-3.5 h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {isOpen && searchTerm && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredCities.map((city, index) => (
            <li
              key={`${city.name}-${city.uf}-${index}`}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center text-sm text-gray-700"
              onClick={() => {
                onChange(city.name, city.uf);
                setSearchTerm(`${city.name} - ${city.uf}`);
                setIsOpen(false);
              }}
            >
              {city.name} - {city.uf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
