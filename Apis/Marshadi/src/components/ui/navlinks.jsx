// NavLinks.js
"use client";

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { usePermissions } from '@/hooks/usePermissions';
import permissionsConfig from '@/config/permissionsConfig';
import { ChevronDown } from 'lucide-react';

export function NavLinks({ onLinkClick }) {
  const { permissions, loading, error } = usePermissions();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState({});

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!permissions || !Array.isArray(permissions)) {
    return <div>No permissions available</div>;
  }

  // Memorizar la función para abrir/cerrar grupos
  const toggleGroup = useCallback((name) => {
    setOpenGroups((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  // Memorizar los enlaces para evitar re-renders innecesarios
  const renderedLinks = useMemo(() => {
    const renderLinks = (menu, permissions) => {
      return Object.keys(menu).map((groupMajor, indexMajor) => {
        const groupMajorItems = menu[groupMajor];
        const Icon = groupMajorItems.icon;
        const alwaysVisible = groupMajorItems.alwaysVisible;

        const hasPermission = alwaysVisible || Object.keys(groupMajorItems).some((group) => {
          const items = groupMajorItems[group];
          return permissions.some(permission => 
            permission.Text === group && 
            permission.Permisos.some(permiso => permiso.Permiso)
          );
        });

        if (!hasPermission) return null;

        return (
          <div key={`${groupMajor}-${indexMajor}`}>
            <div
              className={clsx(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer',
                'text-gray-700 hover:text-gray-900'
              )}
              onClick={() => toggleGroup(groupMajor)}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5" />} {/* Renderizar el ícono */}
                {groupMajor}
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openGroups[groupMajor] ? 'rotate-180' : ''
                }`}
              />
            </div>
            {openGroups[groupMajor] && (
              <div className="pl-4">
                {Object.keys(groupMajorItems).map((group, index) => {
                  const items = groupMajorItems[group];
                  
                  const hasSubgroupPermission = alwaysVisible || permissions.some(permission => 
                    permission.Text === group && 
                    permission.Permisos.some(permiso => permiso.Permiso)
                  );

                  if (!hasSubgroupPermission) return null;

                  return (
                    <div key={`${group}-${index}`}>
                      <Link
                        href={items.main}
                        onClick={onLinkClick}
                        className={clsx(
                          'flex ms-4 items-center gap-3 rounded-lg px-3 py-2 transition-all',
                          {
                            'text-gray-500 hover:text-gray-900': pathname !== items.main,
                            'bg-gray-100 text-gray-900 hover:text-gray-900': pathname === items.main,
                          }
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {group}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
    };

    return renderLinks(permissionsConfig, permissions);
  }, [permissions, pathname, openGroups, toggleGroup]);

  return (
    <>
      {renderedLinks}
    </>
  );
}
