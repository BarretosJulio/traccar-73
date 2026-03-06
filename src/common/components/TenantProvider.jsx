import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TenantContext = createContext(null);

export const useTenant = () => useContext(TenantContext);

const detectTenantSlug = () => {
  // 1. Check URL query param ?tenant=slug
  const params = new URLSearchParams(window.location.search);
  const queryTenant = params.get('tenant');
  if (queryTenant) return queryTenant;

  // 2. Check localStorage (persisted from previous visit)
  const stored = localStorage.getItem('tenantSlug');
  if (stored) return stored;

  // 3. Default tenant for development
  return 'mabtracker';
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [tenantSlug, setTenantSlug] = useState(() => detectTenantSlug());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', tenantSlug)
          .single();

        if (error || !data) {
          console.error('Tenant not found:', tenantSlug, error);
          setTenant(null);
        } else {
          setTenant(data);
          localStorage.setItem('tenantSlug', data.slug);
        }
      } catch (err) {
        console.error('Error fetching tenant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  const value = {
    tenant,
    tenantSlug,
    setTenantSlug,
    loading,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantProvider;
