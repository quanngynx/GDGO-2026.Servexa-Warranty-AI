import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { PageContext } from '../types';

export function usePageContext(): PageContext {
  const location = useLocation();
  
  return useMemo(() => {
    const pathname = location.pathname;
    
    // Parse pathname to determine context
    if (pathname === '/' || pathname.includes('dashboard')) {
      return { type: 'dashboard' };
    }
    
    if (pathname.includes('repair-cases-management')) {
      const match = pathname.match(/repair-cases-management\/(\w+)/);
      return {
        type: 'repair_case',
        entityId: match?.[1],
        entityName: match?.[1] ? `Case ${match[1]}` : undefined,
      };
    }
    
    if (pathname.includes('products') || pathname.includes('inventory')) {
      return { type: 'inventory' };
    }
    
    if (pathname.includes('customers') || pathname.includes('users')) {
      return { type: 'customer' };
    }
    
    if (pathname.includes('report') || pathname.includes('statistics')) {
      return { type: 'report' };
    }
    
    if (pathname.includes('settings') || pathname.includes('system')) {
      return { type: 'settings' };
    }
    
    return { type: 'dashboard' };
  }, [location.pathname]);
}

export function getContextLabel(context: PageContext): string {
  switch (context.type) {
    case 'dashboard':
      return 'Command Center';
    case 'repair_case':
      return context.entityName || 'Repair Case';
    case 'inventory':
      return 'Inventory';
    case 'customer':
      return 'Customer';
    case 'report':
      return 'Reports';
    case 'settings':
      return 'Settings';
    default:
      return 'General';
  }
}

export function getContextPromptHint(context: PageContext): string {
  switch (context.type) {
    case 'dashboard':
      return 'Ask about operations, SLA risks, or bottlenecks...';
    case 'repair_case':
      return 'Ask about this case, similar issues, or next steps...';
    case 'inventory':
      return 'Ask about stock levels, predictions, or parts...';
    case 'customer':
      return 'Ask about customer history or recommendations...';
    case 'report':
      return 'Ask about trends, anomalies, or insights...';
    default:
      return 'How can I help you?';
  }
}
